import type { MetadataRoute } from "next";
import { getBlogSitemapEntries } from "@/lib/sanity";
import { features } from "@/settings/features";
import { buildSitemap, pageUrl } from "@/settings/seo";

function toSitemapDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  // Prefer YYYY-MM-DD for sitemap lastmod stability.
  const day = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : undefined;
}

/**
 * Static pages from `settings/sitemap-urls.json` (includes /blog/)
 * plus published, indexable blog posts from Sanity.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = buildSitemap();

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
