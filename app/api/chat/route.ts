import { NextRequest } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

// Use the same getLLM logic as nodes.ts
const getLLM = () => {
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey && !geminiKey.includes("your_")) {
    return new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.5,
      apiKey: geminiKey,
    });
  }

  if (openaiKey && !openaiKey.includes("your_")) {
    return new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.5,
      apiKey: openaiKey,
    });
  }

  throw new Error("No valid LLM API key found.");
};

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array required" }), { status: 400 });
    }

    const llm = getLLM();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const sysMsg = new SystemMessage(
            `You are a professional financial AI assistant for Investra. 
You are chatting with an analyst about the company: ${context?.company || 'Unknown'}.
Use the following generated research context to accurately answer their questions. 
Keep your answers concise, professional, and directly related to the context when possible. 
If they ask something outside the context, answer to the best of your general financial knowledge, but note that it's outside the direct report.

REPORT CONTEXT:
${JSON.stringify(context, null, 2)}`
          );

          // Convert UI messages to Langchain messages
          const history = messages.map(m => 
            m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
          );

          const responseStream = await llm.stream([sysMsg, ...history]);

          for await (const chunk of responseStream) {
            if (chunk.content) {
              controller.enqueue(encoder.encode(chunk.content.toString()));
            }
          }
          controller.close();
        } catch (err: any) {
          console.error("Chat streaming error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
