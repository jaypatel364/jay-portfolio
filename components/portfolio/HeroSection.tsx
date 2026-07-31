"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Download, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const SWAP_INTERVAL = 2800;

export function HeroSection() {
  const words = siteConfig.headlineWords;
  const [index, setIndex] = useState(0);
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), SWAP_INTERVAL);
    return () => clearInterval(id);
  }, [words.length]);

  const socialLinks = [
    { icon: GithubIcon, href: siteConfig.github, label: "GitHub" },
    { icon: LinkedinIcon, href: siteConfig.linkedin, label: "LinkedIn" },
    { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20 sm:pt-16 md:pt-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* ── Availability badge ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-10 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-all duration-200 hover:border-primary/40 hover:bg-primary/10"
            aria-label="Book a meeting"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Available for opportunities
            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* ── Name — the visual anchor ─────────────────────────────── */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
        >
          <span className="gradient-text-animated">{siteConfig.fullName}</span>
        </motion.h1>

        {/* ── Role label ───────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="mt-3 text-base font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          Full Stack Developer
        </motion.p>

        {/* ── Tagline with inline word swap ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-8 flex flex-col items-center justify-center gap-0 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          aria-label={`Building ${words[index]} people actually use.`}
        >
          <span>Building</span>

          {/* Swapping word */}
          <span
            className="relative mt-1 inline-flex h-[1.2em] items-center justify-center overflow-hidden px-3"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Faint underline accent */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1 left-3 right-3 h-[3px] rounded-full bg-primary/30"
            />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={words[index]}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-110%", opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                className="relative gradient-text"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </span>

          <span>people actually use.</span>
        </motion.div>

        {/* ── Description ──────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground"
        >
          {expLabel} years building scalable web applications and production-ready solutions with
          the MERN stack.
        </motion.p>

        {/* ── CTA buttons ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            className="btn-shine inline-flex items-center gap-2 gradient-primary rounded-xl px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
          >
            <Download className="h-4 w-4" />
            Download My CV
          </a>
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-muted/50 active:scale-95"
          >
            Get In Touch
          </button>
        </motion.div>

        {/* ── Social links ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-10 flex items-center justify-center gap-5"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
