// Data layer that reads content from the existing Factory Direct Homes Center
// admin CMS / backend API (api.factorydirecthomescenter.com). This is the bridge
// that lets the new (Vercel/Tailwind) design render live, CMS-managed content
// instead of hardcoded data — so Kyle keeps editing in the admin panel.
//
// Fetches run server-side (Next.js server components), so there is no CORS issue
// and no API key is exposed to the browser.

import { deriveSeries, canonicalSeries } from "./series";
import { galleryOverlays, sheetExtras } from "./gallery-overlays";
import { virtualTours } from "./virtual-tours";
import { sqftOverrides, bedOptions } from "./spec-overrides";
import { anchorPriceFor } from "./price-sheet";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.factorydirecthomescenter.com").replace(/\/$/, "");
const S3_BASE = (process.env.NEXT_PUBLIC_S3_URL || "https://factory-direct-homescenter.s3.us-east-1.amazonaws.com/").replace(/\/$/, "");

export interface ApiFloorPlan {
  slug: string;
  name: string;        // short display name (e.g. "Brighton")
  title: string;       // full title from the CMS
  price: string;       // formatted (e.g. "$120,800")
  sqft: number;
  beds: number;
  baths: number;
  image: string;       // absolute S3 URL, or "" if none
  brand: string;
  homeType: string;
  series: string;      // Champion series (Aspire, Prime, ...) or "" if unknown
  priceFrom?: string;  // range-level anchor ("From $80,000") when exact prices are hidden
  virtualTour?: string; // Matterport URL when a 3D tour exists (cards show a badge)
  widthFt?: number;    // home width in feet (14/16/24/28/32), when derivable
  bedsMin?: number;    // set when the plan can be optioned with fewer bedrooms
  bedsMax?: number;    // set when the plan can be optioned with more bedrooms
  flexNote?: string;   // human-readable explanation of the factory option
}

// Attach flexible-bedroom info (src/lib/spec-overrides.ts) to a plan. Applied
// centrally so cards, search, and detail pages all see the same range.
function withBedOptions<T extends { slug: string }>(p: T): T {
  const opt = bedOptions[p.slug];
  if (!opt) return p;
  return {
    ...p,
    ...(opt.bedsMin !== undefined ? { bedsMin: opt.bedsMin } : {}),
    ...(opt.bedsMax !== undefined ? { bedsMax: opt.bedsMax } : {}),
    flexNote: opt.note,
  };
}

// TEMPORARY (pre-launch): hide all home prices until CMS pricing is cleaned up.
// Flip back to `true` to show real prices again — this single flag controls the
// floor-plan list, detail pages, homepage featured homes, and the inventory page.
const SHOW_PRICES = false;

