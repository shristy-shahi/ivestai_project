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

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

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

        for await (const event of await graph.stream(initialState as any, { streamMode: "updates" })) {
          const nodeName = Object.keys(event)[0];
          const nodeOutput = (event as any)[nodeName];
          send({ type: "step_complete", step: nodeName, data: nodeOutput });
        }

        send({ type: "complete" });
        controller.close();
      } catch (err: any) {
        send({ type: "error", message: err.message });
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
