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
  // be checked without reading the token. No values are returned, except the
  // model-code-shaped match itself. The id is the feed's numeric `id`, not the
  // "MH-…" identifier (that answers 404), and the record comes wrapped:
  // { branding, champion_disclaimer, company, truebuild, vehicle } with the home
  // under `vehicle` — measured 2026-10-18 — so the walk goes into nested objects.
  // With `media: true` the answer also carries the record's media URLs
  // (video_url, matterport_url, virtual_tour_url, tour_url, design_url) — the
  // list feed only flags has_video and never says where the video is.
  const body = (await request.json().catch(() => ({}))) as { detail_id?: unknown; media?: unknown };
  if (typeof body.detail_id === "string" && body.detail_id) {
    const res = await fetch(
      `${DEFAULT_API}/${encodeURIComponent(body.detail_id)}?token=${encodeURIComponent(token)}`,
      { headers: { accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(20_000) },
    ).catch(() => null);
    if (!res) return NextResponse.json({ ok: false, error: "detail: no response" }, { status: 502 });
    const detail = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
    const wrapper = isObj(detail) ? detail : null;
    const home = wrapper && isObj(wrapper.vehicle) ? wrapper.vehicle : wrapper && isObj(wrapper.data) ? wrapper.data : wrapper;
    // Every key path whose VALUE looks like a Champion model code, with the match.
    const codeFields: { key: string; code: string }[] = [];
    const walk = (v: unknown, path: string, depth: number) => {
      if (depth > 4) return;
      if (typeof v === "string") {
        const m = v.match(/\d{4}\s?[HM]\d{2}\s?[0-9A-Z]{3}/i);
        if (m && !/^https?:/i.test(v)) codeFields.push({ key: path, code: m[0] });
      } else if (Array.isArray(v)) {
        v.forEach((x, i) => walk(x, `${path}[${i}]`, depth + 1));
      } else if (isObj(v)) {
        for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k, depth + 1);
      }
    };
    if (home) walk(home, "", 0);
    const MEDIA_KEYS = ["video_url", "matterport_url", "virtual_tour_url", "tour_url", "design_url", "has_video", "has_3d_tour", "has_virtual_tour"];
    const media = body.media === true && home
      ? Object.fromEntries(MEDIA_KEYS.filter((k) => k in home).map((k) => [k, home[k]]))
      : undefined;
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      wrapper_keys: wrapper ? Object.keys(wrapper).sort() : [],
      keys: home ? Object.keys(home).sort() : [],
      code_fields: codeFields,
      ...(media ? { media } : {}),
    });
  }

  const { status, summary } = await runInventorySync({ token, supabaseUrl, serviceKey });
  console.log(`[dealertide-sync] ${summary.ok ? "ok" : "FAILED"}: ${JSON.stringify(summary)}`);
  return NextResponse.json(summary, { status });
}
