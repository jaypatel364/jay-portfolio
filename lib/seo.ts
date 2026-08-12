/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  lib/seo.ts  —  Central SEO configuration for Jay Patel's portfolio
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Everything SEO lives here:
 *    • Site-wide metadata (title, description, keywords, canonical)
 *    • Open Graph (Facebook / LinkedIn / WhatsApp share cards)
 *    • Twitter / X cards
 *    • Robots directives
 *    • JSON-LD structured data:
 *        – Person schema          (who Jay is)
 *        – WebSite schema         (site search action)
 *        – ProfilePage schema     (portfolio page)
 *        – BreadcrumbList schema  (resume page)
 *        – FAQ schema             (common questions answered in structured data)
 *    • Per-page metadata helpers  (resumePageMetadata)
 *
 *  Usage in app/layout.tsx:
 *    import { rootMetadata, rootViewport } from "@/lib/seo";
 *    export const metadata = rootMetadata;
 *    export const viewport  = rootViewport;
 *
 *  Usage in any route's page.tsx:
 *    import { resumePageMetadata } from "@/lib/seo";
 *    export const metadata = resumePageMetadata;
 *
 *  To add JSON-LD to a page:
 *    import { personJsonLd, faqJsonLd } from "@/lib/seo";
 *    <script type="application/ld+json"
 *            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/site-config";
// ─── Base URL ──────────────────────────────────────────────────────────────────
// Set NEXT_PUBLIC_SITE_URL in your .env (production domain, no trailing slash).
// Falls back to the Vercel deployment URL, then localhost for local dev.
export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

// ─── Core copy ─────────────────────────────────────────────────────────────────
// Change these to adjust the text that appears in Google results and link previews.

export const SEO_TITLE_TEMPLATE = `%s | ${siteConfig.fullName}`;
export const SEO_TITLE_DEFAULT = `${siteConfig.fullName} — Full Stack Developer`;

export const SEO_DESCRIPTION =
  `${siteConfig.fullName} is a Full Stack Developer based in ${siteConfig.location} ` +
  `specialising in React, Next.js, Node.js and the MERN stack. ` +
  `Building performant, scalable web applications with 3.5+ years of professional experience.`;

// ─── Keywords ──────────────────────────────────────────────────────────────────
// These feed the <meta name="keywords"> tag and help contextualise the page for
// crawlers even though Google no longer ranks on keywords alone.
export const SEO_KEYWORDS: string[] = [
  // Identity
  siteConfig.fullName,
  "Jay Patel",
  "Jay Patel developer",
  "Jay Patel portfolio",
  "Jay Patel Full Stack Developer",
  "Jay Patel MERN developer",

  // Role
  "Full Stack Developer",
  "MERN Stack Developer",
  "React Developer",
  "Next.js Developer",
  "Node.js Developer",
  "TypeScript Developer",
  "Web Developer",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",

  // Location
  "Full Stack Developer Ahmedabad",
  "Web Developer India",
  "React Developer India",
  "Ahmedabad developer",
  "Krishang Technolab developer",

  // Tech Stack
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "Tailwind CSS",
  "Redux",
  "Zustand",
  "GraphQL",
  "REST API",
  "Docker",
  "AWS",
  "CI/CD",
  "Git",
  "Figma",

  // General
  "developer portfolio",
  "hire developer",
  "freelance developer",
  "open to work",
  "web application development",
  "scalable web apps",
  "MERN stack",
];

