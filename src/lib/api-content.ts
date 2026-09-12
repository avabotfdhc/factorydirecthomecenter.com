// Catalogue and blog data layer. Sources, in priority order: Supabase (the
// owned CMS), the DealerTide inventory feed, and the repo-published data files
// (src/lib/*-floor-plans.ts, src/lib/local-posts.ts), which always merge in.
// Everything runs server-side; no key reaches the browser.

import { galleryOverlays, sheetExtras } from "./gallery-overlays";
import { virtualTours } from "./virtual-tours";
import { bedOptions } from "./spec-overrides";
import { anchorPriceFor } from "./price-sheet";


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
  floorPlanImage?: string; // dimensioned floor-plan drawing (image), for the card's Photo/Plan toggle
  updatedAt?: string;  // ISO timestamp of the last CMS edit, when the source records one (sitemap lastmod)
}

// Pick the floor-plan drawing out of a set of image URLs. Champion's drawings
// and option-layout sheets are named for what they are ("...-floorplan.webp",
// "...-opt2.webp", "...layout..."); photos never are.
const DRAWING_RE = /floor-?plan|layout|-opt\d|drawing|schematic|blueprint/i;
export function pickDrawing(urls: Array<string | undefined | null>): string {
  return urls.find((u) => u && DRAWING_RE.test(u)) || "";
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


// Central decoration applied to every plan on every path (CMS, feed, local):
// bedroom-option overlays, the range-level price anchor, and the repo-mapped
// Matterport tour (a CMS/feed-provided tour always wins).
function decoratePlan<T extends { slug: string; homeType: string; virtualTour?: string; floorPlanImage?: string }>(p: T): T {
  return {
    ...withBedOptions(p),
    priceFrom: priceFromBand(p.homeType),
    virtualTour: p.virtualTour || virtualTours[p.slug] || "",
    // The card's "Plan" view: whatever drawing the source supplied, else the
    // repo-held drawing/option sheet for this slug.
    floorPlanImage:
      p.floorPlanImage ||
      pickDrawing([...(galleryOverlays[p.slug]?.gallery || []), ...(sheetExtras[p.slug] || [])]),
  };
}




// A CMS API failure must NOT be swallowed into an empty result: ISR would then
// cache a zero-home page over the last good one for every visitor. Throwing
// during revalidation makes Next.js keep serving the last successfully
// generated page and retry on the next request. During `next build` we stay
// graceful (empty result) so a CMS blip can't fail unrelated deploys — the
// error still lands in the build log.
//

/**
 * The same failure, where the repo can answer instead.
 *
 * The listing paths each end in a `return` that falls back to repo-published
 * content, but they called cmsFailure() first — which throws — so the fallback
 * below it was unreachable and the page errored instead. That went unnoticed
 * until the CMS returned 502 for three days straight (2026-08-29 onwards) and
 * took /, /floor-plans and /blog down with it, when the repo had 193 published
 * floor plans sitting right there.
 *
 * So: log, don't throw, and let the caller serve what we do have. The result is
 * cached for the route's revalidate window (five minutes), which is the honest
 * trade — a short window of catalogue-only content beats an error page, and it
 * heals itself within five minutes of the CMS coming back.
 */

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
    floorPlanImage: pickDrawing([...(p.gallery || []), p.image]),
  }));
}

// Champion model code as it appears in a slug ("aspire-bayfield-2852h32169",
// "paramount-1432h11214"). Used to spot the same plan published under two slugs.
function modelKey(p: { slug: string; series: string }): string {
  const m = p.slug.match(/(\d{4}[hm]\d{2}[a-z0-9]{3})/i);
  return m ? `${p.series.toLowerCase()}|${m[1].toLowerCase()}` : "";
}

// Media the CMS may hold for a repo-published plan (imported Box photos,
// drawings, tours). CMS media wins when present; the repo copy fills gaps.
function overlayMedia<T extends ApiFloorPlan>(local: T, remote: ApiFloorPlan | undefined): T {
  if (!remote) return local;
  return {
    ...local,
    image: remote.image || local.image,
    floorPlanImage: remote.floorPlanImage || local.floorPlanImage,
    virtualTour: remote.virtualTour || local.virtualTour,
  };
}

