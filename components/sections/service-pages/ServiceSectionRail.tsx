"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "statement", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "capabilities", label: "Capabilities" },
  { id: "system", label: "System" },
  { id: "process", label: "Process" },
  { id: "faq", label: "FAQ" },
] as const;

/** Full-width horizontal section rail — NOT a blog sidebar TOC. */
export function ServiceSectionRail({ hasWork }: { hasWork: boolean }) {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  const items = hasWork ? SECTIONS : SECTIONS.filter((s) => s.id !== "work");

  useEffect(() => {
    const elements = items
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.15, 0.4] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="sticky top-[4.25rem] z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div
        className={cn(
          "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6",
          "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        role="navigation"
        aria-label="Service page sections"
      >
        {items.map((item) => {
          const selected = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                selected
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
