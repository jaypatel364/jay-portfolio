import { createClient, type QueryParams } from "@sanity/client";
import {
  isSanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
} from "./env";

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

export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  options: FetchOptions = {},
): Promise<T | null> {
  if (!sanityClient) return null;

  try {
    return await sanityClient.fetch<T>(query, params, {
      stega: options.stega ?? false,
      next: options.next ?? { revalidate: 60, tags: ["blog"] },
    });
  } catch (error) {
    console.error("[sanity] fetch failed", error);
    return null;
  }
}

export function blogListFilter(): string {
  return `_type == "post" && defined(slug.current) && defined(publishedAt)`;
}
