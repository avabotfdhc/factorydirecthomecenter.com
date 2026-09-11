import type { NextConfig } from "next";
import { HTML_LIMITED_BOT_UA_RE } from "next/dist/shared/lib/router/utils/html-bots";
import { legacyFloorPlanRedirects } from "./src/lib/legacy-redirects";

// Crawlers that must get <title>/<meta> in <head>. Next.js streams metadata
// into the <body> for every user agent that is not on its built-in
// "HTML-limited bots" list (Bingbot, facebookexternalhit, …). SEO audit
// crawlers such as Semrush's SiteAuditBot are not on that list and do not run
// JavaScript, so they reported the homepage as having no title tag and no meta
// description (Semrush On Page SEO Checker, 2026-08-20). Setting
// `htmlLimitedBots` replaces the default list, so the default regex is
// re-included and the audit crawlers appended.
const SEO_AUDIT_BOT_UA_RE = /SemrushBot|SiteAuditBot|SplitSignalBot|AhrefsBot|AhrefsSiteAudit|Screaming Frog|MJ12bot|DotBot|rogerbot|SeznamBot|PetalBot/;
const htmlLimitedBots = new RegExp(`${HTML_LIMITED_BOT_UA_RE.source}|${SEO_AUDIT_BOT_UA_RE.source}`, "i");

const nextConfig: NextConfig = {
  htmlLimitedBots,
  images: {
    // Catalogue photos live in Supabase Storage; next/image resizes to the
    // displayed size, serves AVIF/WebP and caches the variants.
    formats: ["image/avif", "image/webp"],
    // Optimised variants are immutable for a month (catalogue photos change
    // by getting a new path, not by being overwritten).
    minimumCacheTTL: 2678400,
    remotePatterns: [
      // Supabase Storage: plan photos and drawings imported from Champion's Box library.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/contact',
        destination: '/contact-us',
        permanent: true,
      },
      // We order every home to spec — there is no separate standing-inventory
      // feed, so /inventory was always a thin duplicate of the catalog. 301 so
      // the indexed URL consolidates into /floor-plans.
      {
        source: '/inventory',
        destination: '/floor-plans',
        permanent: true,
      },
      // County pages: "-in" aliases → canonical slugs
      ...["allen", "dekalb", "noble", "steuben"].map((c) => ({
        source: `/locations/${c}-county-in`,
        destination: `/locations/${c}-county`,
        permanent: true,
      })),
      // /series/<slug> are series hub pages (src/app/series/[slug]) — the
      // old redirects to /floor-plans were removed 2026-09-09.
      {
        source: '/brands/champion/series/aspire/floor-plans/Sectionals/:slug',
        destination: '/floor-plans/:slug',
        permanent: true,
      },
      {
        source: '/brands/champion-home-builders/series/aspire/floor-plans/Sectionals/:slug',
        destination: '/floor-plans/:slug',
        permanent: true,
      },
      {
        source: '/brands/champion-home-builders/series/factory-direct-homes-center-v2',
        destination: '/',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/floor-plan/:slug',
        destination: '/floor-plans/:slug',
        permanent: true,
      },
      // Fix 404 - PDF moved
      {
        source: '/special-plans/details/features/2024 Aspire Sectional Standards.pdf',
        destination: '/resources',
        permanent: false,
      },
      // Sale page renamed /special-plans → /homes-on-sale (SEO-friendlier slug).
      // 301 the old paths so indexed/linked URLs keep their equity.
      {
        source: '/special-plans/clearance',
        destination: '/homes-on-sale/clearance',
        permanent: true,
      },
      {
        source: '/special-plans/details/:slug',
        destination: '/homes-on-sale/details/:slug',
        permanent: true,
      },
      {
        source: '/special-plans',
        destination: '/homes-on-sale',
        permanent: true,
      },
      // 301s for the retired pre-CMS floor-plan URLs (old short slugs) →
      // current homes, so old indexed/linked pages don't 404.
      ...legacyFloorPlanRedirects,
    ];
  },
  async headers() {
    return [
      {
        // Shipped images are versioned by filename; let browsers and the CDN
        // keep them for a year.
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // HSTS — tells browsers to always use HTTPS for this domain and its
          // subdomains (fixes the "No HSTS support" audit notice). Two-year
          // max-age with preload eligibility.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
