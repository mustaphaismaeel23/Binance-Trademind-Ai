import type { MarketData } from "@/types/analysis";

export function analyzeMarket(market: MarketData) {
  const positiveSignals: string[] = [];
  const negativeSignals: string[] = [];

  if (market.change24h > 0) {
    positiveSignals.push(`The asset is up ${market.change24h.toFixed(2)}% over the observed 24-hour period.`);
  } else {
    negativeSignals.push(`The asset is down ${Math.abs(market.change24h).toFixed(2)}% over the observed 24-hour period.`);
  }

  if (market.liquidity === "HIGH") {
    positiveSignals.push("The available dataset classifies market liquidity as high, which may support easier execution in normal conditions.");
  } else {
    negativeSignals.push("Liquidity is not classified as high, which can increase execution and slippage risk.");
  }

  if (market.volatility === "HIGH") {
    negativeSignals.push("High observed volatility increases the chance of rapid price changes in either direction.");
  }

  return { positiveSignals, negativeSignals };
}
