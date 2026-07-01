// Data layer that reads content from the existing Factory Direct Homes Center
// admin CMS / backend API (api.factorydirecthomescenter.com). This is the bridge
// that lets the new (Vercel/Tailwind) design render live, CMS-managed content
// instead of hardcoded data — so Kyle keeps editing in the admin panel.
//
// Fetches run server-side (Next.js server components), so there is no CORS issue
// and no API key is exposed to the browser.

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
}

function formatPrice(raw: unknown): string {
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
  if (/^https?:\/\//.test(path)) return path;
  return `${S3_BASE}/${String(path).replace(/^\//, "")}`;
}

/** All active floor plans from the CMS, mapped to the card shape the design uses. */
export async function getApiFloorPlans(): Promise<ApiFloorPlan[]> {
  try {
    const res = await fetch(`${API_BASE}/api/floor-plan/get-active?limit=500`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const rows: any[] = Array.isArray(json?.data) ? json.data : (json?.rows || []);
    return rows
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
      }));
  } catch {
    return [];
  }
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
  try {
    const res = await fetch(
      `${API_BASE}/api/floor-plan/get-details/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
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
      series: r?.seriesDetails?.name || String(r.series || "") || "",
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

export async function getApiBlogPosts(): Promise<ApiBlogPost[]> {
  try {
    const res = await fetch(`${API_BASE}/api/blog/get-all?limit=100`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    const rows: any[] = Array.isArray(json?.data) ? json.data : [];
    return rows
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
  } catch {
    return [];
  }
}

export async function getApiBlogBySlug(slug: string): Promise<ApiBlogDetail | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/blog/get-details/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
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
  } catch {
    return null;
  }
}
