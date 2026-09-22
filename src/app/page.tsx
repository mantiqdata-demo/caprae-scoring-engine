"use client";

import { useState } from "react";
import CompanyForm from "@/components/CompanyForm";
import { CompanyInput, ScoreResult } from "@/types";

const defaultInput: CompanyInput = {
  companyName: "",
  industry: "",
  estimatedRevenue: "",
  employeeCount: "",
  location: "",
  businessModel: "services-recurring",
  yearsInBusiness: "",
  ownerType: "founder",
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-gold" : score >= 45 ? "bg-amber" : "bg-red-500";
  return (
    <div className="w-full bg-surface-2 h-1.5 mt-1.5">
      <div className={`${color} h-1.5 transition-all`} style={{ width: `${score}%` }} />
    </div>
  );
}

function CompositeRing({ score }: { score: number }) {
  const color = score >= 70 ? "text-gold" : score >= 45 ? "text-amber" : "text-red-400";
  const label = score >= 70 ? "Strong Fit" : score >= 45 ? "Moderate Fit" : "Weak Fit";
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <span className={`font-serif text-6xl font-bold ${color}`}>{score.toFixed(1)}</span>
      <span className="text-xs text-zinc-400 uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

export default function ScorerPage() {
  const [input, setInput] = useState<CompanyInput>(defaultInput);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scoring failed.");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-white">Acquisition Scorer</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Score a lower-middle-market target against Caprae Capital&apos;s acquisition thesis.
        </p>
      </div>

      <div className="border border-border bg-surface p-6">
        <CompanyForm value={input} onChange={setInput} onSubmit={handleSubmit} loading={loading} />
      </div>

      {error && (
        <div className="border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Composite score */}
          <div className="border border-border bg-surface">
            <div className="px-6 pt-5 pb-2 border-b border-border">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Composite Score</span>
            </div>
            <CompositeRing score={result.composite_score} />
          </div>

          {/* Criteria */}
          <div className="border border-border bg-surface">
            <div className="px-6 py-4 border-b border-border">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Scoring Criteria</span>
            </div>
            <div className="divide-y divide-border">
              {result.criteria.map((c) => (
                <div key={c.name} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">{c.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500">{c.weight}% weight</span>
                      <span className="text-sm font-semibold text-gold w-8 text-right">{c.score}</span>
                    </div>
                  </div>
                  <ScoreBar score={c.score} />
                  <p className="text-xs text-zinc-400 mt-2">{c.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deal thesis */}
          <div className="border border-border bg-surface px-6 py-5">
            <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Deal Thesis</div>
            <p className="text-sm text-zinc-300 leading-relaxed">{result.deal_thesis}</p>
          </div>

          {/* Red flags & next steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-border bg-surface px-6 py-5">
              <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Red Flags</div>
              <ul className="space-y-2">
                {result.red_flags.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-300">
                    <span className="text-red-400 mt-0.5 shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-border bg-surface px-6 py-5">
              <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Next Steps</div>
              <ol className="space-y-2">
                {result.next_steps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-300">
                    <span className="text-gold shrink-0">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
