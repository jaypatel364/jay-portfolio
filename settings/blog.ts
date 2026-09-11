/**
 * Blog route copy + SEO helpers (kept out of settings/seo.ts for easy merge).
 * Indexing: site `allowIndexing` is the master switch; Sanity flags are explicit opt-outs.
 */

import type { Metadata } from "next";
import {
  BASE_URL,
  HOME_URL,
  OG_LOGO,
  OG_LOGO_URL,
  pageUrl,
  personJsonLd,
  TWITTER_HANDLE,
} from "@/settings/seo";
import { siteConfig } from "@/settings";
import { sanityImageUrl } from "@/lib/sanity/image";
import type { BlogPost, BlogSettings, SeoFields, SanityImage } from "@/lib/sanity/types";

export const blogPage = {
  path: "/blog",
  label: "Blog",
  hero: {
    label: "Blog",
    title: "Web Development Insights & Practical Guides",
    description:
      "Practical guides and in-depth tutorials on React, Next.js, Node.js, TypeScript, backend development, APIs, performance, and modern web architecture. Learn how to choose the right tools, build scalable applications, and solve real-world development problems.",
    chips: ["Web Development", "Practical Tutorials", "Engineering Deep Dives"],
  },
} as const;

function absoluteUrl(pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${BASE_URL}${path}`;
}

function resolveImage(...images: Array<SanityImage | null | undefined>): {
  url: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
} | null {
  for (const image of images) {
    const url = sanityImageUrl(image, 1200);
    if (url) {
      const dims = image?.asset?.metadata?.dimensions;
      return {
        url,
        alt: image?.alt?.trim() || image?.title?.trim() || "Blog image",
        title: image?.title?.trim() || undefined,
        width: dims?.width,
        height: dims?.height,
      };
    }
  }
  return null;
}

function personRef(opts?: { url?: string; sameAs?: string[] }) {
  return {
    "@type": "Person" as const,
    "@id": `${HOME_URL}#person`,
    name: siteConfig.fullName,
    url: opts?.url ?? HOME_URL,
    ...(opts?.sameAs?.length ? { sameAs: opts.sameAs } : {}),
  };
}

function websiteRef() {
  return {
    "@type": "WebSite" as const,
    "@id": `${HOME_URL}#website`,
    name: `${siteConfig.fullName} — Portfolio`,
    url: HOME_URL,
  };
}

/** Google Article rich results expect an Organization publisher with a logo. */
function publisherOrg() {
  return {
    "@type": "Organization" as const,
    "@id": `${HOME_URL}#organization`,
    name: siteConfig.fullName,
    url: HOME_URL,
    logo: {
      "@type": "ImageObject" as const,
      "@id": `${HOME_URL}#logo`,
      url: OG_LOGO_URL,
      contentUrl: OG_LOGO_URL,
      width: OG_LOGO.width,
      height: OG_LOGO.height,
      caption: OG_LOGO.alt,
    },
  };
}

