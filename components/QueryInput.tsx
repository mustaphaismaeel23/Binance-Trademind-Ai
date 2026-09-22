"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function QueryInput({ value, onChange, onSubmit, loading }: Props) {
  return (
    <div className="rounded border border-[#3a4048] bg-[#161a1e] p-2 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onSubmit()}
          placeholder="Ask about any token, e.g. Analyze ETHUSDT..."
          className="min-h-14 flex-1 rounded border border-[#252a30] bg-[#0b0e11] px-4 text-white outline-none placeholder:text-slate-600 focus:border-[#f0b90b]"
        />
        <button
          disabled={loading}
          onClick={onSubmit}
          className="min-h-14 rounded bg-[#f0b90b] px-7 font-bold text-[#0b0e11] transition hover:bg-[#f8ca35] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </div>
  );
}
