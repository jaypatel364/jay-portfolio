"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, Hash } from "lucide-react";
import type { BlogPostCard, BlogSettings, BlogTerm } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import { BlogPostCard as PostCard } from "./BlogPostCard";

type BlogIndexSectionProps = {
  settings: BlogSettings | null;
  posts: BlogPostCard[];
  featured: BlogPostCard[];
  categories: BlogTerm[];
  initialCategory?: string | null;
};

export function BlogIndexSection({
  settings,
  posts,
  featured,
  categories,
  initialCategory = null,
}: BlogIndexSectionProps) {
  const router = useRouter();
  const [category, setCategory] = useState<string | null>(initialCategory);

  const featuredIds = useMemo(() => new Set(featured.map((p) => p._id)), [featured]);

  const filtered = useMemo(() => {
    if (!category) return posts;
    return posts.filter((post) => post.categories?.some((c) => c.slug === category));
  }, [posts, category]);

  const gridPosts = useMemo(() => {
    if (category) return filtered;
    return filtered.filter((p) => !featuredIds.has(p._id) || featured.length === 0);
  }, [filtered, featuredIds, featured.length, category]);

  const selectCategory = (slug: string | null) => {
    setCategory(slug);
    const qs = slug ? `?category=${encodeURIComponent(slug)}` : "";
    router.replace(`/blog/${qs}`, { scroll: false });
  };

  return (
    <div className="relative min-w-0 space-y-12 md:space-y-16">
      {!category && featured.length > 0 ? (
        <section aria-labelledby="blog-featured-heading">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Featured
              </p>
              <h2
                id="blog-featured-heading"
                className="font-heading mt-1 text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Start here
              </h2>
            </div>
            <p className="hidden text-sm text-muted-foreground sm:block">
              Editor picks from the engineering notes.
            </p>
          </div>
          <div className="grid gap-6">
            {featured.map((post) => (
              <PostCard key={post._id} post={post} variant="featured" />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="blog-posts-heading">
        <div className="pointer-events-none absolute inset-x-0 top-[40%] -z-10 mx-auto h-64 max-w-3xl rounded-full bg-primary/5 blur-3xl" />

        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {settings?.title || "All posts"}
          </span>
          <h2
            id="blog-posts-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            Browse by category
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {settings?.description ||
              "Filter by Engineering, Frontend, Backend, and more — same control pattern as Work."}
          </p>
        </div>

        <div className="sticky top-20 z-20 mt-8 flex w-full min-w-0 flex-col items-center gap-3 sm:mt-10">
          <div
            className={cn(
              "flex w-full min-w-0 max-w-full items-center gap-0.5 overflow-x-auto rounded-2xl border border-border/70 bg-card/90 p-1.5 shadow-sm backdrop-blur-md",
              "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
            role="tablist"
            aria-label="Filter posts by category"
          >
            <FilterTab
              label="All"
              icon={Boxes}
              selected={!category}
              count={posts.length}
              layoutId="blog-category-active"
              onClick={() => selectCategory(null)}
            />
            {categories.map((item) => (
              <FilterTab
                key={item.slug || item.title}
                label={item.title}
                icon={Hash}
                selected={category === item.slug}
                count={item.count ?? 0}
                layoutId="blog-category-active"
                onClick={() => selectCategory(item.slug || null)}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {gridPosts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-10 rounded-2xl border border-dashed border-border/80 px-6 py-14 text-center"
            >
              {category ? (
                <>
                  <p className="font-heading text-lg font-semibold">No posts in this category</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try another category, or switch back to All.
                  </p>
                </>
              ) : featured.length > 0 ? (
                <>
                  <p className="font-heading text-lg font-semibold">More posts coming soon</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The featured piece above is live — new notes will land in this grid.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-heading text-lg font-semibold">No posts yet</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Publish a post in Sanity and refresh.
                  </p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={category ?? "all"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {gridPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

function FilterTab({
  label,
  icon: Icon,
  selected,
  count,
  layoutId,
  onClick,
}: {
  label: string;
  icon: typeof Boxes;
  selected: boolean;
  count: number;
  layoutId: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        "relative inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        selected ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {selected && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 rounded-xl bg-primary/10 shadow-[inset_0_0_0_1px] shadow-primary/20"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      )}
      <Icon className="relative z-10 h-3.5 w-3.5" aria-hidden />
      <span className="relative z-10">{label}</span>
      <span
        className={cn(
          "relative z-10 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
          selected ? "bg-primary/15 text-primary" : "bg-muted/80 text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}
