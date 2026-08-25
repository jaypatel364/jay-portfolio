"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { BackToTop } from "./BackToTop";

/**
 * Site-wide floating UI (chatbot + back-to-top).
 * Chat mounts after idle so it does not compete with first paint.
 */
const ChatBot = dynamic(() =>
  import("@/components/features/chatbot").then((m) => ({ default: m.ChatBot })),
);

export function GlobalFloatingUI() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = () => setReady(true);
    const ric = window.requestIdleCallback;
    if (ric) {
      const id = ric(mount, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(mount, 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <BackToTop />
      {ready ? <ChatBot /> : null}
    </>
  );
}
