"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Spider web — nodes on a jittered grid, each drifting on its own slow orbit.
 * Neighbours within reach are strung together, strands fade with distance, and
 * the pointer pulls its own strands while nearby nodes give way on a spring.
 *
 * Everything is drawn into five <path> elements (one per strand tier, one for
 * pointer strands, two for nodes), so a frame costs a handful of attribute
 * writes instead of hundreds of DOM nodes.
 *
 * The layout is seeded, so the server renders the resting web in the initial
 * HTML — it survives with JS off or `prefers-reduced-motion`, where it simply
 * never animates.
 */

const VIEW_W = 1000;
const VIEW_H = 620;
const COLS = 10;
const ROWS = 7;
const NODE_COUNT = COLS * ROWS;

/** Strands form under this length; they fade out as they approach it. */
const LINK_DIST = 198;
const POINTER_DIST = 210;
/** How far a node gives way to the pointer, and how lazily it returns. */
const POINTER_PUSH = 30;
const SPRING = 0.055;
const DAMPING = 0.87;

const TAU = Math.PI * 2;

interface Node {
  homeX: number;
  homeY: number;
  ampX: number;
  ampY: number;
  rateX: number;
  rateY: number;
  phaseX: number;
  phaseY: number;
  accent: boolean;
}

/** Small deterministic PRNG — keeps the server and client layouts identical. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NODES: Node[] = (() => {
  const rand = seeded(20260831);
  const cellW = VIEW_W / COLS;
  const cellH = VIEW_H / ROWS;
  const nodes: Node[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      nodes.push({
        homeX: (col + 0.5 + (rand() - 0.5) * 0.52) * cellW,
        homeY: (row + 0.5 + (rand() - 0.5) * 0.52) * cellH,
        ampX: 5 + rand() * 11,
        ampY: 4 + rand() * 10,
        rateX: 0.045 + rand() * 0.075,
        rateY: 0.04 + rand() * 0.07,
        phaseX: rand() * TAU,
        phaseY: rand() * TAU,
        accent: rand() > 0.9,
      });
    }
  }
  return nodes;
})();

const xs = new Float64Array(NODE_COUNT);
const ys = new Float64Array(NODE_COUNT);
const offX = new Float64Array(NODE_COUNT);
const offY = new Float64Array(NODE_COUNT);
const velX = new Float64Array(NODE_COUNT);
const velY = new Float64Array(NODE_COUNT);

interface Frame {
  /** Strand tiers, faintest first. */
  tiers: [string, string, string];
  /** Strands drawn to the pointer, far tier then near tier. */
  pointer: [string, string];
  pointerDot: string;
  nodes: string;
  accents: string;
}

function computeFrame(time: number, pointerX: number, pointerY: number, spring: boolean): Frame {
  for (let i = 0; i < NODE_COUNT; i++) {
    const node = NODES[i];
    const floatX = node.homeX + node.ampX * Math.sin(time * node.rateX * TAU + node.phaseX);
    const floatY = node.homeY + node.ampY * Math.cos(time * node.rateY * TAU + node.phaseY);

    let targetX = 0;
    let targetY = 0;
    const dx = floatX - pointerX;
    const dy = floatY - pointerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < POINTER_DIST) {
      const falloff = 1 - dist / POINTER_DIST;
      const push = (POINTER_PUSH * falloff * falloff) / (dist || 1);
      targetX = dx * push;
      targetY = dy * push;
    }

    if (spring) {
      velX[i] = (velX[i] + (targetX - offX[i]) * SPRING) * DAMPING;
      velY[i] = (velY[i] + (targetY - offY[i]) * SPRING) * DAMPING;
      offX[i] += velX[i];
      offY[i] += velY[i];
    } else {
      offX[i] = targetX;
      offY[i] = targetY;
    }

    xs[i] = floatX + offX[i];
    ys[i] = floatY + offY[i];
  }

  const faint: string[] = [];
  const mid: string[] = [];
  const strong: string[] = [];
  const pointerFar: string[] = [];
  const pointerNear: string[] = [];
  const nodes: string[] = [];
  const accents: string[] = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    const x = xs[i];
    const y = ys[i];

    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dx = xs[j] - x;
      const dy = ys[j] - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist >= LINK_DIST) continue;

      const strength = 1 - dist / LINK_DIST;
      const segment = `M${x.toFixed(1)} ${y.toFixed(1)}L${xs[j].toFixed(1)} ${ys[j].toFixed(1)}`;
      if (strength > 0.58) strong.push(segment);
      else if (strength > 0.28) mid.push(segment);
      else faint.push(segment);
    }

    const pdx = x - pointerX;
    const pdy = y - pointerY;
    const pointerDist = Math.sqrt(pdx * pdx + pdy * pdy);
    if (pointerDist < POINTER_DIST) {
      const strand = `M${pointerX.toFixed(1)} ${pointerY.toFixed(1)}L${x.toFixed(1)} ${y.toFixed(
        1,
      )}`;
      if (pointerDist < POINTER_DIST * 0.55) pointerNear.push(strand);
      else pointerFar.push(strand);
    }

    // Zero-ish length subpath + round cap = a dot, so every node fits in one path.
    const dot = `M${x.toFixed(1)} ${y.toFixed(1)}h0.01`;
    if (NODES[i].accent) accents.push(dot);
    else nodes.push(dot);
  }

  const anchored = pointerNear.length + pointerFar.length > 0;

  return {
    tiers: [faint.join(""), mid.join(""), strong.join("")],
    pointer: [pointerFar.join(""), pointerNear.join("")],
    pointerDot: anchored ? `M${pointerX.toFixed(1)} ${pointerY.toFixed(1)}h0.01` : "",
    nodes: nodes.join(""),
    accents: accents.join(""),
  };
}

