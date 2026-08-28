import type { NextConfig } from "next";
import { legacyFloorPlanRedirects } from "./src/lib/legacy-redirects";

const nextConfig: NextConfig = {
  images: {
    // CMS/DealerTide photos live in S3. Routing them through next/image
    // resizes to the displayed size, serves AVIF/WebP, and adds long-lived
    // caching — the raw S3 objects are multi-megapixel with no Cache-Control.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "factory-direct-homescenter.s3.us-east-1.amazonaws.com",
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
      {
        source: '/inventory',
        destination: '/floor-plans',
        permanent: false,
      },
      // Fix duplicate content issues - redirect old URL patterns to canonical versions
      {
        source: '/series/prime',
        destination: '/floor-plans',
        permanent: true,
      },
      {
        source: '/series/paramount',
        destination: '/floor-plans',
        permanent: true,
      },
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
