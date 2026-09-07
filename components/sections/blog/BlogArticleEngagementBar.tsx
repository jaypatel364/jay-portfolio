"use client";

import { useState } from "react";
import { Check, Heart, Link2, Share2 } from "lucide-react";
import { SiLinkedin, SiX } from "react-icons/si";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type BlogArticleEngagementBarProps = {
  title: string;
  url: string;
  className?: string;
};

export function BlogArticleEngagementBar({ title, url, className }: BlogArticleEngagementBarProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const shareNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await copy();
  };

  const pillBtn =
    "inline-flex h-9 items-center justify-center gap-2 rounded-full border border-border/70 bg-card/40 px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/35 hover:bg-card/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  const iconBtn =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card/40 text-muted-foreground transition-colors hover:border-primary/35 hover:bg-card/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div
      className={cn("mt-10 rounded-2xl border border-border/70 bg-card/50 p-4 sm:p-5", className)}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-center gap-3.5">
          <div
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/25"
            aria-hidden
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
            <Heart className="relative h-5 w-5 fill-primary text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-foreground">
              Found this article helpful?
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
              Your support helps me write more content like this.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
          {/* <button
            type="button"
            onClick={() => setLiked((value) => !value)}
            className={cn(
              pillBtn,
              liked && "border-primary/40 bg-primary/10 text-primary hover:text-primary",
            )}
            aria-pressed={liked}
            aria-label={liked ? "Unlike article" : "Like article"}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-primary text-primary")} aria-hidden />
            <span>{liked ? "Liked" : "Like"}</span>
          </button> */}

          {/* <button type="button" onClick={shareNative} className={pillBtn} aria-label="Share article">
            <Share2 className="h-4 w-4" aria-hidden />
            <span>Share</span>
          </button> */}

          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className={iconBtn}
            aria-label="Share on X"
          >
            <SiX className="h-3.5 w-3.5" aria-hidden />
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={iconBtn}
            aria-label="Share on LinkedIn"
          >
            <SiLinkedin className="h-3.5 w-3.5" aria-hidden />
          </a>

          <button type="button" onClick={copy} className={iconBtn} aria-label="Copy link">
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
            ) : (
              <Link2 className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
