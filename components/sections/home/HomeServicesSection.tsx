import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Gauge,
  Layers,
  Layout,
  Monitor,
  Rocket,
  Server,
  type LucideIcon,
} from "lucide-react";
import { getAllServices } from "@/lib/services";
import { servicePath } from "@/lib/services";
import {
  serviceCardClass,
  serviceIconWrapClass,
} from "@/components/sections/services/service-card-styles";
import { SectionHeading } from "@/components/shared";
import { PAGE_CONTAINER } from "@/components/shared/page-container";
import { innerPages } from "@/settings/pages";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  layout: Layout,
  monitor: Monitor,
  server: Server,
  rocket: Rocket,
  gauge: Gauge,
  layers: Layers,
};

/** Top-3 services teaser — shown on the home page with a "View all" link. */
export function HomeServicesSection() {
  const topServices = getAllServices().slice(0, 3);

  return (
    <section
      id="services-preview"
      aria-labelledby="services-preview-heading"
      className="relative border-t border-border/60 py-20 md:py-24"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-64 max-w-3xl translate-y-12 rounded-full bg-glow/5 blur-3xl"
        aria-hidden
      />

      <div className={PAGE_CONTAINER}>
        <SectionHeading label="What I build" title="Services" titleId="services-preview-heading" />
        <p className="mx-auto mt-3 max-w-xl text-center text-base leading-relaxed text-muted-foreground">
          Full-stack product development, SaaS builds, MVPs, and API engineering for startups and
          product teams.
        </p>

        {/* Top-3 service cards */}
        <ul className="mt-10 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topServices.map((service) => {
            const Icon = ICON_MAP[service.icon] ?? Layout;
            const href = servicePath(service.slug);

            return (
              <li key={service.slug} className="group">
                <article className={serviceCardClass}>
                  <Link
                    href={href}
                    className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    aria-label={service.title}
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <span className={cn(serviceIconWrapClass)}>
                      <Icon className="h-5 w-5" strokeWidth={2.1} aria-hidden />
                    </span>
                  </div>

                  <h3 className="font-heading relative mt-5 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {service.title}
                  </h3>
                  <p className="relative mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {service.shortDescription}
                  </p>

                  <ul
                    className="relative mt-4 space-y-2"
                    aria-label={`${service.title} capabilities`}
                  >
                    {service.cardCapabilities.slice(0, 3).map((cap) => (
                      <li key={cap} className="flex items-start gap-2.5">
                        <span
                          className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground"
                          aria-hidden
                        >
                          <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                        </span>
                        <span className="text-xs leading-relaxed text-muted-foreground transition-colors duration-200 group-hover:text-foreground/85">
                          {cap}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Read more arrow */}
                  <div className="relative mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Learn more
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {/* View all CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href={`${innerPages.services.path}/`}
            className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            View all services
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
