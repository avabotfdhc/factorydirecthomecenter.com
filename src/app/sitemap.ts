import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/pages";
import { catalogueCmsConfigured, getApiFloorPlans, getApiBlogPosts, type ApiFloorPlan } from "@/lib/api-content";
import { isBuildPhase, planEntriesForSitemap } from "@/lib/sitemap-catalogue";
import { canonicalPlans } from "@/lib/plan-canonical";
import { absoluteImageUrl } from "@/lib/image-alt";
import { getGuide } from "@/lib/guides";
import { getSaleStatus } from "@/lib/sale";

const BASE_URL = "https://factorydirecthomescenter.com";

// Refresh periodically so newly-published CMS homes/posts enter the sitemap.
export const revalidate = 3600;

// `lastModified` is only sent when we actually know when the content changed:
// a guide's `updated` date, a post's publish date, or the CMS row's
// `updated_at`. The sale pages carry the start date of the running sale
// phase: their headline offer changes on that day, and Google showed a
// 20%-off snippet for days after the October raise to 25% (2026-10-07)
// because nothing told it the page had changed. Until 2026-09-11 every URL reported "modified now" on every
// request, which teaches Google to ignore the field entirely (and looks like
// freshness gaming). A page with no known date simply omits it.
const isoDate = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const t = Date.parse(value);
  return Number.isFinite(t) ? new Date(t) : undefined;
};

/** Pages whose headline offer comes from the running sale phase. */
const SALE_PAGES = new Set(["/", "/homes-on-sale", "/homes-on-sale/clearance"]);

/**
 * The floor plans the sitemap may list. Strict on purpose: a CMS failure must
 * not be papered over with the repo copy here (its slugs redirect), and a
 * collapsed result must not be published — see src/lib/sitemap-catalogue.ts
 * for what happens instead at runtime (throw → ISR keeps the last good file)
 * and at build time (omit the section, log, let revalidation repair it).
 */
async function sitemapPlans(): Promise<ApiFloorPlan[]> {
  const cmsConfigured = await catalogueCmsConfigured();
  let plans: ApiFloorPlan[] = [];
  let error: unknown;
  try {
    plans = await getApiFloorPlans({ requireCms: true });
  } catch (err) {
    error = err;
  }
  const trusted = planEntriesForSitemap({ plans, cmsConfigured, error }, { buildPhase: isBuildPhase() });
  // Only self-canonical pages: a modular plan whose page points rel=canonical
  // at its HUD twin is left out, so the file never lists a URL the page
  // itself says is not the one to index (src/lib/plan-canonical.ts). The
  // degraded-catalogue floor above is checked on the full set first, because
  // the live catalogue is ~215 plans of which ~58 are such twins.
  return canonicalPlans(trusted);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static/registry pages, minus blog stubs — the real floor-plan and blog
  // detail pages are sourced live from the CMS below.
  const sale = getSaleStatus();
  const staticEntries: MetadataRoute.Sitemap = getAllPages()
    .filter((page) => !page.url.startsWith("/blog/"))
    .map((page) => {
      const lastModified = isoDate(
        getGuide(page.url)?.updated ?? (SALE_PAGES.has(page.url) ? sale.phase?.startDate : undefined),
      );
      return {
        url: `${BASE_URL}${page.url === "/" ? "" : page.url}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      };
    });

  const [plans, posts] = await Promise.all([sitemapPlans(), getApiBlogPosts()]);

  // Image sitemap entries: the card image plus the gallery (photos and
  // floor-plan sheets), absolute URLs, banner first, capped per page.
  const planImages = (plan: { image?: string; gallery?: string[] }) =>
    [...new Set([plan.image, ...(plan.gallery || [])].filter(Boolean).map((s) => absoluteImageUrl(s)))].slice(0, 30);

  const floorPlanEntries: MetadataRoute.Sitemap = plans.map((plan) => {
    const lastModified = isoDate(plan.updatedAt);
    return {
      url: `${BASE_URL}/floor-plans/${plan.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: planImages(plan),
    };
  });

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const lastModified = isoDate(post.date);
    return {
      url: `${BASE_URL}/blog/${post.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      ...(post.image ? { images: [absoluteImageUrl(post.image)] } : {}),
    };
  });

  const seen = new Set(staticEntries.map((e) => e.url));
  return [
    ...staticEntries,
    ...floorPlanEntries.filter((e) => !seen.has(e.url)),
    ...blogEntries.filter((e) => !seen.has(e.url)),
  ];
}
