// Durable copy of every website lead in Supabase `public.leads`.
//
// Why this exists: as of 2026-09-10 DealerTide is the ONLY working lead
// destination. Resend and Google Sheets are unconfigured on Vercel, and the
// legacy CMS enquiry API has answered 5xx since 2026-08-29. That left each
// lead as a single HTTP POST with no record behind it — if DealerTide blinked,
// the lead was gone and the visitor still saw "Lead received". Writing the
// submission here first means a CRM hiccup can never lose one, and gives a
// table to reconcile DealerTide against.
//
// Server-side only, and it MUST run as the service role. `service_role` is the
// only one of the three Supabase roles with `rolbypassrls`, which is what lets
// this insert succeed: since 2026-10-11 the table's "Allow anonymous lead
// inserts" policy is `with check (false)`, closing a Supabase advisor finding
// that an unrestricted anon INSERT let a scripted PostgREST POST write straight
// to `leads`, bypassing the honeypot, the fill timer and Turnstile.
//
// The anon/publishable fallback below is therefore a diagnostic, not a working
// second path: with only that key the POST comes back 403 and `storeLead`
// throws, which `/api/leads` logs verbatim as "[leads] Supabase store failed"
// with PostgREST's own RLS message. That is deliberately louder than the
// "env vars not set" branch — an anon-only deployment is misconfigured, not
// unconfigured, and the log should say which. Keep SUPABASE_SERVICE_ROLE_KEY
// first in the chain; `/api/health` reports whether it is set.

import { type Attribution, attributionColumns } from "./attribution";

export interface StoredLead {
  fullName: string;
  /** "phone · email" — the column is NOT NULL, so never empty. */
  contactInfo: string;
  targetCounty: string;
  timeline: string;
  modelInterest: string;
  seriesInterest?: string;
  sourcePage?: string;
  /** Where the visitor came from, read from the attribution cookie by the
   *  caller. Null when the visitor opted out of tracking or arrived before
   *  the cookie existed — the lead is still stored, just unattributed. */
  attribution?: Attribution | null;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const WRITE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export function leadsStoreConfigured(): boolean {
  return Boolean(SUPABASE_URL && WRITE_KEY);
}

/**
 * Inserts one lead and resolves to its id. Throws on any failure so the caller
 * can log the reason — callers run this under Promise.allSettled and must never
 * let it block the visitor's response.
 */
export async function storeLead(lead: StoredLead): Promise<string | null> {
  if (!SUPABASE_URL || !WRITE_KEY) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: WRITE_KEY,
      Authorization: `Bearer ${WRITE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
    body: JSON.stringify({
      // NOT NULL columns get a readable fallback rather than a 400 from PostgREST.
      full_name: clean(lead.fullName, 120) || "Website visitor",
      contact_info: clean(lead.contactInfo, 200) || "—",
      target_county: clean(lead.targetCounty, 120) || "Not specified",
      timeline: clean(lead.timeline, 60) || "Not specified",
      model_interest: clean(lead.modelInterest, 160) || "Direct Inquiry",
      series_interest: clean(lead.seriesInterest, 60) || "Champion",
      source_page: clean(lead.sourcePage, 300) || null,
      // Campaign columns. Added by
      // supabase/migrations/20260920_lead_attribution.sql; PostgREST rejects
      // the whole insert with a 400 if they are missing, which is why the
      // migration has to be applied before this ships.
      ...attributionColumns(lead.attribution ?? null),
    }),
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).replace(/\s+/g, " ").slice(0, 200);
    throw new Error(`supabase leads insert HTTP ${res.status}${detail ? `: ${detail}` : ""}`);
  }
  const rows = (await res.json().catch(() => [])) as { id?: string }[];
  return rows?.[0]?.id ?? null;
}
