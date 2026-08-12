import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

/**
 * Sitemap — submitted to Google Search Console.
 *
 * Add new routes here as you expand the site.
 * BASE_URL is driven by the NEXT_PUBLIC_SITE_URL env var (see .env.example).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
