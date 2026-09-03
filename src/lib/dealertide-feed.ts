// DealerTide (Renter Insight) inventory feed adapter.
//
// Source: the Meta Commerce product-catalog feed (DEALERTIDE_FEED_URL, token in
// the URL — set only in Vercel env, never committed; this repo is public). The
// feed is a JSON array of "units" (homes). This module maps that shape to the
// same ApiFloorPlan / ApiFloorPlanDetail types the pages already render, so the
// site can source homes from the CRM with no page changes — api-content.ts
// prefers this feed when DEALERTIDE_FEED_URL is set and falls back to the CMS.
//
// Feed field notes (confirmed 2026-08-08 from a live sample):
//   id            "unit-41"                     (stable per unit)
//   title         "2026 Champion Appleton 2842 H32388 — 3BR/2.0BA"
//   description   "... · 3 bedrooms · 2.0 bathrooms · 1120 sq ft · VIN ..."   <- beds/baths/sqft here
//   price         "79792.00 USD"               (present on only some units)
//   image_link            main photo           (Scene7 / S3; may contain spaces)
//   additional_image_link [gallery urls]
//   brand         "Champion" | "Dutch Housing" | "Champion Homes"
//   availability  "in stock" | "out of stock"  ("out of stock" = build-to-order)

import type { ApiFloorPlan, ApiFloorPlanDetail } from "./api-content";
import { deriveSeries } from "./series";

const FEED_URL = process.env.DEALERTIDE_FEED_URL?.trim();

// Match the CMS adapter: prices stay hidden pre-launch (most units have none,
// and partial pricing looks broken). Flip to show real feed prices later.
const SHOW_PRICES = false;

// Build-to-order (not physically in stock) homes are marketed as this model
// year regardless of the year the CRM stamped on the plan.
const ORDER_MODEL_YEAR = "2027";

export function feedConfigured(): boolean {
  return Boolean(FEED_URL);
}

interface FeedUnit {
  id?: string;
  title?: string;
  description?: string;
  price?: string;
  image_link?: string;
  additional_image_link?: string[];
  brand?: string;
  availability?: string;
  condition?: string;
  [k: string]: unknown;
}

function inStock(u: FeedUnit): boolean {
  return /in stock/i.test(String(u.availability || ""));
}

/** Encode a raw image URL so spaces/parentheses are valid, preserving %XX. */
function encodeImg(url?: string): string {
  if (!url) return "";
  try {
    return /^https?:\/\//.test(url) ? encodeURI(url) : "";
  } catch {
    return "";
  }
}

// Available-to-order homes show ORDER_MODEL_YEAR; in-stock units keep their
// real year. Replaces the first 20xx in the text.
function applyYear(text: string, order: boolean): string {
  if (!order) return String(text || "");
  return String(text || "").replace(/\b20\d{2}\b/, ORDER_MODEL_YEAR);
}

/** Text before the " — 3BR/2.0BA" spec suffix. */
function baseTitle(title: string): string {
  return String(title || "").split(/\s+—\s+/)[0].trim();
}

function stripYear(s: string): string {
  return s.replace(/^\s*20\d{2}\s+/, "").trim();
}