const REST = computeFrame(0, -9999, -9999, false);

export function HeroWeb() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tierRefs = useRef<(SVGPathElement | null)[]>([]);
  const pointerRefs = useRef<(SVGPathElement | null)[]>([]);
  const pointerDotRef = useRef<SVGPathElement>(null);
  const nodesRef = useRef<SVGPathElement>(null);
  const accentsRef = useRef<SVGPathElement>(null);
  /** Tall mobile viewports stretch `none`; slice keeps cell size closer to desktop. */
  const [preserveAspect, setPreserveAspect] = useState<"none" | "xMidYMid slice">("none");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const syncAspect = () => setPreserveAspect(mq.matches ? "xMidYMid slice" : "none");
    syncAspect();
    mq.addEventListener("change", syncAspect);
    return () => mq.removeEventListener("change", syncAspect);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rect = svg.getBoundingClientRect();
    let needsMeasure = false;
    let pointerX = -9999;
    let pointerY = -9999;
    let elapsed = 0;
    let last = 0;
    let raf = 0;
    let cancelled = false;

    const step = (now: number) => {
      if (needsMeasure) {
        rect = svg.getBoundingClientRect();
        needsMeasure = false;
      }
      elapsed += last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;

      const frame = computeFrame(elapsed, pointerX, pointerY, true);
      for (let i = 0; i < 3; i++) tierRefs.current[i]?.setAttribute("d", frame.tiers[i]);
      for (let i = 0; i < 2; i++) pointerRefs.current[i]?.setAttribute("d", frame.pointer[i]);
      pointerDotRef.current?.setAttribute("d", frame.pointerDot);
      nodesRef.current?.setAttribute("d", frame.nodes);
      accentsRef.current?.setAttribute("d", frame.accents);

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (!raf) {
        needsMeasure = true;
        last = 0;
        raf = requestAnimationFrame(step);
      }
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = ((event.clientX - rect.left) / rect.width) * VIEW_W;
      pointerY = ((event.clientY - rect.top) / rect.height) * VIEW_H;
    };
    const onPointerOut = () => {
      pointerX = -9999;
      pointerY = -9999;
    };
    const onReflow = () => {
      needsMeasure = true;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    let io: IntersectionObserver | undefined;
    const attach = () => {
      if (cancelled || !svgRef.current) return;

      io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
      io.observe(svgRef.current);

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onReflow, { passive: true });
      window.addEventListener("resize", onReflow);
      document.addEventListener("pointerleave", onPointerOut);
      document.addEventListener("visibilitychange", onVisibility);
    };

    const ric = window.requestIdleCallback;
    if (ric) {
      const idleId = ric(attach, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
        stop();
        io?.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onReflow);
        window.removeEventListener("resize", onReflow);
        document.removeEventListener("pointerleave", onPointerOut);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    const timeoutId = window.setTimeout(attach, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      stop();
      io?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onReflow);
      window.removeEventListener("resize", onReflow);
      document.removeEventListener("pointerleave", onPointerOut);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="hero-web absolute inset-0 h-full w-full"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio={preserveAspect}
      aria-hidden="true"
      focusable="false"
    >
      {/* Trig can round differently across engines; the paths are decorative. */}
      {[0.07, 0.15, 0.27].map((opacity, i) => (
        <path
          key={opacity}
          ref={(el) => {
            tierRefs.current[i] = el;
          }}
          className="hero-web-tier"
          d={REST.tiers[i]}
          fill="none"
          stroke="var(--foreground)"
          strokeOpacity={opacity}
          vectorEffect="non-scaling-stroke"
          suppressHydrationWarning
        />
      ))}

      {[0.2, 0.45].map((opacity, i) => (
        <path
          key={opacity}
          ref={(el) => {
            pointerRefs.current[i] = el;
          }}
          className="hero-web-pointer"
          d={REST.pointer[i]}
          fill="none"
          stroke="var(--primary)"
          strokeOpacity={opacity}
          vectorEffect="non-scaling-stroke"
          suppressHydrationWarning
        />
      ))}

      <path
        ref={nodesRef}
        className="hero-web-node"
        d={REST.nodes}
        fill="none"
        stroke="var(--foreground)"
        strokeOpacity={0.26}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        suppressHydrationWarning
      />
      <path
        ref={accentsRef}
        className="hero-web-accent"
        d={REST.accents}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity={0.6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        suppressHydrationWarning
      />

      {/* Where the pointer strands converge */}
      <path
        ref={pointerDotRef}
        className="hero-web-pointer-dot"
        d={REST.pointerDot}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity={0.55}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        suppressHydrationWarning
      />
    </svg>
  );
}
