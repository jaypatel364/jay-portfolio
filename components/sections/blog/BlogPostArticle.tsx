import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import { sanityImageUrl } from "@/lib/sanity/image";
import { extractToc } from "@/lib/sanity/headings";
import type { BlogPost, BlogPostCard } from "@/lib/sanity/types";
import { pageUrl } from "@/settings/seo";
import { PortableTextBody } from "./PortableTextBody";
import { BlogPostCard as PostCard } from "./BlogPostCard";
import { BlogTableOfContents } from "./BlogTableOfContents";
import { BlogShareBar } from "./BlogShareBar";
import { BlogReadingProgress } from "./BlogReadingProgress";
import { BlogArticleSidebar } from "./BlogArticleSidebar";
import { BlogStickyRail } from "./BlogStickyRail";
import { BlogPublishedDate } from "./BlogPublishedDate";
import { BlogBreadcrumb } from "./BlogBreadcrumb";

export function BlogPostArticle({
  post,
  morePosts,
}: {
  post: BlogPost;
  morePosts: BlogPostCard[];
}) {
  const cover = sanityImageUrl(post.coverImage, 1400);
  const authors = post.authors?.filter(Boolean) ?? [];
  const headings = extractToc(post.body);
  const shareUrl = pageUrl(`blog/${post.slug}`);
  const hasToc = headings.length >= 2;
  const category = post.categories?.[0] ?? null;
  const nextPost = morePosts[0] ?? null;

  return (
    <>
      <BlogReadingProgress />

      <article className="relative min-w-0 pb-24">
        {/* Classic 2-col hero — info left, image right */}
        <header className="relative overflow-hidden border-b border-border/60 pt-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-grid opacity-35" />
            <div
              className="aurora-blob absolute -left-16 top-16 h-56 w-56 bg-primary"
              style={{ animation: "aurora-1 14s ease-in-out infinite" }}
            />
            <div
              className="aurora-blob absolute -right-10 bottom-0 h-48 w-48 bg-glow"
              style={{ animation: "aurora-2 16s ease-in-out infinite" }}
            />
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-6xl px-4 pb-14 sm:px-6 md:pb-16">
            <BlogBreadcrumb post={post} />

            <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-14">
              {/* Left — category / date / title */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {category ? (
                    category.slug ? (
                      <Link
                        href={`/blog/?category=${category.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                      >
                        <FolderOpen className="h-3.5 w-3.5" aria-hidden />
                        {category.title}
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <FolderOpen className="h-3.5 w-3.5" aria-hidden />
                        {category.title}
                      </span>
                    )
                  ) : null}

                  <BlogPublishedDate
                    date={post.publishedAt}
                    readingMinutes={post.readingTimeMinutes}
                  />
                </div>

                <h1 className="font-heading mt-5 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl lg:leading-[1.12]">
                  {post.title}
                </h1>

                {post.excerpt ? (
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {post.excerpt}
                  </p>
                ) : null}
              </div>

              {/* Right — cover image */}
              <div className="min-w-0">
                {cover ? (
                  <figure>
                    <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted/30 shadow-premium sm:aspect-[5/4] lg:aspect-[4/3]">
                      <Image
                        src={cover}
                        alt={post.coverImage?.alt || post.title}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 560px"
                      />
                    </div>
                    {post.coverImage?.caption ? (
                      <figcaption className="mt-2 text-center text-sm text-muted-foreground lg:text-left">
                        {post.coverImage.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-border/70 bg-card/40 text-sm text-muted-foreground">
                    No cover image
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Body + sticky sidebar rail */}
        <div className="relative mx-auto mt-12 w-full min-w-0 max-w-6xl px-4 sm:px-6 lg:mt-16">
          <div className="lg:hidden">
            {hasToc ? <BlogTableOfContents headings={headings} variant="mobile" /> : null}
          </div>

          {/* items-stretch so aside column = article height (sticky end boundary) */}
          <div className="grid min-w-0 items-stretch gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12 xl:gap-14">
            <div className="min-w-0">
              <ArticleBody post={post} shareUrl={shareUrl} authors={authors} />
            </div>

            <aside className="relative hidden min-w-0 lg:block">
              <BlogStickyRail>
                {hasToc ? <BlogTableOfContents headings={headings} variant="desktop" /> : null}
                <BlogArticleSidebar title={post.title} shareUrl={shareUrl} nextPost={nextPost} />
              </BlogStickyRail>
            </aside>
          </div>
        </div>

        {morePosts.length > 0 ? (
          <div className="mx-auto mt-20 w-full max-w-6xl border-t border-border/60 px-4 pt-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Keep reading
                </p>
                <h2 className="font-heading mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {post.relatedPosts?.length ? "Related posts" : "More from the blog"}
                </h2>
              </div>
              <Link
                href="/blog/"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                View all posts
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {morePosts.map((related) => (
                <PostCard key={related._id} post={related} />
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </>
  );
}

function ArticleBody({
  post,
  shareUrl,
  authors,
}: {
  post: BlogPost;
  shareUrl: string;
  authors: NonNullable<BlogPost["authors"]>;
}) {
  const author = authors[0];

  return (
    <div id="blog-article-body" className="min-w-0">
      <PortableTextBody value={post.body} />

      {post.tags?.length ? (
        <ul className="mt-14 flex flex-wrap gap-2 border-t border-border/60 pt-8">
          {post.tags.map((tag) => (
            <li
              key={tag.slug || tag.title}
              className="inline-flex rounded-full border border-border/70 bg-card/40 px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              #{tag.title}
            </li>
          ))}
        </ul>
      ) : null}

      {author ? (
        <aside className="mt-12 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card/80 via-card/40 to-primary/5 p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {sanityImageUrl(author.avatar, 160) ? (
              <Image
                src={sanityImageUrl(author.avatar, 160)!}
                alt={author.avatar?.alt || author.name}
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 font-heading text-xl font-bold text-primary">
                {author.name.slice(0, 1)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Written by
              </p>
              <p className="font-heading mt-1 text-xl font-bold tracking-tight">{author.name}</p>
              {author.role ? (
                <p className="mt-0.5 text-sm text-muted-foreground">{author.role}</p>
              ) : null}
              {author.bio ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{author.bio}</p>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Full-stack developer building production web apps with React, Next.js, and
                  Node.js.
                </p>
              )}
              <Link
                href="/contact/"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Work with {author.name.split(" ")[0]}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </aside>
      ) : null}

      <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
        <p className="min-w-0 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          Found this post helpful? Don&apos;t forget to share it with your network!
        </p>
        <BlogShareBar title={post.title} url={shareUrl} compact className="shrink-0" />
      </div>
    </div>
  );
}
