import type { MetadataRoute } from "next";
import { getBlogSitemapEntries } from "@/lib/sanity";
import { getAllServices } from "@/lib/services";
import { features } from "@/settings/features";
import { normalizeSitemapPath, pageUrl, SITEMAP_URLS, sitemapEntryUrl } from "@/settings/seo";

function toSitemapDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  // Prefer YYYY-MM-DD for sitemap lastmod stability.
  const day = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : undefined;
}

const publishedServiceSlugs = new Set(getAllServices().map((service) => service.slug));

function isPublishedServiceSitemapPath(path: string): boolean {
  const normalized = normalizeSitemapPath(path);
  const match = normalized.match(/^services\/([^/]+)$/);
  if (!match) return true;
  return publishedServiceSlugs.has(match[1]);
}

/**
 * Static pages from `settings/sitemap-urls.json` (includes /blog/)
 * plus published, indexable blog posts from Sanity.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = SITEMAP_URLS.filter(({ path }) =>
    isPublishedServiceSitemapPath(path),
  ).map(({ path, lastModified }) => ({
    url: sitemapEntryUrl(path),
    lastModified,
  }));

  if (!features.allowIndexing) {
    return staticEntries;
  }

  const posts = await getBlogSitemapEntries();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: pageUrl(`blog/${post.slug}`),
    lastModified: toSitemapDate(post.lastModified),
  }));

  return [...staticEntries, ...postEntries];
}
