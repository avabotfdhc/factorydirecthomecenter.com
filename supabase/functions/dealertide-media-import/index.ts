// dealertide-media-import — step 2 of the DealerTide inventory sync: copy the
// photos and plan drawings DealerTide's feed carries for catalogue plans into
// the `floor-plans` storage bucket and attach them as rows APPENDED after the
// plan's existing images. v2 (2026-10-18, Kyle: "import the rest of the photos
// and floor plans") maps every feed image to its plans instead of only the
// record's own code, because the feed's family-level records (no model code)
// hold the big photo sets and Champion names each file after the model.
//
// Which plans a feed image belongs to:
//   - a Champion model code in the filename → that plan and its HUD/modular
//     twin (same box, H↔M); e.g. "112-aspire-2860h32047-kitchen-staged" →
//     2860H32047 + 2860M32047;
//   - the record's own model code and its twin, when the record has one
//     (Champion attaches the 2860 Woodward photos to the 2864 listing);
//   - a family-level record with no code anywhere ("Aspire Silverton", "Prime
//     Vertex 043") → every active plan with that family name.
//   Drawings (`floor_plan_images` in the feed) go by code only — a drawing is
//   length-specific — and become `kind = 'floorplan'` rows appended after the
//   existing ones, so `drawingFrom()` keeps its current pick where one exists
//   and gains a real drawing where the plan had none.
//
// Rules (AGENTS.md, "DealerTide inventory is staged, never imported straight
// into the catalogue"; "Every catalogue image gets checked"):
//   - never a new page: only active, non-Paramount plans already in the CMS;
//   - hosts: Champion's Scene7 library and DealerTide's own copy of Champion's
//     photo sets. Our retired S3 bucket is in the feed too (sales-sheet pages
//     and renderings the site already holds under legacy/) and is never read;
//   - every file is fetched at WEB size, checked to be a real JPEG/PNG, and
//     its pixel size is read from the file: anything under MIN_WIDTH px wide
//     or MIN_BYTES is refused (the 600×400 banner-art lesson of 2026-09-28);
//   - the storage key keeps Champion's filename, so describeImageFile() reads
//     the room out of it ("…-vernona-kitchen-1.jpg" → "kitchen");
//   - never twice: a candidate whose normalised name matches a row the plan
//     already has (a Box import "2852H32103-Kitchen-1-.jpg", a legacy
//     "bayport-kitchen.webp", or an earlier run of this function) is skipped;
//   - set_banner (default true) promotes the first "exterior" photo to the
//     plan's card image ONLY when the current banner is empty or a rendered
//     sales sheet (…/previews/…), the documented way a real photo replaces it;
//   - resumable: `all: true` walks every plan in slug order under
//     `budget_ms` and returns `next` (the slug to resume from) when time runs
//     out; re-running is safe because everything is skipped by name/path.
//
// Deployed with verify_jwt off; the gate is the x-sync-key header, checked
// against the vault secret `dealertide_sync_key` by dealertide_sync_key_ok().
// public.dealertide_media_import(payload) sends it from SQL:
//   select public.dealertide_media_import('{"all":true,"dry_run":true}');
//   select public.dealertide_media_import('{"all":true,"after":"aspire-lincoln-2852h32171"}');
// Body: { slugs?: string[], all?: boolean, after?: string, budget_ms?: number,
//         dry_run?: boolean, set_banner?: boolean, drawings?: boolean, max_width?: number }

import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_HOSTS = new Set(["s7d9.scene7.com", "renterinsight-website-assets-staging.s3.us-west-2.amazonaws.com"]);
const MIN_WIDTH = 1000;
const MIN_BYTES = 30_000;
const DEFAULT_WIDTH = 1800;
const DEFAULT_BUDGET_MS = 110_000;
const FETCH_POOL = 4;
const BUCKET = "floor-plans";

/** Run fn over items with at most n in flight; results in input order. */
async function pool<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}
const CODE_RE = /(\d{4}[HM]\d{2}[0-9A-Z]{3})/i;

