"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";
import type { TocHeading } from "@/lib/sanity/headings";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (!headings.length) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

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
        "rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary">
        <ListTree className="h-3.5 w-3.5" aria-hidden />
        On this page
      </p>
      {list}
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
