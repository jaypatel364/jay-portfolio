"use client";

/**
 * CursorTrail — 5 creative cursor effects, one canvas overlay
 * ──────────────────────────────────────────────────────────────────────────
 * Modes (set via siteConfig.cursorEffect):
 *
 *  "none"       — disabled, nothing rendered
 *  "particles"  — hue-cycling glow particles that drift upward and fade
 *  "ripple"     — expanding ring ripples on every mouse move (water drop feel)
 *  "magnetic"   — 8 orbital dots that elastically chase the cursor at
 *                 different lags — looks like a planetary system
 *  "lightning"  — electric arc bolts shoot from the cursor to random nearby
 *                 points every frame, flickering like static electricity
 *  "pixelate"   — leaves behind falling square pixels that dissolve, like a
 *                 mosaic breaking apart behind you
 *
 * Rules:
 *  • Single fixed canvas, pointer-events: none — never blocks UI
 *  • Fine-pointer (mouse/trackpad) only — auto-skipped on touch
 *  • prefers-reduced-motion respected — all effects disabled
 *  • Each mode is fully self-contained in its own draw/update function
 */

import { useEffect, useRef } from "react";

// ── Public type (imported by site-config) ─────────────────────────────────────

export type CursorEffectMode =
  | "none"
  | "particles"
  | "ripple"
  | "magnetic"
  | "lightning"
  | "pixelate";

// ── Shared canvas setup ───────────────────────────────────────────────────────

function setupCanvas(canvas: HTMLCanvasElement) {
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });
  return () => window.removeEventListener("resize", resize);
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. PARTICLES — hue-cycling glow orbs that drift and fade
// ══════════════════════════════════════════════════════════════════════════════

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  opacity: number;
  life: number;
}

