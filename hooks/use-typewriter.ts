"use client";

import { useState, useEffect, useRef } from "react";

interface UseTypewriterOptions {
  /** Array of strings to cycle through */
  words: string[];
  /** Typing speed in ms per character (default: 80) */
  typeSpeed?: number;
  /** Deleting speed in ms per character (default: 50) */
  deleteSpeed?: number;
  /** Pause after fully typing a word in ms (default: 2000) */
  pauseAfterType?: number;
  /** Pause after fully deleting a word in ms (default: 400) */
  pauseAfterDelete?: number;
}

type Phase = "typing" | "pausing" | "deleting" | "waiting";

export function useTypewriter({
  words,
  typeSpeed = 80,
  deleteSpeed = 50,
  pauseAfterType = 2000,
  pauseAfterDelete = 400,
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const wordIndexRef = useRef(0);
  const charIndexRef = useRef(0);

  // Respect prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (prefersReducedMotion) {
      // Just show the first word statically
      setDisplayText(words[0] ?? "");
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const currentWord = words[wordIndexRef.current % words.length];

      if (phase === "typing") {
        if (charIndexRef.current < currentWord.length) {
          charIndexRef.current += 1;
          setDisplayText(currentWord.slice(0, charIndexRef.current));
          timeout = setTimeout(tick, typeSpeed);
        } else {
          setPhase("pausing");
          timeout = setTimeout(tick, pauseAfterType);
        }
      } else if (phase === "pausing") {
        setPhase("deleting");
        timeout = setTimeout(tick, 0);
      } else if (phase === "deleting") {
        if (charIndexRef.current > 0) {
          charIndexRef.current -= 1;
          setDisplayText(currentWord.slice(0, charIndexRef.current));
          timeout = setTimeout(tick, deleteSpeed);
        } else {
          wordIndexRef.current += 1;
          setPhase("waiting");
          timeout = setTimeout(tick, pauseAfterDelete);
        }
      } else if (phase === "waiting") {
        setPhase("typing");
        timeout = setTimeout(tick, 0);
      }
    };

    timeout = setTimeout(tick, typeSpeed);
    return () => clearTimeout(timeout);
  }, [
    phase,
    words,
    typeSpeed,
    deleteSpeed,
    pauseAfterType,
    pauseAfterDelete,
    prefersReducedMotion,
  ]);

  return { displayText, isTyping: phase === "typing" };
}
