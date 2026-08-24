"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Skill } from "./skill-data";

// ── 3D Tag Sphere — premium globe with momentum + atmosphere ──────────────────
//
// • Fibonacci lattice for even point distribution
// • Circular icon nodes sized by depth (quadratic curve = strong 3D feel)
// • 3 rotating latitude lines that follow the sphere rotation (globe vibes)
// • Radial atmosphere glow behind the sphere
// • Drag to spin with momentum — releases keep spinning, friction slows them
// • Hover tooltip floats above each node
// • Mouse + touch unified via Pointer Events API
//
// Performance: angle updates bypass React state entirely — all per-frame DOM
// mutations (transform, zIndex, opacity, size, box-shadow) are written directly
// via nodeRefs and svgRef. React only re-renders when hover or drag state changes.

interface SpherePoint {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
}

/** Fibonacci sphere — most uniform distribution of N points on a unit sphere */
function fibonacciSphere(n: number): { tx: number; ty: number; tz: number }[] {
  const pts: { tx: number; ty: number; tz: number }[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push({ tx: Math.cos(theta) * r, ty: y, tz: Math.sin(theta) * r });
  }
  return pts;
}

function rotate3D(
  tx: number,
  ty: number,
  tz: number,
  ax: number,
  ay: number,
): { rx: number; ry: number; rz: number } {
  const cosY = Math.cos(ay),
    sinY = Math.sin(ay);
  const x1 = tx * cosY + tz * sinY;
  const z1 = -tx * sinY + tz * cosY;
  const cosX = Math.cos(ax),
    sinX = Math.sin(ax);
  const y2 = ty * cosX - z1 * sinX;
  const z2 = ty * sinX + z1 * cosX;
  return { rx: x1, ry: y2, rz: z2 };
}

/** Generate points for a latitude ring at a given tilt angle */
function latRingPoints(tilt: number, segments = 64): { tx: number; ty: number; tz: number }[] {
  const pts = [];
  const cosT = Math.cos(tilt),
    sinT = Math.sin(tilt);
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    pts.push({ tx: Math.cos(theta) * cosT, ty: sinT, tz: Math.sin(theta) * cosT });
  }
  return pts;
}

const LAT_TILTS = [-0.52, 0, 0.52]; // ≈ -30°, 0°, +30° latitude

