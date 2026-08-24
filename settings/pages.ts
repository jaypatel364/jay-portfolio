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
      title: "Jay Patel — full-stack developer in India",
      description:
        "Based in India, building with React, Next.js, and Node.js since late 2022. " +
        "I ship real-time features, configurable form platforms (100+ flows), and MERN apps — " +
        "owning the path from architecture through deploy.",
      chips: [
        "India · remote-friendly",
        "React · Next.js · Node.js",
        "Open to freelance & collaboration",
      ],
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
      "production MERN apps — the full-stack skills and services Jay Patel ships with.",
    homeCta: "See skills & services",
    placeholder: null,
    hero: {
      label: "Skills & services",
      title: "React, Next.js, and Node.js — skills I use in production",
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
      title: "Projects I've shipped — MERN apps and case studies",
      description:
        "Real-time chat, a headless CMS, GraphQL social APIs, plus NDA work in HR, NGO tooling, " +
        "and KYC. Filter by layer, skim the highlights, open a write-up when one exists.",
      chips: [
        "Full-stack · frontend · backend",
        "Live demos where possible",
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
      title: "Hire a full-stack developer — contact Jay Patel",
      description:
        "Freelance sprint, collaboration, or a short intro call. Use the form, email, or book " +
        "15 minutes on Calendly. Based in India, open to remote and hybrid — I reply within a day.",
      chips: ["Replies within 24 hours", "Remote from India", "Freelance & collaboration"],
    },
  },
} as const;

export type InnerPageKey = keyof typeof innerPages;
