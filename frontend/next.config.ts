import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Performance: compress responses
  compress: true,
  // Optimize image handling
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
