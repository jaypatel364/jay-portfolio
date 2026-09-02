import { blogListFilter, sanityFetch } from "./client";
import type { BlogPost, BlogPostCard, BlogSettings, BlogTaxonomy } from "./types";

const imageProjection = /* groq */ `{
  alt,
  caption,
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

export async function getBlogSettings(): Promise<BlogSettings | null> {
  const filter = blogListFilter();
  return sanityFetch<BlogSettings>(/* groq */ `*[_type == "blogSettings"][0]{
      title,
      description,
      postsPerPage,
      robotsIndex,
      noindexUntilReady,
      defaultOgImage ${imageProjection},
      seo,
      "featuredPosts": featuredPosts[]->[${filter}]{ ${postCardFields} }
    }`);
}

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

export async function getBlogPostsPage(options: BlogPostsPageOptions = {}): Promise<BlogPostsPage> {
  const perPage = Math.max(1, options.perPage ?? DEFAULT_POSTS_PER_PAGE);
  const requestedPage = Math.max(1, options.page ?? 1);
  const { filter, params } = blogListConditions(options);

  const total = (await sanityFetch<number>(/* groq */ `count(*[${filter}])`, params)) ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / perPage) : 1;
  const page = total > 0 ? Math.min(requestedPage, totalPages) : 1;

  const posts = await sanityFetch<BlogPostCard[]>(
    /* groq */ `*[${filter}] | order(coalesce(publishedAt, _updatedAt) desc) [$start...$end] {
        ${postCardFields}
      }`,
    {
      ...params,
      start: (page - 1) * perPage,
      end: (page - 1) * perPage + perPage,
    },
  );

  return {
    posts: posts ?? [],
    total,
    page,
    perPage,
    totalPages,
  };
}

/** Total published posts (for index metadata and counts). */
export async function getBlogPostsCount(): Promise<number> {
  const filter = blogListFilter();
  const total = await sanityFetch<number>(/* groq */ `count(*[${filter}])`);
  return total ?? 0;
}

/** @deprecated Prefer getBlogPostsPage for the index; kept for simple all-posts use. */
export async function getBlogPosts(): Promise<BlogPostCard[]> {
  const filter = blogListFilter();
  const posts = await sanityFetch<
    BlogPostCard[]
  >(/* groq */ `*[${filter}] | order(coalesce(publishedAt, _updatedAt) desc) {
      ${postCardFields}
    }`);
  return posts ?? [];
}

export async function getBlogTaxonomy(): Promise<BlogTaxonomy> {
  const filter = blogListFilter();
  const result = await sanityFetch<{ categories: BlogTaxonomy["categories"] }>(/* groq */ `{
      "categories": *[_type == "category" && count(*[${filter} && references(^._id)]) > 0] | order(title asc) {
        title,
        "slug": slug.current,
        description,
        "count": count(*[${filter} && references(^._id)])
      }
    }`);

  return {
    categories: result?.categories ?? [],
    tags: [],
  };
}

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
  );
}

/** Related editor picks, else same category, else other featured/recent. */
export async function getMorePostsForArticle(post: BlogPost, limit = 3): Promise<BlogPostCard[]> {
  if (post.relatedPosts?.length) {
    return post.relatedPosts.slice(0, limit);
  }

  const filter = blogListFilter();
  const categorySlug = post.categories?.[0]?.slug;

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
  );

  if (more?.length) return more;

  const recent = await sanityFetch<BlogPostCard[]>(
    /* groq */ `*[${filter} && slug.current != $slug]
      | order(coalesce(publishedAt, _updatedAt) desc) [0...$limit] {
      ${postCardFields}
    }`,
    { slug: post.slug, limit },
  );

  return recent ?? [];
}

export async function getBlogSlugs(): Promise<string[]> {
  const filter = blogListFilter();
  const rows = await sanityFetch<Array<{ slug: string }>>(
    /* groq */ `*[${filter}]{ "slug": slug.current }`,
    {},
    { next: { revalidate: 300, tags: ["blog"] } },
  );
  return (rows ?? []).map((r) => r.slug).filter(Boolean);
}

/** Posts explicitly marked featured in Sanity (published only). */
export async function getFeaturedBlogPosts(limit = 2): Promise<BlogPostCard[]> {
  const filter = blogListFilter();
  const posts = await sanityFetch<BlogPostCard[]>(
    /* groq */ `*[${filter} && featured == true]
      | order(coalesce(publishedAt, _updatedAt) desc) [0...$limit] {
      ${postCardFields}
    }`,
    { limit },
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
