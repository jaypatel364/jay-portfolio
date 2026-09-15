/**
 * Project cards + detail-page data.
 * NDA work has no public `/work/<slug>/` page.
 * Published write-ups: see `settings/project-details` (`PUBLISHED_PROJECT_SLUGS`).
 */

import { getProjectDetail, hasPublishedDetail } from "@/settings/project-details";

export type ProjectCategory = "fullstack" | "frontend" | "backend";

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
  /**
   * Cover screenshot — defaults to `/images/projects/<slug>.png` (SEO filename).
   * Override only if the file uses a different path.
   */
  image?: string;
  /** Bullet highlights for the work-page zigzag layout. */
  highlights?: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: "spendly-personal-expense-tracker",
    title: "Spendly - Expense Tracker",
    tagline: "Premium Personal Expense Tracker",
    desc: "A personal expense tracker that turns everyday spending into a clear picture. Log an expense in seconds, set a monthly budget, and import your spending history from CSV or Excel. Totals and category breakdowns show up on one calm, private dashboard. Built with TanStack Start, React, and Supabase, with row-level security so every number stays private.",
    tags: [
      "TanStack Start",
      "React",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "TanStack Query",
      "Recharts",
      "Zod",
    ],
    category: "fullstack",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "oklch(0.72 0.14 165)",
    wip: true,
    demoUrl: "https://pocket-wise-tracker-88.lovable.app/",
    highlights: [
      "Live dashboard with totals, six-month trends, and category charts",
      "CSV and Excel import with column mapping, plus one-click filtered export",
      "Supabase Auth and Postgres row-level security, so each user only sees their own data",
    ],
  },

  {
    slug: "social-media-backend-api",
    title: "Social Media Backend API",
    tagline: "Instagram-Style Backend API",
    desc: "A modular social media backend built with NestJS, GraphQL, and Prisma. It covers the core of any social app: posts, likes, follows, notifications, and JWT authentication. A hotScore algorithm ranks the feed instead of just sorting it by time. The whole thing is structured as a clean modular monolith, built to stay easy to scale and maintain.",
    tags: ["NestJS", "GraphQL", "Prisma", "PostgreSQL", "JWT", "TypeScript"],
    category: "backend",
    color: "from-violet-500/20 to-fuchsia-500/20",
    iconColor: "oklch(0.72 0.22 305)",
    demoUrl: "https://nestjs-graphql-social.onrender.com/graphql",
    codeUrl: "https://github.com/jaypatel364/nestjs-graphql-social-backend",
    highlights: [
      "Modular NestJS monolith with GraphQL and Prisma",
      "Posts, likes, follows, notifications, and JWT authentication",
      "hotScore ranking, so the feed is never just a plain timeline",
    ],
  },
  {
    slug: "minilist-headless-cms",
    title: "MiniList - Headless CMS",
    tagline: "Headless Content Management System",
    desc: "A full-stack headless CMS with a modern Next.js admin dashboard and a scalable NestJS backend. It handles rich text editing, blog and author management, API keys, analytics, Google OAuth, and SEO tools. A REST API sits underneath for smooth content delivery. Built on Prisma and PostgreSQL, so it stays clean, scalable, and easy to self-host.",
    tags: ["Next.js", "NestJS", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "GraphQL"],
    category: "fullstack",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "oklch(0.74 0.16 165)",
    demoUrl: "https://minilist-cms.vercel.app/",
    codeUrl: "https://github.com/jaypatel364/minilist-cms-frontend",
    highlights: [
      "Next.js admin panel and NestJS API, built as a self-hostable headless CMS",
      "Rich text, authors, SEO fields, API keys, and Google OAuth in one place",
      "REST and GraphQL support, so each consumer can use the format it already speaks",
    ],
  },
  {
    slug: "real-time-chat-application",
    title: "Real-Time Chat Application",
    tagline: "Real-Time Group Chat",
    desc: "A lightweight real-time group chat app built with WebSockets. It handles instant messaging, chat rooms, typing indicators, and seen status. The whole thing runs as a Turborepo monorepo, with a Next.js frontend and a Node.js backend. The result is a chat experience that feels fast, clean, and genuinely responsive.",
    tags: ["Next.js", "Node.js", "TypeScript", "WebSockets", "Express.js", "Tailwind CSS"],
    category: "fullstack",
    color: "from-sky-500/20 to-cyan-500/20",
    iconColor: "oklch(0.72 0.17 240)",
    demoUrl: "https://chat-app-web-eta.vercel.app/",
    codeUrl: "https://github.com/jaypatel364/chat-app",
    highlights: [
      "Instant rooms, typing indicators, and seen receipts, all over WebSockets",
      "Turborepo setup with a Next.js client and a dedicated Node.js socket server",
      "Shared TypeScript types, so message shapes can't drift between frontend and backend",
    ],
  },
  {
    slug: "pms-hr-management-system",
    title: "PMS - HR Management System",
    tagline: "HR Management System",
    desc: "I built a full HR platform for a mid-sized company. It covers attendance, leave requests, payroll, and role-based access. It also connects to their existing ERP system, so nothing had to be rebuilt from scratch.",
    tags: ["React", "Node.js", "PostgreSQL", "REST API"],
    category: "fullstack",
    color: "from-slate-500/20 to-zinc-500/20",
    iconColor: "oklch(0.55 0.04 255)",
    nda: true,
    highlights: [
      "Attendance, leave, payroll, and role-based access handled in one HR cycle",
      "Integrated into an existing ERP system without a rewrite",
      "Enterprise-ready workflows built for a mid-sized organization",
    ],
  },
  {
    slug: "philantro-ai-ngo-management-platform",
    title: "Philantro AI - NGO Management Platform",
    tagline: "AI-Powered NGO Management Platform",
    desc: "I built a full NGO management platform. It has a form builder, report generation, a chart builder, and milestone tracking, all fully configurable. I also worked on the UI itself, using AI tools like Visily to turn early ideas into Figma designs, then into real React components that render on the server.",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "SSR", "Tailwind CSS", "Visily", "Figma"],
    category: "fullstack",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "oklch(0.72 0.18 165)",
    nda: true,
    highlights: [
      "Configurable form builder, reports, charts, and milestone tracking in one platform",
      "AI-assisted prototyping, from Visily to Figma to production React",
      "Server-side rendered React on Node and MongoDB, built as a modular NGO platform",
    ],
  },
  {
    slug: "verify-360-kyc-platform",
    title: "Verify 360 - KYC & Identity Verification Platform",
    tagline: "Digital Identity Verification & KYC Platform",
    desc: "I built a KYC platform for identity checks. It verifies documents and checks 3D liveness. It also tracks live location and connects to outside identity APIs. A built-in scoring system flags risky users. It now handles more than 100 client verifications.",
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
      "Document verification, 3D liveness detection, and live geolocation tracking",
      "Risk scoring built to flag suspicious users during KYC checks",
      "More than 100 client verifications, backed by third-party identity APIs",
    ],
  },
];

