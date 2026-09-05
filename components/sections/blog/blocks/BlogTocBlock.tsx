"use client";

import { ListTree } from "lucide-react";
import { extractArticleHeadings } from "@/lib/sanity/headings";
import { useBlogBody } from "../BlogBodyContext";
import { cn } from "@/lib/utils";

export function BlogTocBlock({
  title = "On this page",
  includeH2 = true,
  includeH3 = true,
  includeH4 = false,
}: {
  title?: string;
  includeH2?: boolean;
  includeH3?: boolean;
  includeH4?: boolean;
}) {
  const body = useBlogBody();
  const allHeadings = extractArticleHeadings(body ?? undefined);

  const headings = allHeadings.filter((h) => {
    if (h.level === 2) return includeH2;
    if (h.level === 3) return includeH3;
    if (h.level === 4) return includeH4;
    return false;
  });

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label={title}
      className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-card/50 shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <ListTree className="h-4 w-4 text-primary" aria-hidden />
        <p className="font-heading text-sm font-semibold tracking-tight text-foreground">{title}</p>
      </div>
      <ol className="space-y-1 px-3 py-3">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/8 hover:text-primary",
                heading.level === 3 && "pl-6 text-[13px]",
                heading.level === 4 && "pl-9 text-[12px]",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
