"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, Lock, Hammer } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

interface Project {
  title: string;
  tagline: string;
  desc: string;
  tags: string[];
  category: string;
  color: string;
  iconColor: string;
  /** Private / closed-source — hides the Code link, Demo still shows */
  hideCode?: true;
  /** NDA project — hides both Code and Demo, shows lock badge */
  nda?: true;
  /** Currently being built — shows an "In Progress" badge */
  wip?: true;
  /** URLs — omit the key to hide that link */
  codeUrl?: string;
  demoUrl?: string;
}

const PROJECTS: Project[] = [
  // ── Open / personal projects ─────────────────────────────────────────────
  {
    title: "ShopFlow",
    tagline: "E-Commerce Platform",
    desc: "A full-featured e-commerce platform with real-time inventory management, Stripe payments, and an admin dashboard. Built for scale with Redis caching and optimized database queries.",
    tags: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
    category: "fullstack",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "oklch(0.7 0.18 55)",
    codeUrl: "#",
    demoUrl: "#",
  },
  {
    title: "CollabBoard",
    tagline: "Real-Time Collaboration Tool",
    desc: "A Notion-like workspace with real-time collaborative editing, drag-and-drop kanban boards, and team chat. Powered by WebSockets for instant synchronization.",
    tags: ["Next.js", "Socket.io", "MongoDB", "TypeScript"],
    category: "fullstack",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "oklch(0.65 0.18 160)",
    codeUrl: "#",
    demoUrl: "#",
  },
  {
    title: "DevMetrics",
    tagline: "Analytics Dashboard",
    desc: "A developer productivity dashboard that aggregates GitHub activity, deployment metrics, and team velocity into beautiful, actionable visualizations.",
    tags: ["React", "D3.js", "Express", "PostgreSQL"],
    category: "frontend",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "oklch(0.6 0.2 295)",
    // hideCode: true — uncomment to hide the Code link but keep Demo
    codeUrl: "#",
    demoUrl: "#",
  },
  {
    title: "CloudAPI Gateway",
    tagline: "API Management Service",
    desc: "A lightweight API gateway with rate limiting, authentication middleware, request transformation, and comprehensive logging for microservice architectures.",
    tags: ["Node.js", "Express", "Docker", "Redis", "JWT"],
    category: "backend",
    color: "from-sky-500/20 to-blue-500/20",
    iconColor: "oklch(0.6 0.15 250)",
    hideCode: true, // private repo — demo only
    demoUrl: "#",
  },

  // ── Work in progress ─────────────────────────────────────────────────────
  {
    title: "Jay Portfolio",
    tagline: "Personal Portfolio",
    desc: "The portfolio you're looking at right now. Built with Next.js 15, Tailwind CSS v4, and Framer Motion. Continuously being improved with new features and polish.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "frontend",
    color: "from-cyan-500/20 to-sky-500/20",
    iconColor: "oklch(0.65 0.16 215)",
    wip: true,
    codeUrl: "#",
    demoUrl: "#",
  },

  // ── Professional / NDA projects ──────────────────────────────────────────
  // nda: true hides both Code and Demo automatically.
  {
    title: "Enterprise HR Suite",
    tagline: "HR Management System",
    desc: "Built a full-cycle HR platform for a mid-sized enterprise covering attendance, leave, payroll processing, and role-based access control, integrated with an existing ERP system.",
    tags: ["React", "Node.js", "PostgreSQL", "REST API"],
    category: "fullstack",
    color: "from-slate-500/20 to-zinc-500/20",
    iconColor: "oklch(0.55 0.04 255)",
    nda: true,
  },
  {
    title: "Client Portal",
    tagline: "B2B Customer Dashboard",
    desc: "Developed a white-label client portal with real-time order tracking, invoice management, and an analytics overview. Deployed across multiple tenants with per-client theming.",
    tags: ["Next.js", "TypeScript", "MongoDB", "AWS S3"],
    category: "fullstack",
    color: "from-indigo-500/20 to-blue-500/20",
    iconColor: "oklch(0.6 0.18 270)",
    nda: true,
  },
];

