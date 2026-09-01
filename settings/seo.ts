/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  settings/seo.ts  —  Central SEO configuration for Jay Patel's portfolio
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Everything SEO lives here:
 *    • Site-wide metadata (title, description, keywords, canonical)
 *    • Open Graph (Facebook / LinkedIn / WhatsApp share cards)
 *    • Twitter / X cards
 *    • Robots directives
 *    • JSON-LD structured data:
 *        – Person / WebSite / ProfilePage / FAQ  (home — revisit with the home rewrite)
 *        – AboutPage, CollectionPage (work), WebPage (skills), ContactPage
 *        – Project WebPage + CreativeWork / SoftwareSourceCode + breadcrumbs
 *    • Per-page metadata helpers  (about / skills / work / contact)
 *    • Sitemap registry in `settings/sitemap-urls.json` (per-URL lastModified)
 *
 *  Usage in app/layout.tsx:
 *    import { rootMetadata, rootViewport } from "@/settings/seo";
 *    export const metadata = rootMetadata;
 *    export const viewport  = rootViewport;
 *
 *  Usage in any route's page.tsx:
 *    import { aboutPageMetadata } from "@/settings/seo";
 *    export const metadata = aboutPageMetadata;
 *
 *  To add JSON-LD to a page:
 *    import { personJsonLd, faqJsonLd } from "@/settings/seo";
 *    <script type="application/ld+json"
 *            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Metadata, Viewport } from "next";
import type { MetadataRoute } from "next";
import sitemapUrls from "./sitemap-urls.json";
import { siteConfig } from "@/settings";
import type { ProjectDetail } from "@/settings/project-details/types";
import {
  PROJECTS,
  PROJECT_COVER_IMAGE,
  projectHref,
  projectImageAlt,
  projectImageSrc,
  projectImageTitle,
  type Project,
} from "@/settings/projects";
// ─── Base URL ──────────────────────────────────────────────────────────────────
// Canonical / OG / sitemap must be the public domain — never VERCEL_URL.
// VERCEL_URL is a unique deploy host (e.g. jay-portfolio-xxxx.vercel.app).
const PRODUCTION_ORIGIN = "https://jaypateldev.com";

export const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_ORIGIN : "http://localhost:3000")
).replace(/\/$/, "");

/** Homepage canonical — always with a trailing slash (`https://jaypateldev.com/`). */
export const HOME_URL = `${BASE_URL}/`;

/** Page URL with trailing slash. Do not use for files (`sitemap.xml`, og image). */
export function pageUrl(path: string): string {
  const slug = path.replace(/^\/+|\/+$/g, "");
  return slug ? `${BASE_URL}/${slug}/` : HOME_URL;
}

/** Real content date — fallback when a route is missing from `sitemap-urls.json`. */
export const LAST_UPDATED = "2026-08-31";

/** ISO-8601 DateTime for schema.org `dateModified` (date-only fails validators). */
export const LAST_UPDATED_ISO = `${LAST_UPDATED}T00:00:00+05:30`;

// ─── Sitemap registry (`settings/sitemap-urls.json`) ───────────────────────────
// Edit one entry's lastModified there without changing other pages.

export type SitemapUrlEntry = {
  /** Route slug — "" for home, "about", "work/spendly-personal-expense-tracker", etc. */
  path: string;
  /** YYYY-MM-DD (IST). Do not use `new Date()` in app code. */
  lastModified: string;
};

/** Canonical list of indexable routes and their last-modified dates. */
export const SITEMAP_URLS = sitemapUrls as SitemapUrlEntry[];

/** Normalize a sitemap path or full URL slug to the registry key. */
export function normalizeSitemapPath(path: string): string {
  if (path === "/" || path === "") return "";
  return path.replace(/^\/+|\/+$/g, "");
}

/** Look up lastModified for a route. Falls back to `LAST_UPDATED` when missing. */
export function getSitemapLastModified(path: string): string {
  const key = normalizeSitemapPath(path);
  const entry = SITEMAP_URLS.find((item) => normalizeSitemapPath(item.path) === key);
  return entry?.lastModified ?? LAST_UPDATED;
}

