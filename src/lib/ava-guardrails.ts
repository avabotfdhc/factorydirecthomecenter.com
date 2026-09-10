// Server-side guardrails for Ava (/api/chat).
//
// The prompt in src/lib/ava-knowledge.ts tells Ava how to behave; this file
// enforces the parts that must hold even when a visitor tries to talk her out
// of them. Nothing here calls the network. Ava has no browsing ability by
// construction: the model is called through the chat-completions API with
// exactly three function tools (plan lookup, quote request, visit request)
// and no web, code or file tools, so "reaching the open web" is impossible
// regardless of what a visitor asks. The checks below cover the rest:
//
//   • sanitizeUserText   — strips HTML/control characters and caps length.
//   • looksLikeInjection — catches "ignore your instructions" / persona-swap
//                          attempts before they reach the model; the route
//                          answers with a fixed, polite refusal instead.
//   • checkRateLimit     — per-IP message budget so one visitor (or a bot)
//                          cannot run up the OpenAI bill or spam leads.
//   • enforceReplyPolicy — post-filters the model's reply: removes links to
//                          any host but our own, blocks any dollar figure that
//                          is not one of the published contractor ranges,
//                          blocks prompt leakage, and trims runaway length.

export const SITE_HOST = "factorydirecthomescenter.com";
export const SHOWROOM_PHONE = "(260) 308-1457";

const MAX_USER_CHARS = 1500;
const MAX_REPLY_CHARS = 1400;

/** Fixed reply when a visitor tries to re-program Ava. Never reaches the model. */
export const INJECTION_REPLY =
  "I can only help with Factory Direct Homes Center and your home search — floor plans, options, financing, delivery, the current sale, and booking a showroom visit. What can I help you with there? If you'd rather talk to a person, call or text " +
  SHOWROOM_PHONE +
  ".";

/** Fixed reply once a visitor exceeds the message budget. */
export const RATE_LIMIT_REPLY =
  "You've sent quite a few messages — let's get you to a person. Call or text " +
  SHOWROOM_PHONE +
  " (Mon–Fri 9–5, Sat 10–4 Eastern) or use the Get Pricing button on any floor plan, and the Auburn team will take it from here.";

/** Reply substituted when the model tries to state a home price. */
export const PRICE_REDIRECT_REPLY =
  "Every home is priced line by line from the current factory sheet with the sale applied, so I don't quote figures in chat — the Auburn team turns quotes around quickly, usually the same business day. Want me to have them send a line-item quote and the spec sheet? I'd just need your name, a phone number, and the county the home would go to.";

/** Reply substituted if the model starts echoing its own instructions. */
export const LEAK_REDIRECT_REPLY =
  "Happy to help with your home search. Do you already own land, or are you still looking? I can match you with the right Champion home, get you a line-item quote, or book a showroom visit.";

// Dollar figures Ava may repeat: the pricing guide's published contractor
// ranges (delivery, set-up, site work). Anything else is a home price or an
// invented number and is blocked.
const ALLOWED_DOLLAR_FIGURES = new Set(["2500", "8000", "5000", "15000", "50000"]);

