// Where every lead actually came from.
//
// Until now the site captured nothing about a visitor's origin: no utm_*, no
// gclid, no referrer, no landing page. Nine separate entry points
// (contact form, both quote modals, the brochure email, the sale claim and
// sales-alert forms, the home designer, the instant-quote server action and
// Ava's two chat tools) all posted a name and a phone number and nothing else,
// so a lead from a $40 Google Ads click and a lead from an organic blog post
// were indistinguishable in DealerTide. There was no way to answer "which
// campaign paid for itself".
//
// The design deliberately captures ONCE, on the client, into a single
// first-party cookie, and reads it on the SERVER at submit time:
//
//   • One cookie, not nine form fields. The browser sends it with every POST,
//     so every current and future lead path inherits attribution without
//     touching the form. Adding a tenth form needs no attribution work at all.
//   • First touch AND last touch. First touch is what earned the relationship
//     (the blog post that ranked); last touch is what closed it (the retargeting
//     ad). Home buying runs weeks to months, so a last-touch-only model would
//     credit every sale to a branded search and hide everything that works.
//   • Consent-aware. src/lib/consent.ts runs a notice-and-opt-out model and
//     honours Global Privacy Control. A visitor who has opted out (or whose
//     browser broadcasts GPC) gets no attribution cookie, same as no analytics.
//     See AttributionTracker.
//
// This module is isomorphic: the client writes the cookie, the server parses it.
// Nothing here touches the network or React.

export const ATTRIBUTION_COOKIE = "fdhc_attr";

/** 90 days. Longer than a typical manufactured-home consideration cycle is
 *  worth little: a first touch older than a quarter is not what produced the
 *  lead, and a year-long cookie is a harder privacy story for no payoff. */
export const ATTRIBUTION_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

/** Cookies cap at ~4 KB per name. Every free-text field is clamped so a long
 *  campaign name or a referrer with a huge query string can never silently
 *  push the cookie past the limit and have the browser drop the whole thing. */
const LIMITS = {
  source: 120,
  medium: 120,
  campaign: 160,
  term: 120,
  content: 160,
  clickId: 200,
  landingPage: 300,
  referrer: 300,
} as const;

export type ClickIdType =
  | ""
  | "gclid"
  | "gbraid"
  | "wbraid"
  | "fbclid"
  | "msclkid"
  | "ttclid"
  | "li_fat_id";

/** One arrival at the site. */
export interface Touch {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  /** The ad platform's click identifier, when the URL carried one. */
  clickId: string;
  clickIdType: ClickIdType;
  /** Path + query the visit started on, our own origin stripped. */
  landingPage: string;
  /** External referrer (host + path). Empty for direct and internal clicks. */
  referrer: string;
  /** ISO 8601, when the touch was recorded. */
  at: string;
}

export interface Attribution {
  v: 1;
  first: Touch;
  last: Touch;
  /** How many campaign/referral touches this browser has produced. */
  visits: number;
}

export function emptyTouch(): Touch {
  return {
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
    clickId: "",
    clickIdType: "",
    landingPage: "",
    referrer: "",
    at: "",
  };
}

const clamp = (value: unknown, max: number): string =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";

// ── Referrer classification ─────────────────────────────────────────────────
// Only hosts we can name confidently are mapped. Everything else keeps its own
// hostname as the source and `referral` as the medium, which is honest and
// still groups cleanly in a spreadsheet.

const SEARCH_ENGINES: Array<[RegExp, string]> = [
  [/(^|\.)google\./, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)duckduckgo\.com$/, "duckduckgo"],
  [/(^|\.)search\.yahoo\.com$/, "yahoo"],
  [/(^|\.)ecosia\.org$/, "ecosia"],
  [/(^|\.)search\.brave\.com$/, "brave"],
  [/(^|\.)yandex\./, "yandex"],
  [/(^|\.)baidu\.com$/, "baidu"],
];

const SOCIAL_NETWORKS: Array<[RegExp, string]> = [
  [/(^|\.)facebook\.com$/, "facebook"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)t\.co$/, "twitter"],
  [/(^|\.)x\.com$/, "twitter"],
  [/(^|\.)linkedin\.com$/, "linkedin"],
  [/(^|\.)lnkd\.in$/, "linkedin"],
  [/(^|\.)pinterest\./, "pinterest"],
  [/(^|\.)youtube\.com$/, "youtube"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)reddit\.com$/, "reddit"],
  [/(^|\.)nextdoor\.com$/, "nextdoor"],
];

/**
 * Answer engines. Broken out from plain referrals on purpose: traffic arriving
 * from ChatGPT, Perplexity, Copilot, Gemini and Claude is the only direct
 * measurement anyone gets of AEO working, and it is invisible if it is lumped
 * in with "referral". Kyle can filter `medium = 'ai'` and see whether the
 * FAQ and guide rewrites are being cited.
 */
