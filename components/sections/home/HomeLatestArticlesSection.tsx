import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedBlogPosts, getBlogPostsPage } from "@/lib/sanity";
import { BlogPostCard } from "@/components/sections/blog/BlogPostCard";
import { SectionHeading } from "@/components/shared";
import { PAGE_CONTAINER } from "@/components/shared/page-container";
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

      <div className={PAGE_CONTAINER}>
        <SectionHeading
          label="From the blog"
          title="Latest Articles"
          titleId="latest-articles-heading"
        />
        <p className="mx-auto mt-3 max-w-xl text-center text-base leading-relaxed text-muted-foreground">
          Practical guides and deep dives on React, Next.js, Node.js, and modern web architecture.
        </p>

        {/* Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>

        {/* View all CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href={`${innerPages.blog.path}/`}
            className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            View all articles
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
