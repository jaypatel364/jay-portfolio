"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/settings";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  ts: number;
}

// ── Quick chips ───────────────────────────────────────────────────────────────

const CHIP_GROUPS = [
  [
    { icon: "👋", label: "Introduce yourself!" },
    { icon: "⚡", label: "What's your tech stack?" },
    { icon: "🧠", label: "How many years of experience?" },
    { icon: "📍", label: "Where are you based?" },
  ],
  [
    { icon: "🎨", label: "How did you build this portfolio?" },
    { icon: "✨", label: "What's the coolest feature here?" },
    { icon: "🔮", label: "What are you currently learning?" },
    { icon: "🛠️", label: "What are your favourite tools?" },
  ],
  [
    { icon: "💼", label: "Are you available for hire?" },
    { icon: "💰", label: "What are your hourly rates?" },
    { icon: "🤝", label: "Are you open to freelance?" },
    { icon: "📄", label: "Can I see your resume?" },
  ],
];

// ── User-facing error messages — never show raw API strings ──────────────────
// Maps internal error patterns to polite, humble copy.

function toFriendlyError(raw: string): string {
  const s = raw.toLowerCase();
  if (s.includes("rate limit") || s.includes("429") || s.includes("slow down"))
    return "Sorry — things are a bit busy right now. Please try again in a moment.";
  if (s.includes("unavailable") || s.includes("503"))
    return `Sorry, chat isn't available at the moment. You're welcome to email Jay at ${siteConfig.email}.`;
  if (s.includes("too many messages"))
    return "Sorry for the wait — please send a little less often and try again shortly.";
  // Generic fallback — never expose internal details
  return `Sorry about that — I couldn't complete that reply. Please try again, or email Jay at ${siteConfig.email}.`;
}
// Known domains get a short human label. Nothing long ever renders in a bubble.

const URL_LABELS: { pattern: RegExp; label: string }[] = [
  { pattern: /linkedin\.com/i, label: "LinkedIn Profile" },
  { pattern: /github\.com\/[^/]+$/i, label: "GitHub Profile" },
  { pattern: /github\.com/i, label: "GitHub" },
  { pattern: /jay-patel-resume\.pdf/i, label: "Resume PDF" },
  { pattern: /calendly\.com/i, label: "Book a Call" },
  { pattern: /vercel\.app/i, label: "Live Demo" },
  { pattern: /onrender\.com/i, label: "Live Demo" },
  { pattern: /render\.com/i, label: "Live Demo" },
];

const ALLOWED_LINK_HOSTS = new Set([
  "jaypateldev.com",
  "www.jaypateldev.com",
  "github.com",
  "www.github.com",
  "linkedin.com",
  "www.linkedin.com",
  "calendly.com",
  "www.calendly.com",
]);

function isAllowedChatUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_LINK_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function friendlyLabel(url: string): string {
  for (const { pattern, label } of URL_LABELS) {
    if (pattern.test(url)) return label;
  }
  try {
    const clean = new URL(url).hostname.replace(/^www\./, "");
    return clean.length > 28 ? clean.slice(0, 26) + "…" : clean;
  } catch {
    return "Link";
  }
}

// ── Inline markdown renderer ──────────────────────────────────────────────────

/**
 * renderContent — parses a flat string into React nodes.
 *
 * Supported tokens:
 *   **bold**   → <strong>
 *   `code`     → <code>
 *   https://…  → pill <a> with a friendly label (never raw URL)
 *
 * Consecutive link pills are wrapped in a flex container so they sit
 * 2 px apart and never overflow horizontally.
 */
function renderContent(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/\S+)/g);

  // First pass — convert each token to a React node
  const nodes: React.ReactNode[] = parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-primary/10 px-1 py-0.5 font-mono text-[11px] text-primary border border-primary/20"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("http")) {
      if (!isAllowedChatUrl(part)) {
        return <span key={i}>{part}</span>;
      }
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          // pill style — short label, never raw URL, never overflows
          className="inline-flex items-center gap-0.5 rounded-md border border-primary/25 bg-primary/8 px-1.5 py-0.5 text-[11px] font-medium text-primary no-underline transition-all hover:bg-primary/15 hover:border-primary/40 active:scale-[0.97]"
          data-link-pill
        >
          {friendlyLabel(part)}
          <ArrowUpRight className="h-2.5 w-2.5 shrink-0" />
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });

  // Second pass — group adjacent link pills into a 2px-gap flex row so they
  // never touch each other and never cause horizontal overflow.
  const result: React.ReactNode[] = [];
  let pillBuffer: React.ReactNode[] = [];

  const flushPills = (flushKey: string) => {
    if (pillBuffer.length === 0) return;
    if (pillBuffer.length === 1) {
      result.push(pillBuffer[0]);
    } else {
      result.push(
        <span key={flushKey} className="inline-flex flex-wrap gap-[2px] align-middle">
          {pillBuffer}
        </span>,
      );
    }
    pillBuffer = [];
  };

  nodes.forEach((node, i) => {
    const isLink =
      typeof node === "object" &&
      node !== null &&
      "props" in (node as object) &&
      typeof (node as { props?: Record<string, unknown> }).props === "object" &&
      (node as { props?: Record<string, unknown> }).props?.["data-link-pill"] !== undefined;

    if (isLink) {
      pillBuffer.push(node);
    } else {
      flushPills(`pill-group-${i}`);
      result.push(node);
    }
  });
  flushPills("pill-group-end");

  return result;
}

export type { Message };
export { CHIP_GROUPS, toFriendlyError, renderContent };
