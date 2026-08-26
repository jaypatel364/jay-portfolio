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
  return sanityFetch<BlogSettings>(/* groq */ `*[_type == "blogSettings"][0]{
      title,
      description,
      postsPerPage,
      robotsIndex,
      noindexUntilReady,
      defaultOgImage ${imageProjection},
      seo,
      "featuredPosts": featuredPosts[]->{ ${postCardFields} }
    }`);
}

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

/** Resolve featured strip: Blog Settings picks → posts marked featured → newest. */
export function resolveFeaturedPosts(
  settings: BlogSettings | null,
  posts: BlogPostCard[],
  limit = 2,
): BlogPostCard[] {
  const fromSettings = (settings?.featuredPosts ?? []).filter(Boolean);
  if (fromSettings.length) return fromSettings.slice(0, limit);

  const flagged = posts.filter((p) => p.featured);
  if (flagged.length) return flagged.slice(0, limit);

  return posts.slice(0, Math.min(1, posts.length));
}