/** ISO-8601 DateTime for schema.org `dateModified`. */
export function getSitemapLastModifiedIso(path: string): string {
  return `${getSitemapLastModified(path)}T00:00:00+05:30`;
}

/** Resolve a registry path to the public absolute URL. */
export function sitemapEntryUrl(path: string): string {
  const key = normalizeSitemapPath(path);
  return key ? pageUrl(key) : HOME_URL;
}

/** Build the sitemap payload consumed by `app/sitemap.ts`. */
export function buildSitemap(): MetadataRoute.Sitemap {
  return SITEMAP_URLS.map(({ path, lastModified }) => ({
    url: sitemapEntryUrl(path),
    lastModified,
  }));
}

// ─── Core copy ─────────────────────────────────────────────────────────────────
// Change these to adjust the text that appears in Google results and link previews.

export const SEO_TITLE_TEMPLATE = `%s | ${siteConfig.fullName}`;
export const SEO_TITLE_DEFAULT = `${siteConfig.fullName} | Full Stack Developer | React, Next.js & Node.js`;

export const SEO_DESCRIPTION =
  "Jay Patel is a Full Stack Developer specializing in React, Next.js, Node.js, TypeScript and the MERN stack, available for freelance projects and collaboration.";

// ─── Keywords ──────────────────────────────────────────────────────────────────
// Google ignores <meta name="keywords">. Keep a short identity list for Bing / tools.
export const SEO_KEYWORDS: string[] = [
  "Jay Patel",
  "Jay Patel full stack developer",
  "full stack developer India",
  "MERN stack developer",
  "React Next.js Node.js developer",
];

// ─── Open Graph image ──────────────────────────────────────────────────────────
// Generated by app/opengraph-image.tsx (1200×630) using public/images/avatar.png.
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.fullName} — Full Stack Developer in India`,
  type: "image/png",
} as const;

/** Square brand mark for og:logo (validators / some platforms). */
export const OG_LOGO = {
  url: "/icons/icon-512.png",
  width: 512,
  height: 512,
  alt: `${siteConfig.fullName} logo`,
  type: "image/png",
} as const;

export const OG_LOGO_URL = `${BASE_URL}${OG_LOGO.url}`;

/** X / Twitter large card — separate route with tighter layout for crop safe zone. */
export const TWITTER_IMAGE = {
  url: "/twitter-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.fullName} — Full Stack Developer in India`,
  type: "image/png",
} as const;

// ─── Twitter / X handle ────────────────────────────────────────────────────────
export const TWITTER_HANDLE = "@PatelPjay99909";

