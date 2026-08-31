import type { MetadataRoute } from "next";
import { HOME_URL, LAST_UPDATED, pageUrl } from "@/lib/seo";
import { publishedProjects } from "@/settings/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = LAST_UPDATED;

  return [
    {
      url: HOME_URL,
      lastModified,
    },
    ...(["about", "skills", "work", "contact"] as const).map((slug) => ({
      url: pageUrl(slug),
      lastModified,
    })),
    // All published project write-ups (every slug in PROJECT_DETAILS).
    ...publishedProjects().map((project) => ({
      url: pageUrl(`work/${project.slug}`),
      lastModified,
    })),
  ];
}
