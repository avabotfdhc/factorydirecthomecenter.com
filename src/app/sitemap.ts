import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/pages";
import { floorPlans } from "@/lib/floor-plans";

const BASE_URL = "https://factorydirecthomescenter.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = getAllPages().map((page) => ({
    url: `${BASE_URL}${page.url === "/" ? "" : page.url}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Every dynamic floor plan detail page (/floor-plans/[slug]) from the data model.
  // Priority 0.7 — below hub pages but above thin utility pages.
  const floorPlanEntries: MetadataRoute.Sitemap = floorPlans.map((plan) => ({
    url: `${BASE_URL}/floor-plans/${plan.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dedupe by URL — if a floor plan is also listed in sitePages (e.g. emerald-sky),
  // keep the static registry entry since it carries richer metadata.
  const seen = new Set(staticEntries.map((e) => e.url));
  const merged = [
    ...staticEntries,
    ...floorPlanEntries.filter((e) => !seen.has(e.url)),
  ];

  return merged;
}
