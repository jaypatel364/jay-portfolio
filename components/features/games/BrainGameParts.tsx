"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { SkillNode } from "./brain-data";

// ── Confetti ──────────────────────────────────────────────────────────────────

function ConfettiBurst() {
  const colors = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#ec4899", "#f97316"];
  const pieces = Array.from({ length: 72 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    x: 40 + Math.random() * 20,
    vx: (Math.random() - 0.5) * 140,
    vy: -(55 + Math.random() * 85),
    rot: Math.random() * 360,
    s: 0.5 + Math.random() * 0.9,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-2 w-2 rounded-[2px]"
          style={{ left: `${p.x}%`, top: "45%", backgroundColor: p.color, scale: p.s }}
          animate={{
            x: [0, p.vx, p.vx * 1.3],
            y: [0, p.vy, p.vy * 0.4 + 240],
            opacity: [1, 1, 0],
            rotate: [0, p.rot, p.rot * 2.5],
          }}
          transition={{ duration: 1.6 + Math.random() * 0.7, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ── Fact panel ────────────────────────────────────────────────────────────────

function FactPanel({ node, onClose }: { node: SkillNode; onClose: () => void }) {
  const Icon = node.Icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className="absolute bottom-4 left-4 right-4 z-20 sm:bottom-5 sm:left-auto sm:right-5 sm:w-80"
    >
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/98 shadow-premium backdrop-blur-xl">
        {/* Colour accent stripe */}
        <div
          className="h-[3px] w-full"
          style={{ background: `linear-gradient(90deg, ${node.color}, ${node.color}88)` }}
        />
        <div className="flex items-start gap-3 p-4">
          {/* Icon */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${node.color}18`, border: `1.5px solid ${node.color}35` }}
          >
            <Icon size={22} style={{ color: node.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-foreground">{node.label}</p>
              <button
                onClick={onClose}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{node.fact}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export { ConfettiBurst, FactPanel };
