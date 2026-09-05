import type { Service } from "@/lib/services/types";
import type { Project } from "@/settings/projects";
import { ServicePageExperience } from "./ServicePageExperience";

interface ServicePageArticleProps {
  service: Service;
  caseStudyProjects: Project[];
}

export function ServicePageArticle({ service, caseStudyProjects }: ServicePageArticleProps) {
  return <ServicePageExperience service={service} caseStudyProjects={caseStudyProjects} />;
}
