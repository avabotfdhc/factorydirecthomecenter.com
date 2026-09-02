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