const TWITTER_ACCOUNT = {
  site: TWITTER_HANDLE,
  creator: TWITTER_HANDLE,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
//  Root Metadata  (used in app/layout.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const rootMetadata: Metadata = {
  // ── Basic ──────────────────────────────────────────────────────────────────
  metadataBase: new URL(BASE_URL),

  title: {
    default: SEO_TITLE_DEFAULT,
    template: SEO_TITLE_TEMPLATE,
  },

  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,

  authors: [
    {
      name: siteConfig.fullName,
      url: siteConfig.github,
    },
  ],

  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,

  // ── Robots ─────────────────────────────────────────────────────────────────
  // Controlled by siteConfig.allowIndexing.
  // Set allowIndexing: false in settings/features.ts (allowIndexing) / settings/ to block all crawlers
  // (useful while the site is still in development / staging).
  // Flip it to true when you go live on your real domain.
  robots: siteConfig.allowIndexing
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
        },
      }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },

  // ── Canonical / Alternates ─────────────────────────────────────────────────
  alternates: {
    canonical: HOME_URL,
  },

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: HOME_URL,
    siteName: `${siteConfig.fullName} — Portfolio`,
    title: SEO_TITLE_DEFAULT,
    description: SEO_DESCRIPTION,
    images: [OG_IMAGE],
    // Profile-specific OG fields
    firstName: "Jay",
    lastName: "Patel",
    username: siteConfig.githubUsername,
    gender: "male",
  },

  // ── Twitter / X ────────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE_DEFAULT,
    description: SEO_DESCRIPTION,
    images: [TWITTER_IMAGE],
    ...TWITTER_ACCOUNT,
  },

  // ── App ────────────────────────────────────────────────────────────────────
  applicationName: `${siteConfig.fullName} Portfolio`,
  category: "technology",
  classification: "Portfolio, Developer, Software Engineer",

  // ── Verification ──────────────────────────────────────────────────────────
  // Next.js renders this as <meta name="google-site-verification" content="…" />.
  // Override with NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION if Search Console issues a new token.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },

  // Explicit favicon PNG sizes (16/32) + Apple touch icon + manifest.
  icons: {
    icon: [
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
};

// ─────────────────────────────────────────────────────────────────────────────
//  Root Viewport  (kept separate from Metadata per Next.js 15 requirement)
// ─────────────────────────────────────────────────────────────────────────────
export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f17" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  Per-page metadata helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inner-page metadata uses `title.absolute` so the root `%s | Name` template
 * does not double the brand (e.g. "About | Jay Patel | Jay Patel").
 */
function innerPageMetadata(
  slug: string,
  title: string,
  description: string,
  keywords?: string[],
): Metadata {
  return {
    title: { absolute: title },
    description,
    keywords: keywords ?? SEO_KEYWORDS,
    alternates: { canonical: pageUrl(slug) },
    openGraph: {
      type: "website",
      url: pageUrl(slug),
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [TWITTER_IMAGE],
      ...TWITTER_ACCOUNT,
    },
  };
}

export const aboutPageMetadata = innerPageMetadata(
  "about",
  `About Jay Patel | Full Stack Developer`,
  "Learn about Jay Patel, a Full Stack Developer building React, Next.js, Node.js and MERN applications, real-time systems and production web platforms since 2022.",
  ["about Jay Patel", "Jay Patel developer", ...SEO_KEYWORDS],
);

export const skillsPageMetadata = innerPageMetadata(
  "skills",
  `Full Stack Skills & Services | React, Next.js, Node.js`,
  "Explore Jay Patel's full-stack development skills and services, including React, Next.js, Node.js, TypeScript, MERN, MongoDB, PostgreSQL and DevOps.",
  [
    "full stack development services",
    "React Next.js developer",
    "Node.js API development",
    "MERN stack developer India",
    "TypeScript full stack developer",
    ...SEO_KEYWORDS,
  ],
);

export const workPageMetadata = innerPageMetadata(
  "work",
  `Work & Projects | Jay Patel Full Stack Portfolio`,
  "Explore Jay Patel's Full Stack development work, including Third-Party APIs, SaaS platforms, and production web applications built with React, Next.js, Node.js, and TypeScript.",
  ["Jay Patel portfolio", "full stack developer projects", "Next.js case studies", ...SEO_KEYWORDS],
);

export const contactPageMetadata = innerPageMetadata(
  "contact",
  `Hire Jay Patel | Full Stack Developer in India`,
  "Contact Jay Patel for full-stack development, freelance projects, or product collaboration. Based in India, available for remote work.",
  [
    "hire Jay Patel",
    "hire full stack developer India",
    "freelance MERN developer",
    "contact full stack developer",
    ...SEO_KEYWORDS,
  ],
);

/** Named Person node — bare `@id` refs show as “Unnamed item” in Rich Results. */
function personRef() {
  return {
    "@type": "Person" as const,
    "@id": `${HOME_URL}#person`,
    name: siteConfig.fullName,
  };
}

/** Named WebSite node for `isPartOf` links. */
function websiteRef() {
  return {
    "@type": "WebSite" as const,
    "@id": `${HOME_URL}#website`,
    name: `${siteConfig.fullName} — Portfolio`,
  };
}

/**
 * BreadcrumbList with a list `name` and nested WebPage `item` objects.
 * Plain URL `item` strings often render as “Unnamed item” in validators.
 */
function breadcrumbListFields(
  items: { name: string; url: string }[],
  opts?: { id?: string; name?: string },
) {
  const last = items[items.length - 1];
  const listId = opts?.id ?? `${last?.url ?? HOME_URL}#breadcrumb`;
  const listName = opts?.name ?? (last ? `${last.name} breadcrumb` : "Breadcrumb");

  return {
    "@type": "BreadcrumbList" as const,
    "@id": listId,
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem" as const,
      "@id": `${listId}/item-${i + 1}`,
      position: i + 1,
      name: item.name,
      item: {
        "@type": "WebPage" as const,
        "@id": item.url,
        name: item.name,
        url: item.url,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
  opts?: { id?: string; name?: string },
) {
  return {
    "@context": "https://schema.org",
    ...breadcrumbListFields(items, opts),
  };
}

export function innerPageBreadcrumbJsonLd(pageName: string, slug: string) {
  const url = pageUrl(slug);
  return breadcrumbJsonLd(
    [
      { name: "Home", url: HOME_URL },
      { name: pageName, url },
    ],
    { id: `${url}#breadcrumb`, name: `${pageName} breadcrumb` },
  );
}

export function projectBreadcrumbJsonLd(project: Pick<Project, "slug" | "title">) {
  const url = pageUrl(`work/${project.slug}`);
  return breadcrumbJsonLd(
    [
      { name: "Home", url: HOME_URL },
      { name: "Work", url: pageUrl("work") },
      { name: project.title, url },
    ],
    { id: `${url}#breadcrumb`, name: `${project.title} breadcrumb` },
  );
}

/** About page — AboutPage pointing at the same Person entity as home. */
export const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${pageUrl("about")}#aboutpage`,
  url: pageUrl("about"),
  name: "About Jay Patel | Full Stack Developer",
  description: aboutPageMetadata.description,
  inLanguage: "en-US",
  isPartOf: websiteRef(),
  about: personRef(),
  mainEntity: personRef(),
  dateModified: getSitemapLastModifiedIso("about"),
};

/** Skills page — WebPage wrapper; catalog schemas are injected separately. */
export function skillsPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl("skills")}#webpage`,
    url: pageUrl("skills"),
    name: "Full Stack Skills & Services | React, Next.js, Node.js",
    description: skillsPageMetadata.description,
    inLanguage: "en-US",
    isPartOf: websiteRef(),
    about: personRef(),
    mainEntity: personRef(),
    dateModified: getSitemapLastModifiedIso("skills"),
  };
}

