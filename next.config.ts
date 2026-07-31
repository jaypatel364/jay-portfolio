import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  images: {
    // Allowed external image domains — add more as needed
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
    // Serve modern formats automatically (avif > webp > original)
    formats: ["image/avif", "image/webp"],
    // Cache optimised images for 7 days
    minimumCacheTTL: 60 * 60 * 24 * 7,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
};

export default withPWA({
  dest: "public",
  // Only register SW in production — avoids dev caching headaches
  disable: process.env.NODE_ENV === "development",
  // Cache pages and static assets with a stale-while-revalidate strategy
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
})(nextConfig);
