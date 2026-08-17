"use client";

import React, { useEffect, useRef, useState } from "react";
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

function SkillSphere({ skills, isDark }: { skills: Skill[]; isDark: boolean }) {
  const RADIUS = 185;
  const NODE_R = 22; // px radius of each circular node at full scale

  const [angleX, setAngleX] = useState(0.35);
  const [angleY, setAngleY] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const basePoints = useRef(fibonacciSphere(skills.length));

  // Physics refs — never cause re-render, updated in RAF
  const angleRef = useRef({ x: 0.35, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPtr = useRef({ x: 0, y: 0 });
  const lastPtrTime = useRef(0);
  const ptrDelta = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const frameTime = useRef<number>(0);

  // Main RAF loop — auto-spin + momentum decay
  useEffect(() => {
    const AUTO_X = 0.00022; // rad/ms gentle tilt drift
    const AUTO_Y = 0.00038; // rad/ms main spin
    const FRICTION = 0.92; // stronger friction — decelerates noticeably each frame
    const MIN_VEL = 0.00004; // below this → resume auto-spin
    const MAX_VEL = 0.012; // hard cap so a fast flick never goes wild

    const tick = (now: number) => {
      const dt = frameTime.current ? Math.min(now - frameTime.current, 24) : 16; // clamp dt spike
      frameTime.current = now;

      if (!dragging.current) {
        const speed = Math.sqrt(velRef.current.x ** 2 + velRef.current.y ** 2);
        if (speed > MIN_VEL) {
          // Coast with friction
          velRef.current.x *= FRICTION;
          velRef.current.y *= FRICTION;
          // Clamp so any remaining spike can't run away
          velRef.current.x = Math.max(-MAX_VEL, Math.min(MAX_VEL, velRef.current.x));
          velRef.current.y = Math.max(-MAX_VEL, Math.min(MAX_VEL, velRef.current.y));
          angleRef.current.x += velRef.current.x * dt;
          angleRef.current.y += velRef.current.y * dt;
        } else {
          // Auto-spin
          velRef.current = { x: 0, y: 0 };
          angleRef.current.x += AUTO_X * dt;
          angleRef.current.y += AUTO_Y * dt;
        }
        setAngleX(angleRef.current.x);
        setAngleY(angleRef.current.y);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    setIsDragging(true);
    velRef.current = { x: 0, y: 0 };
    lastPtr.current = { x: e.clientX, y: e.clientY };
    lastPtrTime.current = e.timeStamp;
    ptrDelta.current = { x: 0, y: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPtr.current.x;
    const dy = e.clientY - lastPtr.current.y;
    const dt = Math.max(1, e.timeStamp - lastPtrTime.current);
    // Clamp instantaneous velocity so a fast flick stays within reasonable bounds
    const MAX_VEL = 0.012;
    const rawVx = ((dy * 0.007) / dt) * 16;
    const rawVy = ((dx * 0.007) / dt) * 16;
    velRef.current = {
      x: Math.max(-MAX_VEL, Math.min(MAX_VEL, rawVx)),
      y: Math.max(-MAX_VEL, Math.min(MAX_VEL, rawVy)),
    };
    ptrDelta.current = { x: dy * 0.007, y: dx * 0.007 };
    lastPtr.current = { x: e.clientX, y: e.clientY };
    lastPtrTime.current = e.timeStamp;
    angleRef.current.x += ptrDelta.current.x;
    angleRef.current.y += ptrDelta.current.y;
    setAngleX(angleRef.current.x);
    setAngleY(angleRef.current.y);
  };

  const onPointerUp = () => {
    dragging.current = false;
    setIsDragging(false);
  };

  // ── Project skill nodes ────────────────────────────────────────────────────
  const projected: (SpherePoint & { skill: Skill })[] = basePoints.current.map((p, i) => {
    const { rx, ry, rz } = rotate3D(p.tx, p.ty, p.tz, angleX, angleY);
    const depth = (rz + 1) / 2; // 0 = back, 1 = front
    // Quadratic depth curve — makes back nodes clearly smaller/dimmer
    const depthQ = depth * depth;
    // Quadratic depth curve — back nodes clearly smaller/dimmer but still visible
    // Light mode: floor 0.55 opacity so nothing disappears on white bg
    // Dark mode: floor 0.65 opacity — needs higher floor to stay visible on dark bg
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
  projected.sort((a, b) => a.z - b.z);

  // ── Project latitude rings ─────────────────────────────────────────────────
  const LAT_TILTS = [-0.52, 0, 0.52]; // ≈ -30°, 0°, +30° latitude
  const ringPaths = LAT_TILTS.map((tilt) => {
    const ringPts = latRingPoints(tilt);
    const projected2d = ringPts.map((p) => {
      const { rx, ry } = rotate3D(p.tx, p.ty, p.tz, angleX, angleY);
      return { x: rx * RADIUS + RADIUS + 40, y: ry * RADIUS + RADIUS + 40 };
    });
    // Build SVG path from projected points
    return (
      projected2d
        .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
        .join(" ") + " Z"
    );
  });

  const svgSize = (RADIUS + 40) * 2;

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
          background:
            "radial-gradient(circle, var(--tw-shadow-color, color-mix(in oklch, var(--primary) 10%, transparent)) 0%, transparent 72%)",
          backgroundImage: `radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 72%)`,
        }}
      />

      {/* SVG layer — sphere outline + latitude rings */}
      <svg
        className="pointer-events-none absolute inset-0"
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        overflow="visible"
        aria-hidden="true"
      >
        {/* Outer sphere circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--primary)"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
        {/* Latitude rings */}
        {ringPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--primary)"
            strokeOpacity={0.12}
            strokeWidth={0.8}
            strokeDasharray={i === 1 ? "none" : "4 6"}
          />
        ))}
        {/* Longitude meridian hint — vertical */}
        <ellipse
          cx={svgSize / 2}
          cy={svgSize / 2}
          rx={Math.abs(Math.cos(angleY) * RADIUS)}
          ry={RADIUS}
          fill="none"
          stroke="var(--primary)"
          strokeOpacity={0.07}
          strokeWidth={0.8}
        />
      </svg>

      {/* Skill nodes */}
      {projected.map(({ x, y, scale, opacity, skill }) => {
        const color = isDark ? skill.darkColor : skill.lightColor;
        const Icon = skill.icon;
        const isHovered = hoveredId === skill.name;
        const nodeSize = NODE_R * 2 * scale;

        return (
          <div
            key={skill.name}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              zIndex: Math.round(opacity * 100),
              // Don't mess with opacity on hover — instead we boost it via style
            }}
            onMouseEnter={() => setHoveredId(skill.name)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Hover tooltip above the node */}
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

            {/* Circular node */}
            <div
              className="flex items-center justify-center rounded-full transition-all duration-150"
              style={{
                width: nodeSize,
                height: nodeSize,
                opacity: isHovered ? 1 : opacity,
                // Dark mode: stronger fill + border so nodes punch through the dark bg
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
                    // Dark mode: full color always; light mode: 87% on idle
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
        <span className="text-[10px] text-muted-foreground/35 tracking-wide">
          drag to rotate · hover to explore
        </span>
      </div>
    </div>
  );
}

export { SkillSphere };
