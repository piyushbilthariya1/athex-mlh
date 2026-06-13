import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT_ANALYST } from "@/services/gemini/system-prompts";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { prompt, base64, mimeType, model } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt." }), { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured in .env.local" }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const parts: any[] = [];
    if (base64) {
      parts.push({ text: SYSTEM_PROMPT_ANALYST });
      parts.push({
        inlineData: {
          data: base64,
          mimeType: mimeType || "application/pdf"
        }
      });
    } else {
      parts.push({ text: "You are a helpful and interactive AI assistant named Athex." });
    }
    parts.push({ text: prompt });

    const responseStream = await ai.models.generateContentStream({
      model: model || "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: parts
        }
      ],
      config: {
        temperature: base64 ? 0.2 : 0.7,
      }
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to process query" }), { status: 500 });
  }
}