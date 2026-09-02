// Server-only Supabase admin engine for the floor-plan CMS.
//
// Uses the SERVICE ROLE key, so it bypasses RLS to read inactive rows, write
// records, and upload files. This module must never be imported into a client
// component — the service key is a full-access secret and lives only in the
// server environment (Vercel env var SUPABASE_SERVICE_ROLE_KEY), never in the
// browser bundle and never committed. It reads SUPABASE_SERVICE_ROLE_KEY, which
// (having no NEXT_PUBLIC_ prefix) is undefined in the browser, so the key can
// never leak client-side even if this module were imported by mistake.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "floor-plans";

export function adminConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

export interface AdminFloorPlan {
  id?: string;
  slug: string;
  name: string;
  title: string;
  price: number | null;
  sqft: number | null;
  beds: number | null;
  baths: number | null;
  home_type: string;
  series: string;
  brand: string;
  model_number: string;
  length: string;
  width: string;
  description: string;
  floor_plan_html: string;
  banner_image: string;
  brochure_url: string;
  virtual_tour: string;
  is_active: boolean;
  sort_order: number;
}

export interface AdminImage {
  id?: string;
  floor_plan_id?: string;
  path: string;
  kind: string; // banner | gallery | floorplan | brochure
  sort_order: number;
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  if (!SERVICE_KEY) throw new Error("[supabase-admin] SUPABASE_SERVICE_ROLE_KEY not set");
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    ...extra,
  };
}

async function rest(path: string, init?: RequestInit): Promise<Response> {
  if (!SUPABASE_URL) throw new Error("[supabase-admin] NEXT_PUBLIC_SUPABASE_URL not set");
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, { cache: "no-store", ...init });
}

/** All floor plans (including inactive), newest-editable first. */
export async function listFloorPlans(): Promise<AdminFloorPlan[]> {
  const res = await rest(
    "floor_plans?select=*&order=sort_order.asc,updated_at.desc",
    { headers: headers() },
  );
  if (!res.ok) throw new Error(`[supabase-admin] list ${res.status} ${await res.text()}`);
  return res.json();
}

export async function getFloorPlan(id: string): Promise<(AdminFloorPlan & { floor_plan_images: AdminImage[] }) | null> {
  const res = await rest(
    `floor_plans?id=eq.${encodeURIComponent(id)}&limit=1&select=*,floor_plan_images(*)`,
    { headers: headers() },
  );
  if (!res.ok) throw new Error(`[supabase-admin] get ${res.status} ${await res.text()}`);
  const rows = await res.json();
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

/** Insert or update a floor plan by slug. Returns the row id. */
export async function upsertFloorPlan(data: AdminFloorPlan): Promise<string> {
  const res = await rest("floor_plans?on_conflict=slug", {
    method: "POST",
    headers: headers({
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    }),
    body: JSON.stringify([data]),
  });
  if (!res.ok) throw new Error(`[supabase-admin] upsert ${res.status} ${await res.text()}`);
  const rows = await res.json();
  return rows?.[0]?.id;
}

export async function deleteFloorPlan(id: string): Promise<void> {
  const res = await rest(`floor_plans?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error(`[supabase-admin] delete ${res.status} ${await res.text()}`);
}

/** Replace the gallery image set for a plan (delete-then-insert). */
export async function replaceImages(floorPlanId: string, images: AdminImage[]): Promise<void> {
  const del = await rest(`floor_plan_images?floor_plan_id=eq.${encodeURIComponent(floorPlanId)}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!del.ok) throw new Error(`[supabase-admin] clear images ${del.status} ${await del.text()}`);
  if (images.length === 0) return;
  const rows = images.map((i, idx) => ({
    floor_plan_id: floorPlanId,
    path: i.path,
    kind: i.kind || "gallery",
    sort_order: i.sort_order ?? idx,
  }));
  const ins = await rest("floor_plan_images", {
    method: "POST",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(rows),
  });
  if (!ins.ok) throw new Error(`[supabase-admin] insert images ${ins.status} ${await ins.text()}`);
}

/**
 * Upload bytes to the public floor-plans bucket. `path` is the object key
 * (e.g. "lincoln-2852h32171/banner.webp"). Returns the stored path (which the
 * frontend resolves to a public URL). Upserts so re-seeding is idempotent.
 */
export async function uploadObject(path: string, body: ArrayBuffer | Uint8Array | Buffer, contentType: string): Promise<string> {
  if (!SUPABASE_URL) throw new Error("[supabase-admin] NEXT_PUBLIC_SUPABASE_URL not set");
  const key = path.replace(/^\//, "");
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${key}`, {
    method: "POST",
    headers: headers({ "Content-Type": contentType, "x-upsert": "true" }),
    body: body as BodyInit,
  });
  if (!res.ok) throw new Error(`[supabase-admin] upload ${res.status} ${await res.text()}`);
  return key;
}

// ---------- Bulk import helpers ----------

/**
 * Create a signed upload URL so the BROWSER can PUT a file straight into the
 * public floor-plans bucket, bypassing the Vercel function body-size limit.
 * Returns the absolute URL the client must PUT the file body to.
 */
export async function createSignedUploadUrl(path: string): Promise<string> {
  if (!SUPABASE_URL) throw new Error("[supabase-admin] NEXT_PUBLIC_SUPABASE_URL not set");
  const key = path.replace(/^\//, "");
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET}/${key}`, {
    method: "POST",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`[supabase-admin] sign ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { url?: string };
  if (!json.url) throw new Error("[supabase-admin] sign: no url returned");
  return `${SUPABASE_URL}/storage/v1${json.url}`;
}

/** Patch selected columns of one floor plan by slug. */
export async function patchFloorPlanBySlug(slug: string, fields: Partial<AdminFloorPlan>): Promise<void> {
  const res = await rest(`floor_plans?slug=eq.${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: headers({ "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error(`[supabase-admin] patch ${slug} ${res.status} ${await res.text()}`);
}

/** Append one image to a plan's gallery (by slug), at the end. */
export async function appendImageBySlug(slug: string, path: string, kind = "gallery"): Promise<void> {
  const look = await rest(`floor_plans?slug=eq.${encodeURIComponent(slug)}&select=id,floor_plan_images(sort_order)`, { headers: headers() });
  if (!look.ok) throw new Error(`[supabase-admin] lookup ${slug} ${look.status}`);
  const rows = (await look.json()) as { id: string; floor_plan_images?: { sort_order: number }[] }[];
  const plan = rows[0];
  if (!plan) throw new Error(`[supabase-admin] no plan for slug ${slug}`);
  const next = Math.max(-1, ...(plan.floor_plan_images ?? []).map((i) => i.sort_order ?? 0)) + 1;
  const ins = await rest("floor_plan_images", {
    method: "POST",
    headers: headers({ "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify([{ floor_plan_id: plan.id, path, kind, sort_order: next }]),
  });
  if (!ins.ok) throw new Error(`[supabase-admin] append image ${res_text(ins)}`);
}
async function res_text(r: Response): Promise<string> { return `${r.status} ${await r.text()}`; }

export interface AdminLiterature {
  id?: string;
  title: string;
  category: string;
  home_type?: string;
  path?: string;
  box_file_id?: string;
  box_filename?: string;
  sort_order?: number;
  is_active?: boolean;
}

export async function listLiterature(): Promise<AdminLiterature[]> {
  const res = await rest("literature?select=*&order=category.asc,sort_order.asc", { headers: headers() });
  if (!res.ok) throw new Error(`[supabase-admin] literature list ${res.status}`);
  return res.json();
}

/** Set the stored file path on an existing literature row. */
export async function setLiteraturePath(id: string, path: string): Promise<void> {
  const res = await rest(`literature?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: headers({ "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify({ path }),
  });
  if (!res.ok) throw new Error(`[supabase-admin] literature patch ${res.status} ${await res.text()}`);
}

/** Insert a new literature row (used when an imported file matches no known doc). */
export async function insertLiterature(row: AdminLiterature): Promise<void> {
  const res = await rest("literature", {
    method: "POST",
    headers: headers({ "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify([row]),
  });
  if (!res.ok) throw new Error(`[supabase-admin] literature insert ${res.status} ${await res.text()}`);
}