type Row = Record<string, unknown>;
type Plan = { id: string; slug: string; series: string; name: string; model_number: string; banner_image: string | null; is_active: boolean };
type Candidate = { url: string; drawing: boolean };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

/** Width and height out of a JPEG's SOF marker or a PNG's IHDR, or null. */
function imageSize(b: Uint8Array): { width: number; height: number; type: "jpeg" | "png" } | null {
  if (b.length > 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
    return { width: dv.getUint32(16), height: dv.getUint32(20), type: "png" };
  }
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    const len = (b[i + 2] << 8) | b[i + 3];
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) return { height: (b[i + 5] << 8) | b[i + 6], width: (b[i + 7] << 8) | b[i + 8], type: "jpeg" };
    if (marker === 0xda) break;
    i += 2 + len;
  }
  return null;
}

/** Champion's filename, decoded, lower-cased, safe for a storage key, no extension. */
function stem(url: string): string {
  let path = new URL(url).pathname;
  try { path = decodeURIComponent(path); } catch { /* keep encoded */ }
  let name = path.slice(path.lastIndexOf("/") + 1).toLowerCase().replace(/\.(jpe?g|png|webp)$/, "");
  name = name.replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return name || "photo";
}

/** The name without plant prefix, model code, series word or punctuation — the dedupe key. */
function norm(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.(jpe?g|png|webp)$/, "")
    .replace(/^\d{3}[-_ ](aspire|prime|dutch|champion|genesis)[-_ ]/, "")
    .replace(/^(aspire|prime|dutch|champion)[-_ ]/, "")
    .replace(/\d{4}[hm]\d{2}[0-9a-z]{3}/g, "")
    .replace(/[^a-z0-9]/g, "");
}

const twin = (code: string) => (code[4] === "H" ? code.slice(0, 4) + "M" + code.slice(5) : code[4] === "M" ? code.slice(0, 4) + "H" + code.slice(5) : "");
const family = (model: unknown) =>
  String(model ?? "").toLowerCase().replace(/^(aspire|prime)\s+/, "").replace(/\s+043$/, "").replace(/^the\s+/, "").trim();
const familyKey = (name: string) => name.toLowerCase().replace(/^the\s+/, "").trim();

function fetchUrl(url: string, width: number, drawing: boolean): string {
  const u = new URL(url);
  if (u.host === "s7d9.scene7.com") {
    u.searchParams.set("wid", String(width));
    u.searchParams.set("fmt", drawing ? "png" : "jpeg");
    if (!drawing) u.searchParams.set("qlt", "85");
  }
  return u.toString();
}

