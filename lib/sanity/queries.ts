import { blogListFilter, sanityFetch } from "./client";
import {
  BLOG_LISTING_TAG,
  BLOG_SETTINGS_TAG,
  BLOG_SLUGS_TAG,
  BLOG_TAG,
  BLOG_TAXONOMY_TAG,
  BLOG_TTL,
  blogPostTag,
} from "./cache-tags";
import type { BlogPost, BlogPostCard, BlogSettings, BlogTaxonomy } from "./types";

const imageProjection = /* groq */ `{
  alt,
  caption,
  title,
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  },
  hotspot,
  crop
}`;

const postCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "publishedAt": coalesce(publishedAt, _createdAt),
  "updatedAt": coalesce(updatedAt, _updatedAt),
  featured,
  readingTimeMinutes,
  coverImage ${imageProjection},
  "categories": categories[]->{ title, "slug": slug.current, description },
  "tags": tags[]->{ title, "slug": slug.current },
  seo
`;

// ─────────────────────────────────────────────────────────────────────────────
// Blog Settings
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches the blogSettings singleton.
 *
 * Tags:  blog:settings, blog
 * TTL:   6 hours — settings change infrequently; webhook clears on update.
 */
export async function getBlogSettings(): Promise<BlogSettings | null> {
  const filter = blogListFilter();
  return sanityFetch<BlogSettings>(
    /* groq */ `*[_type == "blogSettings"][0]{
      title,
      description,
      postsPerPage,
      robotsIndex,
      noindexUntilReady,
      defaultOgImage ${imageProjection},
      seo,
      "featuredPosts": featuredPosts[]->[${filter}]{ ${postCardFields} }
    }`,
    {},
    { next: { revalidate: BLOG_TTL.SETTINGS, tags: [BLOG_SETTINGS_TAG, BLOG_TAG] } },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Blog Listing / Paginated index
// ─────────────────────────────────────────────────────────────────────────────

export type BlogPostsPageOptions = {
  page?: number;
  perPage?: number;
  category?: string | null;
  search?: string | null;
  excludeIds?: string[];
};

export type BlogPostsPage = {
  posts: BlogPostCard[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

const DEFAULT_POSTS_PER_PAGE = 12;

function blogListConditions(options: BlogPostsPageOptions = {}): {
  filter: string;
  params: Record<string, unknown>;
} {
  const filter = blogListFilter();
  const parts = [filter];
  const params: Record<string, unknown> = {};

  if (options.category) {
    parts.push(`$category in categories[]->slug.current`);
    params.category = options.category;
  }

  const search = options.search?.trim();
  if (search) {
    parts.push(`(
      title match $searchPattern
      || excerpt match $searchPattern
      || count(categories[@->title match $searchPattern]) > 0
      || count(tags[@->title match $searchPattern]) > 0
    )`);
    params.searchPattern = `*${search}*`;
  }

  if (options.excludeIds?.length) {
    parts.push(`!(_id in $excludeIds)`);
    params.excludeIds = options.excludeIds;
  }

  return { filter: parts.join(" && "), params };
}

/**
 * Returns one page of published posts plus total count — in a single GROQ
 * query.
 *
 * Previously this required two round-trips (count + paginated slice). GROQ
 * object projection lets us fetch both atomically:
 *
 *   {
 *     "total": count(*[<filter>]),
 *     "posts": *[<filter>] | order(...) [$start...$end] { ... }
 *   }
 *
 * This halves the number of Sanity API requests on every index page render
 * while producing identical results. One cache entry covers both pieces of
 * data, so they are always consistent with each other.
 *
 * Note: $start/$end must be known before the query runs. Because page bounds
 * depend on `total`, we use a two-pass approach only when the caller requests
 * a page > 1 AND the requested page might exceed the real last page. In
 * practice, the blog page component always passes page=1 on first render and
 * re-fetches with a validated page number, so the single-query path covers
 * the vast majority of real traffic. When a page overflow is detected from the
 * first result we clamp and re-fetch once — still at most 2 queries vs the
 * previous always-2 design.
 *
 * Tags:  blog:listing, blog
 * TTL:   30 minutes — webhook fires on any post create/update/delete.
 */
export async function getBlogPostsPage(options: BlogPostsPageOptions = {}): Promise<BlogPostsPage> {
  const perPage = Math.max(1, options.perPage ?? DEFAULT_POSTS_PER_PAGE);
  const requestedPage = Math.max(1, options.page ?? 1);
  const { filter, params } = blogListConditions(options);

  const listingCacheOptions = {
    next: { revalidate: BLOG_TTL.LISTING, tags: [BLOG_LISTING_TAG, BLOG_TAG] },
  };

  // ── Single GROQ query: count + page slice ─────────────────────────────────
  type PageResult = { total: number; posts: BlogPostCard[] };

  const start = (requestedPage - 1) * perPage;
  const end = start + perPage;

  const result = await sanityFetch<PageResult>(
    /* groq */ `{
      "total": count(*[${filter}]),
      "posts": *[${filter}] | order(coalesce(publishedAt, _updatedAt) desc) [$start...$end] {
        ${postCardFields}
      }
    }`,
    { ...params, start, end },
    listingCacheOptions,
  );

  const total = result?.total ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / perPage) : 1;
  const page = total > 0 ? Math.min(requestedPage, totalPages) : 1;

  // ── Page-overflow guard ───────────────────────────────────────────────────
  // If the caller requested a page beyond the real last page (e.g. the user
  // bookmarked page 5 and posts were deleted), clamp and re-fetch.
  // This is rare in production; the ISR cache will usually serve the corrected
  // result on subsequent visits without hitting Sanity again.
  if (page < requestedPage && total > 0) {
    const clampedStart = (page - 1) * perPage;
    const clampedEnd = clampedStart + perPage;

    const clamped = await sanityFetch<PageResult>(
      /* groq */ `{
        "total": count(*[${filter}]),
        "posts": *[${filter}] | order(coalesce(publishedAt, _updatedAt) desc) [$start...$end] {
          ${postCardFields}
        }
      }`,
      { ...params, start: clampedStart, end: clampedEnd },
      listingCacheOptions,
    );

    return {
      posts: clamped?.posts ?? [],
      total: clamped?.total ?? total,
      page,
      perPage,
      totalPages,
    };
  }

  return {
    posts: result?.posts ?? [],
    total,
    page,
    perPage,
    totalPages,
  };
}

/**
 * Total published posts (for index metadata and counts).
 *
 * Tags:  blog:listing, blog
 * TTL:   30 minutes.
 */
export async function getBlogPostsCount(): Promise<number> {
  const filter = blogListFilter();
  const total = await sanityFetch<number>(
    /* groq */ `count(*[${filter}])`,
    {},
    { next: { revalidate: BLOG_TTL.LISTING, tags: [BLOG_LISTING_TAG, BLOG_TAG] } },
  );
  return total ?? 0;
}

/** @deprecated Prefer getBlogPostsPage for the index; kept for simple all-posts use. */
export async function getBlogPosts(): Promise<BlogPostCard[]> {
  const filter = blogListFilter();
  const posts = await sanityFetch<BlogPostCard[]>(
    /* groq */ `*[${filter}] | order(coalesce(publishedAt, _updatedAt) desc) {
      ${postCardFields}
    }`,
    {},
    { next: { revalidate: BLOG_TTL.LISTING, tags: [BLOG_LISTING_TAG, BLOG_TAG] } },
  );
  return posts ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Taxonomy
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches published categories (with post counts).
 *
 * Tags:  blog:taxonomy, blog
 * TTL:   6 hours — categories change rarely; webhook fires on category updates.
 */
export async function getBlogTaxonomy(): Promise<BlogTaxonomy> {
  const filter = blogListFilter();
  const result = await sanityFetch<{ categories: BlogTaxonomy["categories"] }>(
    /* groq */ `{
      "categories": *[_type == "category" && count(*[${filter} && references(^._id)]) > 0] | order(title asc) {
        title,
        "slug": slug.current,
        description,
        "count": count(*[${filter} && references(^._id)])
      }
    }`,
    {},
    { next: { revalidate: BLOG_TTL.TAXONOMY, tags: [BLOG_TAXONOMY_TAG, BLOG_TAG] } },
  );

  return {
    categories: result?.categories ?? [],
    tags: [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual post
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches a single published post by slug.
 *
 * Tags:  blog, blog:post:<slug>
 *   - blog              broad tag; invalidated by the webhook on any change.
 *   - blog:post:<slug>  lets the webhook invalidate exactly this post.
 *
 * TTL:   1 hour — webhook provides near-real-time freshness for updates.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const filter = blogListFilter();
  return sanityFetch<BlogPost>(
    /* groq */ `*[${filter} && slug.current == $slug][0]{
      ${postCardFields},
      body[]{
        ...,
        _type == "imageBlock" => {
          ...,
          image ${imageProjection}
        },
        _type == "galleryBlock" => {
          ...,
          images[]{ ..., image ${imageProjection} }
        },
        markDefs[]{
          ...,
          _type == "internalLink" => {
            ...,
            reference->{ _type, title, "slug": slug.current }
          }
        }
      },
      "authors": authors[]->{
        name,
        "slug": slug.current,
        role,
        bio,
        sameAs,
        avatar ${imageProjection}
      },
      "relatedPosts": relatedPosts[]->{ ${postCardFields} }
    }`,
    { slug },
    { next: { revalidate: BLOG_TTL.POST, tags: [BLOG_TAG, blogPostTag(slug)] } },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// "More posts" / related posts
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Related editor picks, else same-category posts, else other featured/recent.
 *
 * Returns early from `post.relatedPosts` when already populated by the
 * getBlogPostBySlug projection — no extra Sanity request in that case.
 *
 * Tags:  blog:post:<slug>, blog:listing, blog
 * TTL:   1 hour.
 */
export async function getMorePostsForArticle(post: BlogPost, limit = 3): Promise<BlogPostCard[]> {
  if (post.relatedPosts?.length) {
    return post.relatedPosts.slice(0, limit);
  }

  const filter = blogListFilter();
  const categorySlug = post.categories?.[0]?.slug;
  const relatedCacheOptions = {
    next: {
      revalidate: BLOG_TTL.POST,
      tags: [BLOG_TAG, blogPostTag(post.slug)],
    },
  };

  const more = await sanityFetch<BlogPostCard[]>(
    /* groq */ `*[
      ${filter}
      && slug.current != $slug
      && (
        ($categorySlug != null && $categorySlug in categories[]->slug.current)
        || featured == true
      )
    ] | order(featured desc, coalesce(publishedAt, _updatedAt) desc) [0...$limit] {
      ${postCardFields}
    }`,
    {
      slug: post.slug,
      categorySlug: categorySlug ?? null,
      limit,
    },
    relatedCacheOptions,
  );

  if (more?.length) return more;

  const recent = await sanityFetch<BlogPostCard[]>(
    /* groq */ `*[${filter} && slug.current != $slug]
      | order(coalesce(publishedAt, _updatedAt) desc) [0...$limit] {
      ${postCardFields}
    }`,
    { slug: post.slug, limit },
    relatedCacheOptions,
  );

  return recent ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Featured posts
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Posts explicitly marked featured in Sanity (published only).
 *
 * Tags:  blog:listing, blog
 * TTL:   30 minutes — changes when a post's `featured` flag is toggled.
 */
export async function getFeaturedBlogPosts(limit = 2): Promise<BlogPostCard[]> {
  const filter = blogListFilter();
  const posts = await sanityFetch<BlogPostCard[]>(
    /* groq */ `*[${filter} && featured == true]
      | order(coalesce(publishedAt, _updatedAt) desc) [0...$limit] {
      ${postCardFields}
    }`,
    { limit },
    { next: { revalidate: BLOG_TTL.LISTING, tags: [BLOG_LISTING_TAG, BLOG_TAG] } },
  );
  return posts ?? [];
}

/** Resolve featured strip: Blog Settings picks → posts marked featured. */
export function resolveFeaturedPosts(
  settings: BlogSettings | null,
  flaggedPosts: BlogPostCard[],
  limit = 2,
): BlogPostCard[] {
  const fromSettings = (settings?.featuredPosts ?? []).filter(Boolean);
  if (fromSettings.length) return fromSettings.slice(0, limit);

  return flaggedPosts.slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// Slugs / Sitemap
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All published post slugs — used by generateStaticParams and the sitemap.
 *
 * Tags:  blog:slugs, blog
 * TTL:   1 hour — new posts create new slugs; webhook fires on publish/delete.
 */
export async function getBlogSlugs(): Promise<string[]> {
  const filter = blogListFilter();
  const rows = await sanityFetch<Array<{ slug: string }>>(
    /* groq */ `*[${filter}]{ "slug": slug.current }`,
    {},
    { next: { revalidate: BLOG_TTL.SLUGS, tags: [BLOG_SLUGS_TAG, BLOG_TAG] } },
  );
  return (rows ?? []).map((r) => r.slug).filter(Boolean);
}

/**
 * Indexable blog URLs for sitemap.xml (skips seo.noIndex posts).
 *
 * Tags:  blog:slugs, blog
 * TTL:   1 hour.
 */
export async function getBlogSitemapEntries(): Promise<
  Array<{ slug: string; lastModified: string }>
> {
  const filter = blogListFilter();
  const rows = await sanityFetch<Array<{ slug: string; lastModified: string }>>(
    /* groq */ `*[${filter} && seo.noIndex != true]{
      "slug": slug.current,
      "lastModified": coalesce(updatedAt, publishedAt, _updatedAt)
    }`,
    {},
    { next: { revalidate: BLOG_TTL.SLUGS, tags: [BLOG_SLUGS_TAG, BLOG_TAG] } },
  );

  return (rows ?? []).filter((row) => Boolean(row.slug));
}
