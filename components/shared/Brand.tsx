"use client";

import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Brand — creative logo mark used in Navbar and Footer.
 *
 * Anatomy:
 *
 *   JAY          ← large name, Space Grotesk, tight tracking
 *    ▔▔▔ ·dev   ← glowing underline bar + floating accent pill
 *
 * Colors mix primary toward foreground so contrast stays WCAG-safe
 * across accents and light/dark, while still reading as brand.
 */
export function Brand({ className }: { className?: string }) {
  const name = siteConfig.name.toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-[3px] select-none group cursor-pointer",
        className,
      )}
    >
      {/* ── Name block ───────────────────────────────────────────── */}
      <span className="relative inline-flex flex-col items-start leading-none">
        <span
          className="font-heading font-black tracking-[-0.04em] text-[1.35em]"
          style={{
            letterSpacing: "-0.04em",
            // Mix toward foreground so light-mode accents clear WCAG on white
            color: "color-mix(in srgb, var(--primary) 50%, var(--foreground))",
          }}
        >
          {name}
        </span>

        {/* Glowing shimmer underline (decorative) */}
        <span
          className="absolute -bottom-[3px] left-0 h-[2.5px] w-full rounded-full overflow-hidden"
          aria-hidden="true"
        >
          <span className="absolute inset-0 rounded-full bg-primary/30" />
          <span
            className="brand-shimmer absolute inset-y-0 w-1/2 rounded-full motion-reduce:hidden"
            style={{
              background: "linear-gradient(90deg, transparent, var(--glow), transparent)",
            }}
          />
        </span>
      </span>

      {/* ── .dev floating pill ────────────────────────────────────── */}
      <span
        className="relative -top-[4px] inline-flex items-center rounded-md px-[5px] py-[2px] text-[0.58em] font-bold tracking-wide leading-none font-mono"
        style={{
          // Soft tint kept; text leans on foreground so small type clears 4.5:1
          background: "color-mix(in srgb, var(--primary) 14%, var(--card))",
          color: "color-mix(in srgb, var(--primary) 32%, var(--foreground))",
          border: "1px solid color-mix(in srgb, var(--primary) 38%, transparent)",
          transform: "rotate(-1.5deg)",
          boxShadow: "0 0 8px -2px color-mix(in oklch, var(--glow) 32%, transparent)",
          transition: "box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease",
        }}
      >
        .dev
      </span>

      <style>{`
        @keyframes brand-shimmer {
          0%   { transform: translateX(-120%); }
          60%  { transform: translateX(220%); }
          100% { transform: translateX(220%); }
        }
        .brand-shimmer {
          animation: brand-shimmer 2.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .brand-shimmer { animation: none; }
        }
      `}</style>
    </span>
  );
}
