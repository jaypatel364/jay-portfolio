"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/services/types";
import { servicePath } from "@/lib/services";
import { cn } from "@/lib/utils";
import { SectionFrame } from "./primitives/SectionFrame";

export function ServiceCapabilityExplorer({ service }: { service: Service }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const cap = service.capabilities[active];

  return (
    <SectionFrame
      id="capabilities"
      label="Capabilities"
      title="What this service covers"
      description="Select a capability to see scope, context, and related services."
      fullBleed
      theme="muted"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-12">
        <ol className="space-y-0 divide-y divide-border/70 rounded-2xl border border-border/70 bg-card/80">
          {service.capabilities.map((item, index) => {
            const selected = active === index;
            return (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    "flex w-full items-start gap-4 px-5 py-4 text-left transition-colors",
                    selected ? "bg-primary/[0.06]" : "hover:bg-muted/30",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-xs font-bold tabular-nums",
                      selected ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("font-heading font-semibold", selected && "text-primary")}>
                    {item.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div
            key={cap?.title}
            initial={reduced ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-[220px] flex-col rounded-2xl border border-border/70 bg-card p-6 sm:p-8"
          >
            {cap ? (
              <>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
                  Capability {String(active + 1).padStart(2, "0")}
                </p>
                <h3 className="font-heading mt-3 text-2xl font-bold text-foreground">
                  {cap.title}
                </h3>
                <p className="mt-4 flex-1 text-base leading-relaxed text-muted-foreground">
                  {cap.description}
                </p>
                {cap.relatedServiceSlug ? (
                  <Link
                    href={servicePath(cap.relatedServiceSlug)}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Explore related service
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionFrame>
  );
}
