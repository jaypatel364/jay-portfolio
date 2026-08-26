import type { PortableTextBlock } from "@portabletext/types";

export type SanityImageAsset = {
  _id?: string;
  url?: string;
  metadata?: {
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio?: number };
  };
};

export type SanityImage = {
  alt?: string | null;
  caption?: string | null;
  asset?: SanityImageAsset | null;
  hotspot?: { x: number; y: number; height: number; width: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
};

export type SeoFields = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  canonicalPath?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: SanityImage | null;
  ogType?: "article" | "website" | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: SanityImage | null;
  twitterCard?: "summary_large_image" | "summary" | null;
  noIndex?: boolean | null;
  noFollow?: boolean | null;
  disallowAiTraining?: boolean | null;
  keywords?: string[] | null;
  articleSection?: string | null;
  articleTags?: string[] | null;
  schemaType?: "BlogPosting" | "TechArticle" | "HowTo" | null;
  jsonLdExtra?: string | null;
};

export type BlogAuthor = {
  name: string;
  slug?: string | null;
  role?: string | null;
  bio?: string | null;
  avatar?: SanityImage | null;
  sameAs?: string[] | null;
};

export type BlogTerm = {
  title: string;
  slug?: string | null;
  description?: string | null;
  count?: number | null;
};

export type BlogTaxonomy = {
  categories: BlogTerm[];
  tags: BlogTerm[];
};

export type BlogPostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  featured?: boolean | null;
  readingTimeMinutes?: number | null;
  coverImage?: SanityImage | null;
  categories?: BlogTerm[] | null;
  tags?: BlogTerm[] | null;
  seo?: SeoFields | null;
};

export type BlogPost = BlogPostCard & {
  body?: PortableTextBlock[] | null;
  authors?: BlogAuthor[] | null;
  relatedPosts?: BlogPostCard[] | null;
};

export type BlogSettings = {
  title?: string | null;
  description?: string | null;
  postsPerPage?: number | null;
  robotsIndex?: boolean | null;
  noindexUntilReady?: boolean | null;
  defaultOgImage?: SanityImage | null;
  seo?: SeoFields | null;
  featuredPosts?: BlogPostCard[] | null;
};