/** URL-safe fragment for JSON-LD `@id` / `url` values. */
function schemaFragment(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

/** Work index — CollectionPage + ItemList of every project card on the page. */
export function workPageJsonLd() {
  const listId = `${pageUrl("work")}#project-list`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl("work")}#collection`,
    url: pageUrl("work"),
    name: "Work & Projects | Jay Patel Full Stack Portfolio",
    description: workPageMetadata.description,
    inLanguage: "en-US",
    isPartOf: websiteRef(),
    about: personRef(),
    dateModified: getSitemapLastModifiedIso("work"),
    mainEntity: {
      "@type": "ItemList",
      "@id": listId,
      name: "Selected projects",
      numberOfItems: PROJECTS.length,
      itemListElement: PROJECTS.map((project, i) => {
        const url = `${BASE_URL}${projectHref(project)}`;
        const img = projectImageMetadata(project);
        return {
          "@type": "ListItem",
          "@id": `${listId}/item-${i + 1}`,
          position: i + 1,
          name: project.title,
          item: {
            "@type": "CreativeWork",
            "@id": url,
            name: project.title,
            url,
            image: {
              "@type": "ImageObject",
              url: img.url,
              name: img.title,
              caption: img.title,
              width: img.width,
              height: img.height,
              encodingFormat: img.type,
            },
          },
        };
      }),
    },
  };
}

/** Absolute URL for a project cover image. */
export function projectImageAbsoluteUrl(project: Pick<Project, "slug" | "image">): string {
  return `${BASE_URL}${projectImageSrc(project)}`;
}

