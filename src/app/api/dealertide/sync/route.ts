import { NextResponse } from "next/server";
import { DEFAULT_API, inventoryToken, runInventorySync } from "@/lib/dealertide-inventory-sync";

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

  // { "detail_id": "<id>" } answers with the field NAMES of one home's detail
  // record (GET /public/inventory/{id}), so the list/detail shape difference can
  // be checked without reading the token. No values are returned.
  const body = (await request.json().catch(() => ({}))) as { detail_id?: unknown };
  if (typeof body.detail_id === "string" && body.detail_id) {
    const res = await fetch(
      `${DEFAULT_API}/${encodeURIComponent(body.detail_id)}?token=${encodeURIComponent(token)}`,
      { headers: { accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(20_000) },
    ).catch(() => null);
    if (!res) return NextResponse.json({ ok: false, error: "detail: no response" }, { status: 502 });
    const detail = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    const home = (detail && typeof detail === "object" && "data" in detail ? detail.data : detail) as Record<string, unknown> | null;
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      keys: home && typeof home === "object" ? Object.keys(home).sort() : [],
      // Only the keys whose VALUE looks like a Champion model code, with the match.
      code_fields: home && typeof home === "object"
        ? Object.entries(home).flatMap(([k, v]) => {
            const m = typeof v === "string" ? v.match(/\d{4}\s?[HM]\d{2}\s?[0-9A-Z]{3}/i) : null;
            return m ? [{ key: k, code: m[0] }] : [];
          })
        : [],
    });
  }

  const { status, summary } = await runInventorySync({ token, supabaseUrl, serviceKey });
  console.log(`[dealertide-sync] ${summary.ok ? "ok" : "FAILED"}: ${JSON.stringify(summary)}`);
  return NextResponse.json(summary, { status });
}