function SkillSphere({ skills, isDark }: { skills: Skill[]; isDark: boolean }) {
  const RADIUS = 185;
  const NODE_R = 22; // px radius of each circular node at full scale

  // Only these two trigger React re-renders
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Per-frame angle state lives exclusively in refs — never touches React
  const angleRef = useRef({ x: 0.35, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPtr = useRef({ x: 0, y: 0 });
  const lastPtrTime = useRef(0);
  const ptrDelta = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const frameTime = useRef<number>(0);
  const basePoints = useRef(fibonacciSphere(skills.length));

  // DOM refs for direct per-frame style mutation — bypasses React reconciliation
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  // Stable skill order for the sorted draw order (stored per-frame in ref)
  const sortOrderRef = useRef<number[]>(skills.map((_, i) => i));

  // Defer first render to client so SSR HTML never contains float-precision styles
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Main RAF loop — angle physics + imperative DOM writes ──────────────────
  useEffect(() => {
    if (!mounted) return;

    const AUTO_X = 0.00022; // rad/ms gentle tilt drift
    const AUTO_Y = 0.00038; // rad/ms main spin
    const FRICTION = 0.92;
    const MIN_VEL = 0.00004;
    const MAX_VEL = 0.012;
    const opacityFloor = isDark ? 0.65 : 0.55;
    const scaleFloor = 0.52;

    const tick = (now: number) => {
      const dt = frameTime.current ? Math.min(now - frameTime.current, 24) : 16;
      frameTime.current = now;

      // ── 1. Advance angles ──────────────────────────────────────────────────
      if (!dragging.current) {
        const speed = Math.sqrt(velRef.current.x ** 2 + velRef.current.y ** 2);
        if (speed > MIN_VEL) {
          velRef.current.x = Math.max(-MAX_VEL, Math.min(MAX_VEL, velRef.current.x * FRICTION));
          velRef.current.y = Math.max(-MAX_VEL, Math.min(MAX_VEL, velRef.current.y * FRICTION));
          angleRef.current.x += velRef.current.x * dt;
          angleRef.current.y += velRef.current.y * dt;
        } else {
          velRef.current = { x: 0, y: 0 };
          angleRef.current.x += AUTO_X * dt;
          angleRef.current.y += AUTO_Y * dt;
        }
      }

      const ax = angleRef.current.x;
      const ay = angleRef.current.y;

      // ── 2. Project all nodes, compute draw order ───────────────────────────
      const pts = basePoints.current;
      const projected: (SpherePoint & { idx: number })[] = pts.map((p, i) => {
        const { rx, ry, rz } = rotate3D(p.tx, p.ty, p.tz, ax, ay);
        const depth = (rz + 1) / 2;
        const depthQ = depth * depth;
        return {
          x: rx * RADIUS,
          y: ry * RADIUS,
          z: rz,
          scale: scaleFloor + depthQ * (1 - scaleFloor),
          opacity: opacityFloor + depthQ * (1 - opacityFloor),
          idx: i,
        };
      });
      projected.sort((a, b) => a.z - b.z);

      // ── 3. Write positions directly to DOM nodes ───────────────────────────
      for (let di = 0; di < projected.length; di++) {
        const { x, y, scale, opacity, idx } = projected[di];
        const el = nodeRefs.current[idx];
        if (!el) continue;
        const zIdx = Math.round(opacity * 100);
        const nodeSize = NODE_R * 2 * scale;
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        el.style.zIndex = String(zIdx);
        // Write depth-driven styles to the inner node div (first child)
        const inner = el.firstElementChild as HTMLDivElement | null;
        if (inner) {
          inner.style.width = `${nodeSize}px`;
          inner.style.height = `${nodeSize}px`;
          inner.style.opacity = String(opacity);
          const skill = skills[idx];
          const color = isDark ? skill.darkColor : skill.lightColor;
          inner.style.boxShadow = isDark
            ? `0 0 ${Math.round(scale * 14)}px ${color}55`
            : `0 0 ${Math.round(scale * 10)}px ${color}28`;
          // Icon size
          const iconEl = inner.firstElementChild?.firstElementChild as SVGElement | null;
          if (iconEl) {
            const iconSize = Math.max(10, Math.round(nodeSize * 0.45));
            iconEl.setAttribute("width", String(iconSize));
            iconEl.setAttribute("height", String(iconSize));
          }
        }
        sortOrderRef.current[di] = idx;
      }

      // ── 4. Update SVG paths (latitude rings + meridian ellipse) ────────────
      const svg = svgRef.current;
      if (svg) {
        const paths = svg.querySelectorAll<SVGPathElement>("path[data-ring]");
        LAT_TILTS.forEach((tilt, ri) => {
          const path = paths[ri];
          if (!path) return;
          const ringPts = latRingPoints(tilt);
          const d =
            ringPts
              .map((p, i) => {
                const { rx, ry } = rotate3D(p.tx, p.ty, p.tz, ax, ay);
                const px = rx * RADIUS + RADIUS + 40;
                const py = ry * RADIUS + RADIUS + 40;
                return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
              })
              .join(" ") + " Z";
          path.setAttribute("d", d);
        });

        const ellipse = svg.querySelector<SVGEllipseElement>("ellipse[data-meridian]");
        if (ellipse) {
          ellipse.setAttribute("rx", String(Math.abs(Math.cos(ay) * RADIUS)));
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted, isDark, skills]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pointer handlers ───────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    setIsDragging(true);
    velRef.current = { x: 0, y: 0 };
    lastPtr.current = { x: e.clientX, y: e.clientY };
    lastPtrTime.current = e.timeStamp;
    ptrDelta.current = { x: 0, y: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dy = e.clientY - lastPtr.current.y;
    const dx = e.clientX - lastPtr.current.x;
    const dt = Math.max(1, e.timeStamp - lastPtrTime.current);
    const MAX_VEL = 0.012;
    velRef.current = {
      x: Math.max(-MAX_VEL, Math.min(MAX_VEL, ((dy * 0.007) / dt) * 16)),
      y: Math.max(-MAX_VEL, Math.min(MAX_VEL, ((dx * 0.007) / dt) * 16)),
    };
    ptrDelta.current = { x: dy * 0.007, y: dx * 0.007 };
    lastPtr.current = { x: e.clientX, y: e.clientY };
    lastPtrTime.current = e.timeStamp;
    angleRef.current.x += ptrDelta.current.x;
    angleRef.current.y += ptrDelta.current.y;
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    setIsDragging(false);
  }, []);

  const svgSize = (RADIUS + 40) * 2;

  // ── Initial projected positions for first paint (static, angle = 0.35/0) ──
  // These are used only for the initial render; the RAF loop takes over immediately.
  const initialProjected = basePoints.current.map((p, i) => {
    const { rx, ry, rz } = rotate3D(p.tx, p.ty, p.tz, 0.35, 0);
    const depth = (rz + 1) / 2;
    const depthQ = depth * depth;
    const opacityFloor = isDark ? 0.65 : 0.55;
    const scaleFloor = 0.52;
    return {
      x: rx * RADIUS,
      y: ry * RADIUS,
      z: rz,
      scale: scaleFloor + depthQ * (1 - scaleFloor),
      opacity: opacityFloor + depthQ * (1 - opacityFloor),
      skill: skills[i],
    };
  });
  initialProjected.sort((a, b) => a.z - b.z);

  // Initial ring paths for SSR / first paint
  const initialRingPaths = LAT_TILTS.map((tilt) => {
    const ringPts = latRingPoints(tilt);
    return (
      ringPts
        .map((p, i) => {
          const { rx, ry } = rotate3D(p.tx, p.ty, p.tz, 0.35, 0);
          return `${i === 0 ? "M" : "L"} ${(rx * RADIUS + RADIUS + 40).toFixed(1)} ${(ry * RADIUS + RADIUS + 40).toFixed(1)}`;
        })
        .join(" ") + " Z"
    );
  });

  return (
    <div
      className="relative mx-auto select-none touch-none"
      style={{
        width: svgSize,
        height: svgSize,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Atmosphere glow — behind everything */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: RADIUS * 2,
          height: RADIUS * 2,
          backgroundImage: `radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 72%)`,
        }}
      />

      {/* SVG layer — sphere outline + latitude rings (paths updated imperatively via svgRef) */}
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0"
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        overflow="visible"
        aria-hidden="true"
      >
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--primary)"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
        {initialRingPaths.map((d, i) => (
          <path
            key={i}
            data-ring={i}
            d={d}
            fill="none"
            stroke="var(--primary)"
            strokeOpacity={0.12}
            strokeWidth={0.8}
            strokeDasharray={i === 1 ? "none" : "4 6"}
          />
        ))}
        <ellipse
          data-meridian
          cx={svgSize / 2}
          cy={svgSize / 2}
          rx={Math.abs(Math.cos(0) * RADIUS)}
          ry={RADIUS}
          fill="none"
          stroke="var(--primary)"
          strokeOpacity={0.07}
          strokeWidth={0.8}
        />
      </svg>

      {/* Skill nodes — only rendered client-side; positions mutated imperatively by RAF */}
      {mounted &&
        initialProjected.map(({ x, y, scale, opacity, skill }) => {
          const color = isDark ? skill.darkColor : skill.lightColor;
          const Icon = skill.icon;
          const isHovered = hoveredId === skill.name;
          const nodeSize = NODE_R * 2 * scale;
          // Find the original index so nodeRefs[originalIdx] is stable across sorts
          const origIdx = skills.indexOf(skill);

          return (
            <div
              key={skill.name}
              ref={(el) => {
                nodeRefs.current[origIdx] = el;
              }}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                zIndex: Math.round(opacity * 100),
              }}
              onMouseEnter={() => setHoveredId(skill.name)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Hover tooltip — React-rendered because it's conditional */}
              {isHovered && (
                <div
                  className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border/60 bg-card/95 px-2.5 py-1 text-[11px] font-bold shadow-lg backdrop-blur-sm"
                  style={{ color, zIndex: 200 }}
                >
                  {skill.name}
                  <div
                    className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
                    style={{ borderTopColor: "var(--border)" }}
                  />
                </div>
              )}

              {/* Circular node — size/opacity/shadow updated imperatively each frame */}
              <div
                className="flex items-center justify-center rounded-full transition-all duration-150"
                style={{
                  width: nodeSize,
                  height: nodeSize,
                  opacity: isHovered ? 1 : opacity,
                  backgroundColor: isDark
                    ? isHovered
                      ? `${color}40`
                      : `${color}28`
                    : isHovered
                      ? `${color}22`
                      : `${color}12`,
                  border: `${scale > 0.8 ? 1.5 : 1}px solid ${
                    isDark
                      ? isHovered
                        ? `${color}cc`
                        : `${color}10`
                      : isHovered
                        ? `${color}70`
                        : `${color}35`
                  }`,
                  boxShadow: isDark
                    ? isHovered
                      ? `0 0 22px ${color}80, 0 0 44px ${color}40, inset 0 0 14px ${color}25`
                      : `0 0 ${Math.round(scale * 14)}px ${color}55`
                    : isHovered
                      ? `0 0 20px ${color}55, 0 0 40px ${color}25, inset 0 0 12px ${color}15`
                      : `0 0 ${Math.round(scale * 10)}px ${color}28`,
                  transform: `scale(${isHovered ? 1.22 : 1})`,
                }}
              >
                <span aria-hidden="true">
                  <Icon
                    role="presentation"
                    size={Math.max(10, Math.round(nodeSize * 0.45))}
                    style={{
                      color: isDark ? color : isHovered ? color : `${color}dd`,
                      filter: isDark
                        ? `drop-shadow(0 0 ${isHovered ? "6px" : "3px"} ${color}cc)`
                        : isHovered
                          ? `drop-shadow(0 0 5px ${color}aa)`
                          : undefined,
                    }}
                  />
                </span>
              </div>
            </div>
          );
        })}

      {/* Drag hint */}
      <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2">
        <span className="text-[10px] text-muted-foreground tracking-wide">
          drag to rotate · hover to explore
        </span>
      </div>
    </div>
  );
}

export { SkillSphere };