const FILTERS = ["all", "fullstack", "frontend", "backend"] as const;
type Filter = (typeof FILTERS)[number];

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="px-6 py-14 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Portfolio" title="Featured Projects" />

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "relative rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                filter === f ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {filter === f && (
                <motion.div
                  layoutId="project-filter-active"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className={cn(
                  "group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300",
                  project.nda
                    ? "border-border/60 hover:border-border hover:shadow-md"
                    : project.wip
                      ? "border-primary/20 hover:border-primary/40 hover:shadow-premium"
                      : "border-border hover:border-primary/30 hover:shadow-premium",
                )}
              >
                {/* Header */}
                <div
                  className={cn(
                    "relative flex h-32 items-center justify-center bg-gradient-to-br",
                    project.color,
                    project.nda && "opacity-70",
                  )}
                >
                  {/* Grid texture */}
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 32px)",
                    }}
                  />

                  {/* Icon badge */}
                  {project.nda ? (
                    <div className="relative z-10">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                        style={{
                          backgroundColor: `color-mix(in oklch, ${project.iconColor} 15%, transparent)`,
                          border: `1.5px solid color-mix(in oklch, ${project.iconColor} 30%, transparent)`,
                        }}
                      >
                        <Lock className="h-5 w-5" style={{ color: project.iconColor }} />
                      </span>
                    </div>
                  ) : (
                    <span
                      className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold shadow-sm"
                      style={{
                        backgroundColor: `color-mix(in oklch, ${project.iconColor} 18%, transparent)`,
                        color: project.iconColor,
                        border: `1.5px solid color-mix(in oklch, ${project.iconColor} 35%, transparent)`,
                      }}
                    >
                      {project.title[0]}
                    </span>
                  )}

                  {/* Top-right badge — NDA or WIP (mutually exclusive) */}
                  {project.nda && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-border/80 bg-background/80 px-2 py-0.5 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <Lock className="h-2.5 w-2.5" />
                      NDA
                    </span>
                  )}
                  {project.wip && !project.nda && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {/* Pulsing dot */}
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>
                      In Progress
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider",
                      project.nda ? "text-muted-foreground" : "text-primary",
                    )}
                  >
                    {project.tagline}
                  </p>
                  <h3 className="font-heading mt-1 text-lg font-bold leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {project.desc}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer row */}
                  <div className="mt-5 flex items-center gap-4 border-t border-border pt-4">
                    {project.nda ? (
                      /* NDA — no links at all */
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground/70 select-none">
                        <Lock className="h-3 w-3 shrink-0" />
                        Code &amp; demo unavailable under NDA
                      </p>
                    ) : (
                      <div className="flex items-center gap-4">
                        {/* Code — hidden when hideCode is set */}
                        {!project.hideCode && (
                          <a
                            href={project.codeUrl ?? "#"}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            aria-label={`View source code for ${project.title}`}
                          >
                            <Code2 className="h-4 w-4" />
                            Code
                          </a>
                        )}

                        {/* Demo — always shown for non-NDA projects */}
                        <a
                          href={project.demoUrl ?? "#"}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                          aria-label={`View live demo for ${project.title}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Demo
                        </a>

                        {/* WIP hint alongside the links */}
                        {project.wip && (
                          <span className="inline-flex items-center gap-1 text-xs text-primary/70">
                            <Hammer className="h-3 w-3" />
                            Building
                          </span>
                        )}
                      </div>
                    )}

                    <span className="ml-auto rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {project.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom notes */}
        {filtered.some((p) => p.nda) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center text-xs text-muted-foreground/60"
          >
            Projects marked NDA were built professionally. Descriptions and tech stacks are shared
            with permission; code and demos cannot be disclosed.
          </motion.p>
        )}
      </div>
    </section>
  );
}
