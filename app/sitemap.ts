import type { MetadataRoute } from "next";
import { buildSitemap } from "@/settings/seo";

/** Generated from `settings/sitemap-urls.json` — edit lastModified per URL there. */
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap();
}
