// Supabase floor-plan adapter — the new, owned CMS.
//
// This reads floor plans from the "FDHC Site" Supabase project (Postgres +
// Storage) via the PostgREST REST API, mapping rows to the same ApiFloorPlan /
// ApiFloorPlanDetail types the pages already render. It is dependency-free
// (plain fetch, like the CMS and DealerTide adapters) so no client SDK is
// added to the bundle.
//
// api-content.ts prefers this source when NEXT_PUBLIC_SUPABASE_URL and
// NEXT_PUBLIC_SUPABASE_ANON_KEY are set (both live only in Vercel env, never
// committed). Until those are set the site keeps sourcing from the DealerTide
// feed / legacy CMS exactly as before — so flipping the env vars IS the
// source-switch, and unsetting them instantly rolls back.
//
// Reads use the anon (publishable) key with RLS: only rows where is_active =
// true are ever returned to the public site. All writes happen server-side in
// the admin with the service-role key and never touch this module.

import type { ApiFloorPlan, ApiFloorPlanDetail } from "./api-content";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Public storage bucket that holds banner/gallery images and brochure PDFs.
const STORAGE_BUCKET = "floor-plans";

// Pre-launch prices stay hidden site-wide (parity with the CMS/feed adapters).
const SHOW_PRICES = false;

export function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

/** Resolve a stored image reference to a loadable URL. Absolute URLs pass
 *  through (encoded); bare paths resolve against the public storage bucket. */
function imgUrl(ref?: string | null): string {
  const s = String(ref || "").trim();
  if (!s) return "";
  if (/^https?:\/\//.test(s)) return encodeURI(s);
  return encodeURI(`${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${s.replace(/^\//, "")}`);
}

function formatPrice(raw: unknown): string {
  if (!SHOW_PRICES) return "Call for pricing";
  const n = Number(String(raw ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? `$${Math.round(n).toLocaleString("en-US")}` : "Call for pricing";
}

interface FloorPlanRow {
  slug: string;
  name?: string;
  title?: string;
  price?: number | string | null;
  sqft?: number | null;
  beds?: number | null;
  baths?: number | null;
  home_type?: string | null;
  series?: string | null;
  brand?: string | null;
  model_number?: string | null;
  length?: string | null;
  width?: string | null;
  description?: string | null;
  floor_plan_html?: string | null;
  banner_image?: string | null;
  brochure_url?: string | null;
  virtual_tour?: string | null;
  floor_plan_images?: { path: string; kind?: string | null; sort_order?: number | null }[];
}

async function rest(path: string): Promise<unknown> {
  if (!supabaseConfigured()) throw new Error("[supabase] not configured");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY as string,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`[supabase] HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

function widthFtFrom(width?: string | null, context = ""): number | undefined {
  const w = parseInt(String(width || ""), 10);
  if (Number.isFinite(w) && w > 0) return w;
  const m = context.match(/\b(14|16|18|24|28|32)(\d{2})([hm])\d{2}/i);
  return m ? Number(m[1]) : undefined;
}

function toFloorPlan(r: FloorPlanRow): ApiFloorPlan {
  return {
    slug: String(r.slug),
    name: String(r.name || ""),
    title: String(r.title || ""),
    price: formatPrice(r.price),
    sqft: Number(r.sqft) || 0,
    beds: Number(r.beds) || 0,
    baths: Number(r.baths) || 0,
    image: imgUrl(r.banner_image),
    brand: String(r.brand || "Champion Homes"),
    homeType: String(r.home_type || ""),
    series: String(r.series || ""),
    widthFt: widthFtFrom(r.width, `${r.slug} ${r.title || ""} ${r.model_number || ""}`),
  };
}

/** All active floor plans, mapped to the card shape the design uses. */
export async function getSupabaseFloorPlans(): Promise<ApiFloorPlan[]> {
  const select = [
    "slug", "name", "title", "price", "sqft", "beds", "baths",
    "home_type", "series", "brand", "model_number", "width", "banner_image",
  ].join(",");
  let rows: FloorPlanRow[];
  try {
    rows = (await rest(
      `floor_plans?is_active=eq.true&order=sort_order.asc,created_at.desc&select=${select}`,
    )) as FloorPlanRow[];
  } catch (err) {
    // Never throw from here. The only caller merges this list with the
    // repo-published catalogue (getApiFloorPlans in api-content.ts), so
    // returning [] serves the 193 plans the repo already holds instead of
    // 500-ing the page.
    //
    // The original intent — rethrow so ISR keeps serving the last good page —
    // only helps where a good page is already cached. On a cold cache entry or
    // a fresh deploy there is nothing to keep and the request 500s. Between
    // 2026-09-02 and 09-04 that took the homepage down for 404 users while
    // Supabase answered 404 to every floor_plans query, and /floor-plans and
    // /design-your-home with it.
    console.error(
      `[supabase] floor_plans list DEGRADED (serving repo-published content): ${err instanceof Error ? err.message : err}`,
    );
    return [];
  }
  const plans = (Array.isArray(rows) ? rows : []).filter((r) => r?.slug).map(toFloorPlan);
  console.log(`[supabase] ${plans.length} active floor plans`);
  return plans;
}

/** One floor plan by slug, with full detail + gallery, from Supabase. */
export async function getSupabaseFloorPlanBySlug(slug: string): Promise<ApiFloorPlanDetail | null> {
  let rows: FloorPlanRow[];
  try {
    rows = (await rest(
      `floor_plans?slug=eq.${encodeURIComponent(slug)}&is_active=eq.true&limit=1` +
        `&select=*,floor_plan_images(path,kind,sort_order)`,
    )) as FloorPlanRow[];
  } catch (err) {
    console.error(`[supabase] floor_plan get-details ${slug} failed: ${err instanceof Error ? err.message : err}`);
    // Unknown whether the slug exists — do not masquerade as 404 at runtime.
    if (process.env.NEXT_PHASE === "phase-production-build") return null;
    throw err;
  }
  const r = (Array.isArray(rows) ? rows : [])[0];
  if (!r?.slug) return null;

  const base = toFloorPlan(r);
  const banner = imgUrl(r.banner_image);
  const images = [...(r.floor_plan_images || [])]
    .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
    .map((i) => imgUrl(i.path))
    .filter(Boolean);
  // Banner first, then the ordered gallery/drawings, deduped.
  const gallery = [...new Set([banner, ...images].filter(Boolean))];

  return {
    ...base,
    description: String(r.description || ""),
    floorPlanHtml: String(r.floor_plan_html || ""),
    modelNumber: String(r.model_number || ""),
    length: String(r.length || ""),
    width: String(r.width || ""),
    series: base.series,
    brochureUrl: imgUrl(r.brochure_url),
    // The imported "…SALES.pdf" sheet is Champion's dimensioned floor-plan
    // sheet, which the detail page offers as the floor-plan PDF download.
    floorPlanUrl: imgUrl(r.brochure_url),
    virtualTour: String(r.virtual_tour || ""),
    gallery,
  };
}
