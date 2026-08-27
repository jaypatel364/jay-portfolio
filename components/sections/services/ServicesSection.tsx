"use client";

import { motion } from "framer-motion";
import { getAllServices, servicePath } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";
import { SectionPageCta } from "@/components/shared/SectionPageCta";
import { getServiceIcon } from "./service-icons";
import { ServiceItemCards, type ServiceCardItem } from "./ServiceItemCards";

/** Map homepage service card titles to dedicated service page slugs when available. */
function serviceSlugForTitle(title: string): string | undefined {
  const normalized = title.toLowerCase();
  const services = getAllServices();
  return services.find((s) => {
    const st = s.title.toLowerCase();
    return (
      normalized.includes(st) ||
      st.includes(normalized) ||
      normalized.includes(s.slug.replace(/-/g, " "))
    );
  })?.slug;
}

export function ServicesSection() {
  const { services } = siteConfig;

  const items: ServiceCardItem[] = services.items.map((item) => {
    const serviceSlug = serviceSlugForTitle(item.title);
    return {
      title: item.title,
      description: item.description,
      href: serviceSlug ? servicePath(serviceSlug) : undefined,
      icon: getServiceIcon(item.icon),
    };
  });

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative min-w-0 py-10 md:py-16"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {services.label}
          </span>
          <h2
            id="services-heading"
            className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            {services.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {services.intro}
          </p>
          <div className="mt-8 flex justify-center">
            <SectionPageCta href="/services/">Explore all services</SectionPageCta>
          </div>
        </motion.div>

        <ServiceItemCards items={items} className="mt-12" />
      </div>
    </section>
  );
}
