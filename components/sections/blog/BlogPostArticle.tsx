import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FolderOpen, Hash } from "lucide-react";
import { SiteButton } from "@/components/shared";
import { sanityImageUrl } from "@/lib/sanity/image";
import { extractToc } from "@/lib/sanity/headings";
import type { BlogAuthor, BlogPost, BlogPostCard } from "@/lib/sanity/types";
import { pageUrl } from "@/settings/seo";
import { PortableTextBody } from "./PortableTextBody";
import { BlogPostCard as PostCard } from "./BlogPostCard";
import { BlogTableOfContents } from "./BlogTableOfContents";
import { BlogArticleEngagementBar } from "./BlogArticleEngagementBar";
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
  const primaryAuthor = authors[0];
  const headings = extractToc(post.body);
  const shareUrl = pageUrl(`blog/${post.slug}`);
  const hasToc = headings.length >= 2;
  const category = post.categories?.[0] ?? null;
  const nextPost = morePosts[0] ?? null;

  return (
    <>
      <BlogReadingProgress />

      <article className="relative min-w-0 pb-24">
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
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-6xl px-4 pb-14 sm:px-6 md:pb-16">
            <BlogBreadcrumb post={post} />

            <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {category ? (
                    category.slug ? (
                      <Link
                        href={`/blog/?category=${category.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-[0_0_20px_-8px_color-mix(in_oklch,var(--primary)_50%,transparent)] transition-colors hover:bg-primary/15"
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

                <h1 className="font-heading mt-5 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                  {post.title}
                </h1>

                {post.excerpt ? (
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {post.excerpt}
                  </p>
                ) : null}

                {primaryAuthor ? <HeroAuthor author={primaryAuthor} /> : null}
              </div>

              <div className="min-w-0">
                {cover ? (
                  <figure>
                    <div className="group relative">
                      <div
                        className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-primary/25 via-transparent to-glow/30 opacity-70 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                        aria-hidden
                      />
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-premium transition-transform duration-500 group-hover:scale-[1.015]">
                        <Image
                          src={cover}
                          alt={post.coverImage?.alt || post.coverImage?.title || post.title}
                          title={post.coverImage?.title?.trim() || undefined}
                          fill
                          priority
                          className="object-contain"
                          sizes="(max-width: 1024px) 100vw, 560px"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent" />
                      </div>
                    </div>
                    {post.coverImage?.caption?.trim() ? (
                      <figcaption className="mt-3 text-center text-sm text-muted-foreground lg:text-left">
                        {post.coverImage.caption.trim()}
                      </figcaption>
                    ) : null}
                  </figure>
                ) : (
                  <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-card/50 to-glow/15 text-sm text-muted-foreground shadow-sm">
                    <div
                      className="pointer-events-none absolute inset-0 bg-grid opacity-40"
                      aria-hidden
                    />
                    <span className="relative">Article cover</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="relative mx-auto mt-12 w-full min-w-0 max-w-6xl px-4 sm:px-6 lg:mt-16">
          <div className="lg:hidden">
            {hasToc ? <BlogTableOfContents headings={headings} variant="mobile" /> : null}
          </div>

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
          <div
            id="blog-related"
            className="relative mx-auto mt-20 w-full max-w-6xl px-4 pt-16 sm:px-6"
          >
            <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent sm:inset-x-6" />
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Keep reading
                </p>
                <h2 className="font-heading mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
                  {post.relatedPosts?.length ? "Related posts" : "More from the blog"}
                </h2>
              </div>
              <Link
                href="/blog/"
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/50 px-3.5 py-1.5 text-sm font-medium text-primary transition-all hover:border-primary/35 hover:bg-primary/[0.07]"
              >
                View all articles
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

function HeroAuthor({ author }: { author: BlogAuthor }) {
  const avatar = sanityImageUrl(author.avatar, 80);

  return (
    <div className="mt-7 flex items-center gap-3">
      {avatar ? (
        <Image
          src={avatar}
          alt={author.avatar?.alt || author.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
          {author.name.slice(0, 1)}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{author.name}</p>
        {author.role ? (
          <p className="text-xs text-muted-foreground">{author.role}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Author</p>
        )}
      </div>
    </div>
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
        <div className="mt-14 border-t border-border/60 pt-8">
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <Hash className="h-3.5 w-3.5 text-primary" aria-hidden />
            Topics
          </p>
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag.slug || tag.title}>
                <span className="inline-flex items-center rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/[0.06] hover:text-foreground">
                  #{tag.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {author ? (
        <aside className="relative mt-12 overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card/95 via-card/75 to-primary/[0.08] p-6 shadow-premium backdrop-blur-sm sm:p-7">
          <div
            className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 left-8 h-36 w-36 rounded-full bg-glow/15 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
            {sanityImageUrl(author.avatar, 160) ? (
              <div className="relative shrink-0">
                <div
                  className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/50 via-primary/20 to-glow/40 opacity-80 blur-[2px]"
                  aria-hidden
                />
                <Image
                  src={sanityImageUrl(author.avatar, 160)!}
                  alt={author.avatar?.alt || author.name}
                  width={72}
                  height={72}
                  className="relative h-[4.5rem] w-[4.5rem] rounded-full object-cover shadow-md ring-2 ring-background"
                />
              </div>
            ) : (
              <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/15 font-heading text-xl font-bold text-primary shadow-[0_10px_30px_-12px_color-mix(in_oklch,var(--primary)_40%,transparent)]">
                {author.name.slice(0, 1)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Written by
              </p>
              <p className="font-heading mt-1.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {author.name}
              </p>
              {author.role ? (
                <p className="mt-1 text-sm font-medium text-muted-foreground">{author.role}</p>
              ) : null}
              {author.bio ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {author.bio}
                </p>
              ) : (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Full-stack developer building production web apps with React, Next.js, and
                  Node.js.
                </p>
              )}
              <SiteButton href="/contact/" size="sm" className="mt-5">
                Work with {author.name.split(" ")[0]}
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </SiteButton>
            </div>
          </div>
        </aside>
      ) : null}

      <BlogArticleEngagementBar title={post.title} url={shareUrl} />
    </div>
  );
}
