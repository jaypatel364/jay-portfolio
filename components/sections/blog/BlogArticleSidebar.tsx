import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar, Mail } from "lucide-react";
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
      <div className="rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur-sm">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Share
        </p>
        <BlogShareBar title={title} url={shareUrl} className="mt-3" compact />
      </div>

      {/* {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}/`}
          className="group block overflow-hidden rounded-2xl border border-border/70 bg-card/50 transition-colors hover:border-primary/35"
        >
          <div className="relative aspect-[16/10] bg-muted/40">
            {nextImage ? (
              <Image
                src={nextImage}
                alt={nextPost.coverImage?.alt || nextPost.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="280px"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 to-glow/20" />
            )}
          </div>
          <div className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Up next
            </p>
            <p className="font-heading mt-1.5 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
              {nextPost.title}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Continue reading
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ) : null} */}

      <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-card/60 to-glow/10 p-4">
        <p className="font-heading text-sm font-bold tracking-tight text-foreground">
          Building something similar?
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Freelance full-stack work — React, Next.js, Node.js. Usually replies within 24 hours.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden />
            Start a project
          </Link>
          {siteConfig.bookingUrl ? (
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/35"
            >
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              Book a call
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
