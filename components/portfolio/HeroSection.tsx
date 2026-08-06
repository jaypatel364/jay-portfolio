"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Download, ArrowUpRight, Terminal } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import React from "react";

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

// ── Interactive terminal ──────────────────────────────────────────────────────

const BOOT_LINES = [
  {
    text: `Last login: ${new Date().toDateString()} on ttys001`,
    color: "text-muted-foreground/50",
  },
  { text: `Portfolio OS v2.0 — ${siteConfig.fullName}`, color: "text-foreground/70" },
  { text: 'Type "help" for available commands.', color: "text-primary/70" },
];

type OutputLine =
  | { type: "input"; text: string }
  | { type: "output"; nodes: React.ReactNode[]; _sideEffect?: "contact" }
  | { type: "error"; text: string };

function buildOutput(cmd: string, expLabel: string, onRun: (c: string) => void): OutputLine[] {
  const c = cmd.trim().toLowerCase();

  if (c === "help")
    return [
      {
        type: "output",
        nodes: [
          <span key="h" className="block text-primary font-semibold mb-1">
            Available commands
          </span>,
          ...[
            ["whoami", "Who is this developer?"],
            ["skills", "Tech stack"],
            ["experience", "Work history"],
            ["contact", "Get in touch"],
            ["status", "Availability"],
            ["ls", "Browse all sections"],
            ["cat about.md", "Read the bio"],
            ["git log", "Portfolio commit history"],
            ["curl -i portfolio", "HTTP headers (dev joke)"],
            ["neofetch", "System info card"],
            ["sudo hire-me", "The most important command"],
            ["clear", "Clear terminal"],
          ].map(([n, d]) => (
            <button
              key={n}
              type="button"
              onClick={() => onRun(n!)}
              className="flex w-full items-baseline gap-1 rounded px-1 -mx-1 text-left transition-colors hover:bg-primary/5 group"
            >
              <span className="min-w-[10rem] shrink-0 text-primary/80 group-hover:text-primary transition-colors">
                {n}
              </span>
              <span className="text-muted-foreground/60 text-xs">{d}</span>
            </button>
          )),
        ],
      },
    ];

  if (c === "whoami")
    return [
      {
        type: "output",
        nodes: [
          <span key="n" className="block">
            <span className="text-muted-foreground/50 min-w-[6rem] shrink-0 inline-block">
              name
            </span>
            {siteConfig.fullName}
          </span>,
          <span key="r" className="block">
            <span className="text-muted-foreground/50 min-w-[6rem] shrink-0 inline-block">
              role
            </span>
            Full Stack Developer
          </span>,
          <span key="l" className="block">
            <span className="text-muted-foreground/50 min-w-[6rem] shrink-0 inline-block">
              based
            </span>
            {siteConfig.location}
          </span>,
          <span key="x" className="block">
            <span className="text-muted-foreground/50 min-w-[6rem] shrink-0 inline-block">exp</span>
            {expLabel}+ years
          </span>,
          <span key="g" className="block">
            <span className="text-muted-foreground/50 min-w-[6rem] shrink-0 inline-block">
              github
            </span>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline underline-offset-2"
            >
              @{siteConfig.githubUsername}
            </a>
          </span>,
        ],
      },
    ];

  if (c === "skills")
    return [
      {
        type: "output",
        nodes: [
          <span key="t" className="block text-primary font-semibold mb-1">
            Tech stack
          </span>,
          <span key="fe" className="block">
            <span className="text-yellow-400/80 min-w-[6rem] shrink-0 inline-block">frontend</span>
            React · Next.js · TypeScript · Tailwind
          </span>,
          <span key="be" className="block">
            <span className="text-green-400/80 min-w-[6rem] shrink-0 inline-block">backend</span>
            Node.js · Express · REST · GraphQL
          </span>,
          <span key="db" className="block">
            <span className="text-blue-400/80 min-w-[6rem] shrink-0 inline-block">database</span>
            MongoDB · PostgreSQL · Redis
          </span>,
          <span key="dv" className="block">
            <span className="text-purple-400/80 min-w-[6rem] shrink-0 inline-block">devops</span>
            Docker · AWS · CI/CD · Git
          </span>,
        ],
      },
    ];

  if (c === "experience")
    return [
      {
        type: "output",
        nodes: [
          <span key="t" className="block text-primary font-semibold mb-1">
            Work history
          </span>,
          <span key="e1" className="block font-medium">
            Full Stack Developer — Krishang Technolab
          </span>,
          <span key="e1p" className="block text-muted-foreground/60 text-xs">
            Dec 2022 – Present · Ahmedabad, India
          </span>,
          <span key="e1d" className="block text-muted-foreground/80 mt-0.5">
            MERN stack · led team of 5 · 100+ form configs
          </span>,
          <span key="sp" className="block h-2" />,
          <span key="e2" className="block font-medium">
            Web Developer Intern — Krishang Technolab
          </span>,
          <span key="e2p" className="block text-muted-foreground/60 text-xs">
            Aug – Nov 2022
          </span>,
          <span key="e2d" className="block text-muted-foreground/80 mt-0.5">
            HR tool · attendance · +20% perf improvement
          </span>,
        ],
      },
    ];

  if (c === "projects")
    return [
      {
        type: "output",
        nodes: [
          <span key="t" className="block text-primary font-semibold mb-1">
            {siteConfig.projectCount}+ production projects
          </span>,
          <span key="p1" className="block">
            → ShopFlow{" "}
            <span className="text-muted-foreground/50 text-xs ml-1">E-Commerce · fullstack</span>
          </span>,
          <span key="p2" className="block">
            → CollabBoard{" "}
            <span className="text-muted-foreground/50 text-xs ml-1">Real-time · fullstack</span>
          </span>,
          <span key="p3" className="block">
            → DevMetrics{" "}
            <span className="text-muted-foreground/50 text-xs ml-1">Analytics · frontend</span>
          </span>,
          <span key="p4" className="block">
            → CloudAPI Gateway{" "}
            <span className="text-muted-foreground/50 text-xs ml-1">Microservices · backend</span>
          </span>,
          <span key="h" className="block text-muted-foreground/40 text-xs mt-1">
            ↓ scroll to Projects section for full list
          </span>,
        ],
      },
    ];

  if (c === "contact")
    return [
      {
        type: "output",
        nodes: [
          <span key="t" className="block text-primary font-semibold mb-1">
            Get in touch
          </span>,
          <span key="em" className="block">
            <span className="text-muted-foreground/50 min-w-[6rem] shrink-0 inline-block">
              email
            </span>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-primary hover:underline underline-offset-2"
            >
              {siteConfig.email}
            </a>
          </span>,
          <span key="li" className="block">
            <span className="text-muted-foreground/50 min-w-[6rem] shrink-0 inline-block">
              linkedin
            </span>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline underline-offset-2"
            >
              jaypatelfullstack
            </a>
          </span>,
          <span key="ca" className="block">
            <span className="text-muted-foreground/50 min-w-[6rem] shrink-0 inline-block">
              book call
            </span>
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline underline-offset-2"
            >
              calendly.com/jaypatel-dev
            </a>
          </span>,
        ],
      },
    ];

  if (c === "status")
    return [
      {
        type: "output",
        nodes: [
          <span key="s" className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <span className="text-green-400 font-semibold">OPEN TO WORK</span>
          </span>,
          <span key="d" className="block text-muted-foreground/60 text-xs mt-1">
            Remote · Full-time · {siteConfig.location}
          </span>,
        ],
      },
    ];

  // ── Easter-egg / dev-loved commands ──────────────────────────────────────

  if (c === "ls" || c === "ls -la")
    return [
      {
        type: "output",
        nodes: [
          <span key="t" className="block text-primary/60 text-xs mb-1">
            drwxr-xr-x jay@portfolio ~/
          </span>,
          ...[
            ["home", "d", "The hero — start here"],
            ["about", "d", "Who built this"],
            ["skills", "d", "Tech stack with orbital UI"],
            ["experience", "d", "Work history"],
            ["education", "d", "Academic background"],
            ["contact", "d", "Let's talk"],
          ].map(([name, type, desc]) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                document.getElementById(name)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex w-full items-baseline gap-2 text-left hover:bg-primary/5 rounded px-1 -mx-1 transition-colors group"
            >
              <span className="text-blue-400/70 w-3">{type === "d" ? "d" : "-"}</span>
              <span className="text-primary/80 min-w-[7rem] group-hover:text-primary transition-colors">
                {name}/
              </span>
              <span className="text-muted-foreground/50 text-xs">{desc}</span>
            </button>
          )),
        ],
      },
    ];

  if (c === "cat about.md")
    return [
      {
        type: "output",
        nodes: [
          <span key="t" className="block text-primary/60 text-xs mb-2">
            # about.md
          </span>,
          <span key="b1" className="block">
            Hey 👋 I'm <span className="text-primary font-semibold">{siteConfig.fullName}</span>, a
            Full Stack Developer
          </span>,
          <span key="b2" className="block text-muted-foreground/70 mt-1">
            based in {siteConfig.location} with {expLabel} years of experience
          </span>,
          <span key="b3" className="block text-muted-foreground/70">
            building production-grade MERN applications.
          </span>,
          <span key="b4" className="block mt-2">
            I care deeply about clean code, great UX, and
          </span>,
          <span key="b5" className="block">
            shipping things people actually use.
          </span>,
          <span key="b6" className="block text-muted-foreground/40 text-xs mt-2">
            ~{siteConfig.fullName.split(" ")[0].toLowerCase()}/about.md [readonly]
          </span>,
        ],
      },
    ];

  if (c === "curl -i portfolio" || c === "curl -I portfolio" || c === "curl portfolio")
    return [
      {
        type: "output",
        nodes: [
          <span key="h0" className="block text-green-400/80 font-semibold">
            HTTP/2 200 OK
          </span>,
          <span key="h1" className="block text-muted-foreground/60">
            content-type: text/html; charset=utf-8
          </span>,
          <span key="h2" className="block text-muted-foreground/60">
            x-powered-by: Next.js 15
          </span>,
          <span key="h3" className="block text-muted-foreground/60">
            x-developer: {siteConfig.fullName}
          </span>,
          <span key="h4" className="block text-muted-foreground/60">
            x-stack: React · Node.js · MongoDB
          </span>,
          <span key="h5" className="block text-muted-foreground/60">
            x-available-for: remote-work · contracts · full-time
          </span>,
          <span key="h6" className="block text-muted-foreground/60">
            cache-control: public, max-age=31536000
          </span>,
          <span key="h7" className="block text-muted-foreground/60">
            x-frame-options: SAMEORIGIN
          </span>,
          <span key="h8" className="block text-muted-foreground/60 mt-1">
            transfer-encoding: chunked
          </span>,
        ],
      },
    ];

  if (c === "git log" || c === "git log --oneline")
    return [
      {
        type: "output",
        nodes: [
          <span key="t" className="block text-primary/60 text-xs mb-1.5">
            On branch main · {siteConfig.githubUsername}/portfolio
          </span>,
          ...[
            ["a3f9c2e", "feat: add interactive terminal to hero section"],
            ["b12d4f1", "feat: orbital skill visualization with live rotation"],
            ["c8e7a3b", "feat: GitHub activity graph with brand accent colours"],
            ["d4f2c9a", "feat: infinite tech marquee with real brand icons"],
            ["e1b8d6c", "feat: NDA + WIP project flags in ProjectsSection"],
            ["f7a3e2d", "feat: command palette with ⌘K shortcut"],
            ["g9c1f4b", "feat: accent color picker with localStorage persist"],
            ["h2e8a5c", "chore: initial commit — portfolio v2.0"],
          ].map(([hash, msg]) => (
            <span key={hash} className="flex gap-2.5 items-baseline">
              <span className="text-yellow-400/70 font-mono text-xs shrink-0">{hash}</span>
              <span className="text-muted-foreground/80 text-xs">{msg}</span>
            </span>
          )),
        ],
      },
    ];

  if (c === "neofetch")
    return [
      {
        type: "output",
        nodes: [
          <div key="nf" className="flex gap-4 items-start">
            {/* ASCII art logo */}
            <pre
              key="art"
              className="text-primary/80 text-[10px] leading-tight shrink-0 select-none"
            >
              {`     __
    /\\ \\
   /  \\ \\
  / /\\ \\ \\
 / / /\\ \\ \\
/ / /  \\ \\_\\
\\/_/    \\/_/`}
            </pre>
            <div key="info" className="space-y-0.5 text-xs">
              <span className="block">
                <span className="text-primary font-semibold">
                  {siteConfig.fullName.toLowerCase().replace(" ", "@")}
                </span>
              </span>
              <span className="block text-muted-foreground/40">{"─".repeat(22)}</span>
              <span className="block">
                <span className="text-primary/70 w-22 inline-block">OS</span>Portfolio OS v2.0
              </span>
              <span className="block">
                <span className="text-primary/70 w-22 inline-block">Shell</span>zsh 5.9
              </span>
              <span className="block">
                <span className="text-primary/70 w-22 inline-block">Framework</span>Next.js 15
              </span>
              <span className="block">
                <span className="text-primary/70 w-22 inline-block">Language</span>TypeScript
              </span>
              <span className="block">
                <span className="text-primary/70 w-22 inline-block">Runtime</span>Node.js
              </span>
              <span className="block">
                <span className="text-primary/70 w-22 inline-block">Uptime</span>
                {expLabel} years
              </span>
              <span className="block">
                <span className="text-primary/70 w-22 inline-block">Location</span>
                {siteConfig.location}
              </span>
              <span className="block mt-1 flex gap-1">
                {[
                  "#EF4444",
                  "#F97316",
                  "#EAB308",
                  "#22C55E",
                  "#3B82F6",
                  "#8B5CF6",
                  "#EC4899",
                  "#6B7280",
                ].map((c) => (
                  <span
                    key={c}
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </span>
            </div>
          </div>,
        ],
      },
    ];

  if (c === "pwd")
    return [
      {
        type: "output",
        nodes: [
          <span key="p" className="block text-foreground/80">
            /home/{siteConfig.fullName.split(" ")[0].toLowerCase()}/portfolio
          </span>,
        ],
      },
    ];

  if (c === "date")
    return [
      {
        type: "output",
        nodes: [
          <span key="d" className="block text-foreground/80">
            {new Date().toString()}
          </span>,
        ],
      },
    ];

  if (c === "uname" || c === "uname -a")
    return [
      {
        type: "output",
        nodes: [
          <span key="u" className="block text-foreground/80">
            PortfolioOS 2.0.0 Next.js-15 React-19 x86_64 TypeScript
          </span>,
        ],
      },
    ];

  if (c === "echo $path" || c === " $PATH")
    return [
      {
        type: "output",
        nodes: [
          <span key="p" className="block text-foreground/80">
            /usr/local/bin:/usr/bin:/bin:/skills:/experience:/projects
          </span>,
        ],
      },
    ];

  if (c === "sudo hire-me")
    return [
      {
        type: "output",
        nodes: [
          <span key="s" className="block text-green-400 font-semibold">
            ✓ Request submitted!
          </span>,
          <span key="s2" className="block text-muted-foreground/70 text-xs mt-0.5">
            Redirecting to contact form...
          </span>,
        ],
        _sideEffect: "contact" as const,
      },
    ];

  if (c === "ssh jay@work")
    return [
      {
        type: "output",
        nodes: [
          <span key="a" className="block text-yellow-400/80">
            ssh: connect to host work port 22: Permission denied
          </span>,
          <span key="b" className="block text-muted-foreground/50 text-xs mt-0.5">
            hint: try "contact" instead 😄
          </span>,
        ],
      },
    ];

  if (c === "rm -rf /")
    return [
      {
        type: "output",
        nodes: [
          <span key="r" className="block text-red-400/80">
            rm: dangerous operation blocked by portfolio-os
          </span>,
          <span key="r2" className="block text-muted-foreground/50 text-xs mt-0.5">
            nice try though 👀
          </span>,
        ],
      },
    ];

  if (c === "vim" || c === "nano" || c === "emacs")
    return [
      {
        type: "output",
        nodes: [
          <span key="v" className="block text-muted-foreground/60">
            {c}: editor opened... just kidding.
          </span>,
          <span key="v2" className="block text-muted-foreground/50 text-xs mt-0.5">
            I use VS Code with Kiro AI 🤖
          </span>,
        ],
      },
    ];

  if (c === "exit" || c === "logout")
    return [
      {
        type: "output",
        nodes: [
          <span key="e" className="block text-muted-foreground/60">
            logout: you can't leave — this portfolio is too good 😄
          </span>,
        ],
      },
    ];

  if (c === "ping google.com")
    return [
      {
        type: "output",
        nodes: [
          <span key="p1" className="block text-foreground/80">
            PING google.com: 56 bytes of data
          </span>,
          <span key="p2" className="block text-foreground/80">
            64 bytes from google.com: icmp_seq=0 ttl=117 time=12.4 ms
          </span>,
          <span key="p3" className="block text-foreground/80">
            64 bytes from google.com: icmp_seq=1 ttl=117 time=11.8 ms
          </span>,
          <span key="p4" className="block text-muted-foreground/50 text-xs mt-1">
            --- but why ping Google when you can hire a dev? ---
          </span>,
        ],
      },
    ];

  if (c === "") return [];
  return [{ type: "error", text: `zsh: command not found: ${cmd}  (try "help" or "ls")` }];
}

// ── TerminalBlock ─────────────────────────────────────────────────────────────

function TerminalBlock() {
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const [bootStep, setBootStep] = useState(0);
  const [booted, setBooted] = useState(false);
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [cursorOn, setCursorOn] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Boot: one line per 300 ms
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBootStep(BOOT_LINES.length);
      setBooted(true);
      return;
    }
    if (bootStep < BOOT_LINES.length) {
      const t = setTimeout(() => setBootStep((s) => s + 1), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBooted(true), 200);
    return () => clearTimeout(t);
  }, [bootStep]);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Scroll terminal body to bottom — scoped, never affects page
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    // rAF ensures DOM has painted before we measure scrollHeight
    const id = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [history, bootStep, booted]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    if (cmd.toLowerCase() === "clear") {
      setHistory([]);
      setInput("");
      return;
    }
    const out = buildOutput(cmd, expLabel, runCommand);
    setHistory((h) => [...h, { type: "input", text: cmd }, ...out]);
    if (cmd) setCmdHistory((h) => [cmd, ...h]);
    setHistoryIdx(-1);
    setInput("");
    // Handle side effects (e.g. sudo hire-me scrolls to contact)
    const sideEffect = out.find(
      (l) =>
        l.type === "output" &&
        (l as { type: "output"; nodes: React.ReactNode[]; _sideEffect?: string })._sideEffect,
    );
    if (
      sideEffect &&
      (sideEffect as { type: "output"; nodes: React.ReactNode[]; _sideEffect?: string })
        ._sideEffect === "contact"
    ) {
      setTimeout(
        () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
        800,
      );
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIdx - 1;
      if (next < 0) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(next);
        setInput(cmdHistory[next] ?? "");
      }
    } else if (e.ctrlKey && e.key === "c") {
      setInput("");
      setHistory((h) => [...h, { type: "input", text: `${input}^C` }]);
    } else if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-premium cursor-text"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
        </div>
        <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Terminal className="h-3 w-3" />
          jay@portfolio ~ zsh
        </span>
        <span className="w-14" />
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className="h-64 lg:h-80 overflow-y-auto p-4 font-mono text-sm"
        style={{ scrollbarWidth: "none" }}
        onWheel={(e) => {
          // Stop wheel events from bubbling to the page
          const el = bodyRef.current;
          if (!el) return;
          const atTop = el.scrollTop === 0 && e.deltaY < 0;
          const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;
          if (!atTop && !atBottom) e.stopPropagation();
        }}
      >
        {BOOT_LINES.slice(0, bootStep).map((l, i) => (
          <motion.div
            key={`b${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className={cn("leading-relaxed", l.color)}
          >
            {l.text}
          </motion.div>
        ))}
        {booted && <div className="h-2" />}
        {booted &&
          history.map((line, i) => {
            if (line.type === "input")
              return (
                <div key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="select-none text-primary/30 shrink-0 text-xs mt-0.5">$</span>
                  <span className="text-foreground/70 break-all">{line.text}</span>
                </div>
              );
            if (line.type === "output")
              return (
                <div
                  key={i}
                  className="ml-5 mt-0.5 mb-3 space-y-0.5 leading-relaxed text-foreground/80"
                >
                  {line.nodes}
                </div>
              );
            if (line.type === "error")
              return (
                <div key={i} className="ml-5 mt-0.5 mb-2 text-red-400/80 leading-relaxed">
                  {line.text}
                </div>
              );
            return null;
          })}
        {booted && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runCommand(input);
            }}
            className="flex items-center gap-2 leading-relaxed mt-1"
          >
            <span className="select-none text-primary/50 shrink-0">❯</span>
            <span className="relative flex-1 flex items-center min-w-0">
              <span className="text-foreground whitespace-pre">{input}</span>
              <span
                className={cn(
                  "inline-block h-[1.05em] w-[0.5em] rounded-[2px] bg-primary ml-px shrink-0 transition-opacity duration-75",
                  cursorOn ? "opacity-100" : "opacity-0",
                )}
              />
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="fixed top-[-9999px] left-[-9999px] h-px w-px border-0 bg-transparent p-0 text-transparent outline-none pointer-events-none opacity-0"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="text"
              enterKeyHint="send"
              aria-label="Terminal input"
              tabIndex={-1}
            />
          </form>
        )}
      </div>

      {/* Footer */}
      {booted && (
        <div className="border-t border-border/40 px-4 py-2 font-mono text-[10px] text-muted-foreground/80 text-center select-none">
          click · type a command · try "neofetch" or "sudo hire-me" · ↑↓ history
        </div>
      )}
    </motion.div>
  );
}

// ── HeroSection ───────────────────────────────────────────────────────────────

export function HeroSection() {
  const words = siteConfig.headlineWords;
  const [index, setIndex] = useState(0);
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const withTerminal = siteConfig.showTerminalHero;

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
      <div className={cn("relative z-10 mx-auto w-full", withTerminal ? "max-w-6xl" : "max-w-4xl")}>
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "mb-10 flex",
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

        {/* Layout */}
        <div
          className={cn(
            withTerminal
              ? "text-center grid items-center gap-12 lg:text-left lg:grid-cols-2 lg:gap-16"
              : "text-center",
          )}
        >
          {/* Left / centre */}
          <div className={cn(withTerminal ? "lg:text-left" : "")}>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
            >
              <span className="gradient-text-animated">{siteConfig.fullName}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-3 text-base font-medium uppercase tracking-[0.2em] text-muted-foreground"
            >
              Full Stack Developer
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className={cn(
                "mt-8 flex flex-col gap-0 text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
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
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className={cn(
                "mt-6 text-base leading-relaxed text-muted-foreground",
                withTerminal ? "mx-auto max-w-lg lg:mx-0 lg:max-w-md" : "mx-auto max-w-lg",
              )}
            >
              {expLabel} years building scalable web applications and production-ready solutions
              with the MERN stack.
            </motion.p>

            {/* Mobile terminal */}
            {withTerminal && (
              <div className="mt-8 lg:hidden">
                <TerminalBlock />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={cn(
                "mt-10 flex flex-wrap gap-4",
                withTerminal ? "justify-center lg:justify-start" : "items-center justify-center",
              )}
            >
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                className="btn-shine inline-flex items-center gap-2 rounded-xl gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
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

          {/* Desktop terminal (right col) */}
          {withTerminal && (
            <div className="hidden lg:flex lg:items-center lg:justify-end">
              <div className="w-full max-w-[540px]">
                <TerminalBlock />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
