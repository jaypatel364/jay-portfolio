"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/services/types";
import { ServiceSectionShell } from "../primitives/ServiceSectionShell";

export function ServiceUseCasesSection({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <ServiceSectionShell
      id="use-cases"
      label="Use cases"
      title="Where this service applies"
      description="Product contexts where this engagement delivers the most value."
      theme="muted"
      width="wide"
    >
      <ul className="grid gap-6 sm:grid-cols-2">
        {service.useCases.map((item, i) => (
          <motion.li
            key={item.title}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.04 }}
            className="border-l-2 border-primary/40 pl-5"
          >
            <h3 className="font-heading text-lg font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </motion.li>
        ))}
      </ul>
    </ServiceSectionShell>
  );
}
