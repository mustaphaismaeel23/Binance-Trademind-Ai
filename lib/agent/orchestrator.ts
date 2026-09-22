import { analyzeIntent } from "./intent";
import { getMarketData } from "@/lib/providers/market-data";
import { analyzeMarket } from "./market";
import { assessRisk } from "./risk";
import { generateReport } from "./report";
import type { AnalysisResponse, WorkflowStep } from "@/types/analysis";

export async function runTradeMindAnalysis(query: string): Promise<AnalysisResponse> {
  const workflow: WorkflowStep[] = [];

  try {
    const intent = analyzeIntent(query);
    workflow.push({ id: "intent", status: "complete", detail: `Detected ${intent.asset} with a ${intent.timeHorizon.replace("_", " ")} horizon.` });

    const market = await getMarketData(intent);
    workflow.push({ id: "market", status: "complete", detail: `Retrieved ${market.symbol} market snapshot from ${market.source}.` });

    const marketAnalysis = analyzeMarket(market);
    workflow.push({ id: "intelligence", status: "complete", detail: "Separated observed positive and negative market signals." });

    const risk = assessRisk(market);
    workflow.push({ id: "risk", status: "complete", detail: `Assigned ${risk.riskLevel} risk based on volatility, movement, and liquidity.` });

    const report = generateReport(market, marketAnalysis, risk);
    workflow.push({ id: "report", status: "complete", detail: "Generated the final structured research brief." });

    return { query, intent, market, report, workflow };
  } catch (error) {
    return {
      query,
      intent: null,
      market: null,
      report: null,
      workflow,
      error: error instanceof Error ? error.message : "Analysis failed",
    };
  }
}
