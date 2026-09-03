import type { AnalysisReport, MarketData } from "@/types/analysis";

export function generateReport(
  market: MarketData,
  marketAnalysis: { positiveSignals: string[]; negativeSignals: string[] },
  risk: { riskLevel: "LOW" | "MODERATE" | "HIGH"; factors: string[] }
): AnalysisReport {
  const direction = market.change24h >= 0 ? "positive" : "negative";
  const marketInterpretation =
    `The available market snapshot shows ${direction} 24-hour momentum of ${Math.abs(market.change24h).toFixed(2)}%. ` +
    `Liquidity is classified as ${market.liquidity.toLowerCase()} while volatility is ${market.volatility.toLowerCase()}. ` +
    `These observations describe current conditions rather than a prediction of future price movement.`;

  return {
    positiveSignals: marketAnalysis.positiveSignals.length
      ? marketAnalysis.positiveSignals
      : ["No strong positive signal was identified from the limited market snapshot."],
    riskFactors: [...marketAnalysis.negativeSignals, ...risk.factors],
    marketInterpretation,
    riskLevel: risk.riskLevel,
    summary:
      `The current snapshot suggests a ${risk.riskLevel.toLowerCase()} risk environment. ` +
      `Use this as one research input, verify live information, and consider your own strategy and risk limits before taking any action.`,
    disclaimer: "This analysis is for research purposes and is not financial advice.",
  };
}
