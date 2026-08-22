import { MonitorSmartphone, Server, Wrench } from "lucide-react";
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
} from "react-icons/si";
import type { IconType } from "react-icons";
import { siteConfig } from "@/lib/site-config";

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
    category: "Frontend Development",
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
    category: "Backend Development",
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
    category: "DevOps & Infrastructure",
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

export type { Skill, SkillGroup };
export { SKILL_GROUPS };
