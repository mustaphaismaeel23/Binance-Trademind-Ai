import type { MarketData, RiskLevel } from "@/types/analysis";

export function assessRisk(market: MarketData): { riskLevel: RiskLevel; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  if (market.volatility === "HIGH") {
    score += 2;
    factors.push("Market volatility is classified as high.");
  } else if (market.volatility === "MODERATE") {
    score += 1;
    factors.push("Moderate volatility means short-term price movement can still be significant.");
  }

  if (Math.abs(market.change24h) >= 5) {
    score += 1;
    factors.push("A large 24-hour move can increase the risk of chasing momentum after a rapid price change.");
  }

  if (market.liquidity === "LOW") {
    score += 2;
    factors.push("Lower liquidity can increase slippage and execution risk.");
  }

  const riskLevel: RiskLevel = score >= 3 ? "HIGH" : score >= 1 ? "MODERATE" : "LOW";
  return { riskLevel, factors };
}