function slugify(s: string): string {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Year-independent slug so URLs don't change when the model year flips. */
function unitSlug(u: FeedUnit): string {
  const base = slugify(stripYear(baseTitle(String(u.title || ""))));
  return base || slugify(String(u.id || "home"));
}

function num(re: RegExp, s: string): number {
  const m = String(s || "").match(re);
  return m ? Number(m[1].replace(/,/g, "")) || 0 : 0;
}

function formatPrice(raw?: string): string {
  if (!SHOW_PRICES) return "Call for pricing";
  const n = Number(String(raw ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? `$${Math.round(n).toLocaleString("en-US")}` : "Call for pricing";
}

function vinFrom(desc: string): string {
  const m = String(desc || "").match(/VIN\s+([A-Za-z0-9-]+)/);
  return m && m[1].toUpperCase() !== "TBD" ? m[1] : "";
}

function toFloorPlan(u: FeedUnit): ApiFloorPlan & { _hasImage: boolean; _inStock: boolean } {
  const order = !inStock(u);
  const desc = String(u.description || "");
  const name = applyYear(baseTitle(String(u.title || "")), order) || "Home";
  const image = encodeImg(u.image_link) || encodeImg((u.additional_image_link || [])[0]);
  return {
    slug: unitSlug(u),
    name,
    title: applyYear(String(u.title || ""), order),
    price: formatPrice(u.price),
    sqft: num(/([\d,]+)\s*sq\s*ft/i, desc),
    beds: num(/(\d+)\s*bedrooms?/i, desc),
    baths: num(/([\d.]+)\s*bathrooms?/i, desc),
    image,
    brand: String(u.brand || "Champion Homes"),
    homeType: "",
    series: deriveSeries(String(u.title || ""), desc, String(u.brand || "")),
    _hasImage: Boolean(image),
    _inStock: !order,
  };
}

async function fetchUnits(): Promise<FeedUnit[]> {
  if (!FEED_URL) return [];
  const res = await fetch(FEED_URL, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`[dt-feed] HTTP ${res.status} ${res.statusText}`);
  const json = await res.json();
  const rows = Array.isArray(json) ? json : (json?.data || json?.products || json?.items || []);
  return Array.isArray(rows) ? rows : [];
}

/** All homes from the feed, deduped by slug, photo-bearing homes first. */
export async function getFeedFloorPlans(): Promise<ApiFloorPlan[]> {
  let units: FeedUnit[];
  try {
    units = await fetchUnits();
  } catch (err) {
    // During `next build` degrade gracefully (log + empty) so a feed blip can't
    // fail a deploy; at runtime rethrow so ISR keeps serving the last good page.
    console.error(`[dt-feed] fetch failed: ${err instanceof Error ? err.message : err}`);
    if (process.env.NEXT_PHASE === "phase-production-build") return [];
    throw err;
  }

  const mapped = units.filter((u) => u?.title).map(toFloorPlan);

  // Dedupe by slug (H/M variants share a plan): keep the richest — prefer one
  // with a photo, then in-stock.
  const best = new Map<string, ReturnType<typeof toFloorPlan>>();
  for (const p of mapped) {
    const cur = best.get(p.slug);
    if (!cur) { best.set(p.slug, p); continue; }
    const score = (x: typeof p) => (x._hasImage ? 2 : 0) + (x._inStock ? 1 : 0);
    if (score(p) > score(cur)) best.set(p.slug, p);
  }

  const list = [...best.values()].sort((a, b) => Number(b._hasImage) - Number(a._hasImage));
  console.log(`[dt-feed] ${list.length} homes (${mapped.length} units) from inventory feed`);
  return list.map(({ _hasImage, _inStock, ...rest }) => { void _hasImage; void _inStock; return rest; });
}

/** One home by slug, with gallery, for the detail page. */
export async function getFeedFloorPlanBySlug(slug: string): Promise<ApiFloorPlanDetail | null> {
  const units = await fetchUnits();
  const matches = units.filter((u) => u?.title && unitSlug(u) === slug);
  if (matches.length === 0) return null;
  // Prefer the variant with a photo.
  const u = matches.sort((a, b) => (encodeImg(b.image_link) ? 1 : 0) - (encodeImg(a.image_link) ? 1 : 0))[0];

  const order = !inStock(u);
  const base = toFloorPlan(u);
  const desc = applyYear(String(u.description || ""), order);
  const gallery = [...new Set(
    [encodeImg(u.image_link), ...((u.additional_image_link || []).map(encodeImg))].filter(Boolean),
  )];

  return {
    slug: base.slug,
    name: base.name,
    title: base.title,
    price: base.price,
    sqft: base.sqft,
    beds: base.beds,
    baths: base.baths,
    image: base.image,
    brand: base.brand,
    homeType: "",
    description: desc,
    floorPlanHtml: "",
    modelNumber: vinFrom(String(u.description || "")),
    length: "",
    width: "",
    series: base.series,
    brochureUrl: "",
    floorPlanUrl: "",
    virtualTour: "",
    gallery,
  };
}
