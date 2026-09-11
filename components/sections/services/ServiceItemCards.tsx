"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Layout, type LucideIcon } from "lucide-react";
import {
  serviceCardActiveClass,
  serviceCardClass,
  serviceIconWrapActiveClass,
  serviceIconWrapClass,
} from "./service-card-styles";
import { cn } from "@/lib/utils";

export type ServiceCardItem = {
  title: string;
  description: string;
  href?: string;
  icon?: LucideIcon;
};

interface ServiceItemCardsProps {
  items: ServiceCardItem[];
  className?: string;
}

/** Card grid — shared by Skills services section and service-page capabilities. */
export function ServiceItemCards({ items, className }: ServiceItemCardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <ul className={cn("grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5", className)}>
      {items.map((item, i) => {
        const Icon = item.icon ?? Layout;
        const isActive = hovered === i;

        return (
          <motion.li
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.45,
              delay: Math.min(i * 0.04, 0.28),
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
          >
            <article className={cn(serviceCardClass, isActive && serviceCardActiveClass)}>
              <div className="relative flex items-start justify-between gap-3">
                <span className={cn(serviceIconWrapClass, isActive && serviceIconWrapActiveClass)}>
                  <Icon className="h-5 w-5" strokeWidth={2.1} aria-hidden />
                </span>
                <span className="font-mono text-[11px] font-semibold tabular-nums text-muted-foreground/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-heading relative mt-5 text-lg font-bold tracking-tight">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span className="text-foreground">{item.title}</span>
                )}
              </h3>
              <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          </motion.li>
        );
      })}
    </ul>
  );
}
