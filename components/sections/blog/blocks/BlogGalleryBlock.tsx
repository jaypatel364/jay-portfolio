"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { sanityImageUrl } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";

type GalleryImage = {
  alt?: string;
  caption?: string;
  title?: string;
  image?: Parameters<typeof sanityImageUrl>[0];
};

function galleryLabel(item: {
  alt?: string;
  caption?: string;
  title?: string;
  image?: GalleryImage["image"];
}) {
  const title = item.title?.trim() || item.image?.title?.trim() || undefined;
  const caption = item.caption?.trim() || item.image?.caption?.trim() || undefined;
  const alt = item.alt?.trim() || item.image?.alt?.trim() || title || "Gallery image";
  return { title, caption, alt };
}

export function BlogGalleryBlock({
  images,
  layout = "grid",
}: {
  images: GalleryImage[];
  layout?: string;
}) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  const resolved = images
    .map((item) => ({ ...item, url: sanityImageUrl(item.image, 1200) }))
    .filter((item) => item.url);

  if (!resolved.length) return null;

  const isCarousel = layout === "carousel";
  const current = resolved[active] ?? resolved[0];

  if (!isCarousel && resolved.length > 1) {
    return (
      <figure className="mt-10 overflow-hidden rounded-2xl border border-border/70 bg-card/40 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
          <Images className="h-4 w-4 text-primary" aria-hidden />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Gallery · {resolved.length} images
          </span>
        </div>
        <div className="grid gap-3 p-3 sm:grid-cols-2">
          {resolved.map((item, index) => {
            const { title, caption, alt } = galleryLabel(item);
            return (
              <div
                key={index}
                className="group overflow-hidden rounded-xl border border-border/60 bg-muted/20"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.url!}
                    alt={alt}
                    title={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                </div>
                {title || caption ? (
                  <figcaption className="px-3 py-2 text-xs leading-relaxed">
                    {title ? (
                      <span className="block font-medium text-foreground">{title}</span>
                    ) : null}
                    {caption ? (
                      <span className={cn("block text-muted-foreground", title && "mt-0.5")}>
                        {caption}
                      </span>
                    ) : null}
                  </figcaption>
                ) : null}
              </div>
            );
          })}
        </div>
      </figure>
    );
  }

  const prev = () => setActive((i) => (i === 0 ? resolved.length - 1 : i - 1));
  const next = () => setActive((i) => (i === resolved.length - 1 ? 0 : i + 1));

  return (
    <figure className="mt-10 overflow-hidden rounded-2xl border border-border/70 bg-card/40 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Images className="h-4 w-4 text-primary" aria-hidden />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {isCarousel ? "Carousel" : "Gallery"} · {resolved.length} images
          </span>
        </div>
        {isCarousel && resolved.length > 1 ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prev}
              className="rounded-lg border border-border/70 p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-lg border border-border/70 p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="relative aspect-[16/9] bg-muted/20">
        {(() => {
          const { title, caption, alt } = galleryLabel(current);
          return (
            <>
              <Image
                key={current.url}
                src={current.url!}
                alt={alt}
                title={title}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, 720px"
              />
              {title || caption ? (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10 text-sm text-white/90">
                  {title ? <span className="block font-medium text-white">{title}</span> : null}
                  {caption ? (
                    <span className={cn("block text-white/85", title && "mt-0.5")}>{caption}</span>
                  ) : null}
                </figcaption>
              ) : null}
            </>
          );
        })()}
      </div>

      {resolved.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto p-3">
          {resolved.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                active === index
                  ? "border-primary shadow-[0_0_0_1px_var(--primary)]"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={galleryLabel(item).alt || `View image ${index + 1}`}
              aria-pressed={active === index}
            >
              <Image src={item.url!} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      ) : null}
    </figure>
  );
}
