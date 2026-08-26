"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { SiLinkedin, SiX } from "react-icons/si";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type BlogShareBarProps = {
  title: string;
  url: string;
  className?: string;
  compact?: boolean;
};

export function BlogShareBar({ title, url, className, compact }: BlogShareBarProps) {
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
      toast.error("Couldn’t copy link");
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

  const btn =
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {!compact ? (
        <p className="mr-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Share
        </p>
      ) : null}

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Share on X"
      >
        <SiX className="h-3.5 w-3.5" aria-hidden />
        {!compact ? <span>X</span> : null}
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Share on LinkedIn"
      >
        <SiLinkedin className="h-3.5 w-3.5" aria-hidden />
        {!compact ? <span>LinkedIn</span> : null}
      </a>

      <button type="button" onClick={copy} className={btn} aria-label="Copy link">
        {copied ? (
          <Check className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Link2 className="h-3.5 w-3.5" />
        )}
        {!compact ? <span>{copied ? "Copied" : "Copy"}</span> : null}
      </button>

      <button
        type="button"
        onClick={shareNative}
        className={cn(btn, "sm:hidden")}
        aria-label="Share"
      >
        <Share2 className="h-3.5 w-3.5" />
        <span>Share</span>
      </button>
    </div>
  );
}
