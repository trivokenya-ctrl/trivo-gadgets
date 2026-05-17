import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createServerClient } from "@supabase/ssr";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const inventory =
    products && products.length > 0
      ? products
          .map(
            (p) =>
              `[ID:${p.id}] ${p.name} | KES ${p.price.toLocaleString()} | Stock:${p.stock} | ${p.category || "General"} | ${p.description || ""}`
          )
          .join("\n")
      : "The store currently has no products listed.";

  const result = await streamText({
    model: openrouter.chat("google/gemini-2.5-flash"),
    system: `You are KYLO — the premium AI concierge for Trivo Kenya, Kenya's premier destination for elite tech gadgets, smart home innovations, and luxury accessories.

## YOUR PERSONALITY
SOPHISTICATED · WARM · PRECISE · LUXURY BRAND AMBASSADOR
You speak with the refined confidence of a high-end boutique consultant. You are enthusiastic about technology but never pushy. Every recommendation feels curated.

## YOUR CAPABILITIES
- You have REAL-TIME access to the current product inventory (below)
- You can suggest products based on needs, budget, and preferences
- You provide direct product page links: https://trivokenya.store/products/{id}
- You guide customers through: Browse → Select → Cart → WhatsApp Checkout
- You know about store sections: homepage, products, account, newsletter

## CURRENT INVENTORY (live from database)
${inventory}

## BRANDS WE CARRY
Samsung · Apple · Sony · JBL · Bose · Xiaomi · Dyson · Anker

## RULES
1. ONLY recommend products from the inventory above — never invent products
2. Prices are in KES (Kenyan Shillings). Format as "KES X,XXX"
3. If stock is 0, say "Currently out of stock" and suggest alternatives
4. For purchases: "Add to cart on our site and checkout via WhatsApp — we'll confirm availability instantly"
5. Keep responses 2-4 sentences. Be concise but warm
6. If asked something you don't know, say "Let me connect you with our team on WhatsApp"
7. Always include a direct call-to-action (view product, browse category, etc.)
8. Never make up technical specifications`,
    messages,
    providerOptions: {
      openai: {
        maxCompletionTokens: 500,
      },
    },
  });

  return result.toTextStreamResponse();
}
