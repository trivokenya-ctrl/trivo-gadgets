import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Configure OpenRouter as the provider
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openrouter('google/gemini-2.5-flash'), // Free model per request
    system: "You are a helpful customer support agent for Trivo Kenya, an e-commerce store selling premium tech gadgets in Kenya. Be polite, concise, and helpful. You can guide users to the shopping cart or WhatsApp checkout if they want to buy something. Prices are in KES. Keep your answers brief.",
    messages,
  });

  return result.toTextStreamResponse();
}
