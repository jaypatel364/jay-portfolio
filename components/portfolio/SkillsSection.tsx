"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { MonitorSmartphone, Server, Wrench, Sparkles, Globe2, LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiRedux,
  SiHtml5,
  SiCss3,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiGraphql,
  SiPrisma,
  SiSocketdotio,
  SiGit,
  SiGithub,
  SiDocker,
  SiAmazonwebservices,
  SiJest,
  SiVitest,
  SiFigma,
  SiLinux,
  SiVite,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { useTheme } from "@/hooks/use-theme";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";
import { BrainGameTrigger } from "@/components/portfolio/BrainGame";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Skill {
  name: string;
  icon: IconType;
  lightColor: string;
  darkColor: string;
}

interface SkillGroup {
  category: string;
  icon: LucideIcon;
  description: string;
  skills: Skill[];
  /** Max shown in the "All" grid. Sphere always shows all. Pulled from site-config. */
  previewCount: number;
}

// ── Skill data ─────────────────────────────────────────────────────────────────

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Frontend",
    icon: MonitorSmartphone,
    description: "Crafting pixel-perfect, responsive interfaces",
    previewCount: siteConfig.skillPreviewCounts["Frontend"] ?? 8,
    skills: [
      { name: "React", icon: SiReact, lightColor: "#149ECA", darkColor: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, lightColor: "#000000", darkColor: "#ffffff" },
      { name: "TypeScript", icon: SiTypescript, lightColor: "#3178C6", darkColor: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, lightColor: "#B8960C", darkColor: "#F7DF1E" },
      { name: "Tailwind", icon: SiTailwindcss, lightColor: "#0891B2", darkColor: "#06B6D4" },
      { name: "Redux", icon: SiRedux, lightColor: "#6040A0", darkColor: "#764ABC" },
      { name: "HTML5", icon: SiHtml5, lightColor: "#D43B1A", darkColor: "#E34F26" },
      { name: "CSS3", icon: SiCss3, lightColor: "#1A5FA0", darkColor: "#1572B6" },
    ],
  },
  {
    category: "Backend",
    icon: Server,
    description: "Building robust, scalable server-side systems",
    previewCount: siteConfig.skillPreviewCounts["Backend"] ?? 8,
    skills: [
      { name: "Node.js", icon: SiNodedotjs, lightColor: "#2E7D32", darkColor: "#5FA04E" },
      { name: "Express.js", icon: SiExpress, lightColor: "#404040", darkColor: "#cccccc" },
      { name: "MongoDB", icon: SiMongodb, lightColor: "#2E7D32", darkColor: "#47A248" },
      { name: "PostgreSQL", icon: SiPostgresql, lightColor: "#2F4FD6", darkColor: "#4169E1" },
      { name: "Redis", icon: SiRedis, lightColor: "#D32E22", darkColor: "#FF4438" },
      { name: "GraphQL", icon: SiGraphql, lightColor: "#B0006F", darkColor: "#E10098" },
      { name: "Prisma", icon: SiPrisma, lightColor: "#1a6b8a", darkColor: "#5BC4D1" },
      { name: "Socket.io", icon: SiSocketdotio, lightColor: "#1a1a1a", darkColor: "#dedede" },
    ],
  },
  {
    category: "Tools & DevOps",
    icon: Wrench,
    description: "Streamlining workflows and deployments",
    previewCount: siteConfig.skillPreviewCounts["Tools & DevOps"] ?? 8,
    skills: [
      { name: "Git", icon: SiGit, lightColor: "#C0392B", darkColor: "#F05032" },
      { name: "GitHub", icon: SiGithub, lightColor: "#1a1a1a", darkColor: "#ffffff" },
      { name: "Docker", icon: SiDocker, lightColor: "#1A7CB8", darkColor: "#2496ED" },
      { name: "AWS", icon: SiAmazonwebservices, lightColor: "#CC7A00", darkColor: "#FF9900" },
      { name: "Jest", icon: SiJest, lightColor: "#9A0F1D", darkColor: "#C21325" },
      { name: "Vitest", icon: SiVitest, lightColor: "#4a7a10", darkColor: "#6E9F18" },
      { name: "Figma", icon: SiFigma, lightColor: "#D93B1C", darkColor: "#F24E1E" },
      { name: "Linux", icon: SiLinux, lightColor: "#B89000", darkColor: "#FCC624" },
    ],
  },
];

