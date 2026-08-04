"use client";

/**
 * TechMarquee
 * -----------
 * Infinite two-row scrolling strip using react-icons Simple Icons (si).
 * Official brand colours, theme-aware for icons that are white on dark.
 *
 * To hide: comment out `dailyStack` in site-config.ts.
 */

import { motion } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { useTheme } from "@/hooks/use-theme";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiAmazonwebservices,
  SiTailwindcss,
  SiGit,
  SiGithub,
  SiGraphql,
  SiPrisma,
  SiFirebase,
  SiSupabase,
  SiVercel,
  SiFigma,
  SiVite,
  SiVitest,
  SiJest,
  SiLinux,
  SiNginx,
} from "react-icons/si";
import type { IconType } from "react-icons";

// ── Brand colours ────────────────────────────────────────────────────────────
// `light` = colour used on a light background
// `dark`  = colour used on a dark background
// Icons that are naturally white/near-white get a dark alternative for light mode.

interface BrandColor {
  light: string;
  dark: string;
}

const BRAND_COLORS: Record<string, BrandColor> = {
  React: { light: "#149ECA", dark: "#61DAFB" },
  "Next.js": { light: "#000000", dark: "#ffffff" }, // black in light, white in dark
  TypeScript: { light: "#3178C6", dark: "#3178C6" },
  JavaScript: { light: "#B8960C", dark: "#F7DF1E" }, // dark yellow for light bg
  "Node.js": { light: "#3D8B37", dark: "#5FA04E" },
  Express: { light: "#363636", dark: "#d4d4d4" }, // dark grey / light grey
  MongoDB: { light: "#2E7D32", dark: "#47A248" },
  PostgreSQL: { light: "#2F4FD6", dark: "#4169E1" },
  Redis: { light: "#D32E22", dark: "#FF4438" },
  Docker: { light: "#1A7CB8", dark: "#2496ED" },
  AWS: { light: "#CC7A00", dark: "#FF9900" },
  Tailwind: { light: "#0891B2", dark: "#06B6D4" },
  Git: { light: "#C0392B", dark: "#F05032" },
  GitHub: { light: "#1a1a1a", dark: "#ffffff" }, // near-black / white
  GraphQL: { light: "#B0006F", dark: "#E10098" },
  Prisma: { light: "#0c4a6e", dark: "#7dd3fc" },
  Firebase: { light: "#D4960A", dark: "#FFCA28" },
  Supabase: { light: "#1a8f5e", dark: "#3ECF8E" },
  Vercel: { light: "#000000", dark: "#ffffff" }, // black / white
  Figma: { light: "#D93B1C", dark: "#F24E1E" },
  Vite: { light: "#4C52CC", dark: "#646CFF" },
  Vitest: { light: "#4a7a10", dark: "#6E9F18" },
  Jest: { light: "#9A0F1D", dark: "#C21325" },
  Linux: { light: "#B89000", dark: "#FCC624" },
  Nginx: { light: "#007A2D", dark: "#009639" },
};

// ── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, IconType> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  Docker: SiDocker,
  AWS: SiAmazonwebservices,
  Tailwind: SiTailwindcss,
  Git: SiGit,
  GitHub: SiGithub,
  GraphQL: SiGraphql,
  Prisma: SiPrisma,
  Firebase: SiFirebase,
  Supabase: SiSupabase,
  Vercel: SiVercel,
  Figma: SiFigma,
  Vite: SiVite,
  Vitest: SiVitest,
  Jest: SiJest,
  Linux: SiLinux,
  Nginx: SiNginx,
};

// ── Pill component ────────────────────────────────────────────────────────────

interface PillProps {
  item: { name: string; icon: string };
  isDark: boolean;
  index: number;
}

function TechPill({ item, isDark }: PillProps) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICON_MAP[item.name];
  const colorSet = BRAND_COLORS[item.name];
  const color = colorSet ? (isDark ? colorSet.dark : colorSet.light) : "currentColor";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex shrink-0 cursor-default items-center gap-2.5 overflow-hidden rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-all duration-300"
      style={{
        borderColor: hovered ? `${color}50` : `${color}20`,
      }}
    >
      {/* Brand colour wash — faint at rest, full on hover */}
      <span
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          background: `${color}12`,
          opacity: hovered ? 1 : 0.4,
        }}
        aria-hidden="true"
      />

      {/* Icon */}
      <span
        className="relative flex h-5 w-5 shrink-0 items-center justify-center"
        aria-hidden="true"
      >
        {Icon ? (
          <Icon size={18} style={{ color }} className="transition-all duration-300" />
        ) : (
          <span className="text-base leading-none">{item.icon}</span>
        )}
      </span>

      {/* Label */}
      <span
        className="relative transition-colors duration-300"
        style={{ color: hovered ? color : undefined }}
      >
        {item.name}
      </span>
    </div>
  );
}

// ── Marquee row ───────────────────────────────────────────────────────────────

interface StackItem {
  name: string;
  icon: string;
}

interface MarqueeRowProps {
  items: StackItem[];
  direction?: "left" | "right";
  speed?: number;
  isDark: boolean;
}

function MarqueeRow({ items, direction = "left", speed = 32, isDark }: MarqueeRowProps) {
  const tripled = [...items, ...items, ...items];
  const sign = direction === "left" ? "-" : "";

  return (
    <div className="relative flex overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="flex shrink-0 gap-3"
        animate={{ x: [`${sign}0%`, `${sign}33.333%`] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity, repeatType: "loop" }}
      >
        {tripled.map((item, i) => (
          <TechPill key={`${item.name}-${i}`} item={item} isDark={isDark} index={i} />
        ))}
      </motion.div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function TechMarquee() {
  const stack = siteConfig.dailyStack;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (!stack || stack.length === 0) return null;

  const mid = Math.ceil(stack.length / 2);
  const row1 = stack.slice(0, mid);
  const row2 = stack.slice(mid);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-14 space-y-3"
    >
      <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Stack I use daily
      </p>
      <MarqueeRow items={row1} direction="left" speed={32} isDark={isDark} />
      {row2.length > 0 && <MarqueeRow items={row2} direction="right" speed={26} isDark={isDark} />}
    </motion.div>
  );
}
