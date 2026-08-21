"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/site-config";

/**
 * Overlays stay code-split and mount after first paint to reduce Total Blocking Time.
 * SSR is kept so the homepage HTML is never skipped.
 */
const ChatBot = dynamic(() =>
  import("@/components/features/chatbot").then((m) => ({ default: m.ChatBot })),
);
const CursorSpotlight = dynamic(() =>
  import("@/components/effects").then((m) => ({ default: m.CursorSpotlight })),
);
const KonamiEasterEgg = dynamic(() =>
  import("@/components/effects").then((m) => ({ default: m.KonamiEasterEgg })),
);
const CatchTheBug = dynamic(() =>
  import("@/components/effects").then((m) => ({ default: m.CatchTheBug })),
);
const CursorTrail = dynamic(() =>
  import("@/components/effects").then((m) => ({ default: m.CursorTrail })),
);

export function HomeOverlays() {
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

  if (!ready) return null;

  return (
    <>
      <CursorSpotlight />
      <KonamiEasterEgg />
      {siteConfig.showCatchTheBug && <CatchTheBug />}
      {siteConfig.cursorEffect !== "none" && <CursorTrail mode={siteConfig.cursorEffect} />}
      <ChatBot />
    </>
  );
}
