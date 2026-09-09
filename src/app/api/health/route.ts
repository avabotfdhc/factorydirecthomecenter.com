import { NextResponse } from "next/server";
import { CMS_API } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// GET /api/health — which integrations this deployment has configured
// (booleans only, never values) plus a reachability probe of the CMS API the
// admin login proxies to. Env var changes on Vercel only reach deployments
// created after the change, so check this after every redeploy.

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

export async function GET() {
  const configured = {
    supabaseUrl: set("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: set("NEXT_PUBLIC_SUPABASE_ANON_KEY") || set("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    supabaseServiceRole: set("SUPABASE_SERVICE_ROLE_KEY"),
    openai: set("OPENAI_API_KEY"),
    resend: set("RESEND_API_KEY"),
    leadWebhookSecret: set("LEAD_WEBHOOK_SECRET"),
    googleSheets: set("GOOGLE_SHEETS_ID") && set("GOOGLE_SERVICE_ACCOUNT_KEY"),
    dealerTide: set("DEALERTIDE_API_KEY"),
    cmsSync: set("CMS_SYNC_SECRET") && set("CMS_ADMIN_USER") && set("CMS_ADMIN_PASS"),
    apiUrlOverride: set("NEXT_PUBLIC_API_URL"),
    ga4: set("NEXT_PUBLIC_GA_MEASUREMENT_ID"),
    gtm: set("NEXT_PUBLIC_GTM_ID"),
    metaPixel: set("NEXT_PUBLIC_FB_PIXEL_ID"),
    clarity: set("NEXT_PUBLIC_CLARITY_PROJECT_ID"),
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const [root, health, supabase] = await Promise.all([
    probe(`${CMS_API}/`),
    probe(`${CMS_API}/api/health`),
    supabaseUrl && supabaseKey
      ? probe(`${supabaseUrl}/rest/v1/floor_plans?select=id&limit=1`, {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        })
      : Promise.resolve({ status: null, error: "not configured" }),
  ]);

  return NextResponse.json({
    ok: configured.supabaseUrl && configured.supabaseAnonKey && supabase.status === 200,
    configured,
    supabase: { host: supabaseUrl ? new URL(supabaseUrl).host : null, floorPlansProbe: supabase },
    cms: { api: CMS_API, root, health },
    checkedAt: new Date().toISOString(),
  });
}