/** Open Graph / Twitter / metadata fields for a project screenshot. */
export function projectImageMetadata(
  project: Pick<Project, "slug" | "title" | "image" | "tagline">,
) {
  return {
    url: projectImageAbsoluteUrl(project),
    width: PROJECT_COVER_IMAGE.width,
    height: PROJECT_COVER_IMAGE.height,
    alt: projectImageAlt(project),
    title: projectImageTitle(project),
    type: PROJECT_COVER_IMAGE.type,
  };
}

/** ImageObject JSON-LD for project cover screenshots. */
export function projectImageJsonLd(project: Project) {
  const img = projectImageMetadata(project);
  const workUrl = pageUrl(`work/${project.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${workUrl}#cover-image`,
    url: img.url,
    contentUrl: img.url,
    name: img.title,
    caption: img.title,
    description: project.tagline,
    width: img.width,
    height: img.height,
    encodingFormat: img.type,
    representativeOfPage: true,
    inLanguage: "en-US",
    creator: personRef(),
    isPartOf: {
      "@type": "CreativeWork",
      "@id": `${workUrl}#work`,
      name: project.title,
      url: workUrl,
    },
  };
}

/** WebPage wrapper for a published `/work/<slug>/` case study. */
export function projectDetailPageJsonLd(project: Project, detail: ProjectDetail) {
  const slugPath = `work/${project.slug}`;
  const url = pageUrl(slugPath);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: detail.seo.title,
    description: detail.seo.description,
    inLanguage: "en-US",
    isPartOf: websiteRef(),
    about: personRef(),
    author: personRef(),
    dateModified: getSitemapLastModifiedIso(slugPath),
    primaryImageOfPage: {
      "@type": "ImageObject",
      "@id": `${url}#cover-image`,
    },
    breadcrumb: {
      "@id": `${url}#breadcrumb`,
    },
    mainEntity: {
      "@id": `${url}#work`,
    },
  };
}

/** Public `/work/<slug>/` pages — indexed only when published. */
export function projectJsonLd(project: Project, detail?: ProjectDetail) {
  const slugPath = `work/${project.slug}`;
  const url = pageUrl(slugPath);
  const img = projectImageMetadata(project);
  const description = detail?.seo.description ?? project.desc;
  const headline = detail?.seo.ogTitle ?? project.title;
  const keywords = detail?.seo
    ? [detail.seo.primaryTopic, ...detail.seo.secondaryTopics].join(", ")
    : project.tags.join(", ");

  return {
    "@context": "https://schema.org",
    "@type": project.codeUrl ? "SoftwareSourceCode" : "CreativeWork",
    "@id": `${url}#work`,
    name: project.title,
    headline,
    description,
    url,
    image: {
      "@type": "ImageObject",
      "@id": `${url}#cover-image`,
      url: img.url,
      contentUrl: img.url,
      name: img.title,
      caption: img.alt,
      width: img.width,
      height: img.height,
      encodingFormat: img.type,
    },
    inLanguage: "en-US",
    isPartOf: websiteRef(),
    author: personRef(),
    creator: personRef(),
    keywords,
    dateModified: getSitemapLastModifiedIso(slugPath),
    ...(detail
      ? {
          about: {
            "@type": "Thing",
            name: detail.seo.primaryTopic,
          },
        }
      : {}),
    ...(detail ? { mainEntityOfPage: { "@id": `${url}#webpage` } } : {}),
    ...(project.codeUrl ? { codeRepository: project.codeUrl } : {}),
    ...(project.demoUrl ? { sameAs: project.demoUrl } : {}),
  };
}