function mergePlans(remote: ApiFloorPlan[], local: ApiFloorPlan[]): ApiFloorPlan[] {
  const remoteBySlug = new Map(remote.map((p) => [p.slug, p]));
  const remoteByModel = new Map<string, ApiFloorPlan>();
  for (const p of remote) {
    const k = modelKey(p);
    if (k) remoteByModel.set(k, p);
  }
  const localSlugs = new Set(local.map((p) => p.slug));
  // A repo plan that the CMS also publishes under a different slug (same
  // series + model code) is the same home: the CMS copy is the one the admin
  // edits and imports photos into, so it wins and the repo twin drops out.
  const kept = local.filter((p) => remoteBySlug.has(p.slug) || !remoteByModel.has(modelKey(p)));
  return [
    ...remote.filter((p) => !localSlugs.has(p.slug)),
    ...kept.map((p) => overlayMedia(p, remoteBySlug.get(p.slug))),
  ];
}

/** All active floor plans from the CMS, mapped to the card shape the design uses. */
export async function getApiFloorPlans(): Promise<ApiFloorPlan[]> {
  // Source priority (imported lazily to avoid load-time env reads):
  //   1. Supabase — the new owned CMS, used whenever its env vars are set.
  //   2. DealerTide (Renter Insight) inventory feed.
  //   3. Legacy CMS (below) as the final fallback.
  // Repo-published local plans always merge in on top of the chosen source.
  const { supabaseConfigured, getSupabaseFloorPlans } = await import("./supabase-content");
  if (supabaseConfigured()) return mergePlans(await getSupabaseFloorPlans(), await localPlans()).map(decoratePlan);

  const { feedConfigured, getFeedFloorPlans } = await import("./dealertide-feed");
  if (feedConfigured()) return mergePlans(await getFeedFloorPlans(), await localPlans()).map(decoratePlan);

  // No CMS configured: the repo-published catalogue is the site.
  return (await localPlans()).map(decoratePlan);
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
  floorPlanUrl: string;    // Champion's dimensioned floor-plan sheet (PDF), or ""
  virtualTour: string;     // e.g. Matterport URL or ""
  gallery: string[];       // absolute image URLs (banner first)
  documents?: { title: string; url: string }[]; // every sales-sheet / option-sheet PDF for the plan
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
      const local = decoratePlan({
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
        // The detail page generates the plan's narrative (src/lib/plan-content.ts);
        // the body only carries Champion's spec-sheet extras for Paramount.
        floorPlanHtml: paramountExtraHtml(p),
        modelNumber: p.modelNumber,
        length: p.length,
        width: p.width,
        series: p.series || PRIME_SERIES,
        brochureUrl: p.brochureUrl || "",
        floorPlanUrl: p.floorPlanUrl || "",
        virtualTour: p.virtualTour || "",
        gallery: p.gallery ?? (p.image ? [p.image] : []),
      });
      // Same slug in the CMS (seeded from this catalogue, then enriched via the
      // /admin importer): its photos, drawings, sales sheet and tour lead.
      const { supabaseConfigured, getSupabaseFloorPlanBySlug } = await import("./supabase-content");
      if (!supabaseConfigured()) return local;
      const remote = await getSupabaseFloorPlanBySlug(slug).catch(() => null);
      if (!remote) return local;
      return {
        ...overlayMedia(local, remote),
        description: remote.description || local.description,
        floorPlanHtml: remote.floorPlanHtml || local.floorPlanHtml,
        brochureUrl: remote.brochureUrl || local.brochureUrl,
        floorPlanUrl: remote.floorPlanUrl || local.floorPlanUrl,
        gallery: [...new Set([...remote.gallery, ...local.gallery])],
        documents: remote.documents,
      };
    }
  }

  // Supabase (new owned CMS) is the source of truth for a slug when configured.
  const { supabaseConfigured, getSupabaseFloorPlanBySlug } = await import("./supabase-content");
  if (supabaseConfigured()) {
    const d = await getSupabaseFloorPlanBySlug(slug);
    if (!d) return d;
    return decoratePlan(d);
  }

  const { feedConfigured, getFeedFloorPlanBySlug } = await import("./dealertide-feed");
  if (feedConfigured()) {
    const d = await getFeedFloorPlanBySlug(slug);
    if (!d) return d;
    // decoratePlan applies the repo-mapped tour when the feed has none.
    return decoratePlan(d);
  }

  return null;
}

// ---------- Blog ----------



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
  return mergePosts([], await localPosts());
}

export async function getApiBlogBySlug(slug: string): Promise<ApiBlogDetail | null> {
  const { localBlogPosts } = await import("./local-posts");
  return localBlogPosts.find((p) => p.slug === slug) ?? null;
}
