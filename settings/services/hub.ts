import type { ServicesHubSettings } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA, SERVICE_WORK_CTA } from "./shared";

export const servicesHub: ServicesHubSettings = {
  path: "/services",
  label: "Services",
  hero: {
    label: "Services",
    title: "Full Stack Web Development Services",
    description:
      "Looking to hire a full stack developer who delivers real results? I build clean, fast web apps for real businesses, not just demos.\n\nEvery project is built to scale. Custom design or a full build, you get reliable, honest work shaped around your product, not a generic package off a shelf.",
    primaryCta: SERVICE_CONTACT_CTA,
    secondaryCta: SERVICE_WORK_CTA,
    chips: ["Custom software", "Web development", "Full-stack development"],
  },
  overview: {
    label: "Overview",
    title: "End-to-End Web Development for Modern Products",
    description:
      "I'm a full stack developer. I handle the whole build, from the first line of code to launch day. One person, one point of contact, a product that ships faster.",
  },
  seo: {
    title: "Full Stack Web Development Services | Jay Patel",
    description:
      "Hire a full stack developer for web development, backend, frontend, MERN stack, MVP, and SaaS development services built to scale.",
    focusKeyword: "full stack web development services",
    keywords: [
      "full stack web development services",
      "hire a full stack developer",
      "web development",
      "backend development",
      "frontend development",
      "MERN stack development",
      "MVP development",
      "SaaS development services",
      "Jay Patel developer",
    ],
  },
};
