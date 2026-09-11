"use server";

import { headers } from "next/headers";
import { storeLead } from "@/lib/leads-store";

// Lead intake for the instant-quote modal (PriceQuoteModal) and the mobile
// action bar.
//
// Two destinations, run together so neither can lose a lead:
//   1. Supabase `public.leads` (the owned CMS) — when the Supabase env vars
//      are set. Server-side we prefer the service-role key; otherwise the
//      publishable key works through the anon INSERT policy.
//   2. The existing /api/leads fan-out (email, Google Sheets, legacy CMS,
//      DealerTide), so the lead shows up everywhere it always has.
// Success means at least one destination accepted it.

export interface LeadSubmission {
  name: string;
  /** Phone number (required). */
  contact: string;
  /** Email address (optional). */
  email?: string;
  county: string;
  timeframe: string;
  modelName: string;
  series?: string;
  sourcePage?: string;
  /** Lead source label for email/CRM ("Instant Quote", "Ava Chat — Showroom Visit"). */
  source?: string;
  /** Free-text note for the team (preferred visit time, must-haves, land status). */
  message?: string;
}

export interface LeadResult {
  success: boolean;
  leadId?: string;
  error?: string;
}

const clean = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

// One insert implementation for every form on the site (lib/leads-store.ts),
// so the instant-quote modal and /api/leads write identical rows.
function insertSupabaseLead(lead: LeadSubmission): Promise<string | null> {
  return storeLead({
    fullName: lead.name,
    contactInfo: [clean(lead.contact, 60), clean(lead.email, 120)].filter(Boolean).join(" · "),
    targetCounty: lead.county,
    timeline: lead.timeframe,
    modelInterest: lead.modelName,
    seriesInterest: lead.series,
    sourcePage: lead.sourcePage || "/",
  });
}

// The quote modal asks for a phone number and an optional email, so pass
// exactly what the visitor gave. /api/leads accepts phone-only; it used to
// require an email, which forced a placeholder that DealerTide then deduped
// every phone-only lead against.
async function fanOutToLeadsApi(lead: LeadSubmission): Promise<void> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  if (!host) return;
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const [firstName, ...rest] = clean(lead.name, 120).split(/\s+/);
  const phone = clean(lead.contact, 60);
  const email = clean(lead.email, 120);
  const res = await fetch(`${proto}://${host}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      firstName: firstName || "Website",
      lastName: rest.join(" ") || "—",
      ...(email ? { email } : {}),
      phone,
      // This action already stored the lead in Supabase (insertSupabaseLead);
      // tell the route not to write a second row.
      skipStore: true,
      interest: clean(lead.modelName, 160),
      deliveryState: clean(lead.county, 120),
      timeframe: clean(lead.timeframe, 60),
      message:
        clean(lead.message, 600) ||
        `Instant price quote request for ${clean(lead.modelName, 160)} (${clean(lead.series, 60) || "Champion"}). Delivery: ${clean(lead.county, 120)}.`,
      source: clean(lead.source, 80) || "Instant Quote",
      pageUrl: clean(lead.sourcePage, 300),
    }),
  });
  if (!res.ok) throw new Error(`/api/leads HTTP ${res.status}`);
}

export async function submitLead(payload: LeadSubmission): Promise<LeadResult> {
  const lead: LeadSubmission = {
    name: clean(payload?.name, 120),
    contact: clean(payload?.contact, 60),
    email: clean(payload?.email, 120),
    county: clean(payload?.county, 120),
    timeframe: clean(payload?.timeframe, 60) || "Just researching",
    modelName: clean(payload?.modelName, 160) || "Direct Inquiry",
    series: clean(payload?.series, 60) || "Champion",
    sourcePage: clean(payload?.sourcePage, 300),
    source: clean(payload?.source, 80),
    message: clean(payload?.message, 600),
  };
  if (!lead.name || lead.contact.replace(/\D/g, "").length < 10 || !lead.county) {
    return { success: false, error: "Name, a phone number and county are required" };
  }

  const [db, api] = await Promise.allSettled([insertSupabaseLead(lead), fanOutToLeadsApi(lead)]);
  if (db.status === "rejected") console.error("[leads] Supabase insert failed:", db.reason);
  if (api.status === "rejected") console.error("[leads] /api/leads fan-out failed:", api.reason);

  const leadId = db.status === "fulfilled" ? db.value : null;
  const ok = db.status === "fulfilled" && (leadId !== null || api.status === "fulfilled");
  if (ok || api.status === "fulfilled") {
    return { success: true, ...(leadId ? { leadId } : {}) };
  }
  return { success: false, error: "Could not save your request. Please call (260) 308-1457." };
}
