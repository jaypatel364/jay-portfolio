"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, ChevronRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const PROJECTS = [
  {
    title: "ShopFlow",
    tagline: "E-Commerce Platform",
    desc: "A full-featured e-commerce platform with real-time inventory management, Stripe payments, and an admin dashboard. Built for scale with Redis caching and optimized database queries.",
    tags: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
    category: "fullstack",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "CollabBoard",
    tagline: "Real-Time Collaboration Tool",
    desc: "A Notion-like workspace with real-time collaborative editing, drag-and-drop kanban boards, and team chat. Powered by WebSockets for instant synchronization.",
    tags: ["Next.js", "Socket.io", "MongoDB", "TypeScript"],
    category: "fullstack",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "DevMetrics",
    tagline: "Analytics Dashboard",
    desc: "A developer productivity dashboard that aggregates GitHub activity, deployment metrics, and team velocity into beautiful, actionable visualizations.",
    tags: ["React", "D3.js", "Express", "PostgreSQL"],
    category: "frontend",
    color: "from-violet-500/20 to-purple-500/20",
  },
  {
    title: "CloudAPI Gateway",
    tagline: "API Management Service",
    desc: "A lightweight API gateway with rate limiting, authentication middleware, request transformation, and comprehensive logging for microservice architectures.",
    tags: ["Node.js", "Express", "Docker", "Redis", "JWT"],
    category: "backend",
    color: "from-sky-500/20 to-blue-500/20",
  },
  {
    title: "HealthTrack",
    tagline: "Fitness & Wellness App",
    desc: "A comprehensive health tracking application with workout logging, nutrition tracking, progress charts, and personalized recommendations using machine learning.",
    tags: ["React Native", "Node.js", "MongoDB", "Chart.js"],
    category: "fullstack",
    color: "from-rose-500/20 to-pink-500/20",
  },
  {
    title: "ContentCMS",
    tagline: "Headless CMS",
    desc: "A modern headless CMS with a visual editor, custom field types, version history, and a powerful REST + GraphQL API for content delivery.",
    tags: ["Next.js", "GraphQL", "MongoDB", "AWS S3"],
    category: "fullstack",
    color: "from-yellow-500/20 to-amber-500/20",
  },
];

const FILTERS = ["all", "fullstack", "frontend", "backend"];

export function ProjectsSection() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="px-6 py-14 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Portfolio" title="Featured Projects" />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-premium"
              >
                {/* Gradient header */}
                <div className={`h-40 bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                  <span className="font-heading text-3xl font-bold text-foreground/20">
                    {project.title[0]}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {project.tagline}
                  </p>
                  <h3 className="font-heading mt-1 text-lg font-bold">{project.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {project.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      <Code2 className="h-4 w-4" /> Code
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      <ExternalLink className="h-4 w-4" /> Demo
                    </a>
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
