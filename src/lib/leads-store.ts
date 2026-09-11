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
// Server-side only. Prefers the service-role key; falls back to the anon key,
// which the table's "Allow anonymous lead inserts" policy permits.

export interface StoredLead {
  fullName: string;
  /** "phone · email" — the column is NOT NULL, so never empty. */
  contactInfo: string;
  targetCounty: string;
  timeline: string;
  modelInterest: string;
  seriesInterest?: string;
  sourcePage?: string;
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
    }),
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).replace(/\s+/g, " ").slice(0, 200);
    throw new Error(`supabase leads insert HTTP ${res.status}${detail ? `: ${detail}` : ""}`);
  }
  const rows = (await res.json().catch(() => [])) as { id?: string }[];
  return rows?.[0]?.id ?? null;
}
