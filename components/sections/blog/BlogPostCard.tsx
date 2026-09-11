import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { sanityImageUrl } from "@/lib/sanity/image";
import type { BlogPostCard } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import { BlogPublishedDate } from "./BlogPublishedDate";

type BlogPostCardProps = {
  post: BlogPostCard;
  variant?: "default" | "featured" | "compact";
  className?: string;
};

export function BlogPostCard({ post, variant = "default", className }: BlogPostCardProps) {
  const imageUrl = sanityImageUrl(post.coverImage, variant === "featured" ? 1400 : 900);
  const category = post.categories?.[0] ?? null;
  const featured = Boolean(post.featured) || variant === "featured";

  if (variant === "featured") {
    return (
      <article
        className={cn(
          "group relative grid min-w-0 overflow-hidden rounded-3xl border border-border/70 bg-card/40 md:grid-cols-[1.15fr_1fr]",
          "transition-colors hover:border-primary/40",
          className,
        )}
      >
        <Link
          href={`/blog/${post.slug}/`}
          className="absolute inset-0 z-10"
          aria-label={post.title}
        />

        <div className="relative min-h-[220px] overflow-hidden bg-muted/40 sm:min-h-[280px]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.coverImage?.alt || post.title}
              fill
              priority
              className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center bg-gradient-to-br from-primary/20 via-transparent to-glow/25" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent md:hidden" />
        </div>

        <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" aria-hidden />
              Featured
            </span>
            {category ? (
              category.slug ? (
                <Link
                  href={`/blog/?category=${category.slug}`}
                  className="relative z-20 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/15"
                >
                  {category.title}
                </Link>
              ) : (
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                  {category.title}
                </span>
              )
            ) : null}
          </div>

          <h2 className="font-heading mt-4 text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
            {post.title}
          </h2>
          {post.excerpt ? (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {post.excerpt}
            </p>
          ) : null}

          <BlogPublishedDate
            date={post.publishedAt}
            readingMinutes={post.readingTimeMinutes}
            className="mt-5"
          />

          <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Read article
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/40",
        "shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-md",
        className,
      )}
    >
      <Link
        href={`/blog/${post.slug}/`}
        className="absolute inset-0 z-10"
        aria-label={post.title}
      />

      <div
        className={cn(
          "relative overflow-hidden bg-muted/40",
          variant === "compact" ? "aspect-[16/9]" : "aspect-[16/10]",
        )}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.coverImage?.alt || post.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 via-transparent to-glow/20 text-sm text-muted-foreground">
            No cover image
          </div>
        )}
        {featured ? (
          <span className="absolute left-3 top-3 z-[1] rounded-full border border-primary/30 bg-background/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur">
            Featured
          </span>
        ) : null}
      </div>

      <div className={cn("flex flex-1 flex-col", variant === "compact" ? "p-4" : "p-4 sm:p-5")}>
        {/* Category pill + plain date */}
        <div className="flex flex-wrap items-center gap-2">
          {category ? (
            category.slug ? (
              <Link
                href={`/blog/?category=${category.slug}`}
                className="relative z-20 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary/15"
              >
                {category.title}
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                {category.title}
              </span>
            )
          ) : null}
          {category && post.publishedAt ? (
            <span className="text-muted-foreground/50" aria-hidden>
              ·
            </span>
          ) : null}
          {post.publishedAt ? (
            <BlogPublishedDate
              date={post.publishedAt}
              className="text-xs text-muted-foreground"
              showLabel={false}
            />
          ) : null}
        </div>

        {/* Title — max 3 lines + reserved height so cards stay equal */}
        <span
          className={cn(
            "font-heading font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary",
            "line-clamp-2",
            // Smaller sizes + reserved 3-line height
            variant === "compact"
              ? "mt-3 text-base leading-snug min-h-[3.25rem]" // ~1.08rem × 3
              : "mt-3 text-md leading-snug min-h-[2.5rem]", // ~1.25rem × 3
          )}
        >
          {post.title}
        </span>

        {/* Description — max 3 lines + reserved height */}
        {post.excerpt ? (
          <p
            className={cn(
              "mt-2 leading-relaxed text-muted-foreground line-clamp-3",
              variant === "compact"
                ? "text-xs min-h-[3.6rem]" // ~1.2rem * 3
                : "text-sm min-h-[4rem]", // ~1.5rem * 3
            )}
          >
            {post.excerpt}
          </p>
        ) : (
          // Keep the reserved space even when there is no excerpt
          <div
            className={cn("mt-2", variant === "compact" ? "min-h-[3.6rem]" : "min-h-[4.5rem]")}
          />
        )}

        {/* CTA pinned to the bottom */}
        <div className="mt-auto flex items-center gap-1 pt-5 text-sm font-medium text-primary">
          Read article
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </article>
  );
}
