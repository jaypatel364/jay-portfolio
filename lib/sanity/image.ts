import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { sanityDataset, sanityProjectId } from "./env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({
  projectId: sanityProjectId,
  dataset: sanityDataset,
});

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

export function sanityImageUrl(image: SanityImage | null | undefined, width = 1200): string | null {
  if (!image?.asset) return null;
  try {
    return urlForImage(image).width(width).auto("format").quality(80).url();
  } catch {
    return image.asset.url ?? null;
  }
}
