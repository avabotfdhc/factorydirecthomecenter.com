// Data layer that reads content from the existing Factory Direct Homes Center
// admin CMS / backend API (api.factorydirecthomescenter.com). This is the bridge
// that lets the new (Vercel/Tailwind) design render live, CMS-managed content
// instead of hardcoded data — so Kyle keeps editing in the admin panel.
//
// Fetches run server-side (Next.js server components), so there is no CORS issue
// and no API key is exposed to the browser.

import { deriveSeries } from "./series";

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
}

// TEMPORARY (pre-launch): hide all home prices until CMS pricing is cleaned up.
// Flip back to `true` to show real prices again — this single flag controls the
// floor-plan list, detail pages, homepage featured homes, and the inventory page.
const SHOW_PRICES = false;

function formatPrice(raw: unknown): string {
  if (!SHOW_PRICES) return "Contact for price";
  const n = Number(String(raw ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? `$${n.toLocaleString("en-US")}` : "Contact for price";
}

// CMS titles are long ("Brighton - 3 Bed 2 Bath ... | Champion Aspire").
// Use the first segment as the card's display name.
function shortName(title: string): string {
  return String(title || "")
    .split(/\s[-|–]\s/)[0]
    .trim() || "Home";
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

/** All active floor plans from the CMS, mapped to the card shape the design uses. */
export async function getApiFloorPlans(): Promise<ApiFloorPlan[]> {
  // Prefer the DealerTide (Renter Insight) inventory feed when configured; the
  // CMS remains the fallback. Imported lazily to avoid a load-time env read.
  const { feedConfigured, getFeedFloorPlans } = await import("./dealertide-feed");
  if (feedConfigured()) return getFeedFloorPlans();

  const endpoint = "floor-plan/get-active";
  let json: any;
  try {
    const res = await fetch(`${API_BASE}/api/${endpoint}?limit=500`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      cmsFailure(endpoint, `HTTP ${res.status} ${res.statusText}`);
      return [];
    }
    json = await res.json();
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("[cms-api]")) throw err;
    cmsFailure(endpoint, String(err));
    return [];
  }
  const rows: any[] = Array.isArray(json?.data) ? json.data : (json?.rows || []);
  const plans = rows
    .filter((r) => r?.slug)
    .map((r) => ({
      slug: String(r.slug),
      name: shortName(r.title),
      title: String(r.title || ""),
      price: formatPrice(r.price),
      sqft: Number(r.sqft) || 0,
      beds: Number(r.beds) || 0,
      baths: Number(r.baths) || 0,
      image: s3Url(r.bannerImage),
      brand: r?.brandDetails?.name || r?.seriesDetails?.name || "Champion Homes",
      homeType: String(r.homeType || ""),
      series: String(r?.seriesDetails?.name || r?.series || "") || deriveSeries(r.title, r?.modelNo, r?.description),
    }));
  if (plans.length === 0) {
    // HTTP 200 with zero homes is a valid CMS state but almost always means
    // someone deactivated everything — make it impossible to miss in the logs.
    console.warn(`[cms-api] ${endpoint} returned 0 active homes — floor plan pages will render empty`);
  } else {
    console.log(`[cms-api] ${endpoint} OK — ${plans.length} active homes`);
  }
  return plans;
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
  const { feedConfigured, getFeedFloorPlanBySlug } = await import("./dealertide-feed");
  if (feedConfigured()) return getFeedFloorPlanBySlug(slug);

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
    const gallery = [...new Set(rawImgs)].map(s3Url);

    return {
      slug: String(r.slug),
      name: shortName(r.title),
      title: String(r.title || ""),
      price: formatPrice(r.price),
      sqft: Number(r.sqft) || 0,
      beds: Number(r.beds) || 0,
      baths: Number(r.baths) || 0,
      image: s3Url(r.bannerImage),
      brand: r?.brandDetails?.name || "Champion Homes",
      homeType: String(r.homeType || ""),
      description: String(r.description || ""),
      floorPlanHtml: String(r.floorPlan || ""),
      modelNumber: String(r.modelNumber || ""),
      length: String(r.length || ""),
      width: String(r.width || ""),
      series: r?.seriesDetails?.name || String(r.series || "") || deriveSeries(r.title, r?.modelNo, r?.description),
      brochureUrl: r.brochure ? s3Url(r.brochure) : "",
      virtualTour: String(r.virtualTour || ""),
      gallery,
    };
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
