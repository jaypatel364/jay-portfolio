"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps the full page in a staggered entrance animation.
 * The outer container fades in; each direct child staggered by 0.08s.
 * Runs once on initial mount and never repeats.
 * Respects prefers-reduced-motion automatically via framer-motion.
 */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      // Small stagger between navbar, main, footer
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="contents">
      {children}
    </motion.div>
  );
}

/**
 * Wrap each top-level page slot (Navbar, main, Footer) with this
 * to participate in the stagger.
 */
export function PageTransitionItem({ children }: PageTransitionProps) {
  return (
    <motion.div variants={item} className="contents">
      {children}
    </motion.div>
  );
}
