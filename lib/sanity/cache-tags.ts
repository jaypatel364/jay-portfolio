/**
 * Centralised cache-tag definitions for the Sanity blog.
 *
 * Using string constants instead of ad-hoc literals means:
 *  - A typo is a type-error, not a silent cache miss.
 *  - The webhook and the queries always agree on the exact tag name.
 *  - Renaming a tag is a single-place change.
 *
 * Tag hierarchy
 * ─────────────
 *  blog                  – broad: invalidates every blog-related cache entry.
 *  blog:listing          – the paginated post list / index page.
 *  blog:post:<slug>      – one individual post by its slug.
 *  blog:taxonomy         – categories / tags used for filtering.
 *  blog:settings         – blogSettings singleton.
 *  blog:slugs            – the list of all published slugs (generateStaticParams, sitemap).
 */

export const BLOG_TAG = "blog" as const;
export const BLOG_LISTING_TAG = "blog:listing" as const;
export const BLOG_TAXONOMY_TAG = "blog:taxonomy" as const;
export const BLOG_SETTINGS_TAG = "blog:settings" as const;
export const BLOG_SLUGS_TAG = "blog:slugs" as const;

/** Returns the per-post cache tag for a given slug, e.g. `"blog:post:my-post"`. */
export function blogPostTag(slug: string): string {
  return `blog:post:${slug}`;
}

/**
 * Cache TTLs (seconds).
 *
 * The Sanity webhook provides near-real-time freshness for publish/update/delete
 * events, so these values are intentionally conservative rather than tight.
 * They act as a backstop, not as the primary freshness mechanism.
 */
export const BLOG_TTL = {
  /** Individual post body, metadata — 1 hour. */
  POST: 60 * 60,
  /** Paginated listing, featured strip, count — 30 minutes. */
  LISTING: 30 * 60,
  /** Category / tag taxonomy — 6 hours (rarely changes). */
  TAXONOMY: 6 * 60 * 60,
  /** blogSettings singleton — 6 hours. */
  SETTINGS: 6 * 60 * 60,
  /** All published slugs for generateStaticParams / sitemap — 1 hour. */
  SLUGS: 60 * 60,
} as const;
