"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BLOG_ARTICLE_BODY_ID, computeArticleBodyScrollPercent } from "@/lib/scroll-progress";

/** Thin reading progress under the fixed navbar — modern blog UX for long posts. */
export function BlogReadingProgress({ targetId = BLOG_ARTICLE_BODY_ID }: { targetId?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setProgress(computeArticleBodyScrollPercent(targetId));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 bg-transparent"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-label="Reading progress"
    >
      <div
        className={cn(
          "h-full origin-left rounded-r-full transition-[width] duration-150 ease-out",
          "bg-gradient-to-r from-primary via-primary to-glow",
          "shadow-[0_0_12px_color-mix(in_oklch,var(--primary)_55%,transparent)]",
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
