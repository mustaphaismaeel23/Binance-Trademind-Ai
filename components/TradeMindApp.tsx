"use client";

import { useState } from "react";
import type { AnalysisResponse } from "@/types/analysis";
import QueryInput from "./QueryInput";
import AgentWorkflow from "./AgentWorkflow";
import AnalysisReport from "./AnalysisReport";

const examples = [
  "Analyze SOL for a short-term trade and identify the major risks.",
  "Compare BTC and ETH for a medium-risk trader.",
  "What are the risks of trading DOGE today?"
];

export default function TradeMindApp() {
  const [query, setQuery] = useState(examples[0]);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyze(nextQuery?: string) {
    const activeQuery = (nextQuery ?? query).trim();
    if (!activeQuery || loading) return;
    setQuery(activeQuery);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: activeQuery }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Analysis failed");
      setResult(data);
    } catch (error) {
      setResult({
        query: activeQuery,
        intent: null,
        market: null,
        report: null,
        workflow: [],
        error: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-14 flex items-center justify-between border-b border-[#262b31] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 rotate-45 items-center justify-center rounded-[4px] bg-[#f0b90b]">
              <span className="-rotate-45 text-lg font-black text-[#0b0e11]">B</span>
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">BINANCE <span className="text-[#f0b90b]">TRADEMIND AI</span></div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Market intelligence terminal</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-400" /> LIVE DATA</div>
        </nav>

        <section className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#f0b90b]">AI-powered market research</p>
          <h1 className="max-w-2xl text-4xl font-black tracking-[-0.04em] md:text-6xl">Research the market.<br /><span className="text-slate-500">Understand the risk.</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
            Ask about any Binance-listed token. Get live market observations, a transparent agent workflow, and a structured risk brief.
          </p>

          <div className="mt-8">
            <QueryInput value={query} onChange={setQuery} onSubmit={() => analyze()} loading={loading} />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {examples.map((example) => (
              <button key={example} onClick={() => analyze(example)}
                className="rounded border border-[#2b3138] bg-[#161a1e] px-3 py-2 text-left text-xs text-slate-400 transition hover:border-[#f0b90b] hover:text-white">
                {example}
              </button>
            ))}
          </div>
        </section>

        {(loading || result) && (
          <section className="mt-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <AgentWorkflow workflow={result?.workflow ?? []} loading={loading} />
            <AnalysisReport result={result} loading={loading} />
          </section>
        )}

        <p className="mx-auto mt-12 max-w-3xl text-center text-xs leading-6 text-slate-500">
          TradeMind AI is a research prototype and does not provide financial advice or execute trades.
        </p>
      </div>
    </main>
  );
}
