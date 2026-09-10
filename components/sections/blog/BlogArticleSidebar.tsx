import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar, Mail, Sparkles } from "lucide-react";
import { SiteButton } from "@/components/shared";
import { sanityImageUrl } from "@/lib/sanity/image";
import type { BlogPostCard } from "@/lib/sanity/types";
import { siteConfig } from "@/settings";
import { BlogShareBar } from "./BlogShareBar";

/** Widgets stacked under TOC — share, next read, contact. */
export function BlogArticleSidebar({
  title,
  shareUrl,
  nextPost,
}: {
  title: string;
  shareUrl: string;
  nextPost?: BlogPostCard | null;
}) {
  const nextImage = nextPost ? sanityImageUrl(nextPost.coverImage, 480) : null;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card/80 via-card/55 to-primary/[0.06] p-4 shadow-sm backdrop-blur-sm">
        <div
          className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-primary/15 blur-2xl"
          aria-hidden
        />
        <p className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Share article
        </p>
        <BlogShareBar title={title} url={shareUrl} className="relative mt-3" compact />
      </div>

      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}/`}
          className="group relative block overflow-hidden rounded-2xl border border-border/70 bg-card/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-muted/40">
            {nextImage ? (
              <Image
                src={nextImage}
                alt={nextPost.coverImage?.alt || nextPost.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="280px"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 via-transparent to-glow/25" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </div>
          <div className="relative p-4">
            <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-3 w-3" aria-hidden />
              Up next
            </p>
            <p className="font-heading mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
              {nextPost.title}
            </p>
            <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-primary">
              Continue reading
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ) : null}

      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/12 via-card/70 to-glow/15 p-4 shadow-sm">
        <div
          className="pointer-events-none absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-primary/20 blur-2xl"
          aria-hidden
        />
        <p className="relative font-heading text-sm font-bold tracking-tight text-foreground">
          Building something similar?
        </p>
        <p className="relative mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Full-stack freelance help with React, Next.js, and Node.js. Usually reply within 24 hours.
        </p>
        <div className="relative mt-3.5 flex flex-col gap-2">
          <SiteButton href="/contact/" size="sm" className="w-full">
            <Mail className="h-3.5 w-3.5" aria-hidden />
            Start a project
          </SiteButton>
          {siteConfig.bookingUrl ? (
            <SiteButton
              href={siteConfig.bookingUrl}
              external
              variant="secondary"
              size="sm"
              className="w-full"
            >
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              Book a call
            </SiteButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}
