"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
import type { Service } from "@/lib/services/types";
import { SectionFrame } from "./primitives/SectionFrame";

export function ServiceResourcesRail({ service }: { service: Service }) {
  const reduced = useReducedMotion() ?? false;
  if (!service.relatedPosts.length) return null;

  return (
    <SectionFrame
      id="related-resources"
      label="Insights"
      title="Related articles & guides"
      description="Topic clusters connect services with deeper articles — explore guides related to this service."
    >
      <ul className="divide-y divide-border/70 rounded-2xl border border-border/70 bg-card/40">
        {service.relatedPosts.map((post, i) => (
          <motion.li
            key={post.slug}
            initial={reduced ? false : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              href={`/blog/${post.slug}/`}
              className="group flex items-start gap-4 px-5 py-5 transition-colors hover:bg-primary/[0.04]"
            >
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-semibold text-foreground group-hover:text-primary">
                  {post.title}
                </h3>
                {post.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{post.description}</p>
                ) : null}
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-primary opacity-60 transition-opacity group-hover:opacity-100" />
            </Link>
          </motion.li>
        ))}
      </ul>
    </SectionFrame>
  );
}
