"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { shouldShowGlobalCta } from "@/lib/global-cta";

const GlobalCta = dynamic(() => import("./GlobalCta").then((m) => ({ default: m.GlobalCta })));

/** Renders the global CTA above the footer when the route allows it. */
export function GlobalCtaGate() {
  const pathname = usePathname();
  if (!shouldShowGlobalCta(pathname)) return null;
  return <GlobalCta />;
}
