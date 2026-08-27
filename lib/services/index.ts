import { servicesHub } from "@/settings/services/hub";
import { SERVICE_PAGE_EXTRAS } from "@/settings/services/extras";
import { ALL_SERVICES } from "@/settings/services/pages";
import { DEFAULT_SERVICE_SECTION_ORDER, type Service, type ServiceSectionKey } from "./types";

export type { Service, ServicesHubSettings, ServiceSectionKey } from "./types";
export { DEFAULT_SERVICE_SECTION_ORDER };

export function getServicesHub() {
  return servicesHub;
}

function mergeServiceExtras(service: Service): Service {
  const extra = SERVICE_PAGE_EXTRAS[service.slug];
  if (!extra) return service;

  return {
    ...service,
    editorialIntro: service.editorialIntro ?? extra.editorialIntro,
    whatWeBuild: service.whatWeBuild ?? extra.whatWeBuild,
    industries: service.industries ?? extra.industries,
    hero: {
      ...service.hero,
      headlineLines: service.hero.headlineLines ?? extra.headlineLines,
    },
  };
}

export function getAllServices(): Service[] {
  return [...ALL_SERVICES].sort((a, b) => a.order - b.order).map(mergeServiceExtras);
}

export function getServiceBySlug(slug: string): Service | undefined {
  const service = ALL_SERVICES.find((s) => s.slug === slug);
  return service ? mergeServiceExtras(service) : undefined;
}

export function getServiceSlugs(): string[] {
  return getAllServices().map((s) => s.slug);
}

export function getRelatedServices(service: Service): Service[] {
  return service.relatedServiceSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is Service => Boolean(s));
}

const LEGACY_SECTION_ALIASES: Partial<Record<ServiceSectionKey, ServiceSectionKey>> = {
  architecture: "piecesConnect",
};

export function getServiceSectionOrder(service: Service): ServiceSectionKey[] {
  const raw = service.sectionOrder ?? DEFAULT_SERVICE_SECTION_ORDER;
  const seen = new Set<ServiceSectionKey>();
  const normalized: ServiceSectionKey[] = [];

  for (const key of raw) {
    const next = LEGACY_SECTION_ALIASES[key] ?? key;
    if (seen.has(next)) continue;
    seen.add(next);
    normalized.push(next);
  }

  for (const key of DEFAULT_SERVICE_SECTION_ORDER) {
    if (!seen.has(key)) normalized.push(key);
  }

  return normalized;
}

export function isServiceSectionVisible(service: Service, key: ServiceSectionKey): boolean {
  return service.sectionVisibility?.[key] !== false;
}

export function servicePath(slug: string): string {
  return `/services/${slug}/`;
}