const ANSWER_ENGINES: Array<[RegExp, string]> = [
  [/(^|\.)chatgpt\.com$/, "chatgpt"],
  [/(^|\.)chat\.openai\.com$/, "chatgpt"],
  [/(^|\.)openai\.com$/, "chatgpt"],
  [/(^|\.)perplexity\.ai$/, "perplexity"],
  [/(^|\.)claude\.ai$/, "claude"],
  [/(^|\.)gemini\.google\.com$/, "gemini"],
  [/(^|\.)copilot\.microsoft\.com$/, "copilot"],
  [/(^|\.)bing\.com\/chat$/, "copilot"],
  [/(^|\.)you\.com$/, "you"],
  [/(^|\.)phind\.com$/, "phind"],
];

/** Click identifiers, in the order they should win when several are present. */
const CLICK_IDS: Array<[ClickIdType, string, string]> = [
  // param, default source, default medium
  ["gclid", "google", "cpc"],
  ["gbraid", "google", "cpc"],
  ["wbraid", "google", "cpc"],
  ["msclkid", "bing", "cpc"],
  ["ttclid", "tiktok", "paid_social"],
  ["li_fat_id", "linkedin", "paid_social"],
  // fbclid rides organic Facebook and Instagram shares as well as paid
  // placements, so it is classified as social rather than assumed to be paid.
  // A paid campaign that also sets utm_medium overrides this.
  ["fbclid", "facebook", "social"],
];

function classifyReferrer(host: string): { source: string; medium: string } {
  const h = host.toLowerCase().replace(/^www\./, "");
  for (const [re, name] of ANSWER_ENGINES) if (re.test(h)) return { source: name, medium: "ai" };
  for (const [re, name] of SEARCH_ENGINES) if (re.test(h)) return { source: name, medium: "organic" };
  for (const [re, name] of SOCIAL_NETWORKS) if (re.test(h)) return { source: name, medium: "social" };
  return { source: h, medium: "referral" };
}

// ── Building a touch ────────────────────────────────────────────────────────

export interface TouchInput {
  /** The full URL of the page being viewed. */
  url: string;
  /** document.referrer, or "". */
  referrer?: string;
  /** Overridable for tests. */
  now?: Date;
}

/**
 * Reads one arrival into a Touch. Always returns a Touch — a direct visit with
 * no parameters is still the landing page, which is what first touch needs.
 * Use `isAttributedTouch` to decide whether it should replace the last touch.
 */
export function parseTouch({ url, referrer = "", now = new Date() }: TouchInput): Touch {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ...emptyTouch(), at: now.toISOString() };
  }
  const q = parsed.searchParams;
  const touch = emptyTouch();
  touch.at = now.toISOString();
  touch.landingPage = clamp(parsed.pathname + parsed.search, LIMITS.landingPage);

  touch.source = clamp(q.get("utm_source"), LIMITS.source);
  touch.medium = clamp(q.get("utm_medium"), LIMITS.medium);
  touch.campaign = clamp(q.get("utm_campaign"), LIMITS.campaign);
  touch.term = clamp(q.get("utm_term"), LIMITS.term);
  touch.content = clamp(q.get("utm_content"), LIMITS.content);

  for (const [param, defSource, defMedium] of CLICK_IDS) {
    const value = q.get(param);
    if (!value) continue;
    touch.clickId = clamp(value, LIMITS.clickId);
    touch.clickIdType = param;
    // An explicit utm_* always wins; the click id only fills what is missing.
    if (!touch.source) touch.source = defSource;
    if (!touch.medium) touch.medium = defMedium;
    break;
  }

  // The referrer is recorded whenever it is external, and fills source/medium
  // only when the URL said nothing.
  if (referrer) {
    try {
      const ref = new URL(referrer);
      if (ref.host.toLowerCase().replace(/^www\./, "") !== parsed.host.toLowerCase().replace(/^www\./, "")) {
        touch.referrer = clamp(ref.host + (ref.pathname === "/" ? "" : ref.pathname), LIMITS.referrer);
        const guess = classifyReferrer(ref.host);
        if (!touch.source) touch.source = guess.source;
        if (!touch.medium) touch.medium = guess.medium;
      }
    } catch {
      /* an unparseable referrer is the same as none */
    }
  }

  if (!touch.source) {
    touch.source = "direct";
    touch.medium = touch.medium || "none";
  }

  return touch;
}

/** True when the arrival carries a real origin signal rather than "direct". */
export function isAttributedTouch(touch: Touch): boolean {
  return Boolean(touch.clickId) || Boolean(touch.referrer) || (touch.source !== "direct" && touch.source !== "");
}

/**
 * Folds a new arrival into what we already knew.
 *
 * First touch is written once and never overwritten — that is the whole point
 * of it. Last touch only moves for an arrival that actually carries a signal,
 * so a visitor who clicks an ad, leaves, and comes back by typing the domain
 * still has the ad credited rather than being relabelled "direct" at the
 * moment they convert. That single rule is the difference between usable ad
 * reporting and reporting that says every sale came from nowhere.
 */
