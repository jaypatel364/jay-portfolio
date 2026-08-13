"use client";

import { motion } from "framer-motion";

interface Props {
  label: string;
  title: string;
}

export function SectionHeading({ label, title }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <span className="text-sm font-semibold uppercase tracking-widest text-primary">{label}</span>
      <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </motion.div>
  );
}
