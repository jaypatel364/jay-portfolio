/**
 * Sanity connection for the blog.
 * Public project id / dataset are safe to expose; read token stays server-only.
 */

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "qvi88ypr";

export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2025-08-01";

/** Viewer token — only needed to read unpublished drafts (`drafts.*`). */
export const sanityReadToken = process.env.SANITY_API_READ_TOKEN?.trim() || "";

export function isSanityConfigured(): boolean {
  return Boolean(sanityProjectId && sanityDataset);
}
