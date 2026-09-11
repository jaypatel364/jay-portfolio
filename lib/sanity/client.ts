import { createClient, type QueryParams } from "@sanity/client";
import {
  isSanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
} from "./env";
import { BLOG_TAG, BLOG_TTL } from "./cache-tags";

export const sanityClient = isSanityConfigured()
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: true,
      perspective: "published",
      // Token only when present — public dataset can serve published docs without it.
      ...(sanityReadToken ? { token: sanityReadToken } : {}),
    })
  : null;

type FetchOptions = {
  stega?: boolean;
  next?: { revalidate?: number | false; tags?: string[] };
};

/**
 * Centralised Sanity data fetcher with Next.js ISR cache integration.
 *
 * Default cache behaviour (when no `options.next` is provided):
 *   - revalidate: BLOG_TTL.LISTING (30 min) — a safe fallback for any query
 *     that does not supply its own TTL.
 *   - tags: [BLOG_TAG] — broad tag; the Sanity webhook revalidates this on
 *     any blog document change, so the TTL acts as a backstop only.
 *
 * Query-specific overrides are set in lib/sanity/queries.ts using the
 * constants from lib/sanity/cache-tags.ts for consistent, typo-free tags.
 *
 * Caching hierarchy:
 *   Browser / Vercel Edge
 *     ↓ miss
 *   Next.js Data Cache (ISR)
 *     ↓ miss
 *   Sanity API CDN  (useCdn: true)
 *     ↓ miss
 *   Sanity API
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  options: FetchOptions = {},
): Promise<T | null> {
  if (!sanityClient) return null;

  try {
    return await sanityClient.fetch<T>(query, params, {
      stega: options.stega ?? false,
      next: options.next ?? { revalidate: BLOG_TTL.LISTING, tags: [BLOG_TAG] },
    });
  } catch (error) {
    console.error("[sanity] fetch failed", error);
    return null;
  }
}

/** Public blog listing — published only, not scheduled for the future. */
export function blogListFilter(): string {
  return `_type == "post" && defined(slug.current) && status == "published" && defined(publishedAt) && publishedAt <= now()`;
}
