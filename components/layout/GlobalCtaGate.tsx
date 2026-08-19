"use client";

import { usePathname } from "next/navigation";
import { shouldShowGlobalCta } from "@/lib/global-cta";
import { GlobalCta } from "./GlobalCta";

/** Renders the global CTA above the footer when the route allows it. */
export function GlobalCtaGate() {
  const pathname = usePathname();
  if (!shouldShowGlobalCta(pathname)) return null;
  return <GlobalCta />;
}
