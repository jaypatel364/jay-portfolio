import { cn } from "@/lib/utils";

/** Shared card surface — matches Skills page ServicesSection. */
export const serviceCardClass = cn(
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card",
  "p-6 transition-all duration-300 sm:p-7",
  "hover:border-primary/35 hover:shadow-glow hover:-translate-y-1",
);

export const serviceCardActiveClass = "border-primary/35 shadow-glow -translate-y-1";

export const serviceIconWrapClass = cn(
  "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary",
  "transition-all duration-300 group-hover:scale-105 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow",
);

export const serviceIconWrapActiveClass =
  "scale-105 border-primary/40 bg-primary text-primary-foreground shadow-glow";