function formatPrice(raw: unknown): string {
  if (!SHOW_PRICES) return "Call for pricing";
  const n = Number(String(raw ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? `$${n.toLocaleString("en-US")}` : "Call for pricing";
}

// Range-level "From $X" anchors are switched off. They were withdrawn on
// 2026-08-30 at Kyle's direction: a single figure standing in for a whole home
// type set an expectation the eventual line-item quote had to climb away from,
// and the previous hand-entered numbers had drifted badly enough to prove the
// point ("From $39,900" sat $11,600 under the cheapest single actually sold).
//
// Real per-home prices are published on /homes-on-sale, where all 147 models
// carry an MSRP and a sale price straight from the master price sheet. Set this
// to true to bring the type-level anchors back.
const SHOW_PRICE_ANCHORS = false;

function priceFromBand(homeType: string): string {
  if (!SHOW_PRICE_ANCHORS || SHOW_PRICES) return "";
  const anchor = /multi|double|sectional/i.test(homeType)
    ? anchorPriceFor("multi")
    : /single/i.test(homeType)
      ? anchorPriceFor("single")
      : undefined;
  return anchor === undefined ? "" : `From $${anchor.toLocaleString("en-US")}`;
}

// Home width in feet from a Champion model number ("2856H32392" → 28) found in
// the slug/title/banner filename — powers the width filter on /floor-plans.
function deriveWidthFt(context: string): number | undefined {
  const m = context.match(/\b(14|16|18|24|28|32)(\d{2})([hm])\d{2}/i);
  return m ? Number(m[1]) : undefined;
}

// Central decoration applied to every plan on every path (CMS, feed, local):
// bedroom-option overlays, the range-level price anchor, and the repo-mapped
// Matterport tour (a CMS/feed-provided tour always wins).
function decoratePlan<T extends { slug: string; homeType: string; virtualTour?: string }>(p: T): T {
  return {
    ...withBedOptions(p),
    priceFrom: priceFromBand(p.homeType),
    virtualTour: p.virtualTour || virtualTours[p.slug] || "",
  };
}

// CMS titles are long ("Brighton - 3 Bed 2 Bath ... | Champion Aspire").
// Use the first segment as the card's display name.
function shortName(title: string): string {
  return String(title || "")
    .split(/\s[-|–]\s/)[0]
    .trim() || "Home";
}

// The CMS leaves homeType empty on most listings (and uses "singleWide" on a
// few), which silently breaks the type filter — a "Multi-Section" search would
// exclude nearly the whole catalog. Normalize the CMS value, and when it's
// missing derive the type from the Champion model number (present in the
// slug, title, or banner-image filename): width prefix 24/28/32 = sectional
// (Multi-Section), 14/16 = Single Wide; an M build code = Modular.
function normalizeHomeType(raw: unknown, context: string): string {
  const t = String(raw || "").trim();
  if (/single/i.test(t)) return "Single Wide";
  if (/double|sectional|multi/i.test(t)) return "Multi-Section";
  if (/modular/i.test(t)) return "Modular";
  const m = context.match(/\b(14|16|24|28|32)(\d{2})([hm])\d{2}/i);
  if (m) {
    if (m[3].toLowerCase() === "m") return "Modular";
    return Number(m[1]) >= 24 ? "Multi-Section" : "Single Wide";
  }
  return t;
}

function s3Url(path?: string): string {
  if (!path) return "";
  // Many CMS image keys contain spaces/parentheses — encode so the URL is valid
  // everywhere (social-preview scrapers and strict crawlers won't auto-encode).
  // encodeURI preserves the URL structure and already-encoded %XX sequences.
  const raw = /^https?:\/\//.test(path) ? path : `${S3_BASE}/${String(path).replace(/^\//, "")}`;
  return encodeURI(raw);
}

// A CMS API failure must NOT be swallowed into an empty result: ISR would then
// cache a zero-home page over the last good one for every visitor. Throwing
// during revalidation makes Next.js keep serving the last successfully
// generated page and retry on the next request. During `next build` we stay
// graceful (empty result) so a CMS blip can't fail unrelated deploys — the
// error still lands in the build log.
function cmsFailure(context: string, detail: string): void {
  console.error(`[cms-api] ${context} FAILED: ${detail}`);
  if (process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error(`[cms-api] ${context}: ${detail}`);
  }
}

// Repo-published Champion PRIME Series models (src/lib/local-floor-plans.ts)
// merge with the remote catalog the same way local blog posts do — these
// models were never entered into the CMS, so the repo is their source of
// truth. Local wins on slug collisions; getApiFloorPlanBySlug resolves them
// first, so they stay reachable even when the CMS/feed is down.
async function localPlans(): Promise<ApiFloorPlan[]> {
  const { localFloorPlans, PRIME_SERIES, PRIME_HOME_TYPE, seriesLabel } = await import("./local-floor-plans");
  return localFloorPlans.filter((p) => !p.hidden).map((p) => ({
    slug: p.slug,
    name: p.name,
    title: `${p.name} - ${p.beds} Bed ${p.baths} Bath ${p.homeType || PRIME_HOME_TYPE} | Champion ${seriesLabel(p)} Series`,
    price: formatPrice(p.fdhcPrice),
    sqft: p.sqft,
    beds: p.beds,
    baths: p.baths,
    image: p.image || "",
    brand: "Champion Home Builders",
    homeType: p.homeType || PRIME_HOME_TYPE,
    series: p.series || PRIME_SERIES,
    virtualTour: p.virtualTour || "",
    widthFt: parseInt(p.width, 10) || undefined,
  }));
}

function mergePlans(remote: ApiFloorPlan[], local: ApiFloorPlan[]): ApiFloorPlan[] {
  const localSlugs = new Set(local.map((p) => p.slug));
  return [...remote.filter((p) => !localSlugs.has(p.slug)), ...local];
}

/** All active floor plans from the CMS, mapped to the card shape the design uses. */
export async function getApiFloorPlans(): Promise<ApiFloorPlan[]> {
  // Prefer the DealerTide (Renter Insight) inventory feed when configured; the
  // CMS remains the fallback. Imported lazily to avoid a load-time env read.
  const { feedConfigured, getFeedFloorPlans } = await import("./dealertide-feed");
  if (feedConfigured()) return mergePlans(await getFeedFloorPlans(), await localPlans()).map(decoratePlan);

  const endpoint = "floor-plan/get-active";
  let json: any;
  try {
    const res = await fetch(`${API_BASE}/api/${endpoint}?limit=500`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      cmsFailure(endpoint, `HTTP ${res.status} ${res.statusText}`);
      return (await localPlans()).map(decoratePlan);
    }
    json = await res.json();
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("[cms-api]")) throw err;
    cmsFailure(endpoint, String(err));
    return (await localPlans()).map(withBedOptions);
  }
  const rows: any[] = Array.isArray(json?.data) ? json.data : (json?.rows || []);
  const plans = rows
    .filter((r) => r?.slug)
    .map((r) => ({
      slug: String(r.slug),
      name: shortName(r.title),
      title: String(r.title || ""),
      price: formatPrice(r.price),
      sqft: sqftOverrides[String(r.slug)] ?? (Number(r.sqft) || 0),
      beds: Number(r.beds) || 0,
      baths: Number(r.baths) || 0,
      image: galleryOverlays[String(r.slug)]?.image || s3Url(r.bannerImage),
      brand: r?.brandDetails?.name || r?.seriesDetails?.name || "Champion Homes",
      homeType: normalizeHomeType(r.homeType, `${r.slug} ${r.title} ${r.modelNumber || ""} ${r.bannerImage || ""}`),
      series: canonicalSeries(r?.seriesDetails?.name || r?.series) || deriveSeries(r.title, r?.modelNo, r?.description),
      widthFt: deriveWidthFt(`${r.slug} ${r.title} ${r.modelNumber || ""} ${r.bannerImage || ""}`),
    }));
  if (plans.length === 0) {
    // HTTP 200 with zero homes is a valid CMS state but almost always means
    // someone deactivated everything — make it impossible to miss in the logs.
    console.warn(`[cms-api] ${endpoint} returned 0 active homes — floor plan pages will render empty`);
  } else {
    console.log(`[cms-api] ${endpoint} OK — ${plans.length} active homes`);
  }
  return mergePlans(plans, await localPlans()).map(decoratePlan);
}

/** Small, presentable set of homes for the homepage featured section — homes
 * with a real photo and plausible price first. Shared by the server-rendered
 * homepage and the /api/homes/featured route. */
export async function getFeaturedHomes(): Promise<ApiFloorPlan[]> {
  const priceValue = (raw: string) => Number(String(raw).replace(/[^0-9.]/g, "")) || 0;
  const all = await getApiFloorPlans();
  const complete = all.filter((h) => h.image && priceValue(h.price) >= 10000);
  return (complete.length >= 4 ? complete : all.filter((h) => h.image)).slice(0, 4);
}

export interface ApiFloorPlanDetail extends ApiFloorPlan {
  description: string;     // short summary
  floorPlanHtml: string;   // long HTML body
  modelNumber: string;
  length: string;
  width: string;
  series: string;
  brochureUrl: string;     // absolute S3 URL or ""
  virtualTour: string;     // e.g. Matterport URL or ""
  gallery: string[];       // absolute image URLs (banner first)
}

/** One floor plan by slug, with full detail, from the CMS. */
export async function getApiFloorPlanBySlug(slug: string): Promise<ApiFloorPlanDetail | null> {
  // Repo-published PRIME models resolve first (same local-first rule as blog posts).
  {
    const { localFloorPlans, PRIME_SERIES, PRIME_HOME_TYPE, planDescription, seriesLabel } = await import("./local-floor-plans");
    const { paramountExtraHtml } = await import("./paramount-content");
    const p = localFloorPlans.find((x) => x.slug === slug);
    if (p?.hidden) return null;
    if (p) {
      return decoratePlan({
        slug: p.slug,
        name: p.name,
        title: `${p.name} - ${p.beds} Bed ${p.baths} Bath ${p.homeType || PRIME_HOME_TYPE} | Champion ${seriesLabel(p)} Series`,
        price: formatPrice(p.fdhcPrice),
        sqft: p.sqft,
        beds: p.beds,
        baths: p.baths,
        image: p.image || "",
        brand: "Champion Home Builders",
        homeType: p.homeType || PRIME_HOME_TYPE,
        description: planDescription(p),
        floorPlanHtml: `<p>${planDescription(p)}</p>${paramountExtraHtml(p)}`,
        modelNumber: p.modelNumber,
        length: p.length,
        width: p.width,
        series: p.series || PRIME_SERIES,
        brochureUrl: p.brochureUrl || "",
        virtualTour: p.virtualTour || "",
        gallery: p.gallery ?? (p.image ? [p.image] : []),
      });
    }
  }

  // Repo-mapped Matterport tour (src/lib/virtual-tours.ts) fills in when the
  // CMS/feed has no tour of its own — a CMS-provided tour always wins.
  const localTour = virtualTours[slug] || "";

  const { feedConfigured, getFeedFloorPlanBySlug } = await import("./dealertide-feed");
  if (feedConfigured()) {
    const d = await getFeedFloorPlanBySlug(slug);
    if (!d) return d;
    // decoratePlan applies the repo-mapped tour when the feed has none.
    return decoratePlan(d);
  }

  const endpoint = `floor-plan/get-details/${slug}`;
  let json: any;
  try {
    const res = await fetch(
      `${API_BASE}/api/floor-plan/get-details/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } },
    );
    // 404 is a genuinely unknown slug -> notFound(). Anything else (5xx, rate
    // limit) must not masquerade as "home doesn't exist".
    if (res.status === 404) return null;
    if (!res.ok) {
      cmsFailure(endpoint, `HTTP ${res.status} ${res.statusText}`);
      return null;
    }
    json = await res.json();
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("[cms-api]")) throw err;
    cmsFailure(endpoint, String(err));
    return null;
  }
  try {
    const r: any = json?.data || json;
    if (!r?.slug) return null;

    const rawImgs = [
      r.bannerImage,
      ...((r.images || []).map((i: any) => i?.imageName || i?.imageLocation)),
      ...((r.galleryImages || []).map((i: any) => i?.imageName || i?.imageLocation)),
    ].filter(Boolean);
    // Photo-shoot overlay: real photography first, CMS images (drawing) after.
    const overlay = galleryOverlays[String(r.slug)];
    // Buyer-journey ordering: hero photo first, then the floor-plan drawing(s)
    // from the CMS and the SALES option sheets, then the rest of the photos.
    const cmsImgs = [...new Set(rawImgs)].map(s3Url);
    const sheets = sheetExtras[String(r.slug)] || [];
    const gallery = overlay
      ? [overlay.gallery[0], ...cmsImgs, ...sheets, ...overlay.gallery.slice(1)]
      : [...cmsImgs, ...sheets];

    const homeType = normalizeHomeType(r.homeType, `${r.slug} ${r.title} ${r.modelNumber || ""} ${r.bannerImage || ""}`);
    const series = canonicalSeries(r?.seriesDetails?.name || r?.series) || deriveSeries(r.title, r?.modelNo, r?.description);
    // Champion-published series brochure fills in when the CMS record has none.
    const { seriesBrochure } = await import("./brochures");

    return decoratePlan({
      slug: String(r.slug),
      name: shortName(r.title),
      title: String(r.title || ""),
      price: formatPrice(r.price),
      sqft: sqftOverrides[String(r.slug)] ?? (Number(r.sqft) || 0),
      beds: Number(r.beds) || 0,
      baths: Number(r.baths) || 0,
      image: overlay?.image || s3Url(r.bannerImage),
      brand: r?.brandDetails?.name || "Champion Homes",
      homeType,
      description: String(r.description || ""),
      floorPlanHtml: String(r.floorPlan || ""),
      modelNumber: String(r.modelNumber || ""),
      length: String(r.length || ""),
      width: String(r.width || ""),
      series,
      brochureUrl: r.brochure ? s3Url(r.brochure) : seriesBrochure(series, homeType),
      virtualTour: String(r.virtualTour || "") || localTour,
      gallery,
    });
  } catch {
    return null;
  }
}

// ---------- Blog ----------

function stripHtmlLocal(s: string): string {
  return String(s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  return new Date(t).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export interface ApiBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string; // formatted
}

export interface ApiBlogDetail extends ApiBlogPost {
  html: string;
}

// Repo-authored posts (src/lib/local-posts.ts) merge with CMS posts so the
// listing, sitemap, and RSS feed all include them. Local wins on slug
// collisions — getApiBlogBySlug also resolves local posts first.
async function localPosts(): Promise<ApiBlogPost[]> {
  const { localBlogPosts } = await import("./local-posts");
  return localBlogPosts.map(({ slug, title, excerpt, image, date }) => ({ slug, title, excerpt, image, date }));
}

function mergePosts(cms: ApiBlogPost[], local: ApiBlogPost[]): ApiBlogPost[] {
  const localSlugs = new Set(local.map((p) => p.slug));
  return [...local, ...cms.filter((p) => !localSlugs.has(p.slug))].sort(
    (a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0),
  );
}

export async function getApiBlogPosts(): Promise<ApiBlogPost[]> {
  const endpoint = "blog/get-all";
  let json: any;
  try {
    const res = await fetch(`${API_BASE}/api/blog/get-all?limit=100`, { next: { revalidate: 300 } });
    if (!res.ok) {
      cmsFailure(endpoint, `HTTP ${res.status} ${res.statusText}`);
      return mergePosts([], await localPosts());
    }
    json = await res.json();
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("[cms-api]")) throw err;
    cmsFailure(endpoint, String(err));
    return mergePosts([], await localPosts());
  }
  {
    const rows: any[] = Array.isArray(json?.data) ? json.data : [];
    const cmsPosts = rows
      .filter((r) => r?.slug && r?.isActive !== false && r?.isDeleted !== true)
      // Newest posts first — sort by createdAt (falls back to updatedAt) descending
      .sort((a, b) => {
        const ta = new Date(a?.createdAt || a?.updatedAt || 0).getTime();
        const tb = new Date(b?.createdAt || b?.updatedAt || 0).getTime();
        return tb - ta;
      })
      .map((r) => ({
        slug: String(r.slug),
        title: String(r.title || ""),
        excerpt: stripHtmlLocal(r.description || "").slice(0, 170),
        image: s3Url(r.bannerImage),
        date: formatDate(r.createdAt),
      }));
    return mergePosts(cmsPosts, await localPosts());
  }
}

export async function getApiBlogBySlug(slug: string): Promise<ApiBlogDetail | null> {
  {
    const { localBlogPosts } = await import("./local-posts");
    const local = localBlogPosts.find((p) => p.slug === slug);
    if (local) return local;
  }
  const endpoint = `blog/get-details/${slug}`;
  let json: any;
  try {
    const res = await fetch(
      `${API_BASE}/api/blog/get-details/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } },
    );
    if (res.status === 404) return null;
    if (!res.ok) {
      cmsFailure(endpoint, `HTTP ${res.status} ${res.statusText}`);
      return null;
    }
    json = await res.json();
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("[cms-api]")) throw err;
    cmsFailure(endpoint, String(err));
    return null;
  }
  {
    const r: any = json?.data || json;
    if (!r?.slug) return null;
    return {
      slug: String(r.slug),
      title: String(r.title || ""),
      excerpt: stripHtmlLocal(r.description || "").slice(0, 170),
      image: s3Url(r.bannerImage),
      date: formatDate(r.createdAt),
      html: String(r.description || ""),
    };
  }
}
