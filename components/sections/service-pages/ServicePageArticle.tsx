import type { Service } from "@/lib/services/types";
import type { BlogPostCard } from "@/lib/sanity/types";
import type { Project } from "@/settings/projects";
import { ServicePageExperience } from "./ServicePageExperience";

interface ServicePageArticleProps {
  service: Service;
  caseStudyProjects: Project[];
  relatedBlogPosts: BlogPostCard[];
}

export function ServicePageArticle({
  service,
  caseStudyProjects,
  relatedBlogPosts,
}: ServicePageArticleProps) {
  return (
    <ServicePageExperience
      service={service}
      caseStudyProjects={caseStudyProjects}
      relatedBlogPosts={relatedBlogPosts}
    />
  );
}
