export default function AboutPage() {
  const criteria = [
    { name: "Revenue Fit", weight: 20, desc: "Sweet spot is $1M–$20M ARR. Below $500K = too small. Above $50M = too large." },
    { name: "Business Model Quality", weight: 20, desc: "SaaS and recurring-revenue models score highest. Project-based services score lowest." },
    { name: "Owner Succession Signal", weight: 20, desc: "Founder-owned 10+ years signals strong exit motivation. PE-backed companies score lower." },
    { name: "Size Fit", weight: 15, desc: "Ideal band is 10–200 employees. Outside this range reduces score linearly." },
    { name: "Industry Attractiveness", weight: 15, desc: "Favors fragmented, defensive, non-cyclical industries. Penalizes commoditized or declining sectors." },
    { name: "Digital Presence Health", weight: 10, desc: "Outdated digital presence signals value-creation opportunity. Already-modern companies have less upside." },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl text-white">Scoring Methodology</h1>
        <p className="text-sm text-zinc-400 mt-1">
          How Caprae Capital evaluates lower-middle-market acquisition targets.
        </p>
      </div>

      <div className="border border-border bg-surface divide-y divide-border">
        {criteria.map((c) => (
          <div key={c.name} className="px-6 py-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white">{c.name}</span>
              <span className="text-xs text-zinc-500">{c.weight}% weight</span>
            </div>
            <p className="text-xs text-zinc-400">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="border border-border bg-surface px-6 py-5">
        <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Composite Score</div>
        <p className="text-sm text-zinc-300 leading-relaxed">
          The composite score is the weighted average of all six criteria (0–100). Scores of 70+ indicate a strong fit,
          45–69 a moderate fit, and below 45 a weak fit for Caprae Capital&apos;s acquisition thesis.
        </p>
      </div>
    </div>
  );
}
