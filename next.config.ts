import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      isProd
        ? "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com"
        : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://github-contributions-api.jogruber.de https://*.ingest.sentry.io https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' mailto:",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const PRODUCTION_ORIGIN = "https://jaypateldev.com";

const hostRedirect = (host: string) => ({
  source: "/:path*",
  has: [{ type: "host" as const, value: host }],
  destination: `${PRODUCTION_ORIGIN}/:path*`,
  permanent: true,
});

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Required so Next.js metadata keeps https://jaypateldev.com/ (not …com).
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    // Preview deployments (unique *.vercel.app URLs) are not redirected.
    // www is also redirected in Vercel Domains; this is a backup.
    const hosts = ["www.jaypateldev.com", "jay-patel-dev.vercel.app"];
    return hosts.flatMap((host) => [
      {
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: `${PRODUCTION_ORIGIN}/`,
        permanent: true,
      },
      hostRedirect(host),
    ]);
  },
};

export default nextConfig;
