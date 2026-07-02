import { NextRequest } from "next/server";
import { buildInvestmentGraph } from "@/lib/agent/graph";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const { company, userId } = await req.json();
  if (!company?.trim()) {
    return new Response(JSON.stringify({ error: "Company name required" }), { status: 400 });
  }

  // Paywall Check
  if (userId && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: userRecord } = await supabase.from("users").select("tier, credits_used").eq("id", userId).single();
    
    if (userRecord) {
      if (userRecord.tier === "free" && userRecord.credits_used >= 3) {
        return new Response(JSON.stringify({ error: "Free search limit reached. Please upgrade to Pro for unlimited AI research." }), { status: 403 });
      }
      
      // Increment usage
      await supabase.from("users").update({ credits_used: userRecord.credits_used + 1 }).eq("id", userId);
    }
  }

  const encoder = new TextEncoder();

  // Step descriptions for richer progress UI
  const STEP_META: Record<string, { index: number; label: string }> = {
    company_research:    { index: 1, label: "Researching company fundamentals" },
    financial_analysis:  { index: 2, label: "Analysing financial statements" },
    news_analysis:       { index: 3, label: "Scanning latest news & press" },
    sentiment_analysis:  { index: 4, label: "Evaluating market sentiment" },
    competitor_analysis: { index: 5, label: "Comparing competitors" },
    risk_assessment:     { index: 6, label: "Assessing investment risks" },
    recommendation:      { index: 7, label: "Building final recommendation" },
  };
  const TOTAL_STEPS = Object.keys(STEP_META).length;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const startTime = Date.now();

      try {
        const graph = buildInvestmentGraph();

        const initialState = {
          company: company.trim(),
          ticker: "",
          companyData: null,
          financialData: null,
          newsData: [],
          sentiment: null,
          competitors: [],
          risks: null,
          recommendation: null,
          score: 0,
          agentLogs: [],
          currentStep: "company_research" as const,
          error: null,
        };

        send({ type: "started", company: company.trim(), totalSteps: TOTAL_STEPS, timestamp: new Date().toISOString() });

        for await (const event of await graph.stream(initialState as any, { streamMode: "updates" })) {
          const nodeName = Object.keys(event)[0];
          const nodeOutput = (event as any)[nodeName];
          const meta = STEP_META[nodeName] || { index: 0, label: nodeName };
          send({
            type: "step_complete",
            step: nodeName,
            stepIndex: meta.index,
            totalSteps: TOTAL_STEPS,
            stepLabel: meta.label,
            elapsedMs: Date.now() - startTime,
            data: nodeOutput,
          });
        }

        send({ type: "complete", elapsedMs: Date.now() - startTime });
        controller.close();
      } catch (err: any) {
        send({ type: "error", message: err.message, code: "AGENT_ERROR", elapsedMs: Date.now() - startTime });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
