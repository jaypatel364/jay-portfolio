"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Download, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { TerminalBlock } from "./TerminalBlock";

const SWAP_INTERVAL = 2800;

interface HeroInteractiveProps {
  expLabel: string;
  withTerminal: boolean;
}

/** Client island — motion, terminal, CTAs. Static SEO copy lives in server HeroSection. */
export function HeroInteractive({ expLabel, withTerminal }: HeroInteractiveProps) {
  const words = siteConfig.headlineWords;
  const [index, setIndex] = useState(0);

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
    <div
      className={cn(
        withTerminal
          ? "text-center grid items-center gap-12 lg:text-left lg:grid-cols-2 lg:gap-16 -mt-4 lg:mt-0"
          : "text-center -mt-4",
      )}
    >
      <div className={cn(withTerminal ? "lg:text-left" : "")}>
        <motion.div
          initial={false}
          className={cn(
            "mb-8 flex",
            withTerminal ? "justify-center lg:justify-start" : "justify-center",
          )}
        >
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-all duration-200 hover:border-primary/40 hover:bg-primary/10"
            aria-label="Book a meeting"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Available for opportunities
            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </a>
        </motion.div>

        <motion.div
          initial={false}
          className={cn(
            "flex flex-col gap-0 text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
            withTerminal
              ? "items-center justify-center lg:items-start"
              : "items-center justify-center",
          )}
          aria-label={`Building ${words[index]} people actually use.`}
        >
          <span>Building</span>
          <span
            className="relative mt-1 inline-flex h-[1.2em] items-center overflow-hidden px-3 lg:px-0"
            aria-live="polite"
            aria-atomic="true"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1 left-0 right-0 h-[3px] rounded-full bg-primary/30"
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

        <p className="sr-only">
          {expLabel} years building scalable web applications with the MERN stack.
        </p>

        {withTerminal && (
          <div className="mt-8 lg:hidden">
            <TerminalBlock />
          </div>
        )}

        <motion.div
          initial={false}
          className={cn(
            "mt-10 flex flex-wrap gap-4",
            withTerminal ? "justify-center lg:justify-start" : "items-center justify-center",
          )}
        >
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex items-center gap-2 rounded-xl gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
          >
            <Download className="h-4 w-4" />
            View Resume
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

        <motion.div
          initial={false}
          className={cn(
            "mt-8 flex items-center gap-4",
            withTerminal ? "justify-center lg:justify-start" : "justify-center",
          )}
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

      {withTerminal && (
        <div className="hidden lg:flex lg:items-center lg:justify-end">
          <div className="w-full max-w-[540px]">
            <TerminalBlock />
          </div>
        </div>
      )}
    </div>
  );
}
