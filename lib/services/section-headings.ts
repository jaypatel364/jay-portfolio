import type { Service, ServiceHeadingKeywords, ServiceSectionKey } from "./types";

export type ServiceSectionHeadings = Record<
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
>;

/** Master H2 templates — same pattern on every service detail page. */
export const SERVICE_H2_TEMPLATES = {
  whatWeDo: (k: ServiceHeadingKeywords) => `What My ${k.keyword} Services Include`,
  capabilities: (k: ServiceHeadingKeywords) => `${k.keywordVariant} Capabilities`,
  problems: (k: ServiceHeadingKeywords) => `Common ${k.keyword} Challenges I Solve`,
  process: (k: ServiceHeadingKeywords) => `My ${k.keyword} Process`,
  technologies: (k: ServiceHeadingKeywords) => `${k.keyword} Technologies I Use`,
  piecesConnect: (k: ServiceHeadingKeywords) => `How ${k.piecesKeyword} Come Together`,
  useCases: (k: ServiceHeadingKeywords) => `Where ${k.keyword} Applies`,
  audiences: (k: ServiceHeadingKeywords) => `Who My ${k.keyword} Services Are For`,
  deliverables: (k: ServiceHeadingKeywords) => `What's Included in My ${k.keyword} Services`,
  benefits: (k: ServiceHeadingKeywords) => `Benefits of ${k.keywordVariant}`,
  whyHire: (k: ServiceHeadingKeywords) => `Why Hire Me as a ${k.roleKeyword}?`,
  caseStudies: (k: ServiceHeadingKeywords) => `${k.keyword} Projects & Examples`,
  faqs: (k: ServiceHeadingKeywords) => `${k.keyword} Services FAQs`,
  relatedServices: (k: ServiceHeadingKeywords) => `Related ${k.keyword} Services`,
  relatedPosts: (k: ServiceHeadingKeywords) => `${k.keyword} Guides & Resources`,
} as const satisfies Record<keyof ServiceSectionHeadings, (k: ServiceHeadingKeywords) => string>;

/** Build all section H2s from a service's keyword set. */
export function getServiceSectionHeadings(service: Service): ServiceSectionHeadings {
  const k = service.headingKeywords;
  const headings = {} as ServiceSectionHeadings;

  for (const key of Object.keys(SERVICE_H2_TEMPLATES) as (keyof ServiceSectionHeadings)[]) {
    headings[key] = SERVICE_H2_TEMPLATES[key](k);
  }

  return headings;
}

export function getServiceSectionHeading(
  service: Service,
  key: keyof ServiceSectionHeadings,
): string {
  return getServiceSectionHeadings(service)[key];
}

/** Map section renderer keys to heading keys (for shells that use ServiceSectionKey). */
export const SECTION_KEY_TO_HEADING: Partial<
  Record<ServiceSectionKey, keyof ServiceSectionHeadings>
> = {
  whatWeDo: "whatWeDo",
  capabilities: "capabilities",
  problems: "problems",
  process: "process",
  technologies: "technologies",
  piecesConnect: "piecesConnect",
  architecture: "piecesConnect",
  useCases: "useCases",
  audiences: "audiences",
  deliverables: "deliverables",
  benefits: "benefits",
  whyHire: "whyHire",
  caseStudies: "caseStudies",
  faqs: "faqs",
  relatedServices: "relatedServices",
  relatedPosts: "relatedPosts",
};
