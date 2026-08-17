"use client";

import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/site-config";

/**
 * Overlays stay code-split, but must SSR (no `ssr: false`).
 * `ssr: false` throws BailoutToCSR and Next can skip the rest of the homepage HTML.
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
