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
      question: "Are you available to hire as a full-stack developer?",
      answer:
        "Yes — full-time roles and select freelance builds. I work remotely from India " +
        "(hybrid when it fits). Use the contact form or book a 15-minute call.",
    },
    {
      category: "tech" as const,
      question: "What tech stack do you use day to day?",
      answer:
        "React and Next.js with TypeScript on the frontend, Node.js and Express on the backend, " +
        "MongoDB or PostgreSQL for data. Tailwind, Docker, and AWS or Vercel for shipping. " +
        "Same stack behind MiniList CMS and the Chat App on this site.",
    },
    {
      category: "process" as const,
      question: "How do you start a new full-stack project?",
      answer:
        "Problem first: users, constraints, success criteria. Then data model and API contract, " +
        "scaffold with CI from day one, and ship in small vertical slices with regular feedback.",
    },
    {
      category: "work" as const,
      question: "Do you work remotely or on-site?",
      answer:
        "Mostly remote from India since late 2022. Hybrid is fine when the team and the work " +
        "make that worthwhile.",
    },
    {
      category: "tech" as const,
      question: "Can you build real-time features and complex forms?",
      answer:
        "Yes. I've shipped WebSocket chat (rooms, typing, seen) and configurable form platforms " +
        "with 100+ flows — the kind of UI that has to feel instant and stay maintainable.",
    },
    {
      category: "personal" as const,
      question: "What kind of product work do you want next?",
      answer:
        "Products where latency and clarity matter — real-time tools, heavy form systems, " +
        "internal platforms teams use every day. Complex under the hood, quiet on the surface.",
    },
    {
      category: "process" as const,
      question: "How do you handle tight deadlines and changing scope?",
      answer:
        "I write the scope down. When it moves, I say what slips, cut features, keep quality. " +
        "A smaller honest release beats silence or a broken launch.",
    },
    {
      category: "personal" as const,
      question: "What's something about you that isn't on a resume?",
      answer:
        "I'll spend an afternoon on a hover nobody names but everyone feels. " +
        "An internal HR tool I built saved the team hours every week — quiet wins still beat loud demos.",
    },
  ] as FAQItem[],

  /**
   * About page — “Who I am” (post-hero). Distinct from the home About strip:
   * personal framing, principles, and snapshot — not a copy of home highlights.
   */
  whoAmI: {
    label: "Who I am",
    title: "Full-stack developer who owns the product path",
    lead:
      "I'm Jay Patel — a full-stack developer in India. I care about how a product feels and whether " +
      "the API holds up. Most of my work is MERN: React, Next.js, Node.js, MongoDB or PostgreSQL.",
    body: [
      "I started professionally in late {year}. Since then I've lived in production systems — " +
        "real-time chat, configurable form platforms with 100+ flows, HR and KYC tools, and mentoring juniors on the same codebases.",
      "I prefer work where the hard part stays invisible: latency that disappears, forms that don't fight the user, " +
        "deploys that don't wake anyone up. Reliability over demos.",
    ],
    principles: [
      {
        title: "Understand before building",
        description:
          "Requirements, users, and constraints first. Code comes after the problem is clear.",
      },
      {
        title: "Own the whole path",
        description:
          "Architecture, UI, API, and deploy — one person accountable from sketch to production.",
      },
      {
        title: "Ship in honest slices",
        description:
          "Small vertical releases, clear scope, and no surprise quality cuts when deadlines move.",
      },
    ],
    snapshot: [
      { label: "Based in", value: "India · remote-friendly" },
      { label: "Focus", value: "React · Next.js · Node.js · MERN" },
      { label: "Known for", value: "Real-time systems & complex forms" },
      { label: "Open to", value: "Full-time & select freelance" },
    ],
  },

  /** Why Choose section — about page proof points + CTA. */
  whyChoose: {
    label: "Why hire Jay",
    title: "What you get with a full-stack hire who ships",
    intro:
      "Production MERN work from India — real-time features, heavy form flows, and frontends that " +
      "stay fast with real users. One person owns architecture through deploy.",
    points: [
      { icon: "briefcase", text: "Production full-stack experience since 2022" },
      { icon: "rocket", text: "MERN apps shipped end-to-end" },
      { icon: "zap", text: "Real-time systems & 100+ form flows built" },
      { icon: "shield", text: "TypeScript-first, tested, maintainable code" },
      { icon: "layers", text: "Owns architecture, API, UI, and deployment" },
      { icon: "users", text: "Clear updates — scope, risks, and trade-offs named early" },
      { icon: "globe", text: "Remote from India · open to hybrid" },
      { icon: "graduation", text: "Mentored juniors on real production code" },
      { icon: "clock", text: "On-time delivery with scope you can trust" },
    ] as { icon: string; text: string }[],
    visualCaption:
      "From sketch to production — products that feel fast, stay reliable, and don't surprise you at deploy time.",
    cta: {
      title: "Ready to talk about",
      titleHighlight: "your next hire",
      titleSuffix: "or build?",
      description:
        "Full-time roles and freelance scopes — intro call or a short written brief. I reply to every message.",
      button: "Contact Jay",
    },
  },

  /**
   * Services / capabilities grid — skills page.
   * Titles + copy are keyword-aware for SEO; keep descriptions concise.
   */
  services: {
    label: "Services",
    title: "Full-stack development services for product teams",
    intro:
      "React and Next.js on the frontend, Node.js APIs, real-time features, databases, and deploys — " +
      "how I help teams turn a brief into software people can use.",
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
      "Tell me about the role, product, or freelance scope. I read every message and reply within a day — " +
      "usually sooner on weekdays.",
    quickContactTitle: "Quick contact",
    profilesTitle: "Find me online",
    profilesIntro: "Prefer LinkedIn or GitHub? Connect there, or book a short intro call.",
    formTitle: "Send a message",
    formIntro: "A few details is enough — I’ll reply with next steps, not an auto-reply.",
    availability: [
      { icon: "clock", text: "Replies within 24 hours" },
      { icon: "globe", text: "Remote from India" },
      { icon: "briefcase", text: "Full-time & freelance" },
    ] as { icon: string; text: string }[],
    trust: {
      label: "Background",
      title: "Teams I've shipped with",
      intro:
        "Production MERN work for product teams — day-to-day experience comes from these environments.",
    },
    explore: {
      label: "Before you write",
      title: "Want context before you reach out?",
      intro: "Browse work, skills, or background — then come back when you're ready to talk.",
      items: [
        {
          page: "work",
          description:
            "Selected builds — real-time chat, form platforms, and production MERN apps with case-study depth.",
        },
        {
          page: "skills",
          description: "Full stack breakdown, services, and the process behind each delivery.",
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
    catalogLabel: "Tech stack",
    catalogTitle: "Full tech stack — frontend, backend, and DevOps",
    catalogIntro:
      "Tools I've used in production, grouped by layer: React and Next.js on the client, " +
      "Node.js APIs, MongoDB or PostgreSQL, Redis when latency matters, Docker and AWS to ship.",
    /** Short pipeline labels — how a request moves through the stack. */
    pipeline: [
      { id: "client", label: "Interface", detail: "React · Next.js" },
      { id: "api", label: "API", detail: "Node · Express" },
      { id: "data", label: "Data", detail: "Mongo · Postgres · Redis" },
      { id: "ship", label: "Ship", detail: "Docker · AWS · CI" },
    ] as { id: string; label: string; detail: string }[],
    /** Per-layer narrative: SEO body + user / builder / shipping angles. */
    layers: {
      Frontend: {
        summary:
          "React and Next.js with TypeScript for UIs that feel instant — App Router, server components where they help, and Tailwind for consistent design systems.",
        userLens:
          "Pages load fast, layouts stay consistent, and interactions feel immediate — forms, dashboards, and chat UIs that don’t fight the user.",
        builderLens:
          "Component-driven React, typed props, and Next.js routing so features ship as vertical slices instead of fragile page rewrites.",
        shippingLens:
          "Accessible markup, Core Web Vitals awareness, and design-system tokens so the UI stays maintainable as the product grows.",
        highlights: [
          "TypeScript-first components",
          "App Router & SSR where it helps",
          "Design-system friendly Tailwind",
        ],
      },
      Backend: {
        summary:
          "Node.js and Express (or NestJS) for APIs that stay predictable under load — REST, GraphQL, WebSockets, and clear auth boundaries.",
        userLens:
          "Actions complete reliably — saves stick, live updates arrive, and errors are honest instead of silent failures.",
        builderLens:
          "Clear API contracts, validation at the edge, and data models that match the product — MongoDB or PostgreSQL by use case, Redis when latency matters.",
        shippingLens:
          "Auth boundaries, logging, and retries so third-party integrations and real-time channels hold up in production.",
        highlights: [
          "REST, GraphQL & WebSockets",
          "MongoDB · PostgreSQL · Redis",
          "Auth, validation & contracts",
        ],
      },
      "Tools & DevOps": {
        summary:
          "Git, Docker, AWS, and CI habits that get code live without drama — plus testing and design tools that keep quality high.",
        userLens:
          "Releases show up when promised. Fewer regressions, clearer handovers, and a product that keeps working after launch day.",
        builderLens:
          "Dockerised environments, GitHub workflows, and tests around the risky paths — so the team can move without fear of the deploy button.",
        shippingLens:
          "From local `docker compose` to AWS or Vercel — monitoring-minded deploys and docs so the next person isn’t guessing.",
        highlights: ["Docker & cloud deploys", "GitHub · CI habits", "Jest · Vitest · Figma"],
      },
    } as Record<
      string,
      {
        summary: string;
        userLens: string;
        builderLens: string;
        shippingLens: string;
        highlights: string[];
      }
    >,
    /** Always-visible principles — crawlable + trust. */
    approach: {
      title: "How I pick and use this stack",
      items: [
        {
          title: "Product first, tools second",
          description:
            "I pick React, Next.js, Node.js, and the database that fits the problem — not the trend of the week.",
        },
        {
          title: "One coherent system",
          description:
            "Frontend, API, and data are designed together so features ship as full slices users can actually try.",
        },
        {
          title: "Production from day one",
          description:
            "Types, tests on critical paths, and deployable scaffolding early — so “almost done” means “ready to ship.”",
        },
        {
          title: "Clear enough to hand over",
          description:
            "Readable contracts, sensible structure, and docs so another engineer can extend the work without archaeology.",
        },
      ] as { title: string; description: string }[],
    },
    workStrip: {
      label: "In production",
      title: "Projects that use this stack",
      intro:
        "MERN builds already live — a quick look at work that put these skills into production, not tutorials.",
    },
  },

  /** Skills page — delivery process (SEO + trust). */
  process: {
    label: "Process",
    title: "How a project moves from idea to production",
    intro:
      "Written scope, small releases, and honest status — so you always know what’s shipping next.",
    steps: [
      {
        icon: "compass",
        title: "Discover",
        description:
          "Users, constraints, and success criteria before code. Edge cases and scope get written down first.",
      },
      {
        icon: "layers",
        title: "Architect",
        description:
          "Data model, API contracts, and UI flows in vertical slices. CI and scaffold go up on day one.",
      },
      {
        icon: "rocket",
        title: "Ship",
        description:
          "Small demoable increments with feedback. Each slice is tested, reviewed, and ready to deploy.",
      },
      {
        icon: "life-buoy",
        title: "Support",
        description:
          "Handover docs, monitoring, and fixes after launch. Refactors and mentoring so the codebase stays healthy.",
      },
    ] as { icon: string; title: string; description: string }[],
  },

  /** Work page — stats bar labels + catalog + stack link strip. */
  workPage: {
    statsLabel: "At a glance",
    catalog: {
      label: "Selected work",
      title: "Full-stack projects and case studies",
      intro:
        "Filter by fullstack, frontend, or backend — then open the builds that shipped to production.",
    },
    stackLinks: {
      label: "Tech stack",
      title: "Technologies used across these projects",
      intro:
        "Click a tool to see which projects used it. Tags come from the builds above — open Skills for the full layer catalog.",
      cta: "Explore the full stack",
      hint: "Click a technology",
      usedIn: "Used in",
      idle: "Pick a technology on the left to see where it shipped.",
    },
    comingSoon: {
      label: "Project page",
      badge: "Coming soon",
      headline: "Case study in progress",
      body: "A full write-up — problem, decisions, and screenshots — is on the way. Until then, use the live demo or source when available.",
      back: "Back to all work",
      statusSteps: ["Brief locked", "Draft in progress", "Polish & publish"],
      activeStep: 1,
    },
  },
};
