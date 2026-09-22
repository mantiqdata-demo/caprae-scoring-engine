"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import { BatchRow, CompanyInput, BusinessModel, OwnerType } from "@/types";

function statusColor(status: BatchRow["status"]) {
  if (status === "scored") return "text-gold";
  if (status === "error") return "text-red-400";
  if (status === "scoring") return "text-amber";
  return "text-zinc-500";
}

export default function BatchPage() {
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [running, setRunning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const parsed: BatchRow[] = results.data.map((row, i) => ({
          id: String(i),
          status: "queued",
          input: {
            companyName: row["companyName"] || row["Company Name"] || "",
            industry: row["industry"] || row["Industry"] || "",
            estimatedRevenue: row["estimatedRevenue"] || row["Revenue"] || "",
            employeeCount: row["employeeCount"] || row["Employees"] || "",
            location: row["location"] || row["Location"] || "",
            businessModel: (row["businessModel"] || "services-recurring") as BusinessModel,
            yearsInBusiness: row["yearsInBusiness"] || row["Years"] || "",
            ownerType: (row["ownerType"] || "founder") as OwnerType,
          } satisfies CompanyInput,
        }));
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
            {running ? "Scoring…" : `Score ${rows.length} Companies`}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-white">{row.input.companyName || "—"}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.input.industry || "—"}</td>
                  <td className={`px-4 py-3 capitalize ${statusColor(row.status)}`}>{row.status}</td>
                  <td className="px-4 py-3 text-gold font-semibold">
                    {row.result ? row.result.composite_score.toFixed(1) : row.error ? <span className="text-red-400 text-xs">{row.error}</span> : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
