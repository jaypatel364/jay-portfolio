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
  const category = post.categories?.[0]?.title;
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
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {category}
              </span>
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
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/40 transition-colors hover:border-primary/35",
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

      <div className={cn("flex flex-1 flex-col", variant === "compact" ? "p-4" : "p-5 sm:p-6")}>
        {category ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{category}</p>
        ) : null}

        <h2
          className={cn(
            "font-heading font-semibold tracking-tight text-balance text-foreground transition-colors group-hover:text-primary",
            category ? "mt-2" : "mt-0",
            variant === "compact" ? "text-lg" : "text-xl",
          )}
        >
          {post.title}
        </h2>
        {post.excerpt ? (
          <p
            className={cn(
              "mt-2 leading-relaxed text-muted-foreground",
              variant === "compact" ? "line-clamp-2 text-xs" : "line-clamp-3 text-sm",
            )}
          >
            {post.excerpt}
          </p>
        ) : null}

        <BlogPublishedDate
          date={post.publishedAt}
          readingMinutes={post.readingTimeMinutes}
          className="mt-4"
          showLabel={false}
        />

        <div className="mt-auto flex items-center gap-1 pt-5 text-sm font-medium text-primary">
          Read post
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </article>
  );
}
