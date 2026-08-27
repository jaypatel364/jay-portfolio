import type { MetadataRoute } from "next";
import { HOME_URL, LAST_UPDATED, pageUrl } from "@/lib/seo";
import { getAllServices } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = LAST_UPDATED;
  const services = getAllServices();

  // Project slug pages (`/work/<slug>/`) stay out of the sitemap — they are noindex.
  return [
    {
      url: HOME_URL,
      lastModified,
    },
    ...(["about", "skills", "work", "services", "contact"] as const).map((slug) => ({
      url: pageUrl(slug),
      lastModified,
    })),
    ...services.map((service) => ({
      url: pageUrl(`services/${service.slug}`),
      lastModified: service.updatedAt ?? lastModified,
    })),
  ];
}
