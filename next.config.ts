import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disables ESLint during `next build`
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skips TypeScript checking during build
  },
};

export default nextConfig;