// ── 3D Tag Sphere — premium globe with momentum + atmosphere ──────────────────
//
// • Fibonacci lattice for even point distribution
// • Circular icon nodes sized by depth (quadratic curve = strong 3D feel)
// • 3 rotating latitude lines that follow the sphere rotation (globe vibes)
// • Radial atmosphere glow behind the sphere
// • Drag to spin with momentum — releases keep spinning, friction slows them
// • Hover tooltip floats above each node
// • Mouse + touch unified via Pointer Events API

interface SpherePoint {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
}

/** Fibonacci sphere — most uniform distribution of N points on a unit sphere */
function fibonacciSphere(n: number): { tx: number; ty: number; tz: number }[] {
  const pts: { tx: number; ty: number; tz: number }[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push({ tx: Math.cos(theta) * r, ty: y, tz: Math.sin(theta) * r });
  }
  return pts;
}

function rotate3D(
  tx: number,
  ty: number,
  tz: number,
  ax: number,
  ay: number,
): { rx: number; ry: number; rz: number } {
  const cosY = Math.cos(ay),
    sinY = Math.sin(ay);
  const x1 = tx * cosY + tz * sinY;
  const z1 = -tx * sinY + tz * cosY;
  const cosX = Math.cos(ax),
    sinX = Math.sin(ax);
  const y2 = ty * cosX - z1 * sinX;
  const z2 = ty * sinX + z1 * cosX;
  return { rx: x1, ry: y2, rz: z2 };
}

/** Generate points for a latitude ring at a given tilt angle */
function latRingPoints(tilt: number, segments = 64): { tx: number; ty: number; tz: number }[] {
  const pts = [];
  const cosT = Math.cos(tilt),
    sinT = Math.sin(tilt);
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    pts.push({ tx: Math.cos(theta) * cosT, ty: sinT, tz: Math.sin(theta) * cosT });
  }
  return pts;
}

