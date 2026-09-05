"use client";

import type { Service, ServiceSectionKey } from "@/lib/services/types";
import type { Project } from "@/settings/projects";
import {
  getRelatedServices,
  getServiceSectionOrder,
  isServiceSectionVisible,
} from "@/lib/services";
import { ServiceHero } from "./ServiceHero";
import { ServiceFaqAccordion } from "./ServiceFaqAccordion";
import { ServiceRelatedEcosystem } from "./ServiceRelatedEcosystem";
import { ServiceResourcesRail } from "./ServiceResourcesRail";
import {
  ServiceWhatWeDoSection,
  ServiceCapabilitiesSection,
  ServiceProblemsSection,
  ServiceProcessSection,
  ServiceTechnologiesSection,
  ServicePiecesConnectSection,
  ServiceUseCasesSection,
  ServiceAudiencesSection,
  ServiceDeliverablesSection,
  ServiceBenefitsSection,
  ServiceCaseStudiesSection,
} from "./sections";

interface ServicePageExperienceProps {
  service: Service;
  caseStudyProjects: Project[];
}

/**
 * Service detail page — canonical 15-section IA, natural scroll, no sticky nav.
 * Hero first; remaining sections follow DEFAULT_SERVICE_SECTION_ORDER.
 * Global Contact CTA is rendered by SiteChrome — not duplicated here.
 */
export function ServicePageExperience({ service, caseStudyProjects }: ServicePageExperienceProps) {
  const related = getRelatedServices(service);
  const order = getServiceSectionOrder(service);

  const renderSection = (key: ServiceSectionKey) => {
    if (!isServiceSectionVisible(service, key)) return null;

    switch (key) {
      case "whatWeDo":
        return <ServiceWhatWeDoSection key={key} service={service} />;
      case "capabilities":
        return <ServiceCapabilitiesSection key={key} service={service} />;
      case "problems":
        return <ServiceProblemsSection key={key} service={service} />;
      case "process":
        return <ServiceProcessSection key={key} service={service} />;
      case "technologies":
        return <ServiceTechnologiesSection key={key} service={service} />;
      case "piecesConnect":
      case "architecture":
        return <ServicePiecesConnectSection key={key} service={service} />;
      case "useCases":
        return <ServiceUseCasesSection key={key} service={service} />;
      case "audiences":
        return <ServiceAudiencesSection key={key} service={service} />;
      case "deliverables":
        return <ServiceDeliverablesSection key={key} service={service} />;
      case "benefits":
        return <ServiceBenefitsSection key={key} service={service} />;
      case "caseStudies":
        return caseStudyProjects.length ? (
          <ServiceCaseStudiesSection key={key} service={service} projects={caseStudyProjects} />
        ) : null;
      case "faqs":
        return service.faqs.length ? <ServiceFaqAccordion key={key} service={service} /> : null;
      case "relatedServices":
        return related.length ? (
          <ServiceRelatedEcosystem key={key} service={service} related={related} />
        ) : null;
      case "relatedPosts":
        return service.relatedPosts.length ? (
          <ServiceResourcesRail key={key} service={service} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <article itemScope itemType="https://schema.org/Service">
      <meta itemProp="name" content={service.title} />
      <meta itemProp="description" content={service.seo.description} />

      <ServiceHero service={service} />
      {order.map((key) => renderSection(key))}
    </article>
  );
}
