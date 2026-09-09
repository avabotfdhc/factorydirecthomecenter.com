import { NextResponse } from "next/server";
import { buildAvaKnowledge } from "@/lib/ava-knowledge";
import { submitLead } from "@/app/actions/leads";

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

// Ava converts: once she has a name, a phone/email and a county she calls
// this tool and the lead goes through the same pipeline as the quote form
// (Supabase leads table + email/CRM fan-out via submitLead).
const CAPTURE_LEAD_TOOL = {
  type: "function",
  function: {
    name: "capture_lead",
    description:
      "Send the visitor's details to the Auburn sales team for a line-item quote and spec package. Call it as soon as you have their full name, a phone number or email, and the delivery county/state.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Full name" },
        contact: { type: "string", description: "Phone number or email address" },
        county: { type: "string", description: "Delivery county and state, e.g. DeKalb County, IN" },
        timeframe: { type: "string", description: "Move-in timeline in the visitor's words" },
        modelName: { type: "string", description: "Floor plan or home type they are interested in" },
        series: { type: "string", description: "Champion series, if known" },
        notes: { type: "string", description: "Land status, bedrooms, budget tier, anything else useful" },
      },
      required: ["name", "contact", "county"],
    },
  },
} as const;

interface LeadArgs {
  name?: string;
  contact?: string;
  county?: string;
  timeframe?: string;
  modelName?: string;
  series?: string;
  notes?: string;
}

interface OpenAIChoice {
  message?: {
    content?: string | null;
    tool_calls?: { id: string; type: string; function: { name: string; arguments: string } }[];
  };
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
    const systemMessage = {
      role: "system",
      content: `${AVA_SYSTEM_PROMPT}\n\nKNOWLEDGE BASE (authoritative — prefer it over general knowledge):\n${knowledge}`,
    };
    const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
    const complete = async (msgs: unknown[], withTools: boolean) => {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          max_tokens: 450,
          messages: msgs,
          ...(withTools ? { tools: [CAPTURE_LEAD_TOOL], tool_choice: "auto" } : {}),
        }),
      });
      if (!res.ok) {
        console.error("[chat] OpenAI HTTP", res.status, (await res.text()).slice(0, 300));
        return null;
      }
      const data = (await res.json()) as { choices?: OpenAIChoice[] };
      return data.choices?.[0]?.message ?? null;
    };

    const first = await complete([systemMessage, ...messages], true);
    if (!first) return NextResponse.json({ error: "Chat unavailable" }, { status: 502 });

    const call = first.tool_calls?.find((c) => c.function?.name === "capture_lead");
    if (!call) {
      const reply = first.content?.trim();
      if (!reply) return NextResponse.json({ error: "Chat unavailable" }, { status: 502 });
      return NextResponse.json({ reply });
    }

    // Ava decided to convert: save the lead, then let her confirm naturally.
    let args: LeadArgs = {};
    try {
      args = JSON.parse(call.function.arguments || "{}") as LeadArgs;
    } catch {
      args = {};
    }
    const sourcePage = (() => {
      try {
        return new URL(request.headers.get("referer") || "").pathname;
      } catch {
        return "/chat";
      }
    })();
    const result = await submitLead({
      name: String(args.name || ""),
      contact: String(args.contact || ""),
      county: String(args.county || ""),
      timeframe: String(args.timeframe || "Just researching"),
      modelName: String(args.modelName || "Chat inquiry"),
      series: String(args.series || "Champion"),
      sourcePage: `${sourcePage} (Ava chat)${args.notes ? ` — ${String(args.notes).slice(0, 200)}` : ""}`,
    });

    const followUp = await complete(
      [
        systemMessage,
        ...messages,
        { role: "assistant", content: first.content || null, tool_calls: first.tool_calls },
        {
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(
            result.success
              ? { status: "saved", next: "A home specialist will reach out within one business day. Offer a lot visit at 1211 State Road 8, Auburn." }
              : { status: "failed", next: "Apologize briefly and give the phone number (260) 308-1457 and the Get Pricing button as the fallback." },
          ),
        },
      ],
      false,
    );
    const reply =
      followUp?.content?.trim() ||
      (result.success
        ? `Got it, ${args.name}. Our Auburn team will reach out at ${args.contact} within one business day with your line-item quote and spec sheet. Would you like to set up a lot visit as well?`
        : "I couldn't save that just now. Please call or text (260) 308-1457, or use the Get Pricing button on any floor plan, and the team will take it from there.");
    return NextResponse.json({ reply, leadCaptured: result.success });
  } catch (err) {
    console.error("[chat] failed:", err);
    return NextResponse.json({ error: "Chat unavailable" }, { status: 500 });
  }
}
