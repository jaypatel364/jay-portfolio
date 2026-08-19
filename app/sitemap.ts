import type { MetadataRoute } from "next";
import { HOME_URL, LAST_UPDATED, pageUrl } from "@/lib/seo";
import { features } from "@/settings/features";
import { publicCaseStudies } from "@/settings/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = LAST_UPDATED;
  const extra = [];

  if (features.showCaseStudies) {
    extra.push(
      ...publicCaseStudies().map((p) => ({
        url: pageUrl(`projects/${p.slug}`),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    );
  }

  return [
    {
      url: HOME_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...(["about", "skills", "work", "contact"] as const).map((slug) => ({
      url: pageUrl(slug),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...extra,
  ];
}