/** Contact page — ContactPage + ContactPoint (breadcrumb is a separate script). */
export const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${pageUrl("contact")}#contactpage`,
  url: pageUrl("contact"),
  name: `Contact ${siteConfig.fullName}`,
  description: contactPageMetadata.description,
  inLanguage: "en-US",
  isPartOf: websiteRef(),
  mainEntity: personRef(),
  dateModified: getSitemapLastModifiedIso("contact"),
  about: {
    ...personRef(),
    email: `mailto:${siteConfig.email}`,
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    url: HOME_URL,
    jobTitle: "Full Stack Developer",
    address: {
      "@type": "PostalAddress",
      name: "Ahmedabad, India",
      addressLocality: "Ahmedabad",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        name: "Professional inquiries",
        contactType: "professional inquiries",
        email: siteConfig.email,
        ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
        areaServed: "Worldwide",
        availableLanguage: ["English", "Hindi", "Gujarati"],
      },
    ],
    sameAs: [
      ...new Set(
        siteConfig.profileLinks.map((p) => p.href).filter((href): href is string => Boolean(href)),
      ),
    ],
  },
};

/**
 * Services catalog for the skills page.
 * Use OfferCatalog (not ItemList) — top-level ItemList triggers Google Carousel
 * validation ("Multiple ListItem elements" / duplicate urls).
 */
export function servicesItemListJsonLd() {
  const items = siteConfig.services.items;
  const catalogId = `${pageUrl("skills")}#services`;
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": catalogId,
    name: siteConfig.services.title,
    description: siteConfig.services.intro,
    url: catalogId,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => {
      const slug = schemaFragment(item.title);
      const itemUrl = `${pageUrl("skills")}#service-${slug}`;
      return {
        "@type": "Offer",
        "@id": itemUrl,
        position: i + 1,
        name: item.title,
        description: item.description,
        url: itemUrl,
        itemOffered: {
          "@type": "Service",
          name: item.title,
          description: item.description,
          provider: personRef(),
        },
      };
    }),
  };
}

/**
 * Tech stack catalog for the skills page.
 * DefinedTermSet (not ItemList) — avoids Carousel rich-result checks.
 */
export function skillsCatalogJsonLd() {
  const groups = [
    {
      name: "Frontend",
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind",
        "Redux",
        "HTML5",
        "CSS3",
      ],
    },
    {
      name: "Backend",
      skills: [
        "Node.js",
        "Express.js",
        "MongoDB",
        "PostgreSQL",
        "Redis",
        "GraphQL",
        "Prisma",
        "Socket.io",
      ],
    },
    {
      name: "Tools & DevOps",
      skills: ["Git", "GitHub", "Docker", "AWS", "Jest", "Vitest", "Figma", "Linux"],
    },
  ];
  const allSkills = groups.flatMap((g) => g.skills.map((name) => ({ name, group: g.name })));
  const catalogId = `${pageUrl("skills")}#stack-catalog`;

  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": catalogId,
    name: siteConfig.skillsPage.catalogTitle,
    description: siteConfig.skillsPage.catalogIntro,
    url: catalogId,
    hasDefinedTerm: allSkills.map(({ name, group }) => {
      const termId = `${pageUrl("skills")}#skill-${schemaFragment(name)}`;
      return {
        "@type": "DefinedTerm",
        "@id": termId,
        name,
        termCode: name,
        description: `${name} (${group})`,
        url: termId,
        inDefinedTermSet: catalogId,
      };
    }),
  };
}

