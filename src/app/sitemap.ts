import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/pages";
import { getApiFloorPlans, getApiBlogPosts } from "@/lib/api-content";
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

  const [plans, posts] = await Promise.all([getApiFloorPlans(), getApiBlogPosts()]);

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