function runParticles(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const pool: Particle[] = [];
  let hue = 30;
  const DECAY = 0.03;

  const onMove = (e: MouseEvent) => {
    hue = (hue + 1.8) % 360;
    for (let i = 0; i < 4; i++) {
      if (pool.length >= 140) pool.shift();
      pool.push({
        x: e.clientX + (Math.random() - 0.5) * 8,
        y: e.clientY + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(0.5 + Math.random() * 0.9),
        size: 2.5 + Math.random() * 3.5,
        hue: hue + (Math.random() - 0.5) * 40,
        opacity: 0.75 + Math.random() * 0.25,
        life: 1,
      });
    }
  };
  window.addEventListener("mousemove", onMove, { passive: true });

  let raf: number;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = pool.length - 1; i >= 0; i--) {
      const p = pool[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.012;
      p.life -= DECAY;
      p.opacity = Math.max(0, p.life * 0.9);
      p.size *= 0.975;
      if (p.life <= 0) {
        pool.splice(i, 1);
        continue;
      }

      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
      g.addColorStop(0, `hsla(${p.hue},90%,65%,${p.opacity})`);
      g.addColorStop(1, `hsla(${p.hue},90%,65%,0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},95%,85%,${p.opacity * 0.85})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

  return () => {
    window.removeEventListener("mousemove", onMove);
    cancelAnimationFrame(raf);
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. RIPPLE — water-drop expanding ring on every move
// ══════════════════════════════════════════════════════════════════════════════

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  opacity: number;
  hue: number;
  lineWidth: number;
}

function runRipple(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const pool: Ripple[] = [];
  let hue = 200; // start cool-blue, shifts per ripple
  let lastX = -999;
  let lastY = -999;

  const onMove = (e: MouseEvent) => {
    const dx = e.clientX - lastX,
      dy = e.clientY - lastY;
    if (dx * dx + dy * dy < 200) return; // throttle by distance
    lastX = e.clientX;
    lastY = e.clientY;
    hue = (hue + 12) % 360;
    if (pool.length >= 40) pool.shift();
    pool.push({
      x: e.clientX,
      y: e.clientY,
      r: 0,
      maxR: 55 + Math.random() * 40,
      opacity: 0.9,
      hue,
      lineWidth: 1.5 + Math.random() * 1.5,
    });
    // inner tight ripple
    pool.push({
      x: e.clientX,
      y: e.clientY,
      r: 0,
      maxR: 22 + Math.random() * 14,
      opacity: 0.7,
      hue: (hue + 30) % 360,
      lineWidth: 1,
    });
  };
  window.addEventListener("mousemove", onMove, { passive: true });

  let raf: number;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = pool.length - 1; i >= 0; i--) {
      const p = pool[i];
      const progress = p.r / p.maxR;
      p.r += (p.maxR - p.r) * 0.055 + 0.5;
      p.opacity = Math.max(0, (1 - progress) * 0.85);
      if (p.opacity <= 0) {
        pool.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${p.hue},85%,68%,${p.opacity})`;
      ctx.lineWidth = p.lineWidth * (1 - progress * 0.5);
      ctx.stroke();

      // faint fill glow at center
      if (progress < 0.3) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `hsla(${p.hue},85%,75%,${p.opacity * 0.18})`);
        g.addColorStop(1, `hsla(${p.hue},85%,75%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    }
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

  return () => {
    window.removeEventListener("mousemove", onMove);
    cancelAnimationFrame(raf);
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. MAGNETIC — orbital dots that elastically chase the cursor
// ══════════════════════════════════════════════════════════════════════════════

interface MagDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lag: number; // 0.04 – 0.14 (lower = more elastic / slower)
  radius: number;
  hue: number;
  angle: number; // orbit angle offset
  orbitR: number; // orbit radius around target
}

function runMagnetic(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const cx = canvas.width / 2,
    cy = canvas.height / 2;
  const COUNT = 9;

  const dots: MagDot[] = Array.from({ length: COUNT }, (_, i) => ({
    x: cx,
    y: cy,
    vx: 0,
    vy: 0,
    lag: 0.04 + (i / COUNT) * 0.11,
    radius: 3.5 - i * 0.28,
    hue: (i / COUNT) * 360,
    angle: (i / COUNT) * Math.PI * 2,
    orbitR: 4 + i * 3.5,
  }));

  let mx = cx,
    my = cy;
  let time = 0;

  const onMove = (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;
  };
  window.addEventListener("mousemove", onMove, { passive: true });

  let raf: number;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.025;

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      // Each dot targets a point slightly orbiting the cursor
      const targetX = mx + Math.cos(time + d.angle) * d.orbitR;
      const targetY = my + Math.sin(time + d.angle) * d.orbitR;

      // Spring physics
      d.vx += (targetX - d.x) * d.lag;
      d.vy += (targetY - d.y) * d.lag;
      d.vx *= 0.72;
      d.vy *= 0.72;
      d.x += d.vx;
      d.y += d.vy;
      d.hue = (d.hue + 0.6) % 360;

      // Tail: draw line to next dot
      if (i < dots.length - 1) {
        const next = dots[i + 1];
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = `hsla(${d.hue},85%,65%,0.22)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Glow dot
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius * 3);
      g.addColorStop(0, `hsla(${d.hue},90%,70%,0.9)`);
      g.addColorStop(1, `hsla(${d.hue},90%,70%,0)`);
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${d.hue},95%,85%,0.95)`;
      ctx.fill();
    }

    // Cursor crosshair dot
    const g2 = ctx.createRadialGradient(mx, my, 0, mx, my, 10);
    g2.addColorStop(0, `hsla(45,100%,75%,0.6)`);
    g2.addColorStop(1, `hsla(45,100%,75%,0)`);
    ctx.beginPath();
    ctx.arc(mx, my, 10, 0, Math.PI * 2);
    ctx.fillStyle = g2;
    ctx.fill();

    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

  return () => {
    window.removeEventListener("mousemove", onMove);
    cancelAnimationFrame(raf);
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. LIGHTNING — electric arcs shoot from cursor to random nearby targets
// ══════════════════════════════════════════════════════════════════════════════

interface LBolt {
  points: Array<[number, number]>;
  opacity: number;
  hue: number;
  width: number;
}

function jitter(
  p1: [number, number],
  p2: [number, number],
  depth: number,
): Array<[number, number]> {
  if (depth === 0) return [p1, p2];
  const mx = (p1[0] + p2[0]) / 2 + (Math.random() - 0.5) * 28;
  const my = (p1[1] + p2[1]) / 2 + (Math.random() - 0.5) * 28;
  const mid: [number, number] = [mx, my];
  return [...jitter(p1, mid, depth - 1), ...jitter(mid, p2, depth - 1)];
}

function runLightning(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const bolts: LBolt[] = [];
  let mx = canvas.width / 2,
    my = canvas.height / 2;
  let hue = 200;

  const onMove = (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;
  };
  window.addEventListener("mousemove", onMove, { passive: true });

  let raf: number;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn new bolt randomly
    if (Math.random() < 0.35 && bolts.length < 12) {
      hue = (hue + 18) % 360;
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 110;
      const tx: [number, number] = [mx + Math.cos(angle) * dist, my + Math.sin(angle) * dist];
      bolts.push({
        points: jitter([mx, my], tx, 3),
        opacity: 0.9 + Math.random() * 0.1,
        hue: hue + (Math.random() - 0.5) * 60,
        width: 0.8 + Math.random() * 1.2,
      });
    }

    for (let i = bolts.length - 1; i >= 0; i--) {
      const b = bolts[i];
      b.opacity -= 0.055;
      if (b.opacity <= 0) {
        bolts.splice(i, 1);
        continue;
      }

      // Outer glow pass
      ctx.beginPath();
      ctx.moveTo(b.points[0][0], b.points[0][1]);
      for (const pt of b.points) ctx.lineTo(pt[0], pt[1]);
      ctx.strokeStyle = `hsla(${b.hue},100%,75%,${b.opacity * 0.25})`;
      ctx.lineWidth = b.width * 5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      // Core bright pass
      ctx.beginPath();
      ctx.moveTo(b.points[0][0], b.points[0][1]);
      for (const pt of b.points) ctx.lineTo(pt[0], pt[1]);
      ctx.strokeStyle = `hsla(${b.hue},100%,90%,${b.opacity})`;
      ctx.lineWidth = b.width;
      ctx.stroke();
    }

    // Cursor aura
    const g = ctx.createRadialGradient(mx, my, 0, mx, my, 22);
    g.addColorStop(0, `hsla(${hue},100%,75%,0.25)`);
    g.addColorStop(1, `hsla(${hue},100%,75%,0)`);
    ctx.beginPath();
    ctx.arc(mx, my, 22, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

  return () => {
    window.removeEventListener("mousemove", onMove);
    cancelAnimationFrame(raf);
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. PIXELATE — falling colored square pixels dissolve behind the cursor
// ══════════════════════════════════════════════════════════════════════════════

interface Pixel {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  hue: number;
  sat: number;
  lit: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
}

function runPixelate(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const pool: Pixel[] = [];
  let hue = 45;

  const onMove = (e: MouseEvent) => {
    hue = (hue + 2.5) % 360;
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      if (pool.length >= 200) pool.shift();
      const size = 3 + Math.random() * 9;
      pool.push({
        x: e.clientX + (Math.random() - 0.5) * 18,
        y: e.clientY + (Math.random() - 0.5) * 18,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 0.3 + Math.random() * 1.2,
        size,
        hue: hue + (Math.random() - 0.5) * 50,
        sat: 75 + Math.random() * 20,
        lit: 55 + Math.random() * 20,
        opacity: 0.85 + Math.random() * 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.14,
      });
    }
  };
  window.addEventListener("mousemove", onMove, { passive: true });

  let raf: number;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = pool.length - 1; i >= 0; i--) {
      const p = pool[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // gravity
      p.vx *= 0.98;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.018;
      p.size *= 0.993;
      if (p.opacity <= 0 || p.size < 0.5) {
        pool.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // shadow glow
      ctx.shadowColor = `hsla(${p.hue},${p.sat}%,${p.lit}%,0.6)`;
      ctx.shadowBlur = p.size * 1.8;
      ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${p.lit}%,1)`;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

      // inner lighter square
      ctx.shadowBlur = 0;
      ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${Math.min(95, p.lit + 20)}%,0.7)`;
      ctx.fillRect(-p.size / 4, -p.size / 4, p.size / 2, p.size / 2);

      ctx.restore();
    }
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

  return () => {
    window.removeEventListener("mousemove", onMove);
    cancelAnimationFrame(raf);
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════════════════════════════════════

interface CursorTrailProps {
  mode: CursorEffectMode;
}

export function CursorTrail({ mode }: CursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode === "none") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip on touch-only or reduced-motion
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d")!;
    const cleanupCanvas = setupCanvas(canvas);

    let cleanupEffect: (() => void) | undefined;

    switch (mode) {
      case "particles":
        cleanupEffect = runParticles(canvas, ctx);
        break;
      case "ripple":
        cleanupEffect = runRipple(canvas, ctx);
        break;
      case "magnetic":
        cleanupEffect = runMagnetic(canvas, ctx);
        break;
      case "lightning":
        cleanupEffect = runLightning(canvas, ctx);
        break;
      case "pixelate":
        cleanupEffect = runPixelate(canvas, ctx);
        break;
    }

    return () => {
      cleanupCanvas();
      cleanupEffect?.();
    };
    // remount when mode changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  if (mode === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999997]"
    />
  );
}
