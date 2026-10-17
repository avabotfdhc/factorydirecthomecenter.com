// Rebuild a DealerTide lead from a `public.leads` row.
//
// Exists because of 2026-10-09 → 2026-10-17: DealerTide rejected the partner
// API key on every website lead for eight days ("Invalid or revoked API key"),
// so 17 buyers were in Supabase and not in the CRM. `leads-store.ts` wrote the
// durable copy for exactly this case; this module turns that copy back into
// the payload `/api/leads` would have sent, so `scripts/replay-dealertide-leads.ts`
// can push them once the key works. Pure functions, no network, no env —
// tested in `tests/lead-replay.test.ts`.
//
// Replaying is safe to repeat: DealerTide dedupes on email/phone and answers
// 202 for a contact it already has, which the script reports as "already in
// DealerTide" rather than a failure.

import type { DealertideLead } from "./dealertide";

/** The columns the script selects from `public.leads`. */
export interface StoredLeadRow {
  id: string;
  created_at: string;
  full_name: string;
  /** "phone · email", either half optional — see leads-store.ts. */
  contact_info: string;
  target_county: string | null;
  timeline: string | null;
  model_interest: string | null;
  series_interest: string | null;
  source_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  click_id: string | null;
  click_id_type: string | null;
  landing_page: string | null;
  referrer: string | null;
  first_touch_source: string | null;
  first_touch_medium: string | null;
  first_touch_campaign: string | null;
  touch_count: number | null;
}

/** "Jane Q Public" → first "Jane", last "Q Public"; one word → last "—",
 *  matching what the instant-quote action sends. */
export function splitName(fullName: string): { first_name: string; last_name: string } {
  const [first, ...rest] = fullName.trim().split(/\s+/).filter(Boolean);
  return { first_name: first || "Website", last_name: rest.join(" ") || "—" };
}

/** Pull the phone and the email back out of the stored "phone · email". The
 *  separator is not relied on: anything with an "@" is the email, anything
 *  with seven or more digits is the phone, in whichever order they were
 *  stored. */
export function parseContactInfo(contactInfo: string): { phone: string; email: string } {
  let phone = "";
  let email = "";
  for (const raw of contactInfo.split(/\s*·\s*|\s{2,}|,|;/)) {
    const part = raw.trim();
    if (!part) continue;
    if (!email && part.includes("@")) email = part;
    else if (!phone && part.replace(/\D/g, "").length >= 7) phone = part;
  }
  return { phone, email };
}

/** The same attribution lines `attributionSummaryLines()` writes into a live
 *  lead, rebuilt from the columns `attributionColumns()` stored. */
export function attributionLinesFromRow(row: StoredLeadRow): string[] {
  const describe = (s: string | null, m: string | null, c: string | null) =>
    [s, m, c].filter(Boolean).join(" / ") || "";
  const last = describe(row.utm_source, row.utm_medium, row.utm_campaign);
  const first = describe(row.first_touch_source, row.first_touch_medium, row.first_touch_campaign);
  if (!last && !first) return [];
  const lines = [`Source (last touch): ${last || "unknown"}`];
  if (first && first !== last) lines.push(`First found us via: ${first}`);
  if (row.utm_term) lines.push(`Search term: ${row.utm_term}`);
  if (row.click_id_type && row.click_id) lines.push(`Click ID (${row.click_id_type}): ${row.click_id}`);
  if (row.referrer) lines.push(`Referred by: ${row.referrer}`);
  if (row.landing_page) lines.push(`Landed on: ${row.landing_page}`);
  if ((row.touch_count ?? 0) > 1) lines.push(`Campaign touches before enquiring: ${row.touch_count}`);
  return lines;
}

/** Kyle's and the agent's own test submissions. Skipped unless asked for. */
export function looksLikeTestLead(row: StoredLeadRow): boolean {
  const hay = `${row.full_name} ${row.contact_info}`.toLowerCase();
  return (
    /\bfactorydirecthomescenter\.com\b/.test(hay) ||
    hay.includes("avabotfdhc") ||
    /^\s*test\b/i.test(row.full_name)
  );
}

/** The payload `/api/leads` would have sent for this row, plus a line that
 *  says it is a replay and when the buyer actually enquired, so the
 *  salesperson does not treat an eight-day-old lead as fresh. */
export function replayPayload(row: StoredLeadRow): DealertideLead {
  const { phone, email } = parseContactInfo(row.contact_info);
  const submitted = new Date(row.created_at);
  const when = Number.isNaN(submitted.getTime())
    ? row.created_at
    : submitted.toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" }) + " ET";
  const message = [
    `Form: Website (replayed from the site's lead record — originally submitted ${when})`,
    row.model_interest && row.model_interest !== "Direct Inquiry" && `Interest: ${row.model_interest}`,
    row.target_county && row.target_county !== "Not specified" && `Delivery: ${row.target_county}`,
    row.timeline && row.timeline !== "Not specified" && `Timeframe: ${row.timeline}`,
    ...attributionLinesFromRow(row).map((line) => `— ${line}`),
  ]
    .filter(Boolean)
    .join("\n");
  const lead: DealertideLead = {
    ...splitName(row.full_name),
    source: "Website",
    message,
    page_url: row.source_page || "",
  };
  if (phone) lead.phone = phone;
  if (email) lead.email = email;
  return lead;
}
