import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedBlogPosts, getBlogPostsPage } from "@/lib/sanity";
import { BlogPostCard } from "@/components/sections/blog/BlogPostCard";
import { innerPages } from "@/settings/pages";

/** Latest 3 articles pulled from Sanity — shown on the home page. */
export async function HomeLatestArticlesSection() {
  // Try featured first, fall back to latest published
  const featured = await getFeaturedBlogPosts(3);
  const posts =
    featured.length >= 3
      ? featured.slice(0, 3)
      : (await getBlogPostsPage({ page: 1, perPage: 3 })).posts;

  if (!posts.length) return null;

  return (
    <section
      id="latest-articles"
      aria-labelledby="latest-articles-heading"
      className="relative border-t border-border/60 py-20 md:py-24"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-64 max-w-3xl rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              From the blog
            </span>
            <h2
              id="latest-articles-heading"
              className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
            >
              Latest Articles
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              Practical guides and deep dives on React, Next.js, Node.js, and modern web
              architecture.
            </p>
          </div>
          <Link
            href={`${innerPages.blog.path}/`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 bg-card/50 px-4 py-2 text-sm font-semibold text-primary transition-all hover:border-primary/40 hover:bg-primary/[0.07]"
          >
            {innerPages.blog.homeCta}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
