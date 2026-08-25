"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/site-config";

/**
 * Overlays stay code-split and mount after first paint to reduce Total Blocking Time.
 *
 * Each effect is imported from its own file path (not the barrel) so the bundler
 * can assign each a separate chunk. Importing via the barrel would merge all
 * effects — including the 400-line CursorTrail — into one chunk regardless of
 * which features are actually enabled.
 *
 * CursorTrail's dynamic() is only created when cursorEffect is active, so the
 * chunk is never downloaded when the feature is off (currently "none").
 */
const CursorSpotlight = dynamic(() =>
  import("@/components/effects/CursorSpotlight").then((m) => ({ default: m.CursorSpotlight })),
);
const KonamiEasterEgg = dynamic(() =>
  import("@/components/effects/KonamiEasterEgg").then((m) => ({ default: m.KonamiEasterEgg })),
);
const CatchTheBug = siteConfig.showCatchTheBug
  ? dynamic(() =>
      import("@/components/effects/CatchTheBug").then((m) => ({ default: m.CatchTheBug })),
    )
  : null;
const CursorTrail =
  siteConfig.cursorEffect !== "none"
    ? dynamic(() =>
        import("@/components/effects/CursorTrail").then((m) => ({ default: m.CursorTrail })),
      )
    : null;

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
      {CatchTheBug && <CatchTheBug />}
      {CursorTrail && <CursorTrail mode={siteConfig.cursorEffect} />}
    </>
  );
}
