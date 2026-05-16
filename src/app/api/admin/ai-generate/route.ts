import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const { text } = await generateText({
      model: openrouter("google/gemini-2.5-flash"),
      system: `You are an expert e-commerce product manager and SEO copywriter for Trivo Kenya, a premium tech gadget store in Kenya.
Given a rough product description or idea, generate:
- title: A compelling product title (max 70 characters, SEO-optimized, includes brand if mentioned)
- description: A detailed product description (2-4 sentences, persuasive, includes key features and benefits)
- category: Select the most appropriate category from: Smartphone, Laptop, Audio, Wearable, Accessory, Gaming, Smart Home, Tablet

Return ONLY valid JSON with exactly these three fields: title, description, category. No markdown, no code fences.`,
      prompt,
    });

    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json({
      title: String(result.title || "").slice(0, 70),
      description: String(result.description || ""),
      category: String(result.category || "Accessory"),
    });
  } catch {
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
