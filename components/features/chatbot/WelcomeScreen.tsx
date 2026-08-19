"use client";

import { Hash, Sparkles } from "lucide-react";
import { CHIP_GROUPS } from "./chat-content";

// ── Welcome screen — no scroll, compact ──────────────────────────────────────

function WelcomeScreen({ chipGroup, onChip }: { chipGroup: number; onChip: (s: string) => void }) {
  const chips = CHIP_GROUPS[chipGroup % CHIP_GROUPS.length];

  return (
    <div className="flex flex-col gap-4">
      {/* Identity card */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-transparent to-transparent p-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground leading-tight">Jay Patel</p>
            <p className="text-[11px] text-muted-foreground">Full Stack Dev · India</p>
          </div>
          <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-500">Online</span>
          </span>
        </div>
        <p className="relative mt-2.5 text-[12px] leading-relaxed text-muted-foreground">
          Ask me about my stack, how I built this, availability — or anything else.
        </p>
      </div>

      {/* Chips */}
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          <Hash className="h-2.5 w-2.5" />
          Quick questions
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {chips.map((c) => (
            <button
              key={c.label}
              onClick={() => onChip(c.label)}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-left text-[12px] font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground active:scale-[0.98]"
            >
              <span className="shrink-0 text-sm leading-none">{c.icon}</span>
              <span className="leading-tight">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { WelcomeScreen };
