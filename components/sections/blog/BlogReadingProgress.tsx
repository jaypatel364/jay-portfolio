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
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"
      aria-hidden
    >
      <div
        className={cn("h-full origin-left bg-primary transition-[width] duration-150 ease-out")}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
