/**
 * Blog route copy + SEO helpers (kept out of settings/seo.ts for easy merge).
 * Robots still respect Sanity noIndex / noindexUntilReady when wired for go-live.
 */

import type { Metadata } from "next";
import { BASE_URL, pageUrl, TWITTER_HANDLE } from "@/settings/seo";
import { sanityImageUrl } from "@/lib/sanity/image";
import type { BlogPost, BlogSettings, SeoFields, SanityImage } from "@/lib/sanity/types";

export const blogPage = {
  path: "/blog",
  label: "Blog",
  hero: {
    label: "Blog",
    title: "Notes on full-stack engineering",
    description:
      "Practical write-ups on Next.js, Node.js, and shipping production systems — browse by category.",
    chips: ["Engineering notes", "Browse by category", "Deep dives"],
  },
} as const;

function absoluteUrl(pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${BASE_URL}${path}`;
}

function resolveImage(
  ...images: Array<SanityImage | null | undefined>
): { url: string; alt: string } | null {
  for (const image of images) {
    const url = sanityImageUrl(image, 1200);
    if (url) {
      return { url, alt: image?.alt?.trim() || "Blog image" };
    }
  }
  return null;
}

function robotsFromSeo(
  seo: SeoFields | null | undefined,
  settings: BlogSettings | null | undefined,
): Metadata["robots"] {
  const blocked =
    settings?.noindexUntilReady !== false ||
    settings?.robotsIndex === false ||
    seo?.noIndex !== false;

  const index = !blocked;
  const follow = !(seo?.noFollow ?? false);

  return {
    index,
    follow,
    googleBot: { index, follow },
  };
}

export function blogIndexMetadata(settings: BlogSettings | null): Metadata {
  const seo = settings?.seo;
  const title = seo?.metaTitle || settings?.title || "Blog";
  const description = seo?.metaDescription || settings?.description || blogPage.hero.description;
  const canonical = absoluteUrl(seo?.canonicalPath) || pageUrl("blog");
  const ogImage = resolveImage(seo?.ogImage, settings?.defaultOgImage);

  return {
    title,
    description,
    alternates: { canonical },
    robots: robotsFromSeo(seo, settings),
    openGraph: {
      type: (seo?.ogType as "website" | "article") || "website",
      url: canonical,
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: ogImage
        ? [{ url: ogImage.url, width: 1200, height: 630, alt: ogImage.alt }]
        : undefined,
    },
    twitter: {
      card: seo?.twitterCard || "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: seo?.twitterTitle || seo?.ogTitle || title,
      description: seo?.twitterDescription || seo?.ogDescription || description,
      images: resolveImage(seo?.twitterImage, seo?.ogImage, settings?.defaultOgImage)?.url
        ? [resolveImage(seo?.twitterImage, seo?.ogImage, settings?.defaultOgImage)!.url]
        : undefined,
    },
  };
}

export function blogPostMetadata(post: BlogPost, settings: BlogSettings | null): Metadata {
  const seo = post.seo;
  const title = seo?.metaTitle || post.title;
  const description = seo?.metaDescription || post.excerpt || blogPage.hero.description;
  const canonical = absoluteUrl(seo?.canonicalPath) || pageUrl(`blog/${post.slug}`);
  const ogImage = resolveImage(seo?.ogImage, post.coverImage, settings?.defaultOgImage);

  return {
    title,
    description,
    keywords: seo?.keywords?.filter(Boolean) ?? undefined,
    alternates: { canonical },
    robots: robotsFromSeo(seo, settings),
    openGraph: {
      type: "article",
      url: canonical,
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || post.publishedAt || undefined,
      images: ogImage
        ? [{ url: ogImage.url, width: 1200, height: 630, alt: ogImage.alt }]
        : undefined,
    },
    twitter: {
      card: seo?.twitterCard || "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: seo?.twitterTitle || seo?.ogTitle || title,
      description: seo?.twitterDescription || seo?.ogDescription || description,
      images: resolveImage(
        seo?.twitterImage,
        seo?.ogImage,
        post.coverImage,
        settings?.defaultOgImage,
      )?.url
        ? [
            resolveImage(
              seo?.twitterImage,
              seo?.ogImage,
              post.coverImage,
              settings?.defaultOgImage,
            )!.url,
          ]
        : undefined,
    },
  };
}

export function blogIndexJsonLd(settings: BlogSettings | null, postCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: settings?.seo?.metaTitle || settings?.title || "Blog",
    description:
      settings?.seo?.metaDescription || settings?.description || blogPage.hero.description,
    url: pageUrl("blog"),
    isPartOf: { "@type": "WebSite", name: "Jay Patel", url: `${BASE_URL}/` },
    numberOfItems: postCount,
  };
}

export function blogPostJsonLd(post: BlogPost, settings: BlogSettings | null) {
  const seo = post.seo;
  const image = resolveImage(seo?.ogImage, post.coverImage, settings?.defaultOgImage);
  const authors = (post.authors ?? []).map((author) => ({
    "@type": "Person",
    name: author.name,
    ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
  }));

  return {
    "@context": "https://schema.org",
    "@type": seo?.schemaType || "BlogPosting",
    headline: seo?.metaTitle || post.title,
    description: seo?.metaDescription || post.excerpt || undefined,
    image: image?.url,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: authors.length ? authors : { "@type": "Person", name: "Jay Patel" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl(`blog/${post.slug}`),
    },
    keywords: seo?.keywords ?? seo?.articleTags ?? undefined,
    articleSection: seo?.articleSection || post.categories?.[0]?.title || undefined,
    url: pageUrl(`blog/${post.slug}`),
  };
}

export function blogBreadcrumbJsonLd(parts: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: parts.map((part, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: part.name,
      item: pageUrl(part.path.replace(/^\/+|\/+$/g, "")),
    })),
  };
}
