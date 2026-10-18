// dealertide-media-import — step 2 of the DealerTide inventory sync: copy the
// photos DealerTide's feed carries for a catalogue plan into the `floor-plans`
// storage bucket and attach them as `kind = 'gallery'` rows, APPENDED after the
// plan's existing images. Nothing here touches a plan that is not named in the
// request, and nothing changes which drawing the page uses: `floorplan` rows
// are never added, so `drawingFrom()` keeps its current pick.
//
// Rules (AGENTS.md, "DealerTide inventory is staged, never imported straight
// into the catalogue"; "Every catalogue image gets checked"):
//   - only plans named in the body, matched by their own Champion model code
//     in public.dealertide_inventory — a model already in the catalogue never
//     gets a second page, and nothing is created for a code we do not have;
//   - only Champion's own Scene7 library (s7d9.scene7.com). The feed also
//     carries DealerTide's staging bucket and our retired S3 bucket; those are
//     reported as skipped, never copied;
//   - every file is fetched at WEB size, checked to be a real JPEG, and its
//     pixel size is read from the file: anything under MIN_WIDTH px wide or
//     MIN_BYTES is refused (the 600×400 banner-art lesson of 2026-09-28);
//   - the storage key keeps Champion's filename, so describeImageFile() reads
//     the room out of it ("…-vernona-kitchen-1.jpg" → "kitchen"). A file whose
//     name carries no room is still copied; the audit script grades it;
//   - idempotent: a row whose path already exists is skipped;
//   - set_banner (default true) promotes the first "exterior" photo to the
//     plan's card image ONLY when the current banner is a rendered sales sheet
//     (…/previews/…), which is the documented way a real photo replaces it.
//
// Deployed with verify_jwt off; the gate is the x-sync-key header, checked
// against the vault secret `dealertide_sync_key` by dealertide_sync_key_ok().
// public.dealertide_media_import(payload) sends it from SQL:
//   select public.dealertide_media_import('{"slugs":["aspire-verona-3276h42179"],"dry_run":true}');
// Body: { slugs: string[], dry_run?: boolean, set_banner?: boolean, max_width?: number }

import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_HOSTS = new Set(["s7d9.scene7.com"]);
const MIN_WIDTH = 1000;
const MIN_BYTES = 30_000;
const DEFAULT_WIDTH = 1800;
const BUCKET = "floor-plans";

type Row = Record<string, unknown>;
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

/** Width and height out of a JPEG's SOF marker, or null when it is not a JPEG. */
function jpegSize(b: Uint8Array): { width: number; height: number } | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    const len = (b[i + 2] << 8) | b[i + 3];
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) return { height: (b[i + 5] << 8) | b[i + 6], width: (b[i + 7] << 8) | b[i + 8] };
    if (marker === 0xda) break; // start of scan: no SOF before it
    i += 2 + len;
  }
  return null;
}

/** Champion's filename, lower-cased, safe for a storage key, with .jpg. */
function basenameOf(url: string): string {
  const path = new URL(url).pathname;
  let name = path.slice(path.lastIndexOf("/") + 1).toLowerCase().replace(/\.(jpe?g|png|webp)$/, "");
  name = name.replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return (name || "photo") + ".jpg";
}

function scene7Url(url: string, width: number): string {
  const u = new URL(url);
  u.searchParams.set("wid", String(width));
  u.searchParams.set("fmt", "jpeg");
  u.searchParams.set("qlt", "85");
  return u.toString();
}