function SkillSphere({ skills, isDark }: { skills: Skill[]; isDark: boolean }) {
  const RADIUS = 185;
  const NODE_R = 22; // px radius of each circular node at full scale

  const [angleX, setAngleX] = useState(0.35);
  const [angleY, setAngleY] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const basePoints = useRef(fibonacciSphere(skills.length));

  // Physics refs — never cause re-render, updated in RAF
  const angleRef = useRef({ x: 0.35, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPtr = useRef({ x: 0, y: 0 });
  const lastPtrTime = useRef(0);
  const ptrDelta = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const frameTime = useRef<number>(0);

  // Main RAF loop — auto-spin + momentum decay
  useEffect(() => {
    const AUTO_X = 0.00022; // rad/ms gentle tilt drift
    const AUTO_Y = 0.00038; // rad/ms main spin
    const FRICTION = 0.92; // stronger friction — decelerates noticeably each frame
    const MIN_VEL = 0.00004; // below this → resume auto-spin
    const MAX_VEL = 0.012; // hard cap so a fast flick never goes wild

    const tick = (now: number) => {
      const dt = frameTime.current ? Math.min(now - frameTime.current, 24) : 16; // clamp dt spike
      frameTime.current = now;

      if (!dragging.current) {
        const speed = Math.sqrt(velRef.current.x ** 2 + velRef.current.y ** 2);
        if (speed > MIN_VEL) {
          // Coast with friction
          velRef.current.x *= FRICTION;
          velRef.current.y *= FRICTION;
          // Clamp so any remaining spike can't run away
          velRef.current.x = Math.max(-MAX_VEL, Math.min(MAX_VEL, velRef.current.x));
          velRef.current.y = Math.max(-MAX_VEL, Math.min(MAX_VEL, velRef.current.y));
          angleRef.current.x += velRef.current.x * dt;
          angleRef.current.y += velRef.current.y * dt;
        } else {
          // Auto-spin
          velRef.current = { x: 0, y: 0 };
          angleRef.current.x += AUTO_X * dt;
          angleRef.current.y += AUTO_Y * dt;
        }
        setAngleX(angleRef.current.x);
        setAngleY(angleRef.current.y);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    setIsDragging(true);
    velRef.current = { x: 0, y: 0 };
    lastPtr.current = { x: e.clientX, y: e.clientY };
    lastPtrTime.current = e.timeStamp;
    ptrDelta.current = { x: 0, y: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPtr.current.x;
    const dy = e.clientY - lastPtr.current.y;
    const dt = Math.max(1, e.timeStamp - lastPtrTime.current);
    // Clamp instantaneous velocity so a fast flick stays within reasonable bounds
    const MAX_VEL = 0.012;
    const rawVx = ((dy * 0.007) / dt) * 16;
    const rawVy = ((dx * 0.007) / dt) * 16;
    velRef.current = {
      x: Math.max(-MAX_VEL, Math.min(MAX_VEL, rawVx)),
      y: Math.max(-MAX_VEL, Math.min(MAX_VEL, rawVy)),
    };
    ptrDelta.current = { x: dy * 0.007, y: dx * 0.007 };
    lastPtr.current = { x: e.clientX, y: e.clientY };
    lastPtrTime.current = e.timeStamp;
    angleRef.current.x += ptrDelta.current.x;
    angleRef.current.y += ptrDelta.current.y;
    setAngleX(angleRef.current.x);
    setAngleY(angleRef.current.y);
  };

  const onPointerUp = () => {
    dragging.current = false;
    setIsDragging(false);
  };

  // ── Project skill nodes ────────────────────────────────────────────────────
  const projected: (SpherePoint & { skill: Skill })[] = basePoints.current.map((p, i) => {
    const { rx, ry, rz } = rotate3D(p.tx, p.ty, p.tz, angleX, angleY);
    const depth = (rz + 1) / 2; // 0 = back, 1 = front
    // Quadratic depth curve — makes back nodes clearly smaller/dimmer
    const depthQ = depth * depth;
    // Quadratic depth curve — back nodes clearly smaller/dimmer but still visible
    // Light mode: floor 0.55 opacity so nothing disappears on white bg
    // Dark mode: floor 0.65 opacity — needs higher floor to stay visible on dark bg
    const opacityFloor = isDark ? 0.65 : 0.55;
    const scaleFloor = 0.52;
    return {
      x: rx * RADIUS,
      y: ry * RADIUS,
      z: rz,
      scale: scaleFloor + depthQ * (1 - scaleFloor),
      opacity: opacityFloor + depthQ * (1 - opacityFloor),
      skill: skills[i],
    };
  });
  projected.sort((a, b) => a.z - b.z);

  // ── Project latitude rings ─────────────────────────────────────────────────
  const LAT_TILTS = [-0.52, 0, 0.52]; // ≈ -30°, 0°, +30° latitude
  const ringPaths = LAT_TILTS.map((tilt) => {
    const ringPts = latRingPoints(tilt);
    const projected2d = ringPts.map((p) => {
      const { rx, ry } = rotate3D(p.tx, p.ty, p.tz, angleX, angleY);
      return { x: rx * RADIUS + RADIUS + 40, y: ry * RADIUS + RADIUS + 40 };
    });
    // Build SVG path from projected points
    return (
      projected2d
        .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
        .join(" ") + " Z"
    );
  });

  const svgSize = (RADIUS + 40) * 2;

  return (
    <div
      className="relative mx-auto select-none touch-none"
      style={{
        width: svgSize,
        height: svgSize,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Atmosphere glow — behind everything */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: RADIUS * 2,
          height: RADIUS * 2,
          background:
            "radial-gradient(circle, var(--tw-shadow-color, color-mix(in oklch, var(--primary) 10%, transparent)) 0%, transparent 72%)",
          backgroundImage: `radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 72%)`,
        }}
      />

      {/* SVG layer — sphere outline + latitude rings */}
      <svg
        className="pointer-events-none absolute inset-0"
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        overflow="visible"
      >
        {/* Outer sphere circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--primary)"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
        {/* Latitude rings */}
        {ringPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--primary)"
            strokeOpacity={0.12}
            strokeWidth={0.8}
            strokeDasharray={i === 1 ? "none" : "4 6"}
          />
        ))}
        {/* Longitude meridian hint — vertical */}
        <ellipse
          cx={svgSize / 2}
          cy={svgSize / 2}
          rx={Math.abs(Math.cos(angleY) * RADIUS)}
          ry={RADIUS}
          fill="none"
          stroke="var(--primary)"
          strokeOpacity={0.07}
          strokeWidth={0.8}
        />
      </svg>

      {/* Skill nodes */}
      {projected.map(({ x, y, scale, opacity, skill }) => {
        const color = isDark ? skill.darkColor : skill.lightColor;
        const Icon = skill.icon;
        const isHovered = hoveredId === skill.name;
        const nodeSize = NODE_R * 2 * scale;

        return (
          <div
            key={skill.name}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              zIndex: Math.round(opacity * 100),
              // Don't mess with opacity on hover — instead we boost it via style
            }}
            onMouseEnter={() => setHoveredId(skill.name)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Hover tooltip above the node */}
            {isHovered && (
              <div
                className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border/60 bg-card/95 px-2.5 py-1 text-[11px] font-bold shadow-lg backdrop-blur-sm"
                style={{ color, zIndex: 200 }}
              >
                {skill.name}
                <div
                  className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
                  style={{ borderTopColor: "var(--border)" }}
                />
              </div>
            )}

            {/* Circular node */}
            <div
              className="flex items-center justify-center rounded-full transition-all duration-150"
              style={{
                width: nodeSize,
                height: nodeSize,
                opacity: isHovered ? 1 : opacity,
                // Dark mode: stronger fill + border so nodes punch through the dark bg
                backgroundColor: isDark
                  ? isHovered
                    ? `${color}40`
                    : `${color}28`
                  : isHovered
                    ? `${color}22`
                    : `${color}12`,
                border: `${scale > 0.8 ? 1.5 : 1}px solid ${
                  isDark
                    ? isHovered
                      ? `${color}cc`
                      : `${color}10`
                    : isHovered
                      ? `${color}70`
                      : `${color}35`
                }`,
                boxShadow: isDark
                  ? isHovered
                    ? `0 0 22px ${color}80, 0 0 44px ${color}40, inset 0 0 14px ${color}25`
                    : `0 0 ${Math.round(scale * 14)}px ${color}55`
                  : isHovered
                    ? `0 0 20px ${color}55, 0 0 40px ${color}25, inset 0 0 12px ${color}15`
                    : `0 0 ${Math.round(scale * 10)}px ${color}28`,
                transform: `scale(${isHovered ? 1.22 : 1})`,
              }}
            >
              <Icon
                size={Math.max(10, Math.round(nodeSize * 0.45))}
                style={{
                  // Dark mode: full color always; light mode: 87% on idle
                  color: isDark ? color : isHovered ? color : `${color}dd`,
                  filter: isDark
                    ? `drop-shadow(0 0 ${isHovered ? "6px" : "3px"} ${color}cc)`
                    : isHovered
                      ? `drop-shadow(0 0 5px ${color}aa)`
                      : undefined,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Drag hint */}
      <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2">
        <span className="text-[10px] text-muted-foreground/35 tracking-wide">
          drag to rotate · hover to explore
        </span>
      </div>
    </div>
  );
}

// ── Overflow pill — compact badge for extra skills ────────────────────────────

function OverflowPill({ skill, isDark, delay }: { skill: Skill; isDark: boolean; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = skill.icon;
  const color = isDark ? skill.darkColor : skill.lightColor;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={hovered ? { y: -3, scale: 1.08 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 cursor-default transition-all duration-200"
        style={{
          borderColor: hovered ? `${color}50` : `${color}22`,
          backgroundColor: hovered ? `${color}10` : undefined,
          boxShadow: hovered ? `0 6px 18px ${color}20` : undefined,
        }}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all duration-200"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon size={14} style={{ color }} />
        </span>
        <span className="text-xs font-semibold" style={{ color: hovered ? color : undefined }}>
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ── Grid pill (used in All-view and mobile fallback) ──────────────────────────

function SkillPill({ skill, delay, isDark }: { skill: Skill; delay: number; isDark: boolean }) {
  const [hovered, setHovered] = useState(false);
  const Icon = skill.icon;
  const color = isDark ? skill.darkColor : skill.lightColor;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay, ease: "backOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={hovered ? { y: -4, scale: 1.04 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-border bg-card px-4 py-4 cursor-default w-[79px] transition-all duration-200"
        style={{
          borderColor: hovered ? `${color}50` : undefined,
          boxShadow: hovered ? `0 8px 22px ${color}20` : undefined,
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-200"
          style={{ background: `${color}10`, opacity: hovered ? 1 : 0 }}
          aria-hidden="true"
        />
        <span
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200"
          style={{ backgroundColor: hovered ? `${color}22` : `${color}14` }}
        >
          <Icon size={22} style={{ color }} />
        </span>
        <span className="relative z-10 text-center text-[11px] font-semibold leading-tight text-muted-foreground">
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ── Category card — used in All view ─────────────────────────────────────────

function CategoryCard({
  group,
  index,
  isDark,
}: {
  group: SkillGroup;
  index: number;
  isDark: boolean;
}) {
  const Icon = group.icon;
  // In the "All" view, only show up to previewCount skills
  const visibleSkills = group.skills.slice(0, group.previewCount);
  const showhiddenCount = false;
  const hiddenCount = group.skills.length - visibleSkills.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold">{group.category}</h3>
          <p className="text-xs text-muted-foreground">{group.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {visibleSkills.map((skill, si) => (
          <SkillPill
            key={skill.name}
            skill={skill}
            delay={index * 0.08 + si * 0.04}
            isDark={isDark}
          />
        ))}
        {/* "+N more" badge — click a category filter to see all in the sphere */}
        {showhiddenCount && hiddenCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.3,
              delay: index * 0.08 + visibleSkills.length * 0.04,
              ease: "backOut",
            }}
            className="flex items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-4 w-[79px] cursor-default"
          >
            <span className="text-center text-[11px] font-semibold leading-tight text-primary/70">
              +{hiddenCount}
              <br />
              more
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── Filter types ──────────────────────────────────────────────────────────────

type FilterKey = "all" | "Frontend" | "Backend" | "Tools & DevOps";
type SkillView = "sphere" | "list";

const FILTERS: { label: string; value: FilterKey }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "Frontend" },
  { label: "Backend", value: "Backend" },
  { label: "Tools", value: "Tools & DevOps" },
];

// ── View toggle — Grid ↔ 3D Sphere (shared across all filters) ───────────────

function ViewToggle({ view, onChange }: { view: SkillView; onChange: (v: SkillView) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 28, delay: 0.1 }}
      className="hidden md:flex items-center gap-0.5 rounded-xl border border-border/60 bg-card p-1 shadow-sm"
      role="group"
      aria-label="Switch skills view"
    >
      {(
        [
          { value: "sphere" as const, icon: Globe2, label: "3D Sphere" },
          { value: "list" as const, icon: LayoutGrid, label: "Grid" },
        ] as const
      ).map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          title={label}
          aria-pressed={view === value}
          className={cn(
            "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            view === value ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {view === value && (
            <motion.div
              layoutId="skill-view-active"
              className="absolute inset-0 rounded-lg bg-primary/10"
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
            />
          )}
          <Icon className="relative z-10 h-3.5 w-3.5" />
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export function SkillsSection() {
  const totalSkills = SKILL_GROUPS.reduce((acc, g) => acc + g.skills.length, 0);
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  // Sphere is the default — it's the premium experience
  const [view, setView] = useState<SkillView>("sphere");

  const expNumeric = expLabel.startsWith("<") ? 0 : parseFloat(expLabel);
  const expHalves = Math.round(expNumeric * 2);

  const { count: skillCount, ref: skillRef } = useCountUp({ target: totalSkills, duration: 1400 });
  const { count: expHalfCount, ref: expRef } = useCountUp({
    target: expHalves,
    duration: 1400,
    delay: 100,
  });
  const { count: projCount, ref: projRef } = useCountUp({
    target: siteConfig.projectCount,
    duration: 1400,
    delay: 200,
  });

  const animatedExp =
    expHalfCount === 0
      ? "< 1"
      : expHalfCount % 2 === 0
        ? `${expHalfCount / 2}+`
        : `${(expHalfCount / 2).toFixed(1)}+`;

  const activeGroup =
    activeFilter === "all" ? null : (SKILL_GROUPS.find((g) => g.category === activeFilter) ?? null);

  // Skills to show in the sphere — all when "All", filtered group otherwise
  const sphereSkills =
    activeFilter === "all" ? SKILL_GROUPS.flatMap((g) => g.skills) : (activeGroup?.skills ?? []);

  return (
    <section id="skills" className="relative overflow-hidden px-6 py-14 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading label="Expertise" title="Skills & Technologies" />

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-8 flex max-w-md items-center justify-center gap-8 text-center"
        >
          {[
            { ref: skillRef, val: `${skillCount}+`, label: "Tools & Technologies" },
            { ref: expRef, val: animatedExp, label: "Years Experience" },
            { ref: projRef, val: `${projCount}+`, label: "Production Projects" },
          ].map(({ ref, val, label }, i, arr) => (
            <React.Fragment key={label}>
              <div>
                <span
                  ref={ref as React.RefObject<HTMLSpanElement>}
                  className="text-2xl font-bold gradient-text tabular-nums"
                >
                  {val}
                </span>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
              {i < arr.length - 1 && <div className="h-8 w-px bg-border" />}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Filter tabs + view toggle — always visible together */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-3 flex-wrap"
        >
          <div
            className="flex items-center gap-2 flex-wrap justify-center"
            role="tablist"
            aria-label="Filter skills by category"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                role="tab"
                aria-selected={activeFilter === f.value}
                onClick={() => setActiveFilter(f.value)}
                className={cn(
                  "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  activeFilter === f.value
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {activeFilter === f.value && (
                  <motion.div
                    layoutId="skill-filter-active"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>

          {/* View toggle — always shown, desktop only */}
          <ViewToggle view={view} onChange={setView} />
        </motion.div>

        {/* Jay's Brain game trigger */}
        {siteConfig.showBrainGame && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mt-6 hidden md:flex justify-center"
          >
            <BrainGameTrigger />
          </motion.div>
        )}

        {/* Content */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFilter}-${view}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {/* ── SPHERE view (desktop) ── */}
              {view === "sphere" && (
                <>
                  {/* Category header when a single filter is active */}
                  {activeGroup && (
                    <div className="mb-8 flex items-center justify-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-glow">
                        {React.createElement(activeGroup.icon, {
                          className: "h-5 w-5 text-primary-foreground",
                        })}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold">{activeGroup.category}</h3>
                        <p className="text-xs text-muted-foreground">{activeGroup.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Sphere — desktop */}
                  <div className="hidden md:flex justify-center">
                    <SkillSphere skills={sphereSkills} isDark={isDark} />
                  </div>

                  {/* Mobile fallback — pill grid (sphere is too small on mobile) */}
                  <div className="md:hidden">
                    {activeFilter === "all" ? (
                      <div className="grid gap-12">
                        {SKILL_GROUPS.map((group, i) => (
                          <CategoryCard
                            key={group.category}
                            group={group}
                            index={i}
                            isDark={isDark}
                          />
                        ))}
                      </div>
                    ) : (
                      activeGroup && (
                        <div className="flex flex-wrap justify-center gap-3">
                          {activeGroup.skills.map((skill, si) => (
                            <SkillPill
                              key={skill.name}
                              skill={skill}
                              delay={si * 0.05}
                              isDark={isDark}
                            />
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </>
              )}

              {/* ── GRID / LIST view ── */}
              {view === "list" && (
                <>
                  {activeFilter === "all" ? (
                    <div className="grid gap-12 lg:grid-cols-3">
                      {SKILL_GROUPS.map((group, i) => (
                        <CategoryCard
                          key={group.category}
                          group={group}
                          index={i}
                          isDark={isDark}
                        />
                      ))}
                    </div>
                  ) : (
                    activeGroup && (
                      <>
                        <div className="mb-8 flex items-center justify-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-glow">
                            {React.createElement(activeGroup.icon, {
                              className: "h-5 w-5 text-primary-foreground",
                            })}
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-bold">
                              {activeGroup.category}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {activeGroup.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                          {activeGroup.skills.map((skill, si) => (
                            <OverflowPill
                              key={skill.name}
                              skill={skill}
                              isDark={isDark}
                              delay={si * 0.04}
                            />
                          ))}
                        </div>
                      </>
                    )
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-14 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Always learning &amp; exploring new technologies
          </div>
        </motion.div>
      </div>
    </section>
  );
}
