"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { ListTree } from "lucide-react";
import type { TocHeading } from "@/lib/sanity/headings";
import { cn } from "@/lib/utils";

/** Matches `scroll-mt-28` on article headings (fixed navbar clearance). */
const SCROLL_OFFSET = 112;

function activeHeadingId(headings: TocHeading[]): string {
  if (!headings.length) return "";

  let current = headings[0].id;
  for (const heading of headings) {
    const el = document.getElementById(heading.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= SCROLL_OFFSET + 4) {
      current = heading.id;
    }
  }
  return current;
}

/**
 * “On this page” nav for long technical posts.
 * Sticky behavior is owned by the parent sidebar column.
 */
export function BlogTableOfContents({
  headings,
  variant = "auto",
  className,
}: {
  headings: TocHeading[];
  variant?: "auto" | "mobile" | "desktop";
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");
  const clickLockRef = useRef<string | null>(null);

  const syncActiveFromScroll = useCallback(() => {
    if (clickLockRef.current) {
      setActiveId(clickLockRef.current);
      return;
    }
    setActiveId(activeHeadingId(headings));
  }, [headings]);

  useEffect(() => {
    if (!headings.length) return;

    syncActiveFromScroll();
    window.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    window.addEventListener("resize", syncActiveFromScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", syncActiveFromScroll);
      window.removeEventListener("resize", syncActiveFromScroll);
    };
  }, [headings, syncActiveFromScroll]);

  const handleHeadingClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    clickLockRef.current = id;
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      clickLockRef.current = null;
      syncActiveFromScroll();
    }, 700);
  };

  if (headings.length < 2) return null;

  const list = (
    <nav aria-label="Table of contents">
      <ol className="relative space-y-0.5 border-l border-border/70">
        {headings.map((heading) => {
          const active = activeId === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(event) => handleHeadingClick(event, heading.id)}
                className={cn(
                  "relative block border-l-2 py-2 text-[13px] leading-snug transition-colors",
                  heading.level === 3 ? "pl-5" : "pl-3.5",
                  active
                    ? "-ml-px border-primary font-semibold text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  const mobile = (
    <details
      className={cn(
        "group mb-8 overflow-hidden rounded-2xl border border-border/70 bg-card/60 open:bg-card/90",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3.5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
        <ListTree className="h-4 w-4 text-primary" aria-hidden />
        On this page
        <span className="ml-auto rounded-full bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {headings.length}
        </span>
      </summary>
      <div className="border-t border-border/60 px-4 py-3">{list}</div>
    </details>
  );

  const desktop = (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <p className="mb-3 flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary">
        <ListTree className="h-3.5 w-3.5" aria-hidden />
        On this page
      </p>
      <div
        className="min-h-0 max-h-82 overflow-y-auto overscroll-contain pr-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}
      >
        {list}
      </div>
    </div>
  );

  if (variant === "mobile") return mobile;
  if (variant === "desktop") return desktop;

  return (
    <>
      <div className="lg:hidden">{mobile}</div>
      <div className="hidden lg:block">{desktop}</div>
    </>
  );
}
