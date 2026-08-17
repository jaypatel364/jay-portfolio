import type { MetadataRoute } from "next";
import { BASE_URL, LAST_UPDATED } from "@/lib/seo";
import { features } from "@/settings/features";
import { publicCaseStudies } from "@/settings/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = LAST_UPDATED;
  const extra = [];

  if (features.showResumePage) {
    extra.push({
      url: `${BASE_URL}/resume`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    });
  }
  if (features.showEngineeringPage) {
    extra.push({
      url: `${BASE_URL}/engineering`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  }
  if (features.showCaseStudies) {
    extra.push(
      ...publicCaseStudies().map((p) => ({
        url: `${BASE_URL}/projects/${p.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    );
  }

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...extra,
  ];
}
