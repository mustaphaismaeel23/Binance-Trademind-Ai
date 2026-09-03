"use client";

import { useEffect, useState } from "react";
import type { WorkflowStep } from "@/types/analysis";

const labels = [
  "Understanding your request",
  "Identifying asset and horizon",
  "Retrieving market data",
  "Analyzing market conditions",
  "Evaluating risks",
  "Generating research brief",
];

export default function AgentWorkflow({ workflow, loading }: { workflow: WorkflowStep[]; loading: boolean }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!loading) {
      setVisible(labels.length);
      return;
    }
    setVisible(0);
    const timer = window.setInterval(() => {
      setVisible((current) => {
        if (current >= labels.length) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 450);
    return () => window.clearInterval(timer);
  }, [loading]);

  return (
    <div className="rounded border border-[#2b3138] bg-[#161a1e] p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0b90b]">Agent workflow</p>
        <h2 className="mt-2 text-2xl font-bold">Research stages</h2>
      </div>

      <div className="space-y-4">
        {labels.map((label, index) => {
          const serverStep = workflow[index];
          const active = loading && index === visible - 1;
          const complete = !loading || index < visible || serverStep?.status === "complete";
          return (
            <div key={label} className="flex gap-3">
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm ${
                complete ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300" :
                active ? "border-cyan-300 bg-cyan-300/10 text-cyan-200 animate-pulse" :
                "border-slate-700 text-slate-600"
              }`}>
                {complete ? "✓" : active ? "…" : "○"}
              </div>
              <div>
                <p className={complete || active ? "text-slate-100" : "text-slate-500"}>{label}</p>
                {serverStep?.detail && complete && <p className="mt-1 text-xs text-slate-500">{serverStep.detail}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
