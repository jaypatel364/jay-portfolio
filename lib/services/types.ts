/**
 * Service module types — mirrors a future Sanity `service` document.
 * Editors manage these fields in CMS; file-based content in settings/services/ for now.
 */

export type ServiceCta = {
  label: string;
  href: string;
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
};

export type ServiceProblem = {
  title: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceRelatedPost = {
  title: string;
  /** Blog slug — links to /blog/<slug>/ when the blog module ships. */
  slug: string;
  description?: string;
};

/** CMS-ready image / visual slot for future assets. */
export type ServiceVisual = {
  type?: "diagram" | "screenshot" | "illustration" | "photo";
  image?: string;
  mobileImage?: string;
  alt?: string;
  caption?: string;
  position?: "left" | "right" | "full";
  priority?: boolean;
};

export type ServiceEditorialIntro = {
  /** Large editorial statement (displayed prominently). */
  statement: string;
  /** Supporting paragraph — not a repeat of the hero. */
  supporting: string;
  pullQuote?: string;
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
  | "caseStudies"
  | "faqs"
  | "relatedServices"
  | "relatedPosts";

export type ServiceSectionVisibility = Partial<Record<ServiceSectionKey, boolean>>;

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
  /** Internal SEO brief — not rendered on the public page */
  seoBrief: ServiceSeoBrief;
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
  useCases: ServiceUseCase[];
  audiences: ServiceAudience[];
  deliverables: ServiceDeliverable[];
  benefits: ServiceBenefit[];
  /** Public project slugs from settings/projects.ts */
  caseStudySlugs?: string[];
  faqs: ServiceFaq[];
  relatedServiceSlugs: string[];
  relatedPosts: ServiceRelatedPost[];
  seo: ServiceSeo;
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
  "caseStudies",
  "faqs",
  "relatedServices",
  "relatedPosts",
];
