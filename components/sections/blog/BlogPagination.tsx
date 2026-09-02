"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BlogPaginationProps = {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

function pageRange(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i]!;
    const prev = sorted[i - 1];
    if (prev != null && p - prev > 1) result.push("ellipsis");
    result.push(p);
  }
  return result;
}

export function BlogPagination({ page, totalPages, buildHref }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const items = pageRange(page, totalPages);

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="Blog pagination"
    >
      <PaginationLink href={buildHref(page - 1)} disabled={page <= 1} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Previous</span>
      </PaginationLink>

      <div className="flex items-center gap-1">
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-muted-foreground"
              aria-hidden
            >
              …
            </span>
          ) : (
            <PaginationLink
              key={item}
              href={buildHref(item)}
              active={item === page}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </PaginationLink>
          ),
        )}
      </div>

      <PaginationLink
        href={buildHref(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden />
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  children,
  disabled,
  active,
  ...props
}: {
  href: string;
  children: ReactNode;
  disabled?: boolean;
  active?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const className = cn(
    "inline-flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
    active
      ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px] shadow-primary/20"
      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
    disabled && "pointer-events-none opacity-40",
  );

  if (disabled) {
    return (
      <span className={className} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}
