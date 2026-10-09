// dealertide-sync — copies DealerTide's public inventory feed into the
// public.dealertide_inventory staging table, following DealerTide's own
// re-import steps (2026-10-09):
//   1. pull every page of /public/inventory (available + available_to_order);
//   2. match homes on "id";
//   3. compare each home's photo and floor-plan lists with what is stored
//      (photos can change without updated_at changing) and flag differences;
//   4. a home missing from the list is marked removed only after its detail
//      call answers 410 Gone.
// Read-only towards DealerTide; writes nothing the website reads. Downloading
// media into the catalogue is a separate, reviewed step — see
// docs/dealertide-inventory-sync.md.
//
// Secret (Supabase → Edge Functions → Secrets): DEALERTIDE_INVENTORY_TOKEN, the
// feed token. It rides in DealerTide's URL, so no URL is ever logged or returned.
// Deployed with verify_jwt off; the gate is the x-sync-key header, checked
// against the vault secret `dealertide_sync_key` by dealertide_sync_key_ok().
// public.dealertide_sync_start() sends it, so a sync starts from SQL.

import { createClient } from "npm:@supabase/supabase-js@2";

const API = "https://api.dealertide.com/public/inventory";
const PER_PAGE = 50;
const MAX_PAGES = 40;
// Champion model codes: 2852H32169, 2852M32171, 1456H22P01.
const MODEL_RE = /\b(\d{4}[HM]\d{2}[0-9A-Z]\d{2})\b/i;

type Row = Record<string, unknown>;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

/** A list of URLs, whether the feed sends strings or { url } objects. */
function urls(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === "string" ? x : x && typeof x === "object" ? String((x as Row).url ?? "") : ""))
    .filter((u) => /^https?:\/\//.test(u));
}

function modelCode(h: Row): string | null {
  const nested = (h.catalog_model ?? h.model_info ?? {}) as Row;
  const fields = [h.model_number, h.model, h.catalog_model_number, nested.model_number, nested.model, h.title, h.name, h.description];
  for (const f of fields) {
    const m = typeof f === "string" ? f.match(MODEL_RE) : null;
    if (m) return m[1].toUpperCase();
  }
  return null;
}

const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

function homesOf(body: unknown): Row[] {
  if (Array.isArray(body)) return body as Row[];
  const b = body as Row;
  for (const k of ["data", "inventory", "items", "results", "homes"]) if (Array.isArray(b?.[k])) return b[k] as Row[];
  return [];
}

Deno.serve(async (req) => {
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { data: allowed } = await db.rpc("dealertide_sync_key_ok", { k: req.headers.get("x-sync-key") ?? "" });
  if (allowed !== true) return json({ error: "forbidden" }, 403);
  const token = Deno.env.get("DEALERTIDE_INVENTORY_TOKEN");
  if (!token) return json({ ok: false, error: "DEALERTIDE_INVENTORY_TOKEN is not set" }, 503);
  const { data: run } = await db.from("dealertide_sync_runs").insert({}).select("id").single();
  const finish = async (summary: Row, status = 200) => {
    if (run) {
      await db.from("dealertide_sync_runs").update({
        finished_at: new Date().toISOString(),
        ok: summary.ok === true,
        pages: summary.pages ?? null,
        homes: summary.homes ?? null,
        added: summary.added ?? null,
        media_changed: summary.media_changed ?? null,
        removed: summary.removed ?? null,
        note: summary.error ? String(summary.error) : summary.note ? String(summary.note) : null,
      }).eq("id", run.id);
    }
    return json(summary, status);
  };

  // 1. Every page. The URL carries the token, so it is never logged or returned.
  const feed: Row[] = [];
  let totalPages = 1;
  let declaredTotal: number | null = null;
  let pages = 0;
  for (let page = 1; page <= totalPages; page++) {
    if (page > MAX_PAGES) return finish({ ok: false, error: `more than ${MAX_PAGES} pages — stopped`, pages }, 502);
    const url = `${API}?token=${encodeURIComponent(token)}&statuses=available,available_to_order&per_page=${PER_PAGE}&page=${page}`;
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) return finish({ ok: false, error: `page ${page}: HTTP ${res.status}`, pages }, 502);
    const body = await res.json();
    const meta = ((body as Row)?.meta ?? {}) as Row;
    totalPages = Number(meta.total_pages ?? (body as Row)?.total_pages ?? 1) || 1;
    const total = Number(meta.total ?? meta.total_count ?? (body as Row)?.total_count);
    if (Number.isFinite(total) && total > 0) declaredTotal = total;
    feed.push(...homesOf(body));
    pages = page;
  }
  const homes = feed.filter((h) => h && h.id != null);
  if (homes.length === 0) return finish({ ok: false, error: "the feed returned no homes", pages }, 502);
  const complete = declaredTotal == null || homes.length >= declaredTotal;

  // 2–3. Match on id; flag photo / floor-plan list changes.
  const { data: stored, error: readErr } = await db
    .from("dealertide_inventory")
    .select("id, image_urls, floor_plan_images, media_changed_at, removed_at");
  if (readErr) return finish({ ok: false, error: `read staging: ${readErr.message}`, pages }, 500);
  const prev = new Map((stored ?? []).map((r) => [String(r.id), r]));
  const now = new Date().toISOString();
  let added = 0;
  let mediaChanged = 0;

  const rows = homes.map((h) => {
    const id = String(h.id);
    const photos = urls(h.image_urls);
    const plans = urls(h.floor_plan_images);
    const old = prev.get(id);
    let changedAt = old?.media_changed_at ?? null;
    if (!old) added++;
    else if (old.removed_at || !sameList(old.image_urls ?? [], photos) || !sameList(old.floor_plan_images ?? [], plans)) {
      mediaChanged++;
      changedAt = now;
    }
    return {
      id,
      model_code: modelCode(h),
      title: text(h.title) ?? text(h.name),
      status: text(h.status),
      image_urls: photos,
      floor_plan_images: plans,
      feed_updated_at: text(h.updated_at),
      raw: h,
      last_seen_at: now,
      media_changed_at: changedAt,
      removed_at: null,
    };
  });
  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await db.from("dealertide_inventory").upsert(rows.slice(i, i + 100), { onConflict: "id" });
    if (error) return finish({ ok: false, error: `write staging: ${error.message}`, pages, homes: homes.length }, 500);
  }

  // 4. Gone from the list → removed, but only on a complete pull and a 410.
  const seen = new Set(rows.map((r) => r.id));
  const missing = [...prev.values()].filter((r) => !r.removed_at && !seen.has(String(r.id))).map((r) => String(r.id));
  const removed: string[] = [];
  const kept: string[] = [];
  if (complete) {
    for (const id of missing) {
      const res = await fetch(`${API}/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`, {
        headers: { accept: "application/json" },
      });
      if (res.status === 410) removed.push(id);
      else kept.push(`${id} (HTTP ${res.status})`);
    }
    if (removed.length) await db.from("dealertide_inventory").update({ removed_at: now }).in("id", removed);
  }

  return finish({
    ok: true,
    pages,
    homes: homes.length,
    declared_total: declaredTotal,
    added,
    media_changed: mediaChanged,
    removed: removed.length,
    note: complete ? (kept.length ? `missing but not 410: ${kept.join(", ")}` : null) : "incomplete pull — removals skipped",
    with_model_code: rows.filter((r) => r.model_code).length,
    // Field names only (no values), so the matcher can be adjusted to the real shape.
    sample_fields: Object.keys(homes[0]).sort(),
  });
});
