import { NextResponse } from "next/server";
import { probeDealertideKey } from "@/lib/dealertide";
import { dealertideEnvNames, inventoryToken } from "@/lib/dealertide-inventory-sync";
import { isAdminRequest } from "@/lib/admin-auth";
import { safeEqual } from "@/lib/request-guard";

export const dynamic = "force-dynamic";

// GET /api/health — which integrations this deployment has configured
// (booleans only, never values) plus two live probes: Supabase, and whether
// DealerTide ACCEPTS the lead key. `configured.dealerTide` only says a key is
// set; `dealerTide.key.verdict` says whether it works. The difference cost
// eight days of leads in October 2026 (see AGENTS.md). Env var changes on
// Vercel only reach deployments created after the change, so check this after
// every redeploy.
//
// Who sees what (security fixes, 2026-11-26): anyone gets the two verdicts —
// `ok` and `leadsReachCrm` — so an uptime monitor can watch them. The full
// report (variable names, the Supabase host, upstream response bodies) is
// shown only to a signed-in admin, or to a request carrying
// `x-health-key: <HEALTH_CHECK_SECRET>` when that env var is set.

const set = (name: string) => Boolean(process.env[name]);

async function probe(
  url: string,
  headers?: Record<string, string>,
): Promise<{ status: number | null; body?: unknown; error?: string }> {
  try {
    const res = await fetch(url, { headers, cache: "no-store", signal: AbortSignal.timeout(6000) });
    const text = await res.text();
    let body: unknown = text.slice(0, 200);
    try {
      body = JSON.parse(text);
    } catch {
      /* keep the text snippet */
    }
    return { status: res.status, body };
  } catch (e) {
    return { status: null, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET(request: Request) {
  const configured = {
    supabaseUrl: set("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: set("NEXT_PUBLIC_SUPABASE_ANON_KEY") || set("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    supabaseServiceRole: set("SUPABASE_SERVICE_ROLE_KEY"),
    anthropic: set("ANTHROPIC_API_KEY"),
    openai: set("OPENAI_API_KEY"),
    resend: set("RESEND_API_KEY"),
    // the Home Designer's texted design copy (src/lib/design-summary-send.ts)
    twilio: set("TWILIO_ACCOUNT_SID") && set("TWILIO_AUTH_TOKEN") && (set("TWILIO_MESSAGING_SERVICE_SID") || set("TWILIO_FROM_NUMBER")),
    leadWebhookSecret: set("LEAD_WEBHOOK_SECRET"),
    googleSheets: set("GOOGLE_SHEETS_ID") && set("GOOGLE_SERVICE_ACCOUNT_KEY"),
    dealerTide: set("DEALERTIDE_API_KEY"),
    // The inventory feed token: DEALERTIDE_INVENTORY_TOKEN, or the token inside
    // DEALERTIDE_FEED_URL. Read by POST /api/dealertide/sync, not by any page.
    dealerTideInventoryToken: Boolean(inventoryToken()),
    dealerTideFeedUrl: set("DEALERTIDE_FEED_URL"),
    ga4: set("NEXT_PUBLIC_GA_MEASUREMENT_ID"),
    gtm: set("NEXT_PUBLIC_GTM_ID"),
    metaPixel: set("NEXT_PUBLIC_FB_PIXEL_ID"),
    clarity: set("NEXT_PUBLIC_CLARITY_PROJECT_ID"),
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const [supabase, dealerTideKey] = await Promise.all([
    supabaseUrl && supabaseKey
      ? probe(`${supabaseUrl}/rest/v1/floor_plans?select=id&limit=1`, {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        })
      : Promise.resolve({ status: null, error: "not configured" }),
    probeDealertideKey(),
  ]);

  const ok = configured.supabaseUrl && configured.supabaseAnonKey && supabase.status === 200;
  const healthKey = process.env.HEALTH_CHECK_SECRET;
  const full =
    (healthKey ? safeEqual(request.headers.get("x-health-key"), healthKey) : false) ||
    (await isAdminRequest());
  if (!full) {
    return NextResponse.json({
      ok,
      leadsReachCrm: dealerTideKey.verdict === "ok",
      checkedAt: new Date().toISOString(),
      detail: "Sign in at /admin to see the full report.",
    });
  }

  return NextResponse.json({
    ok,
    configured,
    supabase: { host: supabaseUrl ? new URL(supabaseUrl).host : null, floorPlansProbe: supabase },
    // "ok" means website leads can reach the CRM right now. "rejected" means
    // every lead is being refused with the key this deployment carries —
    // the leads are still in Supabase, but someone has to fix the key.
    dealerTide: {
      key: dealerTideKey,
      leadsReachCrm: dealerTideKey.verdict === "ok",
      // Variable NAMES only, so a token pasted under an unexpected name can be
      // found without anyone reading Vercel's settings. Values never appear.
      envNames: dealertideEnvNames(),
    },
    checkedAt: new Date().toISOString(),
  });
}
