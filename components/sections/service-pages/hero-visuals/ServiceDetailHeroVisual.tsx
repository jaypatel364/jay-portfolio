"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HeroVisualFrame } from "@/components/layout/hero-visuals/HeroVisualFrame";
import type { ServiceVisual } from "@/lib/services/types";

interface ServiceDetailHeroVisualProps {
  slug: string;
  title: string;
  large?: boolean;
  /** Skip entrance animations — used in the page hero for instant paint. */
  instant?: boolean;
  /** Optional diagram/illustration — when set, replaces the generated flow SVG. */
  visual?: ServiceVisual;
  /** Extra classes for the rendered image (sizing / fit only). */
  imageClassName?: string;
}

type Node = { id: string; label: string; x: number; y: number; accent?: boolean };

function FlowDiagram({
  nodes,
  edges,
  label,
  large,
  instant,
}: {
  nodes: Node[];
  edges: [string, string][];
  label: string;
  large?: boolean;
  instant?: boolean;
}) {
  const reduced = useReducedMotion() ?? false;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const animate = !instant && !reduced;

  return (
    <HeroVisualFrame
      label={label}
      overflowVisible
      className={large ? "min-h-[380px]" : "min-h-[300px]"}
    >
      <svg viewBox="0 0 360 280" className="h-full w-full p-4" aria-hidden>
        {edges.map(([from, to], i) => {
          const a = byId[from];
          const b = byId[to];
          if (!a || !b) return null;
          if (!animate) {
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y + 16}
                x2={b.x}
                y2={b.y - 8}
                stroke="var(--border)"
                strokeWidth={1.5}
              />
            );
          }
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y + 16}
              x2={b.x}
              y2={b.y - 8}
              stroke="var(--border)"
              strokeWidth={1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
            />
          );
        })}
        {nodes.map((node, i) => (
          <g key={node.id}>
            {animate ? (
              <motion.rect
                x={node.x - 52}
                y={node.y - 14}
                width={104}
                height={28}
                rx={8}
                fill={
                  node.accent
                    ? "color-mix(in oklch, var(--primary) 18%, var(--card))"
                    : "var(--card)"
                }
                stroke={
                  node.accent
                    ? "color-mix(in oklch, var(--primary) 45%, transparent)"
                    : "var(--border)"
                }
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              />
            ) : (
              <rect
                x={node.x - 52}
                y={node.y - 14}
                width={104}
                height={28}
                rx={8}
                fill={
                  node.accent
                    ? "color-mix(in oklch, var(--primary) 18%, var(--card))"
                    : "var(--card)"
                }
                stroke={
                  node.accent
                    ? "color-mix(in oklch, var(--primary) 45%, transparent)"
                    : "var(--border)"
                }
              />
            )}
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              className="fill-foreground text-[10px] font-semibold"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </HeroVisualFrame>
  );
}

const DIAGRAMS: Record<string, { label: string; nodes: Node[]; edges: [string, string][] }> = {
  "full-stack-development": {
    label: "full-stack.flow",
    nodes: [
      { id: "fe", label: "Frontend", x: 180, y: 36, accent: true },
      { id: "api", label: "API Layer", x: 180, y: 96 },
      { id: "be", label: "Backend", x: 100, y: 156 },
      { id: "db", label: "Database", x: 180, y: 156, accent: true },
      { id: "cloud", label: "Cloud", x: 260, y: 156 },
      { id: "ops", label: "Deploy", x: 180, y: 216 },
    ],
    edges: [
      ["fe", "api"],
      ["api", "be"],
      ["api", "db"],
      ["api", "cloud"],
      ["be", "ops"],
      ["db", "ops"],
      ["cloud", "ops"],
    ],
  },
  "saas-development": {
    label: "saas.platform",
    nodes: [
      { id: "users", label: "Users", x: 80, y: 40 },
      { id: "app", label: "Application", x: 180, y: 40, accent: true },
      { id: "billing", label: "Billing", x: 280, y: 40 },
      { id: "admin", label: "Admin", x: 100, y: 120 },
      { id: "api", label: "APIs", x: 180, y: 120 },
      { id: "analytics", label: "Analytics", x: 260, y: 120 },
      { id: "infra", label: "Infrastructure", x: 180, y: 200, accent: true },
    ],
    edges: [
      ["users", "app"],
      ["app", "billing"],
      ["app", "admin"],
      ["app", "api"],
      ["app", "analytics"],
      ["api", "infra"],
      ["billing", "infra"],
    ],
  },
  "mvp-development": {
    label: "mvp.journey",
    nodes: [
      { id: "idea", label: "Idea", x: 60, y: 140 },
      { id: "scope", label: "Scope", x: 120, y: 100 },
      { id: "build", label: "Build", x: 180, y: 60, accent: true },
      { id: "launch", label: "Launch", x: 240, y: 100 },
      { id: "learn", label: "Learn", x: 300, y: 140, accent: true },
    ],
    edges: [
      ["idea", "scope"],
      ["scope", "build"],
      ["build", "launch"],
      ["launch", "learn"],
    ],
  },
  "backend-development": {
    label: "api.flow",
    nodes: [
      { id: "client", label: "Clients", x: 180, y: 36 },
      { id: "gateway", label: "API Gateway", x: 180, y: 96, accent: true },
      { id: "auth", label: "Auth", x: 80, y: 156 },
      { id: "svc", label: "Services", x: 180, y: 156 },
      { id: "db", label: "Database", x: 280, y: 156 },
      { id: "ext", label: "Integrations", x: 180, y: 216, accent: true },
    ],
    edges: [
      ["client", "gateway"],
      ["gateway", "auth"],
      ["gateway", "svc"],
      ["svc", "db"],
      ["svc", "ext"],
    ],
  },
  "performance-optimization": {
    label: "perf.cycle",
    nodes: [
      { id: "before", label: "Baseline", x: 70, y: 120 },
      { id: "diag", label: "Diagnose", x: 140, y: 80, accent: true },
      { id: "fix", label: "Optimize", x: 210, y: 120 },
      { id: "measure", label: "Measure", x: 280, y: 80 },
      { id: "after", label: "Improved", x: 290, y: 180, accent: true },
    ],
    edges: [
      ["before", "diag"],
      ["diag", "fix"],
      ["fix", "measure"],
      ["measure", "after"],
    ],
  },
  "frontend-development": {
    label: "ui.pipeline",
    nodes: [
      { id: "design", label: "Design", x: 70, y: 100 },
      { id: "components", label: "Components", x: 150, y: 60, accent: true },
      { id: "responsive", label: "Responsive", x: 230, y: 100 },
      { id: "a11y", label: "Accessibility", x: 150, y: 140 },
      { id: "perf", label: "Performance", x: 290, y: 140, accent: true },
    ],
    edges: [
      ["design", "components"],
      ["components", "responsive"],
      ["components", "a11y"],
      ["responsive", "perf"],
      ["a11y", "perf"],
    ],
  },
  "mern-stack-development": {
    label: "mern.stack",
    nodes: [
      { id: "react", label: "React", x: 180, y: 36, accent: true },
      { id: "express", label: "Express.js", x: 180, y: 96 },
      { id: "node", label: "Node.js", x: 180, y: 156 },
      { id: "mongo", label: "MongoDB", x: 180, y: 216, accent: true },
    ],
    edges: [
      ["react", "express"],
      ["express", "node"],
      ["node", "mongo"],
    ],
  },
};

function ImageDiagram({
  src,
  alt,
  title,
  instant,
  className,
}: {
  src: string;
  alt: string;
  title?: string;
  instant?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const animate = !instant && !reduced;

  return (
    <motion.div
      className="relative h-full w-full"
      initial={animate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <Image
        src={src}
        alt={alt}
        title={title ?? alt}
        width={2720}
        height={1840}
        sizes="(max-width: 1024px) 100vw, 440px"
        className={cn("h-auto w-full", className)}
        priority={instant}
      />
    </motion.div>
  );
}

export function ServiceDetailHeroVisual({
  slug,
  title,
  large,
  instant,
  visual,
  imageClassName,
}: ServiceDetailHeroVisualProps) {
  const imageSrc = visual?.image;
  const imageAlt = visual?.alt ?? `${title} architecture visualization`;
  const imageTitle = visual?.title ?? imageAlt;

  return (
    <div className="relative h-full">
      {imageSrc ? (
        <ImageDiagram
          src={imageSrc}
          alt={imageAlt}
          title={imageTitle}
          instant={instant}
          className={imageClassName}
        />
      ) : (
        <FlowDiagram
          {...(DIAGRAMS[slug] ?? DIAGRAMS["full-stack-development"])}
          large={large}
          instant={instant}
        />
      )}
      <p className="sr-only">{title} architecture visualization</p>
    </div>
  );
}
