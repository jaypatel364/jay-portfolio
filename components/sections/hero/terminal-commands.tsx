"use client";

import React from "react";
import { siteConfig } from "@/lib/site-config";

const BOOT_LINES = [
  {
    text: `Last login: ${new Date().toDateString()} on ttys001`,
    color: "text-muted-foreground",
  },
  { text: `Portfolio OS v2.0 — ${siteConfig.fullName}`, color: "text-foreground/70" },
  { text: 'Type "help" for available commands.', color: "text-primary" },
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
            {expLabel} years
          </span>,
          <span key="g" className="block">
            <span className="text-muted-foreground/50 min-w-[6rem] shrink-0 inline-block">
              github
            </span>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              title={`${siteConfig.fullName} on GitHub`}
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
            Dec 2022 – Present · India
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

  if (c === "projects" || c === "work")
    return [
      {
        type: "output",
        nodes: [
          <span key="t" className="block text-primary font-semibold mb-1">
            {siteConfig.projectCount}+ production builds
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
              title={`Email ${siteConfig.fullName}`}
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
              title={`${siteConfig.fullName} on LinkedIn`}
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
              title="Book a call with Jay Patel"
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
            ["work", "d", "Selected work"],
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
            Chat App, MiniList CMS, form systems, HR and KYC platforms.
          </span>,
          <span key="b5" className="block">
            React, Next.js, Node.js — I ship things people use.
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
            /usr/local/bin:/usr/bin:/bin:/skills:/experience:/work
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
            Redirecting to contact page...
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

export type { OutputLine };
export { BOOT_LINES, buildOutput };