Deno.serve(async (req) => {
  const started = Date.now();
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { data: allowed } = await db.rpc("dealertide_sync_key_ok", { k: req.headers.get("x-sync-key") ?? "" });
  if (allowed !== true) return json({ error: "forbidden" }, 403);

  const body = (await req.json().catch(() => ({}))) as Row;
  const slugs = Array.isArray(body.slugs) ? body.slugs.map(String).filter(Boolean) : [];
  const all = body.all === true;
  if (!all && slugs.length === 0) return json({ ok: false, error: "body.slugs or body.all is required" }, 400);
  const after = typeof body.after === "string" ? body.after : "";
  const budget = Number(body.budget_ms) > 0 ? Number(body.budget_ms) : DEFAULT_BUDGET_MS;
  const dryRun = body.dry_run === true;
  const setBanner = body.set_banner !== false;
  const wantDrawings = body.drawings !== false;
  const width = Number(body.max_width) > 0 ? Number(body.max_width) : DEFAULT_WIDTH;

  // Every active plan (the index) — then the subset this call works on.
  const { data: allPlans, error: planErr } = await db
    .from("floor_plans")
    .select("id,slug,series,name,model_number,banner_image,is_active")
    .eq("is_active", true)
    .order("slug");
  if (planErr) return json({ ok: false, error: `floor_plans: ${planErr.message}` }, 500);
  const plans = ((allPlans ?? []) as Plan[]).filter((p) => String(p.series).toLowerCase() !== "paramount");
  const byCode = new Map<string, Plan[]>();
  const byFamily = new Map<string, Plan[]>();
  for (const p of plans) {
    const c = String(p.model_number ?? "").toUpperCase();
    if (CODE_RE.test(c)) byCode.set(c, [...(byCode.get(c) ?? []), p]);
    const f = familyKey(String(p.name ?? ""));
    if (f && !CODE_RE.test(f)) byFamily.set(f, [...(byFamily.get(f) ?? []), p]);
  }

  // The feed, mapped to plans.
  const { data: feed, error: feedErr } = await db
    .from("dealertide_inventory")
    .select("id,model_code,raw,image_urls,floor_plan_images")
    .is("removed_at", null);
  if (feedErr) return json({ ok: false, error: `dealertide_inventory: ${feedErr.message}` }, 500);
  const candidates = new Map<string, Candidate[]>(); // plan id → ordered, deduped
  const add = (p: Plan, c: Candidate) => {
    const list = candidates.get(p.id) ?? [];
    if (!list.some((x) => x.url === c.url)) list.push(c);
    candidates.set(p.id, list);
  };
  const unresolved: Record<string, number> = {};
  for (const r of (feed ?? []) as Row[]) {
    const recCode = typeof r.model_code === "string" ? r.model_code.toUpperCase() : "";
    const fam = family((r.raw as Row | null)?.model);
    const lists: [unknown, boolean][] = [[r.image_urls, false], [r.floor_plan_images, true]];
    for (const [urls, drawing] of lists) {
      if (!Array.isArray(urls)) continue;
      for (const url of urls as string[]) {
        if (typeof url !== "string") continue;
        const targets: Plan[] = [];
        const m = url.match(CODE_RE);
        const codes = new Set<string>();
        if (m) { codes.add(m[1].toUpperCase()); codes.add(twin(m[1].toUpperCase())); }
        if (recCode) { codes.add(recCode); codes.add(twin(recCode)); }
        for (const c of codes) for (const p of byCode.get(c) ?? []) targets.push(p);
        if (targets.length === 0 && !drawing && !m && !recCode && fam && !/^\d/.test(fam)) {
          for (const p of byFamily.get(fam) ?? []) targets.push(p);
        }
        if (targets.length === 0) {
          const key = m ? `code ${m[1].toUpperCase()}` : recCode ? `code ${recCode}` : `family ${fam || "?"}`;
          unresolved[key] = (unresolved[key] ?? 0) + 1;
          continue;
        }
        for (const p of targets) add(p, { url, drawing });
      }
    }
  }

  // Which plans this call works on.
  let work = slugs.length ? plans.filter((p) => slugs.includes(p.slug)) : plans;
  // Inclusive: `next` names the plan that ran out of time, so it is re-done (idempotent).
  if (after) work = work.filter((p) => p.slug >= after);

  const report: Row[] = [];
  let next: string | null = null;
  const totals = { photos: 0, drawings: 0, skipped: 0, banners: 0 };
  for (const plan of work) {
    if (Date.now() - started > budget) { next = plan.slug; break; }
    const cands = candidates.get(plan.id) ?? [];
    if (cands.length === 0) continue;
    const model = String(plan.model_number).toUpperCase();
    const series = String(plan.series).toLowerCase();

    const { data: existing } = await db.from("floor_plan_images").select("path,kind,sort_order").eq("floor_plan_id", plan.id);
    const have = new Set((existing ?? []).map((r) => r.path as string));
    const haveNorm = new Set((existing ?? []).map((r) => norm(String(r.path).split("/").pop() ?? "")));
    let nextSort = Math.max(-1, ...(existing ?? []).map((r) => Number(r.sort_order) || 0)) + 1;
    let banner = plan.banner_image;

    const imported: string[] = [];
    const skipped: Record<string, number> = {};
    const skip = (why: string) => { skipped[why] = (skipped[why] ?? 0) + 1; totals.skipped++; };

    // Decide and fetch in parallel (FETCH_POOL at a time), then write in the
    // feed's order so sort_order stays deterministic.
    type Fetched = { c: Candidate; key: string; n: string; s: string; bytes?: Uint8Array; size?: { width: number; height: number; type: "jpeg" | "png" }; why?: string };
    const prepared: Fetched[] = [];
    for (const c of cands) {
      if (c.drawing && !wantDrawings) continue;
      let host = "";
      try { host = new URL(c.url).host; } catch { skip("not a URL"); continue; }
      if (!ALLOWED_HOSTS.has(host)) { skip(`host ${host}`); continue; }
      const s = stem(c.url);
      const key = c.drawing
        ? `${series}/${model}/plans/dealertide/${s}-floor-plan.png`
        : `${series}/${model}/photos/dealertide/${s}.jpg`;
      if (have.has(key)) { skip("already attached"); continue; }
      const n = norm(s);
      if (!c.drawing && n && haveNorm.has(n)) { skip("same photo already in gallery"); continue; }
      if (prepared.some((p) => p.key === key || (!c.drawing && n && p.n === n))) { skip("duplicate in feed"); continue; }
      prepared.push({ c, key, n, s });
    }
    const fetched = await pool(prepared, FETCH_POOL, async (p): Promise<Fetched> => {
      if (Date.now() - started > budget) return { ...p, why: "out of time" };
      let res: Response;
      try {
        res = await fetch(fetchUrl(p.c.url, width, p.c.drawing), { signal: AbortSignal.timeout(20_000) });
      } catch (err) {
        return { ...p, why: `fetch: ${err instanceof Error ? err.message : String(err)}` };
      }
      if (!res.ok) return { ...p, why: `HTTP ${res.status}` };
      const bytes = new Uint8Array(await res.arrayBuffer());
      const size = imageSize(bytes);
      if (!size) return { ...p, why: "not a JPEG/PNG" };
      if (!p.c.drawing && size.type !== "jpeg") return { ...p, why: "photo not a JPEG" };
      if (size.width < MIN_WIDTH || bytes.length < MIN_BYTES) return { ...p, why: `too small (${size.width}×${size.height}, ${bytes.length} B)` };
      return { ...p, bytes, size };
    });

    for (const f of fetched) {
      if (f.why === "out of time") { next = plan.slug; break; }
      if (f.why || !f.bytes || !f.size) { skip(f.why ?? "no data"); continue; }
      const { c, key, n, s, bytes, size } = f;
      const finalKey = c.drawing && size.type === "jpeg" ? key.replace(/\.png$/, ".jpg") : key;
      const contentType = size.type === "png" ? "image/png" : "image/jpeg";
      if (!dryRun) {
        const up = await db.storage.from(BUCKET).upload(finalKey, bytes, { contentType, upsert: true });
        if (up.error) { skip(`upload: ${up.error.message}`); continue; }
        const ins = await db.from("floor_plan_images").insert({
          floor_plan_id: plan.id, path: finalKey, kind: c.drawing ? "floorplan" : "gallery", sort_order: nextSort,
        });
        if (ins.error) { skip(`insert: ${ins.error.message}`); continue; }
      }
      have.add(finalKey);
      if (n) haveNorm.add(n);
      imported.push(finalKey);
      nextSort++;
      if (c.drawing) totals.drawings++; else totals.photos++;
      const promotable = !banner || /\/previews\//.test(String(banner));
      if (setBanner && !c.drawing && promotable && /exterior/i.test(s)) {
        if (!dryRun) {
          const upd = await db.from("floor_plans").update({ banner_image: finalKey }).eq("id", plan.id);
          if (upd.error) skip(`banner: ${upd.error.message}`);
        }
        banner = finalKey;
        totals.banners++;
      }
    }
    if (imported.length || Object.keys(skipped).length) {
      report.push({ slug: plan.slug, candidates: cands.length, imported: imported.length, files: imported, skipped, banner: banner !== plan.banner_image ? banner : undefined });
    }
    if (next) break;
  }
  return json({ ok: true, dry_run: dryRun, next, totals, plans_with_candidates: candidates.size, unresolved, plans: report, elapsed_ms: Date.now() - started });
});
