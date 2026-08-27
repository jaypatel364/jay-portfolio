"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/services/types";
import { servicePath } from "@/lib/services";
import { serviceCardClass } from "@/components/sections/services/service-card-styles";
import { ServiceSectionShell } from "./primitives/ServiceSectionShell";

export function ServiceRelatedEcosystem({ related }: { service: Service; related: Service[] }) {
  const reduced = useReducedMotion() ?? false;
  if (!related.length) return null;

  return (
    <ServiceSectionShell
      id="related-services"
      label="Connected services"
      title="You may also need"
      description="Services that often complement this engagement."
      theme="muted"
      width="wide"
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {related.map((rel, i) => (
          <motion.li
            key={rel.slug}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={servicePath(rel.slug)} className={serviceCardClass}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
                Related
              </p>
              <h3 className="font-heading mt-2 text-xl font-bold text-foreground group-hover:text-primary">
                {rel.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {rel.shortDescription}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Explore
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </ServiceSectionShell>
  );
}