Deno.serve(async (req) => {
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { data: allowed } = await db.rpc("dealertide_sync_key_ok", { k: req.headers.get("x-sync-key") ?? "" });
  if (allowed !== true) return json({ error: "forbidden" }, 403);

  const body = (await req.json().catch(() => ({}))) as Row;
  const slugs = Array.isArray(body.slugs) ? body.slugs.map(String).filter(Boolean) : [];
  if (slugs.length === 0) return json({ ok: false, error: "body.slugs is required" }, 400);
  const dryRun = body.dry_run === true;
  const setBanner = body.set_banner !== false;
  const width = Number(body.max_width) > 0 ? Number(body.max_width) : DEFAULT_WIDTH;

  const { data: plans, error: planErr } = await db
    .from("floor_plans")
    .select("id,slug,series,model_number,banner_image,is_active")
    .in("slug", slugs);
  if (planErr) return json({ ok: false, error: `floor_plans: ${planErr.message}` }, 500);

  const report: Row[] = [];
  for (const slug of slugs) {
    const plan = (plans ?? []).find((p) => p.slug === slug);
    if (!plan) { report.push({ slug, error: "not in catalogue" }); continue; }
    if (!plan.is_active || String(plan.series).toLowerCase() === "paramount") {
      report.push({ slug, error: "inactive or retired series" });
      continue;
    }
    const model = String(plan.model_number).toUpperCase();
    const series = String(plan.series).toLowerCase();

    const { data: staged } = await db
      .from("dealertide_inventory")
      .select("id,image_urls")
      .eq("model_code", model)
      .is("removed_at", null);
    const urls: string[] = [];
    for (const r of staged ?? []) for (const u of (r.image_urls as string[]) ?? []) if (!urls.includes(u)) urls.push(u);

    const { data: existing } = await db
      .from("floor_plan_images")
      .select("path,kind,sort_order")
      .eq("floor_plan_id", plan.id);
    const have = new Set((existing ?? []).map((r) => r.path as string));
    let next = Math.max(-1, ...(existing ?? []).map((r) => Number(r.sort_order) || 0)) + 1;

    const imported: Row[] = [];
    const skipped: Row[] = [];
    let bannerSet: string | null = null;
    for (const url of urls) {
      let host = "";
      try { host = new URL(url).host; } catch { skipped.push({ url, reason: "not a URL" }); continue; }
      if (!ALLOWED_HOSTS.has(host)) { skipped.push({ url, reason: `host ${host} not allowed` }); continue; }
      const key = `${series}/${model}/photos/dealertide/${basenameOf(url)}`;
      if (have.has(key)) { skipped.push({ url, reason: "already attached", key }); continue; }

      let res: Response;
      try {
        res = await fetch(scene7Url(url, width), { signal: AbortSignal.timeout(20_000) });
      } catch (err) {
        skipped.push({ url, reason: `fetch: ${err instanceof Error ? err.message : String(err)}` });
        continue;
      }
      const type = res.headers.get("content-type") ?? "";
      if (!res.ok || !type.startsWith("image/jpeg")) {
        skipped.push({ url, reason: `HTTP ${res.status} ${type}` });
        continue;
      }
      const bytes = new Uint8Array(await res.arrayBuffer());
      const size = jpegSize(bytes);
      if (!size) { skipped.push({ url, reason: "not a JPEG" }); continue; }
      if (size.width < MIN_WIDTH || bytes.length < MIN_BYTES) {
        skipped.push({ url, reason: `too small: ${size.width}×${size.height}, ${bytes.length} bytes` });
        continue;
      }
      const entry = { url, key, width: size.width, height: size.height, bytes: bytes.length, sort_order: next };
      if (!dryRun) {
        const up = await db.storage.from(BUCKET).upload(key, bytes, { contentType: "image/jpeg", upsert: true });
        if (up.error) { skipped.push({ url, reason: `upload: ${up.error.message}` }); continue; }
        const ins = await db.from("floor_plan_images").insert({ floor_plan_id: plan.id, path: key, kind: "gallery", sort_order: next });
        if (ins.error) { skipped.push({ url, reason: `insert: ${ins.error.message}` }); continue; }
        have.add(key);
      }
      imported.push(entry);
      next++;
      const isSheetBanner = /\/previews\//.test(String(plan.banner_image ?? ""));
      if (setBanner && !bannerSet && isSheetBanner && /exterior/i.test(key)) {
        if (!dryRun) {
          const upd = await db.from("floor_plans").update({ banner_image: key }).eq("id", plan.id);
          if (upd.error) skipped.push({ url, reason: `banner: ${upd.error.message}` });
        }
        bannerSet = key;
      }
    }
    report.push({ slug, model, feed_urls: urls.length, imported, skipped, banner: bannerSet });
  }
  return json({ ok: true, dry_run: dryRun, plans: report });
});
