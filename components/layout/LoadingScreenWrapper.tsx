"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/site-config";

/** Must match `SESSION_KEY` in LoadingScreenParts (avoid importing that module — it pulls framer). */
const SESSION_KEY = "jay_boot_done";

/**
 * When the boot screen is disabled (production default), this wrapper is a
 * no-op and never pulls the boot UI into the critical path.
 */
const LoadingScreen = dynamic(() =>
  import("./LoadingScreen").then((m) => ({ default: m.LoadingScreen })),
);

function BootGate({ children }: { children: React.ReactNode }) {
  const [booting, setBooting] = useState(false);

  useEffect(() => {
    const shouldBoot = !sessionStorage.getItem(SESSION_KEY);
    setBooting(shouldBoot);
    if (!shouldBoot) {
      document.documentElement.removeAttribute("data-booting");
    }
  }, []);

  useEffect(() => {
    if (booting) document.documentElement.removeAttribute("data-booting");
  }, [booting]);

  const handleDone = () => {
    sessionStorage.setItem(SESSION_KEY, "0");
    document.documentElement.removeAttribute("data-booting");
    setBooting(false);
  };

  return (
    <>
      {booting ? <LoadingScreen onDone={handleDone} /> : null}
      {children}
    </>
  );
}

export function LoadingScreenWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!siteConfig.showLoadingScreen) {
      document.documentElement.removeAttribute("data-booting");
    }
  }, []);

  if (!siteConfig.showLoadingScreen) {
    return <>{children}</>;
  }

  return <BootGate>{children}</BootGate>;
}
