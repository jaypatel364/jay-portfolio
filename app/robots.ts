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

  const disallow = ["/api/"];
  if (!features.showCaseStudies) disallow.push("/projects/");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
