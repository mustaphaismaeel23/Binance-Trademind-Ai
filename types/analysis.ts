export type RiskLevel = "LOW" | "MODERATE" | "HIGH";

export type Intent = {
  asset: string;
  symbol: string;
  requestType: string;
  timeHorizon: string;
  riskPreference: string;
};

export type MarketData = {
  symbol: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
  volatility: "LOW" | "MODERATE" | "HIGH";
  liquidity: "LOW" | "MODERATE" | "HIGH";
  source: string;
};

export type AnalysisReport = {
  positiveSignals: string[];
  riskFactors: string[];
  marketInterpretation: string;
  riskLevel: RiskLevel;
  summary: string;
  disclaimer: string;
};

export type WorkflowStep = {
  id: string;
  status: "complete" | "failed";
  detail: string;
};

export type AnalysisResponse = {
  query: string;
  intent: Intent | null;
  market: MarketData | null;
  report: AnalysisReport | null;
  workflow: WorkflowStep[];
  error?: string;
};
