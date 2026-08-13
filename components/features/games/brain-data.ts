"use client";

import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiTailwindcss,
  SiDocker,
  SiAmazonwebservices,
  SiGraphql,
  SiFramer,
  SiPrisma,
  SiGit,
  SiNestjs,
  SiFigma,
  SiSocketdotio,
  SiJest,
  SiLinux,
  SiTurborepo,
} from "react-icons/si";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SkillNode {
  id: string;
  label: string;
  Icon: IconType;
  color: string;
  fact: string;
}

// ── Node data — real icons, real facts ───────────────────────────────────────

const SKILL_NODES: SkillNode[] = [
  {
    id: "react",
    label: "React",
    Icon: SiReact,
    color: "#61DAFB",
    fact: "Built 10+ production React apps. Jay's rule: if a component exceeds 200 lines, it becomes two.",
  },
  {
    id: "nextjs",
    label: "Next.js",
    Icon: SiNextdotjs,
    color: "#888888",
    fact: "This portfolio runs on Next.js 15 App Router with RSC. Jay migrated a client from Pages → App Router in one weekend.",
  },
  {
    id: "typescript",
    label: "TypeScript",
    Icon: SiTypescript,
    color: "#3178C6",
    fact: "Strict mode only. Motto: 'If the compiler is happy, I'm happy.' Refactored 8k lines of JS → TS in 3 days.",
  },
  {
    id: "nodejs",
    label: "Node.js",
    Icon: SiNodedotjs,
    color: "#5FA04E",
    fact: "Built a WebSocket server handling 500+ concurrent connections for a real-time chat app — zero dropped messages.",
  },
  {
    id: "mongodb",
    label: "MongoDB",
    Icon: SiMongodb,
    color: "#47A248",
    fact: "Designed schemas for a social platform with 100k+ documents. Aggregation pipelines are Jay's superpower.",
  },
  {
    id: "postgresql",
    label: "PostgreSQL",
    Icon: SiPostgresql,
    color: "#4169E1",
    fact: "Wrote a query that reduced a client's report generation from 8s → 400ms. Raw SQL + Prisma.",
  },
  {
    id: "redis",
    label: "Redis",
    Icon: SiRedis,
    color: "#FF4438",
    fact: "Used as both cache layer and rate limiter. Cut API response time by 70% by caching the right queries.",
  },
  {
    id: "tailwind",
    label: "Tailwind",
    Icon: SiTailwindcss,
    color: "#06B6D4",
    fact: "This entire portfolio UI is Tailwind v4. Jay can design a pixel-perfect component without opening Figma.",
  },
  {
    id: "docker",
    label: "Docker",
    Icon: SiDocker,
    color: "#2496ED",
    fact: "Containerised a full MERN stack with Docker Compose — spins up the entire dev environment in one command.",
  },
  {
    id: "aws",
    label: "AWS",
    Icon: SiAmazonwebservices,
    color: "#FF9900",
    fact: "Deployed a KYC platform on AWS using S3, CloudFront, and Rekognition for 3D liveness detection.",
  },
  {
    id: "graphql",
    label: "GraphQL",
    Icon: SiGraphql,
    color: "#E10098",
    fact: "Built a social media GraphQL API with NestJS + Apollo — feed ranking, notifications, follows in one elegant schema.",
  },
  {
    id: "framer",
    label: "Framer Motion",
    Icon: SiFramer,
    color: "#BB4AE8",
    fact: "Every animation on this portfolio is Framer Motion. Jay spent 3 hours perfecting the orbital skill ring alone.",
  },
  {
    id: "prisma",
    label: "Prisma",
    Icon: SiPrisma,
    color: "#5BC4D1",
    fact: "Replaced a hand-rolled ORM with Prisma and eliminated an entire class of runtime bugs overnight.",
  },
  {
    id: "git",
    label: "Git",
    Icon: SiGit,
    color: "#F05032",
    fact: "400+ GitHub contributions in the last year. Atomic commits only — every message tells a complete story.",
  },
  {
    id: "nestjs",
    label: "NestJS",
    Icon: SiNestjs,
    color: "#E0234E",
    fact: "Jay's backend of choice for large APIs. Modular architecture, DI, interceptors — genuinely loves it.",
  },
  {
    id: "figma",
    label: "Figma",
    Icon: SiFigma,
    color: "#F24E1E",
    fact: "Designs before coding. Used Figma + Visily for AI-assisted UI prototyping on a client NGO platform.",
  },
  {
    id: "socketio",
    label: "Socket.io",
    Icon: SiSocketdotio,
    color: "#999999",
    fact: "Real-time typing indicators, seen receipts, room management — built it all and made it feel instant.",
  },
  {
    id: "jest",
    label: "Jest/Vitest",
    Icon: SiJest,
    color: "#C21325",
    fact: "Wrote a test suite that caught a race condition before it hit production. Tests are first-class citizens.",
  },
  {
    id: "linux",
    label: "Linux",
    Icon: SiLinux,
    color: "#FCC624",
    fact: "Daily driver for development. Can navigate, debug, and deploy entirely from a terminal — no GUI needed.",
  },
  {
    id: "turborepo",
    label: "Turborepo",
    Icon: SiTurborepo,
    color: "#EF4444",
    fact: "Built a monorepo chat app with Turborepo — shared types between frontend and backend, zero duplication.",
  },
];

export type { SkillNode };
export { SKILL_NODES };
