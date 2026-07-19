import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Core framework config options */
  experimental: {
    // 🌟 FIXED: Modern framework method to increase server upload limits safely up to 10MB!
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
