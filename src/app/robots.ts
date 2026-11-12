import type { MetadataRoute } from "next";
import { AI_CRAWLER_TOKENS } from "@/lib/ai-crawlers";

// Paths no crawler needs: the admin, the layout specimen page and the JSON API.
const PRIVATE_PATHS = ["/admin", "/design-system", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      // A crawler that finds a group naming it obeys that group ONLY and
      // ignores the "*" group. Until 2026-11-11 GPTBot, ClaudeBot,
      // PerplexityBot and GoogleOther each had a group that said just
      // "Allow: /", which (a) lifted the /admin and /api/ disallows for
      // exactly those four and (b) named none of the bots that fetch pages
      // for a live answer (OAI-SearchBot, ChatGPT-User, Claude-SearchBot,
      // Perplexity-User…). One group, the whole roster, the same disallows.
      { userAgent: [...AI_CRAWLER_TOKENS], allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: "https://factorydirecthomescenter.com/sitemap.xml",
  };
}
