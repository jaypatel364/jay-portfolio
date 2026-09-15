import type { Service } from "./types";
import type { ServiceSectionHeadings } from "./section-headings";

/** Per-section H2 supporting paragraph — one string per scroll section. */
export type ServiceSectionSupport = Partial<Record<keyof ServiceSectionHeadings, string>>;

const STATIC_DEFAULTS: Partial<Record<keyof ServiceSectionHeadings, string>> = {
  capabilities:
    "A complete look at the capabilities included in this engagement — scoped to your product, not a generic agency checklist.",
  problems:
    "Common challenges this service addresses — stated plainly, without generic agency filler.",
  process: "How I approach this service from discovery through delivery.",
  technologies: "Stack grouped by layer — chosen for maintainability, not hype.",
  piecesConnect: "These are not isolated deliverables — they work together as one product system.",
  useCases: "Product contexts where this engagement delivers the most value.",
  audiences:
    "Recognize yourself in one of these profiles — each maps to a different starting point.",
  deliverables: "Concrete outputs from this engagement — not vague promises.",
  benefits:
    "What you gain from the engagement, and what improves in your product after delivery — not vanity metrics.",
  relatedServices: "Services that often complement this engagement.",
  relatedPosts:
    "Topic clusters connect services with deeper articles — explore guides related to this service.",
};

function dynamicDefault(service: Service, key: keyof ServiceSectionHeadings): string | undefined {
  if (key === "caseStudies") {
    return `The projects I've worked on that are related to ${service.title.toLowerCase()}.`;
  }
  if (key === "faqs") {
    return `Practical answers about scope, timeline, technology, and how I work on ${service.seo.focusKeyword} engagements.`;
  }
  return undefined;
}

/** H2 supporting copy for a section — prefers service.sectionSupport, then section-specific fallbacks. */
export function getServiceSectionSupport(
  service: Service,
  key: keyof ServiceSectionHeadings,
): string {
  const custom = service.sectionSupport?.[key]?.trim();
  if (custom) return custom;

  if (key === "whyHire") {
    const intro = service.whyHire.intro.trim();
    if (intro) return intro;
  }

  const dynamic = dynamicDefault(service, key);
  if (dynamic) return dynamic;

  return STATIC_DEFAULTS[key] ?? "";
}