export function projectPageMetadata(
  project: {
    slug: string;
    title: string;
    tagline: string;
    desc: string;
  },
  opts?: {
    published?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    keywords?: string[];
  },
): Metadata {
  const title = opts?.seoTitle ?? `${project.title} | ${project.tagline} | Jay Patel`;
  const description = (opts?.seoDescription ?? project.desc).slice(0, 160);
  const indexable = Boolean(opts?.published) && siteConfig.allowIndexing;
  const cover = projectImageMetadata(project);
  const socialTitle = opts?.ogTitle ?? opts?.seoTitle ?? `${project.title}: ${project.tagline}`;
  const socialDescription = opts?.ogDescription ?? description;

  return {
    title: { absolute: title },
    description,
    ...(opts?.keywords?.length ? { keywords: opts.keywords } : {}),
    alternates: { canonical: pageUrl(`work/${project.slug}`) },
    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large" as const,
          },
        }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      url: pageUrl(`work/${project.slug}`),
      title: socialTitle,
      description: socialDescription,
      images: [
        {
          url: cover.url,
          width: cover.width,
          height: cover.height,
          alt: cover.alt,
          type: cover.type,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [{ url: cover.url, alt: cover.alt }],
      ...TWITTER_ACCOUNT,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  JSON-LD Structured Data
//  Paste these as <script type="application/ld+json"> in your page components.
//  All schemas are validated against schema.org.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Person schema — tells Google who Jay is.
 * `@id` …/#person is an internal JSON-LD node id, not a real page or skip-link.
 */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${HOME_URL}#person`,
  name: siteConfig.fullName,
  givenName: "Jay",
  familyName: "Patel",
  url: HOME_URL,
  image: `${BASE_URL}/images/avatar.png`,
  email: `mailto:${siteConfig.email}`,
  jobTitle: "Full Stack Developer",
  description: SEO_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    name: "Ahmedabad, India",
    addressLocality: "Ahmedabad",
    addressCountry: "IN",
  },
  sameAs: [
    ...new Set(
      siteConfig.profileLinks.map((p) => p.href).filter((href): href is string => Boolean(href)),
    ),
  ],
  knowsAbout: [
    "Full Stack Web Development",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "MERN Stack",
    "Web Application Development",
    "SaaS Development",
    "REST API Development",
    "GraphQL API Development",
    "Real-Time Web Applications",
    "WebSocket Applications",
    "Database Design",
    "MongoDB",
    "PostgreSQL",
    "Prisma",
    "Third-Party API Integrations",
    "Performance Optimization",
    "SEO",
    "Web Accessibility",
    "Production Deployment",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "SCET, Kalol",
      sameAs: "https://www.swaminarayanuniversity.ac.in",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "GPG, Gandhinagar",
    },
  ],
};

/**
 * WebSite schema — site identity only.
 * Do not add SearchAction: this site has no search results URL.
 */
export const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${HOME_URL}#website`,
  name: `${siteConfig.fullName} — Portfolio`,
  url: HOME_URL,
  description: SEO_DESCRIPTION,
  author: personRef(),
  inLanguage: "en-US",
};

/**
 * ProfilePage schema — marks this as a personal portfolio / profile page.
 */
export const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${HOME_URL}#profilepage`,
  url: HOME_URL,
  name: SEO_TITLE_DEFAULT,
  description: SEO_DESCRIPTION,
  breadcrumb: breadcrumbListFields([{ name: "Home", url: HOME_URL }], {
    id: `${HOME_URL}#breadcrumb`,
    name: "Home breadcrumb",
  }),
  mainEntity: personRef(),
  about: personRef(),
  dateModified: getSitemapLastModifiedIso(""),
};

/**
 * FAQ structured data — generated from siteConfig.faqItems.
 * Only injected when showFAQ is true (markup must match visible content).
 * Each Question/Answer gets an explicit name so validators don’t show “Unnamed item”.
 */
export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${HOME_URL}#faq`,
  name: "Full Stack Developer FAQ",
  url: `${HOME_URL}#faq`,
  inLanguage: "en-US",
  isPartOf: websiteRef(),
  mainEntity: siteConfig.faqItems.map((item, index) => {
    const slug = schemaFragment(item.question);
    const questionId = `${HOME_URL}#faq-q-${index + 1}-${slug}`;
    return {
      "@type": "Question",
      "@id": questionId,
      name: item.question,
      url: questionId,
      acceptedAnswer: {
        "@type": "Answer",
        "@id": `${questionId}-answer`,
        name: item.question,
        text: item.answer,
      },
    };
  }),
};

/**
 * Convenience array — all JSON-LD schemas for the home page.
 * Spread this into your page to inject all schemas at once.
 */
export const homePageJsonLdSchemas = [
  personJsonLd,
  webSiteJsonLd,
  profilePageJsonLd,
  ...(siteConfig.showFAQ ? [faqJsonLd] : []),
];
