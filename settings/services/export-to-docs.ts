/**
 * Export service page content to section-wise markdown for Google Docs / SEO editing.
 *
 * Run: npm run export:service-content
 * Output: settings/services/content-docs/
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Service, ServicesHubSettings } from "@/lib/services/types";
import { DEFAULT_SERVICE_SECTION_ORDER } from "@/lib/services/types";
import { servicesHub } from "./hub";
import { ALL_SERVICES } from "./pages";

const OUTPUT_DIR = join(import.meta.dirname, "content-docs");

function lines(...parts: Array<string | undefined | null>): string {
  return parts.filter(Boolean).join("\n");
}

function divider(): string {
  return "\n---\n";
}

function block(label: string, value?: string | null): string {
  if (!value?.trim()) return "";
  return `**${label}:**\n${value.trim()}\n`;
}

function listBlock(label: string, items?: string[]): string {
  if (!items?.length) return "";
  return `**${label}:**\n${items.map((item) => `- ${item}`).join("\n")}\n`;
}

function exportHub(hub: ServicesHubSettings): string {
  const { hero, seo } = hub;
  return lines(
    `# Services Hub`,
    ``,
    `**URL:** ${hub.path}/`,
    ``,
    divider().trim(),
    `## SEO (Meta)`,
    ``,
    block("Page title", seo.title),
    block("Meta description", seo.description),
    block("Focus keyword", seo.focusKeyword),
    listBlock("Keywords", seo.keywords),
    divider().trim(),
    `## Hero Banner`,
    ``,
    block("Label", hero.label),
    block("H1", hero.title),
    block("Description", hero.description),
    block("Primary CTA", `${hero.primaryCta.label} → ${hero.primaryCta.href}`),
    hero.secondaryCta
      ? block("Secondary CTA", `${hero.secondaryCta.label} → ${hero.secondaryCta.href}`)
      : "",
    listBlock("Chips", hero.chips),
  );
}

function exportSeoMeta(service: Service): string {
  const { seo, coverImage } = service;
  return lines(
    `## SEO (Meta)`,
    ``,
    block("Page title", seo.title),
    block("Meta description", seo.description),
    block("Focus keyword", seo.focusKeyword),
    listBlock("Keywords", seo.keywords),
    block("OG title", seo.ogTitle),
    block("OG description", seo.ogDescription),
    coverImage ? block("Cover image title", coverImage.title) : "",
    coverImage ? block("Cover image alt", coverImage.alt) : "",
  );
}

function exportSeoBrief(service: Service): string {
  const { seoBrief } = service;
  return lines(
    `## SEO Brief (internal — not shown on page)`,
    ``,
    block("Primary keyword", seoBrief.primaryKeyword),
    block("Search intent", seoBrief.searchIntent),
    block("Conversion intent", seoBrief.conversionIntent),
    listBlock("Secondary keywords", seoBrief.secondaryKeywords),
    listBlock("Long-tail questions", seoBrief.longTailQuestions),
    listBlock("Related entities", seoBrief.relatedEntities),
  );
}

function exportHero(service: Service): string {
  const { hero } = service;
  const headline = hero.headlineLines?.length ? hero.headlineLines.join("\n") : undefined;
  return lines(
    `## Hero Banner`,
    ``,
    block("H1", hero.heading),
    headline ? block("Headline lines", headline) : "",
    block("Description", hero.description),
    block("Primary CTA", `${hero.primaryCta.label} → ${hero.primaryCta.href}`),
    hero.secondaryCta
      ? block("Secondary CTA", `${hero.secondaryCta.label} → ${hero.secondaryCta.href}`)
      : "",
    listBlock("Trust indicators", hero.trustIndicators),
    listBlock("Technologies", hero.technologies),
  );
}

function exportWhatWeDo(service: Service): string {
  const { whatWeDo, overview, editorialIntro } = service;
  const paragraphs = whatWeDo.paragraphs.map((p, i) => block(`Paragraph ${i + 1}`, p)).join("\n");
  return lines(
    `## What I Do`,
    ``,
    block("Heading (H2)", whatWeDo.heading),
    block("Overview", overview),
    editorialIntro ? block("Editorial statement", editorialIntro.statement) : "",
    editorialIntro ? block("Editorial supporting", editorialIntro.supporting) : "",
    editorialIntro?.pullQuote ? block("Pull quote", editorialIntro.pullQuote) : "",
    paragraphs,
    listBlock("What we build", service.whatWeBuild),
  );
}

function exportCapabilities(service: Service): string {
  const items = service.capabilities
    .map((cap) =>
      lines(
        `### ${cap.title}`,
        ``,
        block("Description", cap.description),
        cap.relatedServiceSlug ? block("Related service", cap.relatedServiceSlug) : "",
      ),
    )
    .join("\n");
  return lines(
    `## Service Capabilities`,
    ``,
    block("Section heading (H2)", "Service Capabilities"),
    items,
  );
}

function exportProblems(service: Service): string {
  const items = service.problems
    .map((p) => lines(`### ${p.title}`, ``, block("Description", p.description)))
    .join("\n");
  return lines(`## Problems I Solve`, ``, block("Section heading (H2)", "Problems I Solve"), items);
}

function exportProcess(service: Service): string {
  const steps = service.process
    .map((step, i) =>
      lines(`### Step ${i + 1}: ${step.title}`, ``, block("Description", step.description)),
    )
    .join("\n");
  return lines(`## My Process`, ``, block("Section heading (H2)", "My Process"), steps);
}

function exportTechnologies(service: Service): string {
  const groups = service.technologies
    .map((group) => lines(`### ${group.category}`, ``, listBlock("Tools", group.items)))
    .join("\n");
  return lines(
    `## Technologies & Tools`,
    ``,
    block("Section heading (H2)", "Technologies & Tools"),
    groups,
  );
}

function exportPiecesConnect(service: Service): string {
  return lines(
    `## How the Pieces Connect`,
    ``,
    block("Section heading (H2)", "How the Pieces Connect"),
    block("Overview / system story", service.overview),
    listBlock("Industries", service.industries),
    listBlock("What we build", service.whatWeBuild),
  );
}

function exportUseCases(service: Service): string {
  const items = service.useCases
    .map((uc) => lines(`### ${uc.title}`, ``, block("Description", uc.description)))
    .join("\n");
  return lines(`## Use Cases`, ``, block("Section heading (H2)", "Use Cases"), items);
}

function exportAudiences(service: Service): string {
  const items = service.audiences
    .map((a) => lines(`### ${a.title}`, ``, block("Description", a.description)))
    .join("\n");
  return lines(
    `## Who This Service Is For`,
    ``,
    block("Section heading (H2)", "Who This Service Is For"),
    items,
  );
}

function exportDeliverables(service: Service): string {
  const items = service.deliverables
    .map((d) => lines(`### ${d.title}`, ``, block("Description", d.description)))
    .join("\n");
  return lines(`## Deliverables`, ``, block("Section heading (H2)", "Deliverables"), items);
}

function exportBenefits(service: Service): string {
  const items = service.benefits
    .map((b) =>
      lines(
        `### ${b.title}`,
        ``,
        block("Type", b.kind === "benefit" ? "Benefit" : "Outcome"),
        block("Description", b.description),
      ),
    )
    .join("\n");
  return lines(
    `## Benefits & Outcomes`,
    ``,
    block("Section heading (H2)", "Benefits & Outcomes"),
    items,
  );
}

function exportWhyHire(service: Service): string {
  const { whyHire } = service;
  const reasons = whyHire.reasons
    .map((r) =>
      lines(`### ${r.title}`, ``, block("Tag", r.tag), block("Description", r.description)),
    )
    .join("\n");
  const highlights = whyHire.highlights?.map((h) => `- **${h.label}:** ${h.value}`).join("\n");
  return lines(
    `## Why Hire Me`,
    ``,
    block("Section heading (H2)", `Why Hire Me as a ${whyHire.roleTitle}?`),
    block("Intro", whyHire.intro),
    reasons,
    highlights ? `**Highlights:**\n${highlights}\n` : "",
  );
}

function exportCaseStudies(service: Service): string {
  if (!service.caseStudySlugs?.length) return "";
  return lines(
    `## Case Studies / Work Examples`,
    ``,
    block("Section heading (H2)", "Case Studies / Work Examples"),
    listBlock("Project slugs", service.caseStudySlugs),
    `_Card titles and excerpts are pulled from project settings at render time._`,
  );
}

function exportFaqs(service: Service): string {
  if (!service.faqs.length) return "";
  const items = service.faqs
    .map((faq) => lines(`### ${faq.question}`, ``, block("Answer", faq.answer)))
    .join("\n");
  return lines(`## FAQ`, ``, block("Section heading (H2)", "FAQ"), items);
}

function exportRelatedServices(service: Service): string {
  if (!service.relatedServiceSlugs.length) return "";
  return lines(
    `## You May Also Need`,
    ``,
    block("Section heading (H2)", "You May Also Need"),
    listBlock("Related service slugs", service.relatedServiceSlugs),
  );
}

function exportRelatedPosts(service: Service): string {
  if (!service.relatedPosts.length) return "";
  return lines(
    `## Related Articles & Guides`,
    ``,
    block("Section heading (H2)", "Related Articles & Guides"),
    listBlock("Blog post slugs", service.relatedPosts),
    `_Card titles and excerpts are pulled from Sanity at render time._`,
  );
}

const SECTION_EXPORTERS: Record<string, (service: Service) => string> = {
  whatWeDo: exportWhatWeDo,
  capabilities: exportCapabilities,
  problems: exportProblems,
  process: exportProcess,
  technologies: exportTechnologies,
  piecesConnect: exportPiecesConnect,
  architecture: exportPiecesConnect,
  useCases: exportUseCases,
  audiences: exportAudiences,
  deliverables: exportDeliverables,
  benefits: exportBenefits,
  whyHire: exportWhyHire,
  caseStudies: exportCaseStudies,
  faqs: exportFaqs,
  relatedServices: exportRelatedServices,
  relatedPosts: exportRelatedPosts,
};

function exportService(service: Service): string {
  const sectionOrder = service.sectionOrder ?? DEFAULT_SERVICE_SECTION_ORDER;
  const sections = sectionOrder
    .map((key) => {
      if (service.sectionVisibility?.[key] === false) return "";
      const exporter = SECTION_EXPORTERS[key];
      return exporter ? exporter(service) : "";
    })
    .filter(Boolean)
    .join(divider());

  return lines(
    `# ${service.title}`,
    ``,
    `**URL:** /services/${service.slug}/`,
    service.updatedAt ? `**Last updated:** ${service.updatedAt}` : "",
    service.readTimeMinutes ? `**Read time:** ${service.readTimeMinutes} min` : "",
    ``,
    divider().trim(),
    `## Page Summary (Hub Card)`,
    ``,
    block("Card title", service.title),
    block("Short description", service.shortDescription),
    listBlock("Card capabilities", service.cardCapabilities),
    listBlock("Category labels", service.categoryLabels),
    divider().trim(),
    exportSeoMeta(service),
    divider().trim(),
    exportSeoBrief(service),
    divider().trim(),
    exportHero(service),
    divider().trim(),
    sections,
  );
}

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  writeFileSync(join(OUTPUT_DIR, "00-services-hub.md"), exportHub(servicesHub), "utf8");

  for (const service of ALL_SERVICES) {
    const filename = `${String(service.order).padStart(2, "0")}-${service.slug}.md`;
    writeFileSync(join(OUTPUT_DIR, filename), exportService(service), "utf8");
  }

  writeFileSync(
    join(OUTPUT_DIR, "README.md"),
    lines(
      `# Service content docs`,
      ``,
      `Section-wise copy for Google Docs and SEO editing. Generated from \`settings/services/pages/*.ts\`.`,
      ``,
      `## Regenerate`,
      ``,
      `\`\`\`bash`,
      `npm run export:service-content`,
      `\`\`\``,
      ``,
      `## Files`,
      ``,
      `- \`00-services-hub.md\` — /services/ hub page`,
      ...ALL_SERVICES.map(
        (s) => `- \`${String(s.order).padStart(2, "0")}-${s.slug}.md\` — /services/${s.slug}/`,
      ),
      ``,
      `## Format`,
      ``,
      `Each file uses \`---\` between sections. Labels like **H1**, **Heading (H2)**, and **Description** map to page fields. Edit here for review, then apply changes back to the matching \`.ts\` file.`,
    ),
    "utf8",
  );

  console.log(`Exported ${ALL_SERVICES.length + 1} docs to ${OUTPUT_DIR}`);
}

main();
