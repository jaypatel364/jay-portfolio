import type { MetadataRoute } from "next";
import { HOME_URL, LAST_UPDATED, pageUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = LAST_UPDATED;

  // Project slug pages (`/work/<slug>/`) stay out of the sitemap — they are noindex.
  return [
    {
      url: HOME_URL,
      lastModified,
    },
    ...(["about", "skills", "work", "contact"] as const).map((slug) => ({
      url: pageUrl(slug),
      lastModified,
    })),
  ];
}
