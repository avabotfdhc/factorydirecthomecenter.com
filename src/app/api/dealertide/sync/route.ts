import { NextResponse } from "next/server";
import { inventoryToken, runInventorySync } from "@/lib/dealertide-inventory-sync";

export const dynamic = "force-dynamic";
// Five feed pages plus a detail call per home that left the feed. Well under
// this, but a slow DealerTide must not get the run killed half-written.
export const maxDuration = 120;

// POST /api/dealertide/sync — stage DealerTide's inventory feed into Supabase
// (public.dealertide_inventory) from the website, where the feed token lives.
//
// Gate: the x-sync-key header must match the vault secret `dealertide_sync_key`
// — the same gate the Supabase edge function uses — checked by the SQL function
// dealertide_sync_key_ok() through PostgREST with the service role. Nothing
// else can start a run, and a run only ever reads DealerTide and writes the
// private staging tables. Start one from SQL:
//   select public.dealertide_sync_start_site();
// The JSON summary lands in net._http_response.
export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ ok: false, error: "Supabase service role is not configured" }, { status: 503 });
  }

  const key = request.headers.get("x-sync-key") ?? "";
  const check = await fetch(`${supabaseUrl}/rest/v1/rpc/dealertide_sync_key_ok`, {
    method: "POST",
    cache: "no-store",
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ k: key }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  const allowed = check && check.ok ? await check.json().catch(() => false) : false;
  if (allowed !== true) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const token = inventoryToken();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "no feed token: set DEALERTIDE_INVENTORY_TOKEN (or DEALERTIDE_FEED_URL with ?token=) on Vercel" },
      { status: 503 },
    );
  }

  const { status, summary } = await runInventorySync({ token, supabaseUrl, serviceKey });
  console.log(`[dealertide-sync] ${summary.ok ? "ok" : "FAILED"}: ${JSON.stringify(summary)}`);
  return NextResponse.json(summary, { status });
}
