import type { ServicesHubSettings } from "@/lib/services/types";
import { SERVICE_CONTACT_CTA, SERVICE_WORK_CTA } from "./shared";

export const servicesHub: ServicesHubSettings = {
  path: "/services",
  label: "Services",
  hero: {
    label: "Services",
    title: "Full Stack Web Development Services",
    description:
      "Looking to hire a full stack developer who delivers real results? Jay Patel provides professional web development services which are clean and fast. All projects are designed to scale from custom web design to full stack web development. Get quality, reliable and affordable personalized web application development services for your business goals.",
    primaryCta: SERVICE_CONTACT_CTA,
    secondaryCta: SERVICE_WORK_CTA,
    chips: ["Custom software", "Web development", "Full-stack development"],
  },
  seo: {
    title: "Full Stack Web Development Services | Jay Patel",
    description:
      "Custom full stack web development services using React, Next.js, Node.js and TypeScript. Build scalable web applications, SaaS products and MVPs with Jay Patel.",
    focusKeyword: "software development services",
    keywords: [
      "software development services",
      "custom software",
      "web development",
      "full-stack development",
      "full stack development services",
      "SaaS development services",
      "MVP development",
      "MERN stack development",
      "Jay Patel developer",
    ],
  },
};
