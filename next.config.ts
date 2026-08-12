import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
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