function schemaFragment(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function toIsoDateTime(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  // Sanity datetimes are usually full ISO; date-only fails some validators.
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return `${trimmed}T00:00:00+05:30`;
  return trimmed;
}

/** Google recommends concise headlines (long titles may truncate). */
function articleHeadline(title: string) {
  const trimmed = title.trim();
  if (trimmed.length <= 110) return trimmed;
  return `${trimmed.slice(0, 107).trimEnd()}...`;
}

type FaqQa = { question: string; answer: string };

function normalizeFaqItems(
  items: Array<{ question?: string | null; answer?: string | null }> | null | undefined,
): FaqQa[] {
  const out: FaqQa[] = [];
  for (const item of items ?? []) {
    const question = item.question?.trim();
    const answer = item.answer?.trim();
    if (question && answer) out.push({ question, answer });
  }
  return out;
}

/** Pull visible FAQ Q&A from Portable Text faqBlock nodes. */
export function extractBlogFaqItems(post: BlogPost): FaqQa[] {
  const body = post.body ?? [];
  const items: FaqQa[] = [];

  for (const block of body) {
    const node = block as {
      _type?: string;
      items?: Array<{ question?: string | null; answer?: string | null }>;
    };
    if (node._type !== "faqBlock") continue;
    items.push(...normalizeFaqItems(node.items));
  }

  return items;
}

/**
 * Resolve FAQ Q&A for JSON-LD.
 * Honors Studio `seo.structuredData` FAQPage `enabled` toggle:
 * - all FAQPage entries disabled → no schema
 * - enabled → prefer synced `faqItems`, else visible body faqBlock
 * - no FAQPage entry → fall back to body faqBlock (if any)
 */
export function resolveBlogFaqItems(post: BlogPost): FaqQa[] {
  const faqEntries = (post.seo?.structuredData ?? []).filter(
    (entry) => entry?.schemaType === "FAQPage",
  );

  if (faqEntries.length > 0) {
    const enabledEntries = faqEntries.filter((entry) => entry.enabled !== false);
    if (!enabledEntries.length) return [];

    const fromSeo = enabledEntries.flatMap((entry) => normalizeFaqItems(entry.faqItems));
    if (fromSeo.length) return fromSeo;
  }

  return extractBlogFaqItems(post);
}

function articleSchemaType(seo: SeoFields | null | undefined) {
  const type = seo?.primarySchemaType || seo?.schemaType || "BlogPosting";
  // Google Article docs support Article / NewsArticle / BlogPosting.
  // Keep TechArticle (schema.org subtype); avoid emitting HowTo as the article type.
  if (type === "HowTo") return "BlogPosting";
  return type;
}

function robotsFromSeo(
  seo: SeoFields | null | undefined,
  settings: BlogSettings | null | undefined,
): Metadata["robots"] {
  // Site-wide kill switch (settings/features.ts).
  if (!siteConfig.allowIndexing) {
    return {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    };
  }

  // Explicit Sanity opt-outs only — missing/undefined flags mean indexable (go-live default).
  const blockedBySettings = settings?.noindexUntilReady === true || settings?.robotsIndex === false;
  const blockedByDoc = seo?.noIndex === true;

  const index = !blockedBySettings && !blockedByDoc;
  const follow = seo?.noFollow !== true;

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
    "@id": `${pageUrl("blog")}#webpage`,
    name: settings?.seo?.metaTitle || settings?.title || "Blog",
    description:
      settings?.seo?.metaDescription || settings?.description || blogPage.hero.description,
    url: pageUrl("blog"),
    inLanguage: "en-US",
    isPartOf: websiteRef(),
    about: personRef(),
    numberOfItems: postCount,
  };
}

/** BreadcrumbList with nested WebPage items (avoids “Unnamed item” in validators). */
export function blogBreadcrumbJsonLd(parts: Array<{ name: string; path: string }>) {
  const items = parts.map((part) => ({
    name: part.name,
    url: pageUrl(part.path.replace(/^\/+|\/+$/g, "")),
  }));
  const last = items[items.length - 1];
  const listId = `${last?.url ?? HOME_URL}#breadcrumb`;
  const listName = last ? `${last.name} breadcrumb` : "Breadcrumb";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": listId,
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      "@id": `${listId}/item-${index + 1}`,
      position: index + 1,
      name: item.name,
      item: {
        "@type": "WebPage",
        "@id": item.url,
        name: item.name,
        url: item.url,
      },
    })),
  };
}

/** WebPage wrapper for `/blog/<slug>/`. */
export function blogWebPageJsonLd(post: BlogPost, settings: BlogSettings | null) {
  const seo = post.seo;
  const url = pageUrl(`blog/${post.slug}`);
  const cover = resolveImage(post.coverImage, seo?.ogImage, settings?.defaultOgImage);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: seo?.metaTitle || post.title,
    description: seo?.metaDescription || post.excerpt || blogPage.hero.description,
    inLanguage: "en-US",
    isPartOf: websiteRef(),
    about: personRef(),
    author: personRef(),
    datePublished: toIsoDateTime(post.publishedAt),
    dateModified: toIsoDateTime(post.updatedAt || post.publishedAt),
    ...(cover
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            "@id": `${url}#cover-image`,
          },
        }
      : {}),
    breadcrumb: {
      "@id": `${url}#breadcrumb`,
    },
    mainEntity: {
      "@id": `${url}#article`,
    },
  };
}

