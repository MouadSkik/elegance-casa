import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Core framework production environment options */
  experimental: {
    // 🌟 FIXED: Modern Next.js 16 type-safe path layout to expand limits up to 10MB!
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
