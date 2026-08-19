/**
 * Content — copy and static lists that power UI sections.
 * FAQ, headline words, marquee stack, learning badges, etc.
 */

import type { BuildingItem, FAQItem, LearningItem } from "./types";

export const content = {
  /** Words that cycle in the hero headline. Keep short (1–3 words). */
  headlineWords: ["clean UIs", "scalable apps", "robust APIs", "real products", "great UX"],

  /** How many skills to show per category in the Skills "All" grid. */
  skillPreviewCounts: {
    Frontend: 8,
    Backend: 8,
    "Tools & DevOps": 8,
  } as Record<string, number>,

  /** About section tech marquee. Comment out / empty to hide. */
  dailyStack: [
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "▲" },
    { name: "TypeScript", icon: "🔷" },
    { name: "Node.js", icon: "🟢" },
    { name: "Express", icon: "🚂" },
    { name: "MongoDB", icon: "🍃" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "Redis", icon: "🔴" },
    { name: "Docker", icon: "🐳" },
    { name: "AWS", icon: "☁️" },
    { name: "Tailwind", icon: "🌊" },
    { name: "Git", icon: "🌿" },
  ] as { name: string; icon: string }[],

  /** About "Currently building" badge. null = hidden. */
  currentlyBuilding: null as BuildingItem | null,

  /** About "What I'm learning" badge. [] = hidden. */
  currentlyLearning: [
    // { name: "Distributed systems", icon: "⚡" },
    // { name: "LLM integrations", icon: "🤖" },
  ] as LearningItem[],

  /** FAQ accordion items. category: "work" | "tech" | "personal" | "process" */
  faqItems: [
    {
      category: "work" as const,
      question: "Are you currently available for new opportunities?",
      answer:
        "Yes — full-time roles and a few freelance builds. I work remotely from India " +
        "(hybrid if it fits). Use the contact form or book a call.",
    },
    {
      category: "tech" as const,
      question: "What is your primary tech stack right now?",
      answer:
        "React and Next.js with TypeScript on the frontend, Node.js and Express on the backend, " +
        "MongoDB or PostgreSQL for data. Tailwind, Docker, and AWS or Vercel for shipping. " +
        "That's the same stack behind MiniList CMS and the Chat App on this site.",
    },
    {
      category: "process" as const,
      question: "How do you approach a new project from scratch?",
      answer:
        "I start by understanding the problem deeply before writing a single line of code — " +
        "requirements, users, constraints. Then I sketch the data model and API contract, " +
        "set up the project scaffold with CI/CD from day one, build in small vertical slices, " +
        "and iterate fast with regular feedback loops.",
    },
    {
      category: "work" as const,
      question: "Do you work remotely or on-site?",
      answer:
        "Primarily remote from India since 2022. Hybrid is on the table " +
        "when the team and the work make sense.",
    },
    {
      category: "tech" as const,
      question: "How do you keep your skills sharp and stay current?",
      answer:
        "I ship small things: Chat App, MiniList CMS, internal tools. I read Next.js and Node " +
        "release notes. I learn fastest when something is in production.",
    },
    {
      category: "personal" as const,
      question: "What kind of work genuinely excites you?",
      answer:
        "Work where the UI has to feel instant — real-time chat, big form systems, " +
        "tools that disappear into the product. If it's complex underneath and quiet on the surface, that's the job.",
    },
    {
      category: "process" as const,
      question: "How do you handle tight deadlines and shifting requirements?",
      answer:
        "Write the scope down first. When it moves, I say what slips, cut features, keep quality. " +
        "I've shipped under deadline; silence is worse than a smaller release.",
    },
    {
      category: "personal" as const,
      question: "What's something about you that isn't on your resume?",
      answer:
        "I'll spend an afternoon on a hover that nobody names but everyone feels. " +
        "An internal HR tool I built saved the team hours every week — that quiet win still beats a loud launch.",
    },
  ] as FAQItem[],

  /** Why Choose section — about page proof points + CTA. */
  whyChoose: {
    label: "Why Choose Jay?",
    title: "Why work with a full-stack developer who ships?",
    intro:
      "I build production MERN apps from India — real-time features, complex form flows, " +
      "and frontends that stay fast under real users. You get one person who owns architecture through deploy.",
    points: [
      { icon: "briefcase", text: "Years of production full-stack experience" },
      { icon: "rocket", text: "MERN apps shipped end-to-end" },
      { icon: "zap", text: "Real-time systems & 100+ form flows built" },
      { icon: "shield", text: "TypeScript-first, tested, maintainable code" },
      { icon: "layers", text: "Owns architecture, API, UI, and deployment" },
      { icon: "users", text: "Agile mindset with clear, honest updates" },
      { icon: "globe", text: "Remote-ready — India, open to hybrid" },
      { icon: "graduation", text: "Mentored juniors on real production code" },
      { icon: "clock", text: "On-time delivery with scope you can trust" },
    ] as { icon: string; text: string }[],
    visualCaption:
      "From wireframe to production — I focus on products that feel fast, stay reliable, and scale without drama.",
    cta: {
      title: "Let's start your",
      titleHighlight: "next project",
      titleSuffix: "together",
      description:
        "Full-time roles and freelance builds — reach out for a quick intro or a scoped quote. I reply to every message.",
      button: "Get in touch",
    },
  },

  /**
   * Services / capabilities grid — skills page.
   * Titles + copy are keyword-aware for SEO; keep descriptions concise.
   */
  services: {
    label: "What I Build",
    title: "Full-stack development services I ship for real products",
    intro:
      "From React and Next.js frontends to Node.js APIs, real-time features, and production deploys — " +
      "here’s how I help teams turn ideas into reliable software.",
    items: [
      {
        icon: "layout",
        title: "Full-Stack Web Application Development",
        description:
          "End-to-end MERN apps — React/Next.js UI, Node.js APIs, and databases — shipped as one coherent product.",
      },
      {
        icon: "monitor",
        title: "React & Next.js Frontend Development",
        description:
          "Fast, accessible interfaces with TypeScript, Tailwind, and App Router patterns that feel instant to use.",
      },
      {
        icon: "server",
        title: "Node.js API & Backend Engineering",
        description:
          "REST and GraphQL services with clear contracts, auth, validation, and logging ready for production traffic.",
      },
      {
        icon: "zap",
        title: "Real-Time Systems & Messaging",
        description:
          "Chat, live updates, and presence with WebSockets or similar — low latency UX without fragile hacks.",
      },
      {
        icon: "forms",
        title: "Complex Forms & Workflow Platforms",
        description:
          "Configurable form engines, multi-step flows, and admin tooling — built for scale (100+ forms shipped).",
      },
      {
        icon: "database",
        title: "Database Design (MongoDB & PostgreSQL)",
        description:
          "Schemas that match the product, indexes that stay fast, and migrations you can trust as data grows.",
      },
      {
        icon: "plug",
        title: "API Integrations & Third-Party Systems",
        description:
          "Payments, email, CRM, auth providers, and internal tools wired cleanly with retries and error handling.",
      },
      {
        icon: "gauge",
        title: "Performance, SEO & Accessibility",
        description:
          "Core Web Vitals, semantic HTML, metadata, and UX polish so the product ranks and feels premium.",
      },
      {
        icon: "wrench",
        title: "Maintenance, Mentorship & Handover",
        description:
          "Ongoing fixes, refactors, and clear docs — plus mentoring juniors so the codebase stays healthy.",
      },
    ] as { icon: string; title: string; description: string }[],
  },

  /** Global pre-footer CTA — all pages except contact. On home this block is #contact. */
  globalCta: {
    label: "Start a project",
    availability: "Open to full-time & freelance",
    responseTime: "Replies within 24 hours",
    intents: [
      {
        id: "fulltime",
        label: "Full-time",
        emoji: "💼",
        headlineBefore: "Let's find",
        highlight: "the right hire",
        headlineAfter: "for your product team",
        description:
          "You need a full-stack dev who ships MERN apps without hand-holding — from schema design to deploy.",
        command: "hire jay --role=fullstack --stack=mern",
        primaryCta: "Discuss a role",
        primaryHref: "/contact/",
      },
      {
        id: "freelance",
        label: "Freelance",
        emoji: "🚀",
        headlineBefore: "Let's ship your",
        highlight: "next build",
        headlineAfter: "",
        description:
          "Scoped freelance work — MVPs, feature sprints, or rescuing a stuck codebase. Clear milestones, no fluff.",
        command: "jay ship --mode=freelance --deadline=asap",
        primaryCta: "Scope a project",
        primaryHref: "/contact/",
      },
      {
        id: "call",
        label: "Intro call",
        emoji: "📞",
        headlineBefore: "Let's talk for",
        highlight: "15 minutes",
        headlineAfter: "— no pitch deck needed",
        description:
          "Tell me what you're building and I'll say honestly if I'm the right fit. Quick intro, zero pressure.",
        command: "calendly book --with=jay --duration=15m",
        primaryCta: "Book a call",
        primaryHref: "booking",
      },
    ] as {
      id: string;
      label: string;
      emoji: string;
      headlineBefore: string;
      highlight: string;
      headlineAfter: string;
      description: string;
      command: string;
      primaryCta: string;
      primaryHref: string;
    }[],
    actions: {
      book: { label: "Book a call", hint: "15 min intro" },
      email: { label: "Copy email", hint: "Direct line" },
      message: { label: "Send a message", hint: "Contact form" },
    },
  },

  /** Dedicated /contact page — quick panel + form intro. */
  contactPage: {
    intro:
      "Tell me about your role, product, or freelance scope. I read every message and reply within a day — " +
      "usually much sooner on weekdays.",
    quickContactTitle: "Quick contact",
    profilesTitle: "Find me online",
    profilesIntro: "Prefer a profile you already use? Connect there or book a short intro call.",
    formTitle: "Send a message",
    formIntro: "Share a few details and I’ll get back with next steps — no auto-reply fluff.",
    availability: [
      { icon: "clock", text: "Replies within 24 hours" },
      { icon: "globe", text: "Remote from India" },
      { icon: "briefcase", text: "Full-time & freelance" },
    ] as { icon: string; text: string }[],
    trust: {
      label: "Background",
      title: "Teams I've shipped with",
      intro:
        "Production MERN work for product teams — here's where the day-to-day experience comes from.",
    },
    explore: {
      label: "Explore first",
      title: "Want to see the work before reaching out?",
      intro:
        "Browse projects, the full stack, or my background — then come back when you're ready to talk.",
      items: [
        {
          page: "work",
          description:
            "Selected builds — real-time chat, form platforms, and production MERN apps with case-study depth.",
        },
        {
          page: "skills",
          description:
            "Complete stack breakdown, services I ship, and the process behind each delivery.",
        },
        {
          page: "about",
          description: "Experience, education, GitHub activity, and how I work with teams.",
        },
      ] as { page: "work" | "skills" | "about"; description: string }[],
    },
  },

  /** Skills page — full catalog copy (SEO). Homepage keeps the interactive preview. */
  skillsPage: {
    catalogTitle: "Complete tech stack breakdown",
    catalogIntro:
      "Every tool listed here is something I've used in production — not a buzzword dump. " +
      "Grouped by layer so you can see exactly where React, Next.js, Node.js, MongoDB, and PostgreSQL fit in my day-to-day work.",
    categories: {
      Frontend:
        "React and Next.js with TypeScript for UIs that feel instant — App Router, server components where they help, and Tailwind for consistent design systems.",
      Backend:
        "Node.js and Express (or NestJS) for APIs that stay predictable under load — REST, GraphQL, WebSockets, and clear auth boundaries.",
      "Tools & DevOps":
        "Git, Docker, AWS, and CI habits that get code live without drama — plus testing and design tools that keep quality high.",
    } as Record<string, string>,
    workStrip: {
      label: "In production",
      title: "Where this stack shows up",
      intro:
        "Real MERN builds — not tutorial demos. A quick look at projects that put these skills to work in production.",
    },
  },

  /** Skills page — delivery process (SEO + trust). */
  process: {
    label: "Process",
    title: "How I take a project from idea to production",
    intro:
      "Clear steps, honest scope, and small releases — so you always know where things stand and what ships next.",
    steps: [
      {
        icon: "compass",
        title: "Discover",
        description:
          "Understand the problem, users, and constraints before writing code. Requirements, edge cases, and success metrics get written down first.",
      },
      {
        icon: "layers",
        title: "Architect",
        description:
          "Data model, API contracts, and UI flows — scoped into vertical slices. CI/CD and project scaffold go up on day one.",
      },
      {
        icon: "rocket",
        title: "Ship",
        description:
          "Build in small, demoable increments with regular feedback. Each slice is tested, reviewed, and ready to deploy.",
      },
      {
        icon: "life-buoy",
        title: "Support",
        description:
          "Handover docs, monitoring, and fixes after launch. Ongoing refactors and mentoring so the codebase stays healthy.",
      },
    ] as { icon: string; title: string; description: string }[],
  },

  /** Work page — stats bar labels + stack link strip. */
  workPage: {
    stackLinks: {
      label: "Tech stack",
      title: "Technologies used across this work",
      intro:
        "Every tag below is a tool used in at least one of these projects. See the full breakdown — grouped by layer — on the skills page.",
      cta: "Explore the full stack",
    },
  },
};