export const PROJECT_FILTERS = ["all", "fullstack", "frontend", "backend"] as const;

/** Homepage shows a short preview; the rest lives on /work. */
export const HOME_PROJECT_COUNT = 3;

/** Non-NDA projects — the only ones with a public `/work/<slug>/` page. */
export function publicProjects(): Project[] {
  return PROJECTS.filter((p) => !p.nda);
}

/** Projects with a published full write-up (indexed, full detail UI). */
export function publishedProjects(): Project[] {
  return PROJECTS.filter((p) => hasPublishedDetail(p.slug));
}

/** Whether this project has a published detail page (vs coming-soon placeholder). */
export function isProjectPublished(slug: string): boolean {
  return hasPublishedDetail(slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Canonical project URL — `/work/<slug>/` (trailing slash matches next.config). */
export function projectPath(slug: string): string {
  return `/work/${slug}/`;
}

/** Cover image — `/images/projects/<slug>.png` (filename matches project slug / SEO). */
export function projectImageSrc(project: Pick<Project, "slug" | "image">): string {
  return project.image ?? `/images/projects/${project.slug}.png`;
}

/** Shared dimensions for project cover PNGs (all exports are 1672×941). */
export const PROJECT_COVER_IMAGE = {
  width: 1672,
  height: 941,
  type: "image/png" as const,
};

/** Alt text — descriptive text from the write-up, falling back to the title. */
export function projectImageAlt(project: Pick<Project, "slug" | "title">): string {
  return getProjectDetail(project.slug)?.imageAlt ?? project.title;
}

/** HTML title attribute + image SEO name — matches project title. */
export function projectImageTitle(project: Pick<Project, "title">): string {
  return project.title;
}

/**
 * Where UI should send users for a project.
 * Published (including NDA write-ups) → `/work/<slug>/`.
 * Unpublished NDA work has no detail page → catalog anchor on `/work/`.
 */
export function projectHref(project: Pick<Project, "slug" | "nda">): string {
  if (hasPublishedDetail(project.slug)) return projectPath(project.slug);
  if (project.nda) return `/work/#project-${project.slug}`;
  return projectPath(project.slug);
}

/** Projects that have a `/work/<slug>/` route (published, or public coming-soon). */
export function routableProjects(): Project[] {
  return PROJECTS.filter((p) => !p.nda || hasPublishedDetail(p.slug));
}

/** Unique tech tags across all projects — for work-page stack links. */
export function getProjectStackTags(): string[] {
  return [...new Set(PROJECTS.flatMap((p) => p.tags))].sort((a, b) => a.localeCompare(b));
}

/** Tag → which projects use it (sorted by usage, then name). */
export function getProjectStackUsage(): {
  tag: string;
  count: number;
  projects: { slug: string; title: string; nda?: true }[];
}[] {
  const map = new Map<string, { slug: string; title: string; nda?: true }[]>();

  for (const project of PROJECTS) {
    for (const tag of project.tags) {
      const list = map.get(tag) ?? [];
      list.push({
        slug: project.slug,
        title: project.title,
        ...(project.nda ? { nda: true as const } : {}),
      });
      map.set(tag, list);
    }
  }

  return [...map.entries()]
    .map(([tag, projects]) => ({ tag, count: projects.length, projects }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Aggregate counts for the work-page stats bar. */
export function getWorkPageStats() {
  const tags = getProjectStackTags();
  const production = PROJECTS.filter((p) => !p.wip);
  const withDemos = PROJECTS.filter((p) => Boolean(p.demoUrl) && !p.nda);

  return {
    projectCount: PROJECTS.length,
    productionCount: production.length,
    techCount: tags.length,
    demoCount: withDemos.length,
    ndaCount: PROJECTS.filter((p) => p.nda).length,
  };
}
