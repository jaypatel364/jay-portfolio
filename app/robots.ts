import type { MetadataRoute } from "next";
import { BASE_URL } from "@/settings/seo";
import { features } from "@/settings/features";

/**
 * robots.txt — always derived from BASE_URL so the sitemap host cannot drift.
 * When allowIndexing is false, disallow everything (matches meta robots).
 */
export default function robots(): MetadataRoute.Robots {
  if (!features.allowIndexing) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        // Legacy path (redirects to /work/)
        "/projects/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
