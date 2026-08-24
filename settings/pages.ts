/**
 * Inner route copy — titles, intros, and home-section CTA labels.
 * Hero H1 + description are crawlable; keep them human and keyword-clear.
 */

export const innerPages = {
  about: {
    path: "/about",
    navId: "about",
    label: "About",
    title: "About Jay Patel | Full Stack Developer in India",
    description:
      "Jay Patel is a full-stack developer in India (since 2022). React, Next.js, and Node.js — " +
      "real-time systems, large form platforms, and production MERN apps built end to end.",
    homeCta: "Read More About Me",
    placeholder: null,
    hero: {
      label: "About",
      title: "About Jay Patel",
      description:
        "I'm Jay Patel, a Full Stack Developer with {expLabel} years of professional experience building modern web applications with React, Next.js, Node.js, TypeScript and the MERN stack.",
      chips: ["Remote-friendly", "React · Next.js · Node.js", "Open to freelance & collaboration"],
    },
    contactSection: {
      label: "Contact",
      title: "Want to work together?",
      description:
        "Freelance scope, collaboration, or a quick question — send a message. I reply to every one.",
    },
  },
  skills: {
    path: "/skills",
    navId: "skills",
    label: "Skills",
    title: "Full Stack Skills & Services | React, Next.js, Node.js",
    description:
      "React and Next.js frontends, Node.js APIs, real-time features, MongoDB/PostgreSQL, and " +
      "production MERN apps — the full-stack skills and services Jay Patel builds projects with.",
    homeCta: "See skills & services",
    placeholder: null,
    hero: {
      label: "Skills & services",
      title: "Full Stack Development Skills",
      description:
        "Not a buzzword list. Every layer below shows up in shipped work: frontends people use, " +
        "APIs that stay predictable, databases that match the product, and deploys that don't panic.",
      chips: ["MERN & TypeScript", "24+ tools in production", "Services + process"],
    },
  },
  work: {
    path: "/work",
    navId: "work",
    label: "Work",
    title: "Work & Projects | Jay Patel Full Stack Portfolio",
    description:
      "Selected projects by Jay Patel — real-time chat, headless CMS, social APIs, and production " +
      "MERN apps. Case studies and NDA-friendly summaries from shipped work.",
    homeCta: "Browse Featured Projects",
    placeholder: null,
    hero: {
      label: "Work",
      title: "Full Stack Projects and Production Work",
      description:
        "A selection of applications and systems I have built across real-time communication, APIs, content management, HR workflows, NGO platforms, and identity verification.",
      chips: [
        "Full-stack applications",
        "Production Ready · Live Demos Available",
        "NDA summaries included",
      ],
    },
  },
  contact: {
    path: "/contact",
    navId: "contact",
    label: "Contact",
    title: "Hire Jay Patel | Full Stack Developer Contact",
    description:
      "Contact Jay Patel for freelance full-stack development in India. MERN builds, collaboration, " +
      "or a 15-minute intro call — remote-friendly, replies within 24 hours.",
    homeCta: "Go to contact",
    placeholder: null,
    hero: {
      label: "Contact",
      title: "Let's talk about your project",
      description:
        "Have a project in mind, need help with an existing product, or looking for a developer to join the work? " +
        "Send me a few details and I'll get back to you within 24 hours.",
      chips: [
        "Usually replies within 24 hours",
        "Based in India · remote-friendly",
        "Freelance & collaboration",
      ],
    },
  },
} as const;

export type InnerPageKey = keyof typeof innerPages;
