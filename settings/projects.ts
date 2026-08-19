/**
 * Project cards + case-study copy.
 * NDA work has no public case-study route.
 */

export type ProjectCategory = "fullstack" | "frontend" | "backend";

export interface CaseStudySection {
  heading: string;
  body: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  desc: string;
  tags: string[];
  category: ProjectCategory;
  color: string;
  iconColor: string;
  hideCode?: true;
  nda?: true;
  wip?: true;
  codeUrl?: string;
  demoUrl?: string;
  /** Bullet highlights for the work-page zigzag layout. */
  highlights?: string[];
  /** Long-form page. Omit for NDA cards. */
  caseStudy?: {
    problem: string;
    role: string;
    sections: CaseStudySection[];
  };
}

export const PROJECTS: Project[] = [
  {
    slug: "chat-app",
    title: "Chat App",
    tagline: "Real-Time Group Chat",
    desc: "A lightweight real-time group chat application built with WebSockets, featuring instant messaging, chat rooms, typing indicators, and seen status. Built as a Turborepo monorepo with a Next.js frontend and Node.js backend, delivering a clean, responsive, and modern chat experience.",
    tags: ["Next.js", "Node.js", "TypeScript", "WebSockets", "Express.js", "Tailwind CSS"],
    category: "fullstack",
    color: "from-sky-500/20 to-cyan-500/20",
    iconColor: "oklch(0.72 0.17 240)",
    demoUrl: "https://chat-app-web-eta.vercel.app/",
    highlights: [
      "Instant rooms, typing indicators, and seen receipts over WebSockets",
      "Turborepo split — Next.js client + Node.js socket server",
      "Shared TypeScript types so message shapes cannot drift",
    ],
    caseStudy: {
      problem:
        "Build a group chat that feels instant without dragging in a heavy real-time SaaS. Rooms, typing, and seen status had to work on a small Node process.",
      role: "Solo: architecture, WebSocket protocol, Next.js UI, Turborepo split, Vercel deploy.",
      sections: [
        {
          heading: "Approach",
          body: "A Turborepo holds a Next.js client and an Express + WebSocket server. The socket layer owns rooms, presence, typing indicators, and seen receipts so the UI stays a thin subscriber. TypeScript is shared across packages so message shapes cannot drift.",
        },
        {
          heading: "Trade-offs",
          body: "Sockets over a hosted realtime product kept the stack learnable and cheap. The cost is that horizontal scale needs sticky sessions or a pub/sub bus — not required for this demo. Source is not public yet; the live demo is the artifact.",
        },
      ],
    },
  },
  {
    slug: "social-media-backend",
    title: "Social Media Backend",
    tagline: "Instagram-Style Backend API",
    desc: "A modular social media backend built with NestJS, GraphQL, and Prisma, implementing core social networking features like posts, likes, follows, notifications, JWT authentication, and feed ranking using a hotScore algorithm. Designed with a clean modular monolith architecture for scalability and maintainability.",
    tags: ["NestJS", "GraphQL", "Prisma", "PostgreSQL", "JWT", "TypeScript"],
    category: "backend",
    color: "from-violet-500/20 to-fuchsia-500/20",
    iconColor: "oklch(0.72 0.22 305)",
    demoUrl: "https://nestjs-graphql-social.onrender.com/graphql",
    highlights: [
      "Modular NestJS monolith with GraphQL + Prisma",
      "Posts, likes, follows, notifications, and JWT auth",
      "hotScore ranking so the feed is not a naive timeline",
    ],
    caseStudy: {
      problem:
        "Model a social graph (posts, likes, follows, notifications) with a typed API and a feed that is not a naive chronological dump.",
      role: "Solo: NestJS modules, GraphQL schema, Prisma models, JWT auth, hotScore ranking, hosted GraphQL playground.",
      sections: [
        {
          heading: "Approach",
          body: "A modular monolith in NestJS: each domain (users, posts, graph, notifications) is a module with GraphQL resolvers on top of Prisma/PostgreSQL. JWT guards the mutations. Feed ranking uses a hotScore so recent engagement surfaces without a separate ranking service.",
        },
        {
          heading: "Trade-offs",
          body: "GraphQL playground is the public demo — there is no consumer UI. That is intentional: the work is the API shape and the data model. Repo is private for now.",
        },
      ],
    },
  },
  {
    slug: "minilist-cms",
    title: "MiniList CMS",
    tagline: "Headless Content Management System",
    desc: "A full-stack headless CMS featuring a modern Next.js admin dashboard and a scalable NestJS backend. It provides rich text editing, blog and author management, API key generation, analytics, Google OAuth authentication, SEO tools, and a REST API for seamless content delivery. Built with Prisma and PostgreSQL for a clean, scalable, and self-hostable content management experience.",
    tags: ["Next.js", "NestJS", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "GraphQL"],
    category: "fullstack",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "oklch(0.74 0.16 165)",
    demoUrl: "https://minilist-cms.vercel.app/",
    highlights: [
      "Next.js admin + NestJS API as a self-hostable headless CMS",
      "Rich text, authors, SEO fields, API keys, and Google OAuth",
      "REST and GraphQL so consumers pick the shape they already use",
    ],
    caseStudy: {
      problem:
        "Ship a self-hostable headless CMS: editors need a real admin, sites need a stable content API, and keys/auth cannot be an afterthought.",
      role: "Solo: Next.js admin, NestJS API, Prisma/PostgreSQL, OAuth, API keys, SEO fields, analytics.",
      sections: [
        {
          heading: "Approach",
          body: "Admin UI in Next.js (rich text, authors, posts, SEO). API in NestJS with Prisma. API keys isolate consumers from the admin session. Google OAuth is for editors, not for the public API. GraphQL and REST both exist so a site can pick the shape it already uses.",
        },
        {
          heading: "Trade-offs",
          body: "Two runtimes (Next + Nest) is more moving parts than a single Next app, but it matches how a CMS is actually deployed: dashboard and API scale independently. Source is not public yet; the hosted admin is.",
        },
      ],
    },
  },
  // {
  //   slug: "jay-portfolio",
  //   title: "jaypateldev.com",
  //   tagline: "This portfolio",
  //   desc: "The site you are on. Next.js 15 App Router, settings-driven copy, Groq chat, contact APIs with Upstash rate limits, CSP, CI, and a print resume. Built to be indexed and operated like a small production app.",
  //   tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Groq", "Upstash"],
  //   category: "fullstack",
  //   color: "from-cyan-500/20 to-sky-500/20",
  //   iconColor: "oklch(0.65 0.16 215)",
  //   codeUrl: "https://github.com/jaypatel364/jay-portfolio",
  //   demoUrl: "https://jaypateldev.com",
  //   caseStudy: {
  //     problem:
  //       "A personal site that is actually operable: crawlers see real HTML, APIs fail closed, secrets stay out of git, and the homepage is not a 4k-line client blob.",
  //     role: "Solo: product, architecture, security headers, APIs, CI, SEO, and the public write-up on /engineering.",
  //     sections: [
  //       {
  //         heading: "Approach",
  //         body: "App Router with a settings/ layer for identity, flags, FAQ, and SEO. Chat and contact are Node routes with Zod, origin checks, and hashed rate-limit keys. Games and overlays load with next/dynamic. Resume is first-party (/resume + print). The public repo is this site.",
  //       },
  //       {
  //         heading: "Trade-offs",
  //         body: "Feature surface (games, chat, heatmap) is larger than a static brochure. Code-splitting and fail-closed APIs are how that stays honest in production. Details live on /engineering.",
  //       },
  //     ],
  //   },
  // },
  {
    slug: "pms",
    title: "PMS",
    tagline: "HR Management System",
    desc: "Built a full-cycle HR platform for a mid-sized enterprise covering attendance, leave, payroll processing, and role-based access control, integrated with an existing ERP system.",
    tags: ["React", "Node.js", "PostgreSQL", "REST API"],
    category: "fullstack",
    color: "from-slate-500/20 to-zinc-500/20",
    iconColor: "oklch(0.55 0.04 255)",
    nda: true,
    highlights: [
      "Attendance, leave, payroll, and role-based access in one HR cycle",
      "Integrated with an existing ERP without a rewrite",
      "Enterprise-ready workflows for a mid-sized org",
    ],
  },
  {
    slug: "philantro-ai",
    title: "Philantro AI",
    tagline: "AI-Powered NGO Management Platform",
    desc: "Built a full-stack NGO management platform with configurable modules including a custom form builder, dynamic report generation, customizable chart builder, and milestone tracking. Collaborated on AI-assisted UI prototyping using Visily, transforming concepts into Figma designs and production-ready React components with server-side rendering.",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "SSR", "Tailwind CSS", "Visily", "Figma"],
    category: "fullstack",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "oklch(0.72 0.18 165)",
    nda: true,
    highlights: [
      "Configurable form builder, reports, charts, and milestone tracking",
      "AI-assisted prototyping (Visily → Figma → production React)",
      "SSR React on Node/Mongo for a modular NGO platform",
    ],
  },
  {
    slug: "verify-360",
    title: "Verify 360",
    tagline: "Digital Identity Verification & KYC Platform",
    desc: "Engineered an enterprise KYC verification platform supporting secure document verification, 3D liveness detection, real-time geolocation tracking, and third-party identity verification APIs. Implemented an intelligent risk-scoring system to detect suspicious users and streamline compliance workflows for 100+ client verifications.",
    tags: [
      "React Native",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "AWS Rekognition",
      "REST API",
      "Geolocation",
    ],
    category: "fullstack",
    color: "from-violet-500/20 to-fuchsia-500/20",
    iconColor: "oklch(0.65 0.22 300)",
    nda: true,
    highlights: [
      "Document verification, 3D liveness, and live geolocation",
      "Risk scoring to flag suspicious users in KYC workflows",
      "100+ client verifications with third-party identity APIs",
    ],
  },
];

export const PROJECT_FILTERS = ["all", "fullstack", "frontend", "backend"] as const;

/** Homepage shows a short preview; the rest lives on /work. */
export const HOME_PROJECT_COUNT = 3;

export function publicCaseStudies(): Project[] {
  return PROJECTS.filter((p) => p.caseStudy && !p.nda);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Unique tech tags across all projects — for work-page stack links. */
export function getProjectStackTags(): string[] {
  return [...new Set(PROJECTS.flatMap((p) => p.tags))].sort((a, b) => a.localeCompare(b));
}

/** Aggregate counts for the work-page stats bar. */
export function getWorkPageStats() {
  const tags = getProjectStackTags();
  const production = PROJECTS.filter((p) => !p.wip);
  const withDemos = PROJECTS.filter((p) => Boolean(p.demoUrl) && !p.nda);
  const caseStudies = publicCaseStudies();

  return {
    projectCount: PROJECTS.length,
    productionCount: production.length,
    techCount: tags.length,
    demoCount: withDemos.length,
    caseStudyCount: caseStudies.length,
    ndaCount: PROJECTS.filter((p) => p.nda).length,
  };
}
