"use client";

import { useEffect, useRef } from "react";

/**
 * Renders a large radial-gradient "spotlight" that follows the cursor.
 * - Disabled on touch-only devices (no fine pointer)
 * - Respects prefers-reduced-motion (no movement, gradient hidden)
 * - Runs entirely on a CSS custom property so there are zero React re-renders
 *   during mousemove — the overlay div is mutated directly via the ref.
 */
export function CursorSpotlight() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    // Only activate for devices that have a fine pointer (mouse/trackpad)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || prefersReduced) {
      el.style.opacity = "0";
      return;
    }

    let rafId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    // Lerp the spotlight toward the cursor for a smooth lag effect
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.12);
      currentY = lerp(currentY, targetY, 0.12);

      el.style.background = `radial-gradient(
        600px circle at ${currentX}px ${currentY}px,
        color-mix(in oklch, var(--primary) 8%, transparent) 0%,
        transparent 70%
      )`;

      rafId = requestAnimationFrame(animate);
    };

    // Fade in on first mouse move
    const onFirstMove = () => {
      el.style.opacity = "1";
      window.removeEventListener("mousemove", onFirstMove);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousemove", onFirstMove, { once: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-500"
    />
  );
}
