import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/pages";
import { getApiFloorPlans, getApiBlogPosts } from "@/lib/api-content";

const BASE_URL = "https://factorydirecthomescenter.com";

// Refresh periodically so newly-published CMS homes/posts enter the sitemap.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Static/registry pages, minus stale sample detail URLs — the real
  // floor-plan and blog detail pages are sourced live from the CMS below.
  const staticEntries: MetadataRoute.Sitemap = getAllPages()
    // Exclude the sample detail URL and blog stubs — the real blog posts are
    // sourced live from the CMS below.
    .filter(
      (page) =>
        page.url !== "/floor-plans/emerald-sky" &&
        !page.url.startsWith("/blog/"),
    )
    .map((page) => ({
      url: `${BASE_URL}${page.url === "/" ? "" : page.url}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));

  const [plans, posts] = await Promise.all([getApiFloorPlans(), getApiBlogPosts()]);

  const floorPlanEntries: MetadataRoute.Sitemap = plans.map((plan) => ({
    url: `${BASE_URL}/floor-plans/${plan.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const seen = new Set(staticEntries.map((e) => e.url));
  return [
    ...staticEntries,
    ...floorPlanEntries.filter((e) => !seen.has(e.url)),
    ...blogEntries.filter((e) => !seen.has(e.url)),
  ];
}
