import type { Intent, MarketData } from "@/types/analysis";

type BinanceTicker = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
  highPrice: string;
  lowPrice: string;
};

const BINANCE_API_URL = process.env.BINANCE_API_URL ?? "https://api.binance.com";
const REQUEST_TIMEOUT_MS = 8_000;

function parseTicker(value: unknown): BinanceTicker {
  if (!value || typeof value !== "object") {
    throw new Error("Binance returned an invalid market-data response.");
  }

  const ticker = value as Partial<BinanceTicker>;
  const fields = ["symbol", "lastPrice", "priceChangePercent", "quoteVolume", "highPrice", "lowPrice"] as const;
  if (fields.some((field) => typeof ticker[field] !== "string")) {
    throw new Error("Binance returned an incomplete market-data response.");
  }

  return ticker as BinanceTicker;
}

function parseNumber(value: string, field: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`Binance returned an invalid ${field}.`);
  return parsed;
}

export async function getMarketData(intent: Intent): Promise<MarketData> {
  const symbol = intent.symbol.toUpperCase();
  const endpoint = new URL("/api/v3/ticker/24hr", BINANCE_API_URL);
  endpoint.searchParams.set("symbol", symbol);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new Error("Binance market-data request timed out. Check your network connection.");
    }

    throw new Error("Unable to reach Binance market data. Check your network connection or BINANCE_API_URL.");
  }

  if (!response.ok) {
    throw new Error(`Binance market-data request failed (${response.status}).`);
  }

  const ticker = parseTicker(await response.json());
  const price = parseNumber(ticker.lastPrice, "price");
  const change24h = parseNumber(ticker.priceChangePercent, "24-hour change");
  const volume24h = parseNumber(ticker.quoteVolume, "24-hour volume");
  const highPrice = parseNumber(ticker.highPrice, "24-hour high");
  const lowPrice = parseNumber(ticker.lowPrice, "24-hour low");
  const rangePercent = price > 0 ? ((highPrice - lowPrice) / price) * 100 : 0;

  const volatility = rangePercent >= 12 || Math.abs(change24h) >= 5
    ? "HIGH"
    : rangePercent >= 6 || Math.abs(change24h) >= 2
      ? "MODERATE"
      : "LOW";
  const liquidity = volume24h >= 1_000_000_000
    ? "HIGH"
    : volume24h >= 100_000_000
      ? "MODERATE"
      : "LOW";
  const quoteAsset = symbol.endsWith("USDT") ? "USDT" : symbol.replace(intent.asset.toUpperCase(), "");

  return {
    symbol: ticker.symbol,
    quoteAsset,
    price,
    change24h,
    volume24h,
    volatility,
    liquidity,
    source: "Binance Spot REST API",
  };
}
