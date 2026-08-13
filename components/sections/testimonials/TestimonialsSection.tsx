"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "CTO, TechNova",
    text: "One of the most talented developers I've worked with. Delivered a complex e-commerce platform ahead of schedule with exceptional code quality. A true team player.",
  },
  {
    name: "Marcus Rivera",
    role: "Product Manager, FinEdge",
    text: "Incredible attention to detail and a deep understanding of both frontend and backend. Turned our rough prototype into a polished, production-ready product.",
  },
  {
    name: "Emily Zheng",
    role: "Founder, GrowthLab",
    text: "Exceeded every expectation. Built our entire SaaS from scratch — beautiful UI, robust API, and rock-solid architecture. Highly recommended.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-6 py-14 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Testimonials" title="What People Say" />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl border border-border bg-card p-7 transition-all hover:border-primary/30 hover:shadow-glow"
            >
              <Quote className="mb-4 h-8 w-8 text-primary/20" />
              <p className="text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
