import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/pages";
import { getApiFloorPlans, getApiBlogPosts } from "@/lib/api-content";
import { absoluteImageUrl } from "@/lib/image-alt";

const BASE_URL = "https://factorydirecthomescenter.com";

// Refresh periodically so newly-published CMS homes/posts enter the sitemap.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Static/registry pages, minus blog stubs — the real floor-plan and blog
  // detail pages are sourced live from the CMS below.
  const staticEntries: MetadataRoute.Sitemap = getAllPages()
    .filter((page) => !page.url.startsWith("/blog/"))
    .map((page) => ({
      url: `${BASE_URL}${page.url === "/" ? "" : page.url}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));

  const [plans, posts] = await Promise.all([getApiFloorPlans(), getApiBlogPosts()]);

  // Image sitemap entries: the card image plus the gallery (photos and
  // floor-plan sheets), absolute URLs, banner first, capped per page.
  const planImages = (plan: { image?: string; gallery?: string[] }) =>
    [...new Set([plan.image, ...(plan.gallery || [])].filter(Boolean).map((s) => absoluteImageUrl(s)))].slice(0, 30);

  const floorPlanEntries: MetadataRoute.Sitemap = plans.map((plan) => ({
    url: `${BASE_URL}/floor-plans/${plan.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    images: planImages(plan),
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    ...(post.image ? { images: [absoluteImageUrl(post.image)] } : {}),
  }));

  const seen = new Set(staticEntries.map((e) => e.url));
  return [
    ...staticEntries,
    ...floorPlanEntries.filter((e) => !seen.has(e.url)),
    ...blogEntries.filter((e) => !seen.has(e.url)),
  ];
}
