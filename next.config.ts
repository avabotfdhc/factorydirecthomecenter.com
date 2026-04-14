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
    ];
  },
};

export default nextConfig;
