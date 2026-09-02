import Image from "next/image";
import Link from "next/link";
import { sanityImageUrl } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";

export function BlogImageBlock({
  image,
  alt,
  caption,
  title,
  alignment = "default",
  linkUrl,
}: {
  image?: Parameters<typeof sanityImageUrl>[0];
  alt?: string;
  caption?: string;
  title?: string;
  alignment?: string;
  linkUrl?: string;
}) {
  const url = sanityImageUrl(image, 1400);
  if (!url) return null;

  const figureClass = cn(
    "mt-10 w-full max-w-full min-w-0",
    alignment === "left" && "float-left mr-6 mb-4 max-w-[min(100%,22rem)] clear-left",
    alignment === "right" && "float-right ml-6 mb-4 max-w-[min(100%,22rem)] clear-right",
  );

  const aspectClass = cn(
    alignment === "wide" && "aspect-[21/9]",
    alignment === "full" && "aspect-[2/1] sm:aspect-[21/9]",
    (alignment === "left" || alignment === "right") && "aspect-[4/3]",
    alignment === "default" && "aspect-[16/9]",
  );

  const imageNode = (
    <div
      className={cn(
        "relative w-full max-w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-sm",
        aspectClass,
      )}
    >
      <Image
        src={url}
        alt={alt || title || "Article image"}
        fill
        className="object-cover transition-transform duration-700 hover:scale-[1.02]"
        sizes={
          alignment === "full" || alignment === "wide"
            ? "(max-width: 1024px) 100vw, 720px"
            : alignment === "left" || alignment === "right"
              ? "352px"
              : "(max-width: 768px) 100vw, 720px"
        }
      />
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/5"
        aria-hidden
      />
    </div>
  );

  return (
    <figure className={figureClass}>
      {linkUrl ? (
        <Link href={linkUrl} className="block">
          {imageNode}
        </Link>
      ) : (
        imageNode
      )}
      {caption ? (
        <figcaption className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
