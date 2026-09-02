"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { BlogPostCard, BlogSettings, BlogTerm } from "@/lib/sanity/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { BlogIndexToolbar } from "./BlogIndexToolbar";
import { BlogPagination } from "./BlogPagination";
import { BlogPostCard as PostCard } from "./BlogPostCard";

type BlogIndexSectionProps = {
  settings: BlogSettings | null;
  posts: BlogPostCard[];
  featured: BlogPostCard[];
  categories: BlogTerm[];
  totalPublished: number;
  totalResults: number;
  page: number;
  totalPages: number;
  initialCategory?: string | null;
  initialSearch?: string | null;
};

function buildBlogQuery({
  category,
  search,
  page,
}: {
  category: string | null;
  search: string;
  page: number;
}): string {
  const params = new URLSearchParams();
  const trimmedSearch = search.trim();

  if (category) params.set("category", category);
  if (trimmedSearch) params.set("q", trimmedSearch);
  if (page > 1) params.set("page", String(page));

  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

export function BlogIndexSection({
  settings,
  posts,
  featured,
  categories,
  totalPublished,
  totalResults,
  page,
  totalPages,
  initialCategory = null,
  initialSearch = null,
}: BlogIndexSectionProps) {
  const router = useRouter();
  const appliedCategory = initialCategory ?? null;
  const appliedSearch = (initialSearch ?? "").trim();

  const [searchInput, setSearchInput] = useState(appliedSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  const showFeatured = !appliedCategory && !appliedSearch && page === 1 && featured.length > 0;

  // Keep the input in sync when the URL changes (clear, back/forward, category click).
  useEffect(() => {
    setSearchInput(appliedSearch);
  }, [appliedSearch]);

  // Push search to the URL only after typing settles — avoids fighting explicit clears.
  useEffect(() => {
    if (searchInput !== debouncedSearch) return;

    const next = debouncedSearch.trim();
    if (next === appliedSearch) return;

    router.replace(buildBlogQuery({ category: appliedCategory, search: next, page: 1 }), {
      scroll: false,
    });
  }, [searchInput, debouncedSearch, appliedSearch, appliedCategory, router]);

  const navigate = (next: { category: string | null; search: string; page: number }) => {
    router.replace(buildBlogQuery(next), { scroll: false });
  };

  const selectCategory = (slug: string | null) => {
    navigate({ category: slug, search: appliedSearch, page: 1 });
  };

  const clearSearch = () => {
    setSearchInput("");
    navigate({ category: appliedCategory, search: "", page: 1 });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    router.replace("/blog", { scroll: false });
  };

  const buildPageHref = useMemo(
    () => (nextPage: number) =>
      buildBlogQuery({ category: appliedCategory, search: appliedSearch, page: nextPage }),
    [appliedCategory, appliedSearch],
  );

  const hasActiveFilters = Boolean(appliedCategory || appliedSearch);
  const isSearchPending = searchInput.trim() !== appliedSearch;

  return (
    <div className="relative min-w-0 space-y-12 md:space-y-16">
      {showFeatured ? (
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
            Find your next read
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {settings?.description ||
              "Search the archive or filter by topic — engineering notes, deep dives, and production lessons."}
          </p>
        </div>

        <BlogIndexToolbar
          search={searchInput}
          appliedSearch={appliedSearch}
          onSearchChange={setSearchInput}
          onClearSearch={clearSearch}
          isSearchPending={isSearchPending}
          category={appliedCategory}
          categories={categories}
          totalPublished={totalPublished}
          onSelectCategory={selectCategory}
          hasActiveFilters={hasActiveFilters}
          onClearAll={clearAllFilters}
          resultCount={totalResults}
          page={page}
          totalPages={totalPages}
        />

        <AnimatePresence mode="popLayout">
          {posts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-10 rounded-2xl border border-dashed border-border/80 px-6 py-14 text-center"
            >
              {appliedSearch ? (
                <>
                  <p className="font-heading text-lg font-semibold">No matching posts</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try a different search term or clear filters.
                  </p>
                </>
              ) : appliedCategory ? (
                <>
                  <p className="font-heading text-lg font-semibold">No posts in this category</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try another category, or switch back to All.
                  </p>
                </>
              ) : showFeatured ? (
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
              key={`${appliedCategory ?? "all"}-${appliedSearch}-${page}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <BlogPagination page={page} totalPages={totalPages} buildHref={buildPageHref} />
      </section>
    </div>
  );
}
