"use client";

import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Brand — creative logo mark used in Navbar and Footer.
 *
 * Anatomy:
 *
 *   JAY          ← large gradient-text name, Space Grotesk, tight tracking
 *    ▔▔▔ ·dev   ← glowing underline bar + floating accent pill
 *
 * The underline uses a shimmer animation so it always looks alive.
 * The ·dev pill floats above the baseline, rotated -2° for energy.
 * Every colour follows the active accent via CSS vars — no hardcoding.
 */
export function Brand({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[3px] select-none group cursor-pointer",
        className,
      )}
    >
      {/* ── Name block ───────────────────────────────────────────── */}
      <span className="relative inline-flex flex-col items-start leading-none">
        {/* The name itself */}
        <span
          className="font-heading font-black tracking-[-0.04em] text-[1.35em] gradient-text"
          style={{ letterSpacing: "-0.04em" }}
        >
          {siteConfig.name.toUpperCase()}
        </span>

        {/* Glowing shimmer underline */}
        <span
          className="absolute -bottom-[3px] left-0 h-[2.5px] w-full rounded-full overflow-hidden"
          aria-hidden="true"
        >
          {/* Base track */}
          <span className="absolute inset-0 rounded-full bg-primary/25" />
          {/* Shimmer sweep */}
          <span
            className="absolute inset-y-0 w-1/2 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, var(--glow), transparent)",
              animation: "brand-shimmer 2.4s ease-in-out infinite",
            }}
          />
        </span>
      </span>

      {/* ── .dev floating pill ────────────────────────────────────── */}
      <span
        className="relative -top-[4px] inline-flex items-center rounded-md px-[5px] py-[2px] text-[0.52em] font-bold tracking-wide leading-none font-mono text-primary"
        style={{
          background: "color-mix(in oklch, var(--primary) 18%, var(--card))",
          border: "1px solid color-mix(in oklch, var(--primary) 45%, transparent)",
          transform: "rotate(-1.5deg)",
          boxShadow: "0 0 8px -2px color-mix(in oklch, var(--glow) 40%, transparent)",
          transition: "box-shadow 0.2s ease, background 0.2s ease",
        }}
      >
        .dev
      </span>

      {/* Keyframe injected inline — avoids globals.css coupling */}
      <style>{`
        @keyframes brand-shimmer {
          0%   { transform: translateX(-120%); }
          60%  { transform: translateX(220%); }
          100% { transform: translateX(220%); }
        }
      `}</style>
    </span>
  );
}
