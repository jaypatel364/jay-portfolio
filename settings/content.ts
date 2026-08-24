/**
 * Content — copy and static lists that power UI sections.
 * FAQ, headline words, marquee stack, learning badges, etc.
 */

import { getExperienceLabel } from "@/lib/utils";
import { identity } from "./identity";
import type { BuildingItem, FAQItem, LearningItem } from "./types";

const expLabel = getExperienceLabel(identity.careerStartDate);

export const content = {
  /** Words that cycle in the hero headline. Keep short (1–3 words). */
  headlineWords: ["scalable apps", "robust APIs", "clean UIs", "real products", "great UX"],

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
      category: "tech" as const,
      question: "What does Jay Patel specialize in as a Full Stack Developer?",
      answer:
        "Jay Patel specializes in full-stack web development using React, Next.js, Node.js, " +
        "TypeScript and the MERN stack. His experience includes building scalable web applications, " +
        "REST and GraphQL APIs, real-time features, enterprise systems, SaaS platforms, complex " +
        "forms and backend services using technologies such as MongoDB and PostgreSQL.",
    },
    {
      category: "tech" as const,
      question: "What technologies does Jay Patel use for full-stack development?",
      answer:
        "Jay Patel works primarily with React, Next.js, JavaScript, TypeScript, Node.js, " +
        "Express.js, NestJS, MongoDB and PostgreSQL. His broader toolkit also includes REST APIs, " +
        "GraphQL, Prisma, WebSockets, Docker, AWS, Git and modern testing tools such as Jest and Vitest.",
    },
    {
      category: "tech" as const,
      question: "Does Jay Patel work with the MERN stack?",
      answer:
        "Yes, Jay Patel specializes in MERN stack development using MongoDB, Express.js, React " +
        "and Node.js to build modern full-stack web applications. He also works with TypeScript, " +
        "Next.js, PostgreSQL and other technologies when a project's architecture or requirements " +
        "call for them.",
    },
    {
      category: "work" as const,
      question: "Can Jay Patel build a full-stack web application from scratch?",
      answer:
        "Yes, Jay Patel can work across the full application lifecycle, from frontend development " +
        "and backend architecture to APIs, databases and deployment. His portfolio demonstrates " +
        "experience building complete applications with React, Next.js, Node.js, TypeScript, " +
        "MongoDB, PostgreSQL and related technologies.",
    },
    {
      category: "work" as const,
      question: "What types of web applications has Jay Patel built?",
      answer:
        "Jay Patel has worked on real-time chat applications, social media backend systems, " +
        "headless CMS platforms, HR and business management systems, configurable form systems " +
        "and identity-verification solutions. His projects cover frontend applications, backend " +
        "APIs, real-time functionality, data management and integrations with external services.",
    },
    {
      category: "tech" as const,
      question: "Can Jay Patel build real-time web applications?",
      answer:
        "Yes, Jay Patel has experience building real-time web applications using WebSockets and " +
        "Node.js. His portfolio includes a real-time group chat application with instant messaging, " +
        "chat rooms, typing indicators and seen status, demonstrating practical experience with " +
        "real-time communication rather than only conventional request-and-response applications.",
    },
    {
      category: "process" as const,
      question: "How does Jay Patel approach a new full-stack development project?",
      answer:
        "Jay Patel approaches a new project by first understanding the product requirements, " +
        "technical goals and expected user experience, then translating them into an appropriate " +
        "application architecture and development plan. His work spans frontend, backend, APIs, " +
        "databases and deployment, allowing him to consider the complete system rather than only " +
        "one layer.",
    },
    {
      category: "tech" as const,
      question: "Can Jay Patel develop scalable APIs and backend systems?",
      answer:
        "Yes, Jay Patel has professional experience developing backend systems and APIs with " +
        "Node.js, Express.js and NestJS, including REST and GraphQL APIs. His portfolio also " +
        "includes MongoDB, PostgreSQL, Prisma and authentication-related work, giving him " +
        "experience across application logic, data management and backend architecture.",
    },
    {
      category: "work" as const,
      question: "What experience does Jay Patel have as a Full Stack Developer?",
      answer:
        `Jay Patel has ${expLabel} years of professional experience in web development, working ` +
        "across frontend and backend systems. His experience includes React and Node.js " +
        "development, API integrations, enterprise applications, configurable forms, mentoring " +
        "developers and performance improvements, alongside independent projects involving " +
        "Next.js, TypeScript, WebSockets and modern backend technologies.",
    },
    {
      category: "work" as const,
      question: "Can I hire Jay Patel for freelance full-stack development?",
      answer:
        "Yes, Jay Patel is available for freelance projects and collaboration. He can contribute " +
        "to new web applications, MVPs, feature development and existing codebases, with " +
        "experience across React, Next.js, Node.js, TypeScript and the MERN stack. Visitors can " +
        "use the contact page to discuss their project requirements and determine whether the " +
        "collaboration is a good fit.",
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
      { label: "Open to", value: "Freelance & collaboration" },
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
      titleHighlight: "your next project",
      titleSuffix: "or collaboration?",
      description:
        "Freelance scopes and collaborations — intro call or a short written brief. I reply to every message.",
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
    availability: "Open to freelance & collaboration",
    responseTime: "Usually replies within 24 hours",
    intents: [
      {
        id: "collab",
        label: "Collaboration",
        emoji: "🤝",
        headlineBefore: "Let's Build",
        highlight: "Something Great",
        headlineAfter: "Together",
        description:
          "Have a project, product idea or development challenge? Let's discuss how I can help turn it into a reliable, scalable web application.",
        command: "jay collab --stack=mern --mode=remote",
        primaryCta: "Discuss a collaboration",
        primaryHref: "/contact/",
      },
      {
        id: "freelance",
        label: "Freelance",
        emoji: "🚀",
        headlineBefore: "Let's Build",
        highlight: "Something Great",
        headlineAfter: "Together",
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
        headlineAfter: "about your project",
        description:
          "Tell me what you're building, what you're trying to solve, and where you need help. I'll give you an honest assessment of how I can contribute.",
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
      "Tell me about the project, freelance scope, or collaboration idea. I read every message and reply within a day — " +
      "usually sooner on weekdays.",
    quickContactTitle: "Quick contact",
    profilesTitle: "Find me online",
    profilesIntro: "Prefer LinkedIn or GitHub? Connect there, or book a short intro call.",
    formTitle: "Send a message",
    formIntro: "A few details is enough — I’ll reply with next steps, not an auto-reply.",
    availability: [
      { icon: "clock", text: "Replies within 24 hours" },
      { icon: "globe", text: "Remote from India" },
      { icon: "briefcase", text: "Freelance & collaboration" },
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
