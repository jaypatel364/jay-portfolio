/** Structured long-form content for a published `/work/<slug>/` page. */

export interface ProjectFeature {
  /** Product capability, not a technology name. */
  title: string;
  description: string;
}

export interface ProjectDecision {
  title: string;
  why: string;
  tradeoff: string;
}

export interface ProjectArchitecture {
  /** Top-to-bottom flow labels for the diagram. */
  layers: string[];
  explanation: string;
}

export interface ProjectTechGroup {
  group: string;
  items: string[];
}

/** Contextual internal link — sentence + descriptive anchor (never "click here"). */
export interface ProjectInternalLink {
  sentence: string;
  anchor: string;
  href: string;
}

export interface ProjectDetailSeo {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  primaryTopic: string;
  secondaryTopics: string[];
}

export interface ProjectDetail {
  slug: string;
  /** 50–100 words directly under the H1. */
  intro: string;
  /** 100–150 words — Project Overview section. */
  overview: string;
  /** Bullet list — My Role section. */
  role: string[];
  /** The Problem section. */
  problem: string;
  /** How I Built It — paragraphs separated by a blank line. */
  build: string;
  /** @deprecated Renamed to `build` — kept for older content files. */
  approach?: string;
  features: ProjectFeature[];
  architecture: ProjectArchitecture;
  decisions: ProjectDecision[];
  /** Challenges and Trade-offs bullets. */
  tradeoffs?: string[];
  stack: ProjectTechGroup[];
  /** Outcome bullets — observable results only, never invented metrics. */
  outcome: string[];
  /** What I Learned — only when there is a genuine engineering lesson. */
  learned?: string[];
  /** Shown instead of code/demo links when the work is confidential. */
  ndaNotice?: string;
  /** Descriptive alt text for the cover screenshot. Falls back to project title. */
  imageAlt?: string;
  /** Slugs for Related Projects — defaults to same-category picks if omitted. */
  relatedSlugs?: string[];
  internalLinks?: ProjectInternalLink[];
  seo: ProjectDetailSeo;
}
