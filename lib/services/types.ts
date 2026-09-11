/**
 * Service module types — mirrors a future Sanity `service` document.
 * Editors manage these fields in CMS; file-based content in settings/services/ for now.
 */

export type ServiceCta = {
  label: string;
  href: string;
};

export type ServiceHeadingKeywords = {
  /** Primary keyword — e.g. "Full Stack Development" */
  keyword: string;
  /** Variant for capabilities & benefits — e.g. "Full Stack Web Development" */
  keywordVariant: string;
  /** Variant for How the Pieces Connect — e.g. "Full Stack Applications" */
  piecesKeyword: string;
  /** Role for Why Hire — e.g. "Full Stack Developer" */
  roleKeyword: string;
};

export type ServiceSeoBrief = {
  primaryKeyword: string;
  searchIntent: string;
  secondaryKeywords: string[];
  longTailQuestions: string[];
  relatedEntities: string[];
  conversionIntent: string;
};

export type ServiceSeo = {
  title: string;
  description: string;
  canonicalPath?: string;
  focusKeyword: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
};

export type ServiceCapability = {
  title: string;
  description: string;
  relatedServiceSlug?: string;
};

export type ServiceProcessStep = {
  title: string;
  description: string;
};

export type ServiceTechGroup = {
  category: string;
  items: string[];
};

export type ServiceUseCase = {
  title: string;
  description: string;
};

export type ServiceAudience = {
  title: string;
  description: string;
};

export type ServiceDeliverable = {
  title: string;
  description: string;
};

export type ServiceBenefit = {
  title: string;
  description: string;
  kind: "benefit" | "outcome";
};

export type ServiceProblem = {
  title: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

/** CMS-ready image / visual slot for future assets. */
export type ServiceVisual = {
  type?: "diagram" | "screenshot" | "illustration" | "photo";
  image?: string;
  mobileImage?: string;
  /** Image title attribute — SEO / tooltip when `image` is set. */
  title?: string;
  /** Image alt text — accessibility + SEO when `image` is set. */
  alt?: string;
  caption?: string;
  position?: "left" | "right" | "full";
  priority?: boolean;
};

/** Cover / OG image copy for SEO and social previews. */
export type ServiceCoverImage = {
  title: string;
  alt: string;
  image?: string;
};

export type ServiceEditorialIntro = {
  /** Large editorial statement (displayed prominently). */
  statement: string;
  /** Supporting paragraph — not a repeat of the hero. */
  supporting: string;
  pullQuote?: string;
};

export type ServiceWhyHireReason = {
  title: string;
  description: string;
  /** Short label shown on the card — e.g. "Ownership", "Speed". */
  tag: string;
};

export type ServiceWhyHireHighlight = {
  label: string;
  value: string;
};

export type ServiceWhyHire = {
  /** e.g. "Full-Stack Developer" — used in "Why Hire Me as a …?" */
  roleTitle: string;
  /** Service-specific intro — not a repeat of the hero or overview. */
  intro: string;
  /** Service-specific reasons — not shared global proof points. */
  reasons: ServiceWhyHireReason[];
  /** Optional stat strip below the grid. */
  highlights?: ServiceWhyHireHighlight[];
};

export type ServiceArchitectureNode = {
  id: string;
  label: string;
  row?: number;
  col?: number;
};

/** Section keys — used for ordering and per-service visibility toggles. */
export type ServiceSectionKey =
  | "whatWeDo"
  | "capabilities"
  | "problems"
  | "process"
  | "technologies"
  | "piecesConnect"
  /** @deprecated Use `piecesConnect` — kept for legacy sectionOrder values. */
  | "architecture"
  | "useCases"
  | "audiences"
  | "deliverables"
  | "benefits"
  | "whyHire"
  | "caseStudies"
  | "faqs"
  | "relatedServices"
  | "relatedPosts";

export type ServiceSectionVisibility = Partial<Record<ServiceSectionKey, boolean>>;

/** Per-section H2 supporting paragraph (see getServiceSectionSupport). */
export type ServiceSectionSupport = Partial<
  Record<
    | "whatWeDo"
    | "capabilities"
    | "problems"
    | "process"
    | "technologies"
    | "piecesConnect"
    | "useCases"
    | "audiences"
    | "deliverables"
    | "benefits"
    | "whyHire"
    | "caseStudies"
    | "faqs"
    | "relatedServices"
    | "relatedPosts",
    string
  >
>;

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  /** Card bullets on the hub page */
  cardCapabilities: string[];
  /** Technology / category labels on hub cards */
  categoryLabels: string[];
  icon: string;
  order: number;
  /** When false, the service is hidden from the hub, detail routes, links, and sitemap. */
  published: boolean;
  /** Internal SEO brief — not rendered on the public page */
  seoBrief: ServiceSeoBrief;
  /** Drives master H2 templates for all scroll sections (see SERVICE_H2_TEMPLATES). */
  headingKeywords: ServiceHeadingKeywords;
  /** H2 supporting paragraph per scroll section (hero & What I Do use hero / editorialIntro). */
  sectionSupport?: ServiceSectionSupport;
  hero: {
    heading: string;
    /** Optional multi-line hero headline lines for display rhythm. */
    headlineLines?: string[];
    description: string;
    primaryCta: ServiceCta;
    secondaryCta?: ServiceCta;
    trustIndicators?: string[];
    technologies?: string[];
    visual?: ServiceVisual;
  };
  editorialIntro?: ServiceEditorialIntro;
  /** Concrete deliverable types — semantic SEO + scannable list. */
  whatWeBuild?: string[];
  /** Industries where the service genuinely applies. */
  industries?: string[];
  overview: string;
  whatWeDo: {
    heading: string;
    paragraphs: string[];
  };
  capabilities: ServiceCapability[];
  problems: ServiceProblem[];
  process: ServiceProcessStep[];
  technologies: ServiceTechGroup[];
  /** Optional System / pieces-connect section diagram or illustration. */
  piecesConnectVisual?: ServiceVisual;
  useCases: ServiceUseCase[];
  audiences: ServiceAudience[];
  deliverables: ServiceDeliverable[];
  /** Optional Deliverables section diagram or illustration. */
  deliverablesVisual?: ServiceVisual;
  benefits: ServiceBenefit[];
  whyHire: ServiceWhyHire;
  /** Public project slugs from settings/projects.ts */
  caseStudySlugs?: string[];
  faqs: ServiceFaq[];
  relatedServiceSlugs: string[];
  /** Blog post slugs — card data (title, excerpt, cover) is resolved from Sanity at render time. */
  relatedPosts: string[];
  seo: ServiceSeo;
  /** Approximate reading time for the full service page (minutes). */
  readTimeMinutes?: number;
  /** Cover / feature image metadata for OG and accessibility. */
  coverImage?: ServiceCoverImage;
  sectionOrder?: ServiceSectionKey[];
  sectionVisibility?: ServiceSectionVisibility;
  updatedAt?: string;
};

export type ServicesHubSettings = {
  path: string;
  label: string;
  hero: {
    label: string;
    title: string;
    description: string;
    primaryCta: ServiceCta;
    secondaryCta?: ServiceCta;
    chips: string[];
  };
  seo: ServiceSeo;
};

/** Canonical service page section order (hero renders separately). */
export const DEFAULT_SERVICE_SECTION_ORDER: ServiceSectionKey[] = [
  "whatWeDo",
  "capabilities",
  "problems",
  "process",
  "technologies",
  "piecesConnect",
  "useCases",
  "audiences",
  "deliverables",
  "benefits",
  "whyHire",
  "caseStudies",
  "faqs",
  "relatedServices",
  "relatedPosts",
];
