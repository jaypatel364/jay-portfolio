/**
 * Inner route copy — titles, intros, and home-section CTA labels.
 * Page bodies will grow in dedicated section components (next pass).
 */

import { siteConfig } from "./index";

export const innerPages = {
  about: {
    path: "/about",
    navId: "about",
    label: "About",
    title: "About Jay Patel — Full Stack Developer in India",
    description:
      `${siteConfig.fullName} builds production MERN apps from India — real-time systems, ` +
      `large configurable form flows, and React/Next.js frontends that hold up under real users.`,
    homeCta: "Know more about Jay Patel",
    placeholder: null,
    hero: {
      label: "About me",
      title: "Full-stack developer who ships real products",
      description:
        "I'm Jay Patel — based in India, building MERN apps with React, Next.js, and Node.js. " +
        "From real-time chat to 100+ form flows, I own the work from architecture through deploy.",
      chips: ["Based in India", "Remote-friendly", "Open to full-time & freelance"],
    },
    contactSection: {
      label: "Contact",
      title: "Let's work together",
      description:
        "Have a role, a project, or just a question? Send a message — I reply to every email.",
    },
  },
  skills: {
    path: "/skills",
    navId: "skills",
    label: "Skills",
    title: "Skills & Services — React, Next.js, Node.js, MERN",
    description:
      "What Jay builds: React and Next.js frontends, Node.js APIs, real-time features, complex form platforms, " +
      "and production-ready MERN apps — plus the stack behind them.",
    homeCta: "Explore the full stack",
    placeholder: null,
    hero: {
      label: "Skills & stack",
      title: "The MERN stack I ship with daily",
      description:
        "A detailed look at the tools, frameworks, and practices behind my work — from React and Next.js " +
        "frontends to Node.js APIs, databases, and production deploys.",
      chips: ["24+ technologies", "TypeScript-first", "Production MERN"],
    },
  },
  work: {
    path: "/work",
    navId: "work",
    label: "Work",
    title: "Work & Projects — Selected Builds by Jay Patel",
    description:
      "Case studies and shipped work — MERN apps, real-time features, and NDA-friendly summaries " +
      "from production roles and side projects.",
    homeCta: "View all selected work",
    placeholder: null,
    hero: {
      label: "Selected work",
      title: "Production apps I've shipped",
      description:
        "Real MERN builds — real-time chat, complex form platforms, and full-stack products. " +
        "Filter by category, read the highlights, and dive into case studies where available.",
      chips: ["MERN & Next.js", "Case studies", "NDA-friendly summaries"],
    },
  },
  contact: {
    path: "/contact",
    navId: "contact",
    label: "Contact",
    title: "Contact Jay Patel — Hire a Full Stack Developer",
    description:
      "Reach out for full-time roles, freelance MERN work, or a quick intro call. Based in India, " +
      "open to remote and hybrid.",
    homeCta: "Open the contact page",
    placeholder: null,
    hero: {
      label: "Contact",
      title: "Let's talk about your next build",
      description:
        "Full-time hire, freelance sprint, or a quick intro — email, form, or book a 15-minute call. " +
        "I reply to every message.",
      chips: ["Replies within 24h", "Remote-friendly", "Full-time & freelance"],
    },
  },
} as const;

export type InnerPageKey = keyof typeof innerPages;