const DOLLAR_RE = /\$\s?(\d[\d,]*)(?:\.\d+)?\s*(k|K)?\b|\b(\d[\d,]*)\s+(?:dollars|USD)\b/g;
const SITE_URL_RE = /https?:\/\/(?:www\.)?factorydirecthomescenter\.com(\/[^\s)<>"']*)?/gi;
const EXTERNAL_URL_RE = /\bhttps?:\/\/[^\s)<>"']+|\bwww\.[a-z0-9-]+\.[a-z]{2,}[^\s)<>"']*/gi;
const LEAK_RE =
  /KNOWLEDGE BASE \(authoritative|HARD RULES:|VISITOR CONTEXT|OBJECTION HANDLING \(acknowledge|APPOINTMENT PLAYBOOK \(|CONVERSION PLAYBOOK \(|system prompt|my instructions say/i;

// Prompt-injection / persona-swap patterns. Deliberately narrow: ordinary
// buyer questions never match these, so false positives are rare and the cost
// of one is a polite redirect, not a lost lead.
const INJECTION_RE = new RegExp(
  [
    String.raw`\b(ignore|disregard|forget|override|bypass)\b[^.?!\n]{0,40}\b(your|all|any|previous|prior|above|these|earlier|the system)\s+(instructions?|rules?|prompt|guidelines?|programming|restrictions?)\b`,
    String.raw`\b(system prompt|developer (message|prompt)|hidden (prompt|instructions))\b`,
    String.raw`\b(you are now|from now on,? you are|pretend (to be|you are|you're)|act as (a|an|if you)|role-?play as|new persona|jailbreak|DAN mode|do anything now|developer mode)\b`,
    String.raw`\b(reveal|print|show|repeat|output)\b[^.?!\n]{0,40}\b(your|the) (instructions|prompt|rules|system message)\b`,
  ].join("|"),
  "i",
);

/** Strip markup and control characters from visitor text; cap its length. */
export function sanitizeUserText(text: unknown): string {
  return String(text ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_USER_CHARS);
}

/** True when the message reads as an attempt to re-program Ava. */
export function looksLikeInjection(text: string): boolean {
  return INJECTION_RE.test(text);
}

// ── Rate limiting ──────────────────────────────────────────────────────────
// In-memory token bucket keyed by client IP. On Vercel each warm function
// instance keeps its own map, so the effective ceiling is a little higher
// than the number below under heavy fan-out; it still stops a single browser
// or script from looping the endpoint, which is the case that matters.

export const RATE_LIMIT_MESSAGES = 30;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, now: number = Date.now()): { allowed: boolean; remaining: number } {
  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MESSAGES - 1 };
  }
  b.count += 1;
  return { allowed: b.count <= RATE_LIMIT_MESSAGES, remaining: Math.max(0, RATE_LIMIT_MESSAGES - b.count) };
}

/** Client IP from the proxy headers Vercel sets; "unknown" when absent. */
export function clientKey(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for") || "";
  const first = fwd.split(",")[0]?.trim();
  return first || headers.get("x-real-ip") || "unknown";
}

// ── Reply policy ───────────────────────────────────────────────────────────

export interface GuardedReply {
  text: string;
  /** Which rules fired: "external-link", "price", "leak", "length". */
  flags: string[];
}

function normalizeDigits(s: string): string {
  return s.replace(/,/g, "");
}

/** Apply the hard output rules to a model reply. */
export function enforceReplyPolicy(reply: string): GuardedReply {
  const flags: string[] = [];
  let text = String(reply || "").trim();

  // 1. Prompt leakage → replace wholesale.
  if (LEAK_RE.test(text)) {
    return { text: LEAK_REDIRECT_REPLY, flags: ["leak"] };
  }

  // 2. Home prices → replace wholesale (a partial edit would leave a
  //    sentence that still implies a figure).
  for (const m of text.matchAll(DOLLAR_RE)) {
    const digits = normalizeDigits(m[1] || m[3] || "");
    const hasK = Boolean(m[2]);
    if (!digits) continue;
    if (hasK || !ALLOWED_DOLLAR_FIGURES.has(digits)) {
      return { text: PRICE_REDIRECT_REPLY, flags: ["price"] };
    }
  }

  // 3. Links: keep our own domain as a site-relative path, drop every other host.
  text = text.replace(SITE_URL_RE, (_m, path) => path || "/");
  if (EXTERNAL_URL_RE.test(text)) {
    flags.push("external-link");
    text = text
      .replace(EXTERNAL_URL_RE, "")
      .replace(/\(\s*\)/g, "")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\s+([.,;:!?])/g, "$1")
      .trim();
  }

  // 4. Length: cut at the last sentence boundary inside the cap.
  if (text.length > MAX_REPLY_CHARS) {
    flags.push("length");
    const cut = text.slice(0, MAX_REPLY_CHARS);
    const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
    text = (end > 200 ? cut.slice(0, end + 1) : cut).trim();
  }

  return { text, flags };
}
