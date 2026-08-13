"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";

/**
 * Listens for the Konami code globally.
 * On activation: renders a full-screen matrix rain canvas via portal,
 * shows a toast, then fades out after 4 seconds.
 * Rendered once at the app root — no visible DOM until triggered.
 */
export function KonamiEasterEgg() {
  const sequenceRef = useRef<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);

  const cleanup = useCallback(() => {
    activeRef.current = false;
    cancelAnimationFrame(rafRef.current);
    const el = containerRef.current;
    if (!el) return;
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 600);
    containerRef.current = null;
    canvasRef.current = null;
  }, []);

  const launchMatrix = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    // Container
    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.92);
      opacity: 0; transition: opacity 0.4s ease;
      pointer-events: all;
      display: flex; align-items: center; justify-content: center;
    `;
    containerRef.current = container;

    // Canvas
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = "position:absolute;inset:0;";
    canvasRef.current = canvas;
    container.appendChild(canvas);

    // "You found it" message
    const msg = document.createElement("div");
    msg.style.cssText = `
      position: relative; z-index: 1; text-align: center;
      color: #00ff41; font-family: 'JetBrains Mono', monospace;
      text-shadow: 0 0 20px #00ff41;
      pointer-events: none;
    `;
    msg.innerHTML = `
      <div style="font-size:clamp(1.5rem,4vw,3rem);font-weight:700;letter-spacing:0.1em">
        YOU FOUND IT
      </div>
      <div style="font-size:clamp(0.75rem,2vw,1.1rem);margin-top:0.5rem;opacity:0.7">
        ↑↑↓↓←→←→BA — the Konami Code
      </div>
      <div style="font-size:clamp(0.65rem,1.5vw,0.9rem);margin-top:1.5rem;opacity:0.5">
        click anywhere to close
      </div>
    `;
    container.appendChild(msg);

    // Click to dismiss
    container.addEventListener("click", cleanup);
    document.body.appendChild(container);

    // Fade in
    requestAnimationFrame(() => {
      container.style.opacity = "1";
    });

    // Matrix rain animation
    const ctx = canvas.getContext("2d")!;
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: cols }, () => Math.random() * -100);

    const draw = () => {
      if (!activeRef.current) return;
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    // Auto-close after 4s
    setTimeout(cleanup, 4000);

    toast("🎮 Konami Code activated!", {
      description: "You found the easter egg. Nice.",
      duration: 3000,
    });
  }, [cleanup]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;

      sequenceRef.current.push(e.key);
      if (sequenceRef.current.length > KONAMI.length) {
        sequenceRef.current.shift();
      }
      if (
        sequenceRef.current.length === KONAMI.length &&
        sequenceRef.current.every((k, i) => k === KONAMI[i])
      ) {
        sequenceRef.current = [];
        launchMatrix();
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      cleanup();
    };
  }, [launchMatrix, cleanup]);

  // No permanent DOM — everything is imperatively mounted on trigger
  return null;
}
