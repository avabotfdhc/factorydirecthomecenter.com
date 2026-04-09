import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/pages";

const BASE_URL = "https://factorydirecthomescenter.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllPages().map((page) => ({
    url: `${BASE_URL}${page.url === "/" ? "" : page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
