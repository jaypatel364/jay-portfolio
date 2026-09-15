import {
  Database,
  FileStack,
  Gauge,
  Layout,
  Monitor,
  Plug,
  Rocket,
  Server,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Lucide icons keyed by settings/service icon slugs. */
export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  layout: Layout,
  monitor: Monitor,
  server: Server,
  zap: Zap,
  forms: FileStack,
  database: Database,
  plug: Plug,
  gauge: Gauge,
  wrench: Wrench,
  rocket: Rocket,
};

export const CAPABILITY_ICON_CYCLE: LucideIcon[] = [
  Layout,
  Server,
  Database,
  Plug,
  Gauge,
  Wrench,
  FileStack,
  Zap,
  Monitor,
];

export function getServiceIcon(slug?: string, fallback: LucideIcon = Layout): LucideIcon {
  if (!slug) return fallback;
  return SERVICE_ICON_MAP[slug] ?? fallback;
}