export function mergeAttribution(existing: Attribution | null, touch: Touch): Attribution {
  if (!existing) {
    return { v: 1, first: touch, last: touch, visits: isAttributedTouch(touch) ? 1 : 0 };
  }
  if (!isAttributedTouch(touch)) return existing;
  // Same campaign continuing in the same session is not a new visit.
  const sameOrigin =
    existing.last.source === touch.source &&
    existing.last.medium === touch.medium &&
    existing.last.campaign === touch.campaign &&
    existing.last.clickId === touch.clickId;
  if (sameOrigin) return existing;
  return { v: 1, first: existing.first, last: touch, visits: existing.visits + 1 };
}

// ── Cookie wire format ──────────────────────────────────────────────────────
// Short keys, because two full touches with long campaign names and landing
// paths would otherwise crowd the 4 KB cookie limit. The mapping is here and
// nowhere else.

const WIRE: Array<[keyof Touch, string]> = [
  ["source", "s"],
  ["medium", "m"],
  ["campaign", "c"],
  ["term", "t"],
  ["content", "n"],
  ["clickId", "i"],
  ["clickIdType", "y"],
  ["landingPage", "p"],
  ["referrer", "r"],
  ["at", "d"],
];

function touchToWire(touch: Touch): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, short] of WIRE) {
    const value = touch[key];
    if (value) out[short] = value;
  }
  return out;
}

function wireToTouch(wire: unknown): Touch {
  const touch = emptyTouch();
  if (!wire || typeof wire !== "object") return touch;
  const w = wire as Record<string, unknown>;
  for (const [key, short] of WIRE) {
    const raw = w[short];
    if (typeof raw !== "string") continue;
    const max = key in LIMITS ? LIMITS[key as keyof typeof LIMITS] : 300;
    (touch as unknown as Record<string, string>)[key] = clamp(raw, max);
  }
  return touch;
}

export function encodeAttribution(attribution: Attribution): string {
  return encodeURIComponent(
    JSON.stringify({
      v: 1,
      f: touchToWire(attribution.first),
      l: touchToWire(attribution.last),
      n: attribution.visits,
    }),
  );
}

export function decodeAttribution(raw: string | null | undefined): Attribution | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Record<string, unknown>;
    if (parsed?.v !== 1) return null;
    const first = wireToTouch(parsed.f);
    const last = wireToTouch(parsed.l);
    if (!first.at && !last.at) return null;
    const visits = Number(parsed.n);
    return { v: 1, first, last, visits: Number.isFinite(visits) ? visits : 0 };
  } catch {
    // A truncated or hand-edited cookie is treated as absent rather than
    // throwing inside a lead submission.
    return null;
  }
}

/** Pulls our cookie out of a raw `Cookie:` header. Server side. */
export function readAttributionCookie(cookieHeader: string | null | undefined): Attribution | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() !== ATTRIBUTION_COOKIE) continue;
    return decodeAttribution(part.slice(eq + 1).trim());
  }
  return null;
}

// ── Outputs ─────────────────────────────────────────────────────────────────

/** Flat columns for `public.leads`. Null rather than "" so the table stays
 *  queryable with `is null` and does not fill up with empty strings. */
export function attributionColumns(attribution: Attribution | null): Record<string, string | number | null> {
  const nul = (v: string) => (v ? v : null);
  if (!attribution) {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
      click_id: null,
      click_id_type: null,
      landing_page: null,
      referrer: null,
      first_touch_source: null,
      first_touch_medium: null,
      first_touch_campaign: null,
      first_touch_at: null,
      touch_count: null,
    };
  }
  const { first, last } = attribution;
  return {
    utm_source: nul(last.source),
    utm_medium: nul(last.medium),
    utm_campaign: nul(last.campaign),
    utm_term: nul(last.term),
    utm_content: nul(last.content),
    click_id: nul(last.clickId),
    click_id_type: nul(last.clickIdType),
    landing_page: nul(first.landingPage || last.landingPage),
    referrer: nul(last.referrer),
    first_touch_source: nul(first.source),
    first_touch_medium: nul(first.medium),
    first_touch_campaign: nul(first.campaign),
    first_touch_at: nul(first.at),
    touch_count: attribution.visits,
  };
}

/** One short line per fact, for the lead email and the DealerTide note —
 *  the salesperson opening the lead sees the campaign that produced it. */
export function attributionSummaryLines(attribution: Attribution | null): string[] {
  if (!attribution) return [];
  const { first, last } = attribution;
  const describe = (t: Touch) =>
    [t.source, t.medium, t.campaign].filter(Boolean).join(" / ") || "unknown";
  const lines = [`Source (last touch): ${describe(last)}`];
  const firstDiffers =
    first.source !== last.source || first.medium !== last.medium || first.campaign !== last.campaign;
  if (firstDiffers) lines.push(`First found us via: ${describe(first)}`);
  if (last.term) lines.push(`Search term: ${last.term}`);
  if (last.content) lines.push(`Ad content: ${last.content}`);
  if (last.clickIdType) lines.push(`Click ID (${last.clickIdType}): ${last.clickId}`);
  if (last.referrer) lines.push(`Referred by: ${last.referrer}`);
  if (first.landingPage) lines.push(`Landed on: ${first.landingPage}`);
  if (attribution.visits > 1) lines.push(`Campaign touches before enquiring: ${attribution.visits}`);
  return lines;
}
