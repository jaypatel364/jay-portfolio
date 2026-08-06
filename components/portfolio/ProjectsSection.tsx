"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, Lock, Hammer, ChevronDown } from "lucide-react";
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
    title: "Chat App",
    tagline: "Real-Time Group Chat",
    desc: "A lightweight real-time group chat application built with WebSockets, featuring instant messaging, chat rooms, typing indicators, and seen status. Built as a Turborepo monorepo with a Next.js frontend and Node.js backend, delivering a clean, responsive, and modern chat experience.",
    tags: [
      "Next.js",
      "Node.js",
      "TypeScript",
      "WebSockets",
      "Express.js",
      "Tailwind CSS",
      // "Shadcn UI",
    ],
    category: "fullstack",
    color: "from-sky-500/20 to-cyan-500/20",
    iconColor: "oklch(0.72 0.17 240)",
    hideCode: true,
    demoUrl: "https://chat-app-web-eta.vercel.app/",
  },
  {
    title: "Social Media Backend",
    tagline: "Instagram-Style Backend API",
    desc: "A modular social media backend built with NestJS, GraphQL, and Prisma, implementing core social networking features like posts, likes, follows, notifications, JWT authentication, and feed ranking using a hotScore algorithm. Designed with a clean modular monolith architecture for scalability and maintainability.",
    tags: ["NestJS", "GraphQL", "Prisma", "PostgreSQL", "JWT", "TypeScript"],
    category: "backend",
    color: "from-violet-500/20 to-fuchsia-500/20",
    iconColor: "oklch(0.72 0.22 305)",
    hideCode: true,
    demoUrl: "https://nestjs-graphql-social.onrender.com/graphql",
  },
  {
    title: "MiniList CMS",
    tagline: "Headless Content Management System",
    desc: "A full-stack headless CMS featuring a modern Next.js admin dashboard and a scalable NestJS backend. It provides rich text editing, blog and author management, API key generation, analytics, Google OAuth authentication, SEO tools, and a REST API for seamless content delivery. Built with Prisma and PostgreSQL for a clean, scalable, and self-hostable content management experience.",
    tags: [
      "Next.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Tailwind CSS",
      "GraphQL",
      // "Google OAuth",
    ],
    category: "fullstack",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "oklch(0.74 0.16 165)",
    hideCode: true,
    demoUrl: "https://minilist-cms.vercel.app/",
  },
  // {
  //   title: "Terminal AI Assistant",
  //   tagline: "LLM-Powered CLI Chatbot",
  //   desc: "An intelligent terminal-based AI assistant that enables natural conversations through both text and voice. Powered by modern LLMs, it supports custom system prompts, context-aware responses, streaming output, and configurable personalities, making it ideal for developers seeking a lightweight AI companion directly from the command line.",
  //   tags: ["TypeScript", "Node.js", "LLM", "OpenAI API", "CLI", "Speech-to-Text", "Text-to-Speech"],
  //   category: "ai",
  //   color: "from-indigo-500/20 to-violet-500/20",
  //   iconColor: "oklch(0.72 0.19 275)",
  //   hideCode: true,
  //   demoUrl: "#",
  // },

  // ── Work in progress ─────────────────────────────────────────────────────
  // {
  //   title: "Jay Portfolio",
  //   tagline: "Personal Portfolio",
  //   desc: "The portfolio you're looking at right now. Built with Next.js 15, Tailwind CSS v4, and Framer Motion. Continuously being improved with new features and polish.",
  //   tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  //   category: "frontend",
  //   color: "from-cyan-500/20 to-sky-500/20",
  //   iconColor: "oklch(0.65 0.16 215)",
  //   wip: true,
  //   codeUrl: "https://github.com/jaypatel364/jay-portfolio",
  //   demoUrl: "https://jay-patel-dev.vercel.app/",
  // },

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
    title: "Philantro AI",
    tagline: "AI-Powered NGO Management Platform",
    desc: "Built a full-stack NGO management platform with configurable modules including a custom form builder, dynamic report generation, customizable chart builder, and milestone tracking. Collaborated on AI-assisted UI prototyping using Visily, transforming concepts into Figma designs and production-ready React components with server-side rendering.",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "SSR", "Tailwind CSS", "Visily", "Figma"],
    category: "fullstack",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "oklch(0.72 0.18 165)",
    nda: true,
  },

  // {
  //   title: "Rostered AI",
  //   tagline: "Healthcare Workforce Management System",
  //   desc: "Developed workforce planning features including leave and staff unavailability management for healthcare organizations. Refactored a large Next.js codebase, reducing bugs by 60% and accelerating feature delivery by 40% while improving maintainability and developer productivity.",
  //   tags: ["Next.js", "React", "Material UI", "JavaScript", "GitHub Copilot"],
  //   category: "frontend",
  //   color: "from-blue-500/20 to-cyan-500/20",
  //   iconColor: "oklch(0.67 0.18 250)",
  //   nda: true,
  // },

  {
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
  },
];

// ── Expandable description ────────────────────────────────────────────────────

function ExpandableDesc({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [clampedH, setClampedH] = useState<number | null>(null);
  const [fullHeight, setFullHeight] = useState<number | null>(null);
  const innerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    // 1. Read the actual rendered clamped height (line-clamp is still active)
    const clamped = el.clientHeight;

    // 2. Temporarily lift all clamp constraints to measure the full scrollHeight
    el.style.display = "block";
    el.style.webkitLineClamp = "unset";
    el.style.overflow = "visible";
    el.style.webkitBoxOrient = "unset";
    const full = el.scrollHeight;

    // 3. Restore
    el.style.display = "";
    el.style.webkitLineClamp = "";
    el.style.overflow = "";
    el.style.webkitBoxOrient = "";

    setClampedH(clamped);
    setFullHeight(full);
    // 2px tolerance — descenders on letters like g/p/y extend slightly below
    setOverflows(full > clamped + 2);
  }, [text]);

  const currentHeight = expanded ? (fullHeight ?? "auto") : (clampedH ?? "auto");

  return (
    <div className="flex-1 flex flex-col">
      <motion.div
        animate={{ height: currentHeight }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="overflow-hidden"
      >
        <p
          ref={innerRef}
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            !expanded && "line-clamp-3",
          )}
        >
          {text}
        </p>
      </motion.div>

      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 flex items-center gap-1 self-start text-xs font-semibold text-primary/70 transition-colors hover:text-primary focus-visible:outline-none"
          aria-expanded={expanded}
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="inline-flex"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

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
                  <div className="mt-2.5 flex-1 flex flex-col">
                    <ExpandableDesc text={project.desc} />
                  </div>

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
                            target="_blank"
                            rel="noopener noreferrer"
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
                          target="_blank"
                          rel="noopener noreferrer"
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
