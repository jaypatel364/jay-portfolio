"use client";

import { motion } from "framer-motion";
import { Boxes, Hash, Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import type { BlogTerm } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

type BlogIndexToolbarProps = {
  search: string;
  appliedSearch: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  isSearchPending: boolean;
  category: string | null;
  categories: BlogTerm[];
  totalPublished: number;
  onSelectCategory: (slug: string | null) => void;
  hasActiveFilters: boolean;
  onClearAll: () => void;
  resultCount: number;
  page: number;
  totalPages: number;
};

export function BlogIndexToolbar({
  search,
  appliedSearch,
  onSearchChange,
  onClearSearch,
  isSearchPending,
  category,
  categories,
  totalPublished,
  onSelectCategory,
  hasActiveFilters,
  onClearAll,
  resultCount,
  page,
  totalPages,
}: BlogIndexToolbarProps) {
  const activeCategoryLabel =
    category == null ? null : categories.find((c) => c.slug === category)?.title;

  const showClearSearch = search.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 sm:mt-10"
    >
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/60 shadow-premium backdrop-blur-sm">
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Search className="h-4 w-4" aria-hidden />
          </span>

          <div className="min-w-0 flex-1">
            <label htmlFor="blog-search" className="sr-only">
              Search blog posts
            </label>
            <input
              id="blog-search"
              type="text"
              role="searchbox"
              enterKeyHint="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by title, topic, or keyword…"
              autoComplete="off"
              className={cn(
                "w-full bg-transparent text-sm text-foreground outline-none sm:text-base",
                "placeholder:text-muted-foreground/75",
              )}
            />
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center">
            {isSearchPending ? (
              <Loader2
                className="h-4 w-4 animate-spin text-muted-foreground"
                aria-label="Searching"
              />
            ) : showClearSearch ? (
              <button
                type="button"
                onClick={onClearSearch}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-muted/40 text-muted-foreground transition-colors hover:border-primary/25 hover:bg-primary/5 hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-widest">Categories</p>
          </div>

          <div
            className={cn(
              "flex gap-2",
              "flex-wrap justify-start",
              "max-sm:-mx-1 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-1 max-sm:pb-1",
              "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
            role="tablist"
            aria-label="Filter posts by category"
          >
            <CategoryPill
              label="All"
              icon={Boxes}
              count={totalPublished}
              selected={!category}
              onClick={() => onSelectCategory(null)}
            />
            {categories.map((item) => (
              <CategoryPill
                key={item.slug || item.title}
                label={item.title}
                icon={Hash}
                count={item.count ?? 0}
                selected={category === item.slug}
                onClick={() => onSelectCategory(item.slug || null)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-semibold tabular-nums text-foreground">{resultCount}</span>{" "}
          {resultCount === 1 ? "post" : "posts"}
          {totalPages > 1 ? (
            <>
              {" "}
              · page <span className="font-medium tabular-nums text-foreground">
                {page}
              </span> of{" "}
              <span className="font-medium tabular-nums text-foreground">{totalPages}</span>
            </>
          ) : null}
          {activeCategoryLabel ? (
            <>
              {" "}
              in <span className="font-medium text-foreground">{activeCategoryLabel}</span>
            </>
          ) : null}
          {appliedSearch ? (
            <>
              {" "}
              matching{" "}
              <span className="font-medium text-foreground">&ldquo;{appliedSearch}&rdquo;</span>
            </>
          ) : null}
        </p>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Clear all
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}

function CategoryPill({
  label,
  icon: Icon,
  count,
  selected,
  onClick,
}: {
  label: string;
  icon: typeof Boxes;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-primary/35 bg-primary/10 text-primary shadow-[inset_0_0_0_1px] shadow-primary/15"
          : "border-border/70 bg-muted/25 text-muted-foreground hover:border-primary/20 hover:bg-card hover:text-foreground",
      )}
    >
      <Icon className="h-3.5 w-3.5 opacity-80" aria-hidden />
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
          selected ? "bg-primary/15 text-primary" : "bg-background/80 text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}
