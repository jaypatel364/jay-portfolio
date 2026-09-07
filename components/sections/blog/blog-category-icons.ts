import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Briefcase,
  Cloud,
  Code2,
  FolderOpen,
  Gauge,
  Layers,
  Monitor,
  Server,
  Sparkles,
  Wrench,
} from "lucide-react";

type CategoryRef = {
  slug?: string | null;
  title: string;
};

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const ICON_BY_KEY: Record<string, LucideIcon> = {
  frontend: Monitor,
  "front-end": Monitor,
  fe: Monitor,
  backend: Server,
  "back-end": Server,
  api: Server,
  "case-study": Briefcase,
  "case-studies": Briefcase,
  devops: Cloud,
  infrastructure: Cloud,
  tutorial: Code2,
  tutorials: Code2,
  architecture: Layers,
  performance: Gauge,
  tooling: Wrench,
  tools: Wrench,
  insights: Sparkles,
};

/** Icons for blog category filters — toolbar/search only. */
export function getBlogCategoryIcon(category?: CategoryRef | null): LucideIcon {
  if (!category) return FolderOpen;

  const slugKey = category.slug ? normalizeKey(category.slug) : "";
  const titleKey = normalizeKey(category.title);

  if (slugKey && ICON_BY_KEY[slugKey]) return ICON_BY_KEY[slugKey];
  if (ICON_BY_KEY[titleKey]) return ICON_BY_KEY[titleKey];

  const title = category.title.toLowerCase();
  if (title.includes("front")) return Monitor;
  if (title.includes("back") || title.includes("api")) return Server;
  if (title.includes("case study")) return Briefcase;
  if (title.includes("devops") || title.includes("infra")) return Cloud;
  if (title.includes("tutorial") || title.includes("guide")) return Code2;
  if (title.includes("architect")) return Layers;
  if (title.includes("performance") || title.includes("optim")) return Gauge;

  return FolderOpen;
}

export const BLOG_ALL_CATEGORY_ICON = Boxes;
