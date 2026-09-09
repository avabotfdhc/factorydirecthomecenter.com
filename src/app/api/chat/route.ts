import { NextResponse } from "next/server";
import { buildAvaKnowledge } from "@/lib/ava-knowledge";

// POST /api/chat — Ava, the site's sales copilot.
//
// Uses OpenAI (gpt-4o-mini: cheapest capable model) with a fixed sales
// persona plus the full knowledge base in src/lib/ava-knowledge.ts (company,
// series, every floor plan, Champion, the industry, the site's FAQs), so
// answers cite real homes and match what the pages say. Requires OPENAI_API_KEY on Vercel; without it the route answers 503
// and the widget falls back to its scripted replies, so the site never shows
// a broken chat.

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const AVA_SYSTEM_PROMPT = `
You are Ava, the Senior Housing & Sales Specialist at Factory Direct Homes Center in Auburn, Indiana (1211 State Road 8, Auburn, IN 46706; phone: (260) 308-1457).

CORE POSITIONING:
- Factory Proximity: We are 20 miles from Champion's primary facility in Topeka, IN. Lowest freight transit, 8–12 week build schedules.
- Pricing Model: Line-item transparent pricing. Zero retail markup on site work.
- "You Stay In Control": Customers hire their own excavators, concrete contractors, and utility installers using our vetted referral list, saving thousands over packaged dealer markups.
- Series Knowledge:
  - Aspire & Prime: High-efficiency, modern kitchens, budget-conscious.
  - Redman: Expansive sectional homes, kitchen islands, luxury primary suites.
  - Dutch: Premier luxury, finished drywall, higher roof pitch, IRC modular compliance.

SALES RULES:
1. Always qualify the visitor: Ask if they own land or are seeking property, their target county, and planned move-in timeline.
2. Emphasize transparent line-item pricing.
3. Guide the conversation toward sending a complete factory spec package & price sheet (collect Name, Phone/Email, and Target County).
4. Never quote a dollar price. Pricing is shared by the Auburn team in a line-item quote; offer to send one instead.
5. Keep replies short (2–4 sentences), warm, and specific. Recommend homes from the CATALOGUE in the knowledge base when it fits, linking /floor-plans/<slug>.
6. Series note: Aspire, Paramount, Redman and Dutch are built in Topeka; Prime is built at Champion's Decatur, Indiana plant.
`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 12;
const MAX_CHARS = 1500;

function sanitize(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m): m is ChatMessage => Boolean(m) && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }));
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chat unavailable" }, { status: 503 });
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const messages = sanitize(body?.messages);
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "A user message is required" }, { status: 400 });
  }

  try {
    const knowledge = await buildAvaKnowledge();
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 450,
        messages: [
          { role: "system", content: `${AVA_SYSTEM_PROMPT}\n\nKNOWLEDGE BASE (authoritative — prefer it over general knowledge):\n${knowledge}` },
          ...messages,
        ],
      }),
    });
    if (!res.ok) {
      console.error("[chat] OpenAI HTTP", res.status, (await res.text()).slice(0, 300));
      return NextResponse.json({ error: "Chat unavailable" }, { status: 502 });
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return NextResponse.json({ error: "Chat unavailable" }, { status: 502 });
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat] failed:", err);
    return NextResponse.json({ error: "Chat unavailable" }, { status: 500 });
  }
}