// ─── Open Graph image ──────────────────────────────────────────────────────────
// Place your OG image at /public/og-image.png (1200×630 px recommended).
// If you use next/og to generate it dynamically, update this path to /api/og.
export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.fullName} — Full Stack Developer Portfolio`,
  type: "image/png",
} as const;

// ─── Twitter handle ────────────────────────────────────────────────────────────
// Update this if Jay has a Twitter / X account, otherwise keep it undefined.
export const TWITTER_HANDLE: string | undefined = undefined;

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
  // Set allowIndexing: false in lib/site-config.ts to block all crawlers
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
    canonical: BASE_URL,
  },

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: BASE_URL,
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
    images: [OG_IMAGE.url],
    // Uncomment and set TWITTER_HANDLE (e.g. "@jaypatel_dev") to populate these:
    // site: TWITTER_HANDLE,
    // creator: TWITTER_HANDLE,
  },

  // ── App / PWA ──────────────────────────────────────────────────────────────
  applicationName: `${siteConfig.fullName} Portfolio`,
  category: "technology",
  classification: "Portfolio, Developer, Software Engineer",

  // ── Verification ──────────────────────────────────────────────────────────
  // Uncomment and fill in once you verify your site with these services.
  // verification: {
  //   google: "your-google-site-verification-token",
  //   yandex: "your-yandex-verification-token",
  //   bing:   "your-bing-verification-token",
  // },

  // ── Icons ──────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/icon-192.png",
    shortcut: "/favicon.ico",
  },

  // ── Manifest ───────────────────────────────────────────────────────────────
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

export const resumePageMetadata: Metadata = {
  title: `Resume | ${siteConfig.fullName}`,
  description:
    `View ${siteConfig.fullName}'s full resume — ` +
    `Full Stack Developer with 3+ years experience in React, Next.js, Node.js, ` +
    `MongoDB, and TypeScript. Based in ${siteConfig.location}.`,
  keywords: [
    `${siteConfig.fullName} resume`,
    `${siteConfig.fullName} CV`,
    "Full Stack Developer resume",
    "MERN developer resume",
    "React developer CV",
    ...SEO_KEYWORDS.slice(0, 20),
  ],
  alternates: {
    canonical: `${BASE_URL}/resume`,
  },
  openGraph: {
    type: "profile",
    url: `${BASE_URL}/resume`,
    title: `${siteConfig.fullName} — Resume`,
    description:
      `Full Stack Developer resume — React, Next.js, Node.js, TypeScript, MongoDB. ` +
      `3+ years of experience. Based in ${siteConfig.location}.`,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.fullName} — Resume`,
    description: `Full Stack Developer resume — MERN stack, 3+ years experience. ${siteConfig.location}.`,
    images: [OG_IMAGE.url],
  },
  // Resume pages are sometimes excluded from indexing — remove the line below
  // if you want Google to index the /resume route.
  robots: {
    index: true,
    follow: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  JSON-LD Structured Data
//  Paste these as <script type="application/ld+json"> in your page components.
//  All schemas are validated against schema.org.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Person schema — tells Google who Jay is.
 * Shows in Knowledge Panel and rich results.
 */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  name: siteConfig.fullName,
  givenName: "Jay",
  familyName: "Patel",
  url: BASE_URL,
  image: `${BASE_URL}/og-image.png`,
  email: `mailto:${siteConfig.email}`,
  jobTitle: "Full Stack Developer",
  description: SEO_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ahmedabad",
    addressCountry: "IN",
  },
  sameAs: [siteConfig.github, siteConfig.linkedin],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "REST APIs",
    "GraphQL",
    "Tailwind CSS",
    "Docker",
    "AWS",
    "Full Stack Development",
    "MERN Stack",
    "Web Application Development",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "SCET, Kalol",
      sameAs: "https://www.scet.ac.in",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "GPG, Gandhinagar",
    },
  ],
  worksFor: {
    "@type": "Organization",
    name: "Krishang Technolab",
    url: "https://www.krishangtechnolab.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ahmedabad",
      addressCountry: "IN",
    },
  },
};

/**
 * WebSite schema — enables Google Sitelinks Search Box.
 */
export const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: `${siteConfig.fullName} — Portfolio`,
  url: BASE_URL,
  description: SEO_DESCRIPTION,
  author: {
    "@id": `${BASE_URL}/#person`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "en-US",
};

/**
 * ProfilePage schema — marks this as a personal portfolio / profile page.
 */
export const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${BASE_URL}/#profilepage`,
  url: BASE_URL,
  name: SEO_TITLE_DEFAULT,
  description: SEO_DESCRIPTION,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
    ],
  },
  mainEntity: {
    "@id": `${BASE_URL}/#person`,
  },
  about: {
    "@id": `${BASE_URL}/#person`,
  },
  dateModified: new Date().toISOString().split("T")[0],
};

/**
 * Resume / CV BreadcrumbList schema.
 */
export const resumeBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${BASE_URL}/resume#breadcrumb`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Resume",
      item: `${BASE_URL}/resume`,
    },
  ],
};

/**
 * FAQ structured data — generated dynamically from siteConfig.faqItems so
 * the JSON-LD always stays in sync with what's shown on the page.
 *
 * Even when siteConfig.showFAQ = false (the visual section is hidden), this
 * schema is still injected — Google can still parse and surface the answers.
 * Remove it from homePageJsonLdSchemas below if you want to suppress it too.
 */
export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${BASE_URL}/#faq`,
  mainEntity: siteConfig.faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

/**
 * Convenience array — all JSON-LD schemas for the home page.
 * Spread this into your page to inject all schemas at once.
 */
export const homePageJsonLdSchemas = [
  personJsonLd,
  webSiteJsonLd,
  profilePageJsonLd,
  faqJsonLd,
] as const;
