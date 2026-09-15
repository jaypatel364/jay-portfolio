import { Calendar, Mail } from "lucide-react";
import { SiteButton } from "@/components/shared";
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
