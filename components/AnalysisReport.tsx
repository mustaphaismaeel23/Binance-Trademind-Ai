import type { AnalysisResponse } from "@/types/analysis";

function Skeleton() {
  return <div className="space-y-4 animate-pulse">
    <div className="h-24 rounded-xl bg-slate-800/70" />
    <div className="h-36 rounded-xl bg-slate-800/70" />
    <div className="h-28 rounded-xl bg-slate-800/70" />
  </div>;
}

export default function AnalysisReport({ result, loading }: { result: AnalysisResponse | null; loading: boolean }) {
  if (loading || !result) {
    return <div className="rounded border border-[#2b3138] bg-[#161a1e] p-6"><Skeleton /></div>;
  }

  if (result.error) {
    return <div className="rounded border border-red-900/60 bg-red-950/20 p-6 text-red-200">{result.error}</div>;
  }

  if (!result.report || !result.market || !result.intent) return null;

  const { report, market, intent } = result;

  return (
    <div className="space-y-5">
      <div className="rounded border border-[#2b3138] bg-[#161a1e] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0b90b]">Live research brief</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">{intent.asset} / {market.quoteAsset}</h2>
            <p className="mt-1 text-sm text-slate-400">{intent.timeHorizon.replaceAll("_", " ")} · {intent.requestType.replaceAll("_", " ")}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${market.price.toLocaleString()}</div>
            <div className={market.change24h >= 0 ? "text-emerald-300" : "text-red-300"}>
              {market.change24h >= 0 ? "+" : ""}{market.change24h.toFixed(2)}% · 24h
            </div>
          </div>
        </div>
      </div>

      <Card title="Positive signals" items={report.positiveSignals} />
      <Card title="Risk factors" items={report.riskFactors} />

      <div className="rounded border border-[#2b3138] bg-[#161a1e] p-6">
        <h3 className="font-bold">Market interpretation</h3>
        <p className="mt-3 leading-7 text-slate-300">{report.marketInterpretation}</p>
      </div>

      <div className="rounded border border-[#2b3138] bg-[#161a1e] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold">Overall risk level</h3>
            <p className="mt-1 text-sm text-slate-500">Based on available market observations.</p>
          </div>
          <div className="rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 font-bold text-amber-200">
            {report.riskLevel}
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-300">{report.summary}</p>
        <p className="mt-4 text-xs text-slate-500">{report.disclaimer}</p>
      </div>
    </div>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="text-cyan-300">•</span>{item}</li>)}
      </ul>
    </div>
  );
}