/** ImageObject for the post cover when a usable image exists. */
export function blogCoverImageJsonLd(post: BlogPost, settings: BlogSettings | null) {
  const cover = resolveImage(post.coverImage, post.seo?.ogImage, settings?.defaultOgImage);
  if (!cover) return null;

  const url = pageUrl(`blog/${post.slug}`);
  const name = cover.title || post.coverImage?.alt?.trim() || `${post.title} cover image`;

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${url}#cover-image`,
    url: cover.url,
    contentUrl: cover.url,
    name,
    caption: post.coverImage?.caption?.trim() || cover.alt,
    description: post.excerpt || cover.alt,
    ...(cover.width ? { width: cover.width } : {}),
    ...(cover.height ? { height: cover.height } : {}),
    representativeOfPage: true,
    inLanguage: "en-US",
    creator: personRef(),
    isPartOf: {
      "@id": `${url}#article`,
    },
  };
}

/** BlogPosting / NewsArticle / TechArticle — Google Article-compatible JSON-LD. */
export function blogPostJsonLd(post: BlogPost, settings: BlogSettings | null) {
  const seo = post.seo;
  const url = pageUrl(`blog/${post.slug}`);
  const cover = resolveImage(post.coverImage, seo?.ogImage, settings?.defaultOgImage);
  const headline = articleHeadline(seo?.metaTitle || post.title);

  const authors = (post.authors ?? [])
    .map((author) => {
      const name = author.name?.trim();
      if (!name) return null;
      if (name === siteConfig.fullName || name === "Jay Patel") {
        return personRef({
          sameAs: author.sameAs?.filter(Boolean) as string[] | undefined,
        });
      }
      return {
        "@type": "Person" as const,
        name,
        ...(author.sameAs?.length ? { url: author.sameAs[0], sameAs: author.sameAs } : {}),
      };
    })
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": articleSchemaType(seo),
    "@id": `${url}#article`,
    headline,
    name: post.title,
    description: seo?.metaDescription || post.excerpt || undefined,
    url,
    inLanguage: "en-US",
    isPartOf: websiteRef(),
    ...(cover
      ? {
          // Google accepts ImageObject or URL; include dimensions when known.
          image: [
            {
              "@type": "ImageObject",
              "@id": `${url}#cover-image`,
              url: cover.url,
              contentUrl: cover.url,
              name: cover.title || cover.alt,
              caption: cover.alt,
              ...(cover.width ? { width: cover.width } : {}),
              ...(cover.height ? { height: cover.height } : {}),
            },
          ],
        }
      : {}),
    datePublished: toIsoDateTime(post.publishedAt),
    dateModified: toIsoDateTime(post.updatedAt || post.publishedAt),
    author: authors.length ? authors : [personRef()],
    publisher: publisherOrg(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
    },
    keywords: seo?.keywords ?? seo?.articleTags ?? undefined,
    articleSection: seo?.articleSection || post.categories?.[0]?.title || undefined,
  };
}

/**
 * FAQPage — only when Studio FAQ schema is enabled (or no toggle row + body FAQs).
 * Shape matches Google FAQ structured data: Question.name + Answer.text.
 */
export function blogFaqJsonLd(post: BlogPost) {
  const faqs = resolveBlogFaqItems(post);
  if (!faqs.length) return null;

  const url = pageUrl(`blog/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((item, index) => {
      const slug = schemaFragment(item.question);
      const questionId = `${url}#faq-q-${index + 1}-${slug}`;
      return {
        "@type": "Question",
        "@id": questionId,
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          "@id": `${questionId}-answer`,
          text: item.answer,
        },
      };
    }),
  };
}

/**
 * All JSON-LD graphs for a blog post page — built on the FE from post content.
 * Respects Studio FAQPage `enabled` on seo.structuredData.
 * Order: BreadcrumbList → WebPage → BlogPosting → ImageObject? → Person → FAQPage?
 */
export function blogPostPageJsonLdSchemas(post: BlogPost, settings: BlogSettings | null) {
  const cover = blogCoverImageJsonLd(post, settings);
  const faq = blogFaqJsonLd(post);

  return [
    blogBreadcrumbJsonLd([
      { name: "Home", path: "" },
      { name: "Blog", path: "blog" },
      { name: post.title, path: `blog/${post.slug}` },
    ]),
    blogWebPageJsonLd(post, settings),
    blogPostJsonLd(post, settings),
    ...(cover ? [cover] : []),
    personJsonLd,
    ...(faq ? [faq] : []),
  ];
}
