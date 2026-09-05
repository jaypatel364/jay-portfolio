import type { ServicesHubSettings } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA, SERVICE_WORK_CTA } from "./shared";

export const servicesHub: ServicesHubSettings = {
  path: "/services",
  label: "Services",
  hero: {
    label: "Services",
    title: "Software Development Services for Scalable Digital Products",
    description:
      "I help startups, SaaS companies, and product teams design, build, and improve production web applications — " +
      "from MVPs and full-stack products to backend APIs, frontend experiences, and performance work.",
    primaryCta: SERVICE_CONTACT_CTA,
    secondaryCta: SERVICE_WORK_CTA,
    chips: ["Custom software", "Web development", "Full-stack development"],
  },
  seo: {
    title: "Software Development Services | Full-Stack, SaaS & MVP | Jay Patel",
    description:
      "Full-stack product development, SaaS development, MVP builds, API engineering, frontend development, and performance optimization for startups and product teams.",
    focusKeyword: "software development services",
    keywords: [
      "software development services",
      "custom software",
      "web development",
      "full-stack development",
      "full stack development services",
      "SaaS development services",
      "MVP development",
      "Jay Patel developer",
    ],
  },
};
