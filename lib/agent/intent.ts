import type { Intent } from "@/types/analysis";

const knownAssets: string[] = ["BTC", "ETH", "SOL", "BNB", "XRP", "DOGE", "ADA", "AVAX", "TON"];
const ignoredWords = new Set(["ANALYZE", "COMPARE", "WHAT", "ARE", "THE", "RISKS", "RISK", "OF", "TRADING", "TRADE", "FOR", "AND", "TODAY", "NOW", "CURRENT", "PRICE", "MARKET", "SHORT", "MEDIUM", "LONG", "TERM", "IDENTIFY", "MAJOR", "PLEASE", "SHOW", "WITH", "VERSUS", "VS"]);

function findAsset(query: string): string {
  const upper = query.toUpperCase();
  const pair = upper.match(/\b([A-Z0-9]{2,20})\s*\/?\s*USDT\b/);
  if (pair) return pair[1];

  const candidates: string[] = upper.match(/\b[A-Z0-9]{2,15}\b/g) ?? [];
  const knownAsset = knownAssets.find((asset) => candidates.includes(asset));
  if (knownAsset) return knownAsset;

  return candidates.find((candidate) => !ignoredWords.has(candidate) && candidate !== "USDT") ?? "BTC";
}

export function analyzeIntent(query: string): Intent {
  const asset = findAsset(query);

  const timeHorizon =
    /long[-\s]?term|months|year/.test(query.toLowerCase()) ? "long_term" :
    /medium[-\s]?term|weeks/.test(query.toLowerCase()) ? "medium_term" :
    "short_term";

  const requestType =
    /compare|versus| vs /.test(query.toLowerCase()) ? "comparison" :
    /risk/.test(query.toLowerCase()) ? "risk_analysis" :
    "market_analysis";

  const riskPreference =
    /low risk|conservative/.test(query.toLowerCase()) ? "low" :
    /high risk|aggressive/.test(query.toLowerCase()) ? "high" :
    /medium risk|moderate/.test(query.toLowerCase()) ? "moderate" :
    "not_specified";

  return {
    asset,
    symbol: `${asset}USDT`,
    requestType,
    timeHorizon,
    riskPreference,
  };
}
