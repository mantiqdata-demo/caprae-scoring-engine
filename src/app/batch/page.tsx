"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import { BatchRow, CompanyInput, BusinessModel, OwnerType, ScoreResult } from "@/types";

function statusColor(status: BatchRow["status"]) {
  if (status === "scored") return "text-gold";
  if (status === "error") return "text-red-400";
  if (status === "scoring") return "text-amber";
  return "text-zinc-500";
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-gold" : score >= 45 ? "bg-amber" : "bg-red-500";
  return (
    <div className="w-full bg-surface-2 h-1.5 mt-1.5">
      <div className={`${color} h-1.5 transition-all`} style={{ width: `${score}%` }} />
    </div>
  );
}

function DetailPanel({ row, onClose }: { row: BatchRow; onClose: () => void }) {
  const result = row.result as ScoreResult;
  const scoreColor = result.composite_score >= 70 ? "text-gold" : result.composite_score >= 45 ? "text-amber" : "text-red-400";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-surface border-l border-border z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-surface">
          <div>
            <div className="font-serif text-white text-lg">{row.input.companyName}</div>
            <div className="text-xs text-zinc-400 mt-0.5">{row.input.industry}</div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-serif text-3xl font-bold ${scoreColor}`}>
              {Math.round(result.composite_score)}
            </span>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 py-5 pb-16 space-y-6">
          {/* Criteria */}
          <div>
            <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Scoring Criteria</div>
            <div className="space-y-4">
              {result.criteria.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">{c.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500">{c.weight}% weight</span>
                      <span className="text-sm font-semibold text-gold w-8 text-right">{c.score}</span>
                    </div>
                  </div>
                  <ScoreBar score={c.score} />
                  <p className="text-xs text-zinc-400 mt-1.5">{c.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deal thesis */}
          <div>
            <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Deal Thesis</div>
            <p className="text-sm text-zinc-300 leading-relaxed">{result.deal_thesis}</p>
          </div>

          {/* Red flags */}
          <div>
            <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Red Flags</div>
            <ul className="space-y-2">
              {result.red_flags.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-300">
                  <span className="text-red-400 mt-0.5 shrink-0">—</span>
                  {f.replace(/^[\*\-]\s*/, "")}
                </li>
              ))}
            </ul>
          </div>

          {/* Next steps */}
          <div>
            <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Next Steps</div>
            <ol className="space-y-2">
              {result.next_steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-300">
                  <span className="text-gold shrink-0">{i + 1}.</span>
                  {s.replace(/^\d+\.\s*/, "")}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BatchPage() {
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState<BatchRow | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function exportCSV() {
    const scored = rows.filter((r) => r.result);
    const data = scored.map((r) => ({
      company_name: r.input.companyName,
      industry: r.input.industry,
      estimated_revenue: r.input.estimatedRevenue,
      employee_count: r.input.employeeCount,
      location: r.input.location,
      business_model: r.input.businessModel,
      years_in_business: r.input.yearsInBusiness,
      owner_type: r.input.ownerType,
      composite_score: Math.round(r.result!.composite_score),
      deal_thesis: r.result!.deal_thesis,
      red_flags: r.result!.red_flags.join(" | "),
      next_steps: r.result!.next_steps.join(" | "),
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "caprae-scored-companies.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const parsed: BatchRow[] = results.data.map((row, i) => {
          const rawModel = row["businessModel"] || row["business_model"] || row["Business Model"] || "services-recurring";
          const rawOwner = row["ownerType"] || row["owner_type"] || row["Owner Type"] || "founder";

          const businessModelMap: Record<string, BusinessModel> = {
            "saas": "saas",
            "SaaS": "saas",
            "services-recurring": "services-recurring",
            "Services — Recurring": "services-recurring",
            "services — recurring": "services-recurring",
            "services-project": "services-project",
            "Services — Project": "services-project",
            "services — project": "services-project",
            "product": "product",
            "Product": "product",
          };

          const ownerTypeMap: Record<string, OwnerType> = {
            "founder": "founder",
            "Founder-Owned": "founder",
            "founder-owned": "founder",
            "family": "family",
            "Family-Owned": "family",
            "family-owned": "family",
            "pe-backed": "pe-backed",
            "PE-Backed": "pe-backed",
            "pe backed": "pe-backed",
          };

          return {
            id: String(i),
            status: "queued",
            input: {
              companyName: row["companyName"] || row["company_name"] || row["Company Name"] || row["company"] || row["Company"] || row["name"] || row["Name"] || "",
              industry: row["industry"] || row["Industry"] || "",
              estimatedRevenue: row["estimatedRevenue"] || row["estimated_revenue"] || row["Revenue"] || "",
              employeeCount: row["employeeCount"] || row["employee_count"] || row["Employees"] || "",
              location: row["location"] || row["Location"] || "",
              businessModel: businessModelMap[rawModel] ?? "services-recurring",
              yearsInBusiness: row["yearsInBusiness"] || row["years_in_business"] || row["Years"] || "",
              ownerType: ownerTypeMap[rawOwner] ?? "founder",
            } satisfies CompanyInput,
          };
        });
        setRows(parsed);
      },
    });
  }

  async function runBatch() {
    setRunning(true);
    for (const row of rows) {
      if (row.status === "scored") continue;
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status: "scoring" } : r))
      );
      try {
        const res = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row.input),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setRows((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, status: "scored", result: data } : r))
        );
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error";
        setRows((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, status: "error", error: msg } : r))
        );
      }
    }
    setRunning(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-white">Batch Scorer</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Upload a CSV with columns: companyName, industry, estimatedRevenue, employeeCount, location, businessModel, yearsInBusiness, ownerType
        </p>
      </div>

      <div className="flex items-center gap-4">
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFile}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="px-5 py-2 border border-border text-sm text-zinc-300 hover:border-gold hover:text-white transition-colors"
        >
          Upload CSV
        </button>
        {rows.length > 0 && (
          <button
            onClick={runBatch}
            disabled={running}
            className="px-5 py-2 bg-gold text-black text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {running ? "Scoring…" : "Score Companies"}
          </button>
        )}
        {rows.some((r) => r.result) && (
          <button
            onClick={exportCSV}
            className="px-5 py-2 border border-border text-sm text-zinc-300 hover:border-gold hover:text-white transition-colors"
          >
            Export CSV
          </button>
        )}
      </div>

      {rows.length > 0 && (
        <div className="border border-border bg-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Industry</th>
                <th className="px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Score</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3 text-white">{row.input.companyName || "—"}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.input.industry || "—"}</td>
                  <td className={`px-4 py-3 capitalize ${statusColor(row.status)}`}>{row.status}</td>
                  <td className="px-4 py-3 text-gold font-semibold">
                    {row.result ? Math.round(row.result.composite_score) : row.error ? <span className="text-red-400 text-xs">{row.error}</span> : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.result && (
                      <button
                        onClick={() => setSelected(row)}
                        className="px-3 py-1 text-xs border border-border text-zinc-400 hover:border-gold hover:text-white transition-colors"
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <DetailPanel row={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
