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

/** Sanitize Sanity `originalFilename` for use as a CDN vanity path segment. */
function toVanityName(filename: string | null | undefined): string | undefined {
  if (!filename?.trim()) return undefined;
  const base = filename.trim().replace(/^.*[\\/]/, "");
  const cleaned = base
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^\.+|\.+$/g, "");
  return cleaned || undefined;
}

export function sanityImageUrl(image: SanityImage | null | undefined, width = 1200): string | null {
  if (!image?.asset) return null;
  try {
    let imageBuilder = urlForImage(image).width(width).auto("format").quality(80);
    const vanity = toVanityName(image.asset.originalFilename);
    if (vanity) imageBuilder = imageBuilder.vanityName(vanity);
    return imageBuilder.url();
  } catch {
    return image.asset.url ?? null;
  }
}
