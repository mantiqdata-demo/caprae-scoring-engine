import { NextRequest, NextResponse } from "next/server";
import { CompanyInput, ScoreResult } from "@/types";

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are a lower-middle-market private equity analyst for Caprae Capital. Your job is to score acquisition targets using a strict, consistent rubric. You return only valid JSON — no prose, no markdown fences, no commentary outside the JSON object.`;

function buildPrompt(input: CompanyInput): string {
  return `Score this company strictly as a lower-middle-market PE acquisition target using Caprae Capital's thesis.

Company Details:
- Name: ${input.companyName}
- Industry: ${input.industry}
- Estimated Revenue: ${input.estimatedRevenue}
- Employee Count: ${input.employeeCount}
- Location: ${input.location}
- Business Model: ${input.businessModel}
- Years in Business: ${input.yearsInBusiness}
- Owner Type: ${input.ownerType}

Scoring Criteria (score each 0-100):

1. Revenue Fit (weight: 20%) — Sweet spot is $1M–$20M ARR. Below $500K = too small. Above $50M = too large. Score proportionally within that band.

2. Business Model Quality (weight: 20%) — SaaS = 85-100. Services-recurring = 65-85. Product = 50-70. Services-project = 30-55. Higher recurring revenue = higher score.

3. Owner Succession Signal (weight: 20%) — Founder-owned 10+ years = strong exit signal (80-100). Family-owned = moderate signal (55-75). PE-backed = likely already exited or re-trading (30-55). Score also considers years in business as a proxy for owner fatigue.

4. Size Fit (weight: 15%) — Ideal band: 10–200 employees. Under 10 = too lean for leverage. Over 200 = too operationally complex. Score linearly within band.

5. Industry Attractiveness (weight: 15%) — Favor: fragmented, defensive, non-cyclical industries (HVAC, landscaping, pest control, healthcare services, niche B2B SaaS, logistics). Penalize: heavily cyclical, commoditized, or declining industries.

6. Digital Presence Health (weight: 10%) — Infer from industry and business model. Outdated digital presence = opportunity for value creation (score 60-80). Modern SaaS = already digitized (score 40-60, less upside). No web presence in an otherwise digitized industry = concern (score 20-40).

Composite score = weighted average of all six criteria scores.

Return ONLY this exact JSON structure, with no text before or after:

{
  "composite_score": <number 0-100, one decimal>,
  "criteria": [
    {
      "name": "Revenue Fit",
      "weight": 20,
      "score": <0-100>,
      "rationale": "<1-2 sentences>"
    },
    {
      "name": "Business Model Quality",
      "weight": 20,
      "score": <0-100>,
      "rationale": "<1-2 sentences>"
    },
    {
      "name": "Owner Succession Signal",
      "weight": 20,
      "score": <0-100>,
      "rationale": "<1-2 sentences>"
    },
    {
      "name": "Size Fit",
      "weight": 15,
      "score": <0-100>,
      "rationale": "<1-2 sentences>"
    },
    {
      "name": "Industry Attractiveness",
      "weight": 15,
      "score": <0-100>,
      "rationale": "<1-2 sentences>"
    },
    {
      "name": "Digital Presence Health",
      "weight": 10,
      "score": <0-100>,
      "rationale": "<1-2 sentences>"
    }
  ],
  "deal_thesis": "<3-5 sentence narrative on why this is or is not a compelling acquisition target for Caprae Capital>",
  "red_flags": ["<flag 1>", "<flag 2>"],
  "next_steps": ["<step 1>", "<step 2>", "<step 3>"]
}`;
}

export async function POST(req: NextRequest) {
  try {
    const input: CompanyInput = await req.json();

    if (!input.companyName || !input.industry) {
      return NextResponse.json(
        { error: "Company name and industry are required." },
        { status: 400 }
      );
    }

    const geminiRes = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: buildPrompt(input) }] }],
        generationConfig: { maxOutputTokens: 4096 },
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      return NextResponse.json({ error: `Gemini API error: ${errBody}` }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const raw: string = geminiData.candidates[0].content.parts[0].text.trim();

    // Strip markdown code fences if present
    const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    let result: ScoreResult;
    try {
      result = JSON.parse(stripped);
    } catch {
      const match = stripped.match(/\{[\s\S]*\}/);
      if (!match) {
        return NextResponse.json(
          { error: "Model returned non-JSON response.", raw },
          { status: 502 }
        );
      }
      result = JSON.parse(match[0]);
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
