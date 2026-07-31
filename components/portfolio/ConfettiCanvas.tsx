"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  size: number;
  color: string;
  opacity: number;
  shape: "rect" | "circle";
}

// Colors pulled from the portfolio's primary/accent palette
const COLORS = [
  "#7c3aed", // violet-600  (primary)
  "#a78bfa", // violet-400
  "#06b6d4", // cyan-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#f472b6", // pink-400
  "#60a5fa", // blue-400
];

function createParticle(originX: number, originY: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 4 + Math.random() * 8;
  return {
    x: originX,
    y: originY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 6, // bias upward
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.3,
    size: 5 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: 1,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  };
}

interface ConfettiCanvasProps {
  /** Set to true to fire the burst */
  trigger: boolean;
  /** How many particles to spawn (default: 120) */
  count?: number;
  /** Auto-cleanup delay in ms (default: 3500) */
  duration?: number;
}

export function ConfettiCanvas({ trigger, count = 120, duration = 3500 }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Size canvas to viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fire from the bottom-center area (where the contact form lives)
    const originX = canvas.width / 2;
    const originY = canvas.height * 0.75;

    const particles: Particle[] = Array.from({ length: count }, () =>
      createParticle(originX, originY),
    );

    const gravity = 0.25;
    const drag = 0.98;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;

      for (const p of particles) {
        if (p.opacity <= 0) continue;
        alive = true;

        p.vy += gravity;
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.opacity -= 0.012;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (alive) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    // Hard cleanup after duration regardless of animation state
    const cleanup = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, duration);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(cleanup);
    };
  }, [trigger, count, duration]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70]"
    />
  );
}
