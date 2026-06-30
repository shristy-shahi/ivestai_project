import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { company1, company2 } = await req.json();

    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.2,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await llm.invoke([
      new SystemMessage(
        "You are a senior investment analyst. Return ONLY valid JSON."
      ),
      new HumanMessage(`Compare these two companies as investment opportunities:
Company 1: ${company1}
Company 2: ${company2}

Return JSON:
{
  "winner": "${company1}" | "${company2}",
  "confidence": <number 50-99>,
  "verdict": "2-sentence explanation of winner",
  "company1": {
    "name": "${company1}",
    "ticker": "ticker",
    "score": <0-100>,
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "recommendation": "INVEST" | "PASS"
  },
  "company2": {
    "name": "${company2}",
    "ticker": "ticker",
    "score": <0-100>,
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "recommendation": "INVEST" | "PASS"
  },
  "categories": {
    "growth": {"winner": "company name", "margin": <1-10>},
    "profitability": {"winner": "company name", "margin": <1-10>},
    "valuation": {"winner": "company name", "margin": <1-10>},
    "risk": {"winner": "company name", "margin": <1-10>},
    "momentum": {"winner": "company name", "margin": <1-10>}
  }
}`),
    ]);

    const clean = (response.content as string)
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const result = JSON.parse(clean);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
