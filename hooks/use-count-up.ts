"use client";

import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  /** The target numeric value to count up to */
  target: number;
  /** Duration of the animation in ms (default: 1200) */
  duration?: number;
  /** Delay before starting in ms (default: 0) */
  delay?: number;
  /** Only start when the ref element enters the viewport */
  triggerOnView?: boolean;
}

/**
 * Counts from 0 up to `target` using a ease-out curve.
 * When `triggerOnView` is true, pass the returned `ref` to the element
 * you want to observe — the counter fires once it enters the viewport.
 */
export function useCountUp({
  target,
  duration = 1200,
  delay = 0,
  triggerOnView = true,
}: UseCountUpOptions) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  // Respect prefers-reduced-motion — just jump to target
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // IntersectionObserver to trigger on scroll-into-view
  useEffect(() => {
    if (!triggerOnView) {
      setHasStarted(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerOnView]);

  // Run the count-up animation once triggered
  useEffect(() => {
    if (!hasStarted) return;

    if (prefersReduced) {
      setCount(target);
      return;
    }

    let rafId: number;
    let startTime: number | null = null;

    const delayTimeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));

        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        }
      };

      rafId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      cancelAnimationFrame(rafId);
    };
  }, [hasStarted, target, duration, delay, prefersReduced]);

  return { count, ref };
}
