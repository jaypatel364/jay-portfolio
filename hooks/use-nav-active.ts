"use client";

import { usePathname } from "next/navigation";
import { useActiveSection } from "./use-active-section";
import { PATH_TO_NAV_ID } from "@/lib/nav";

/** Active nav id — route-based on inner pages, scroll-based on home. */
export function useNavActive() {
  const pathname = usePathname();
  const sectionActive = useActiveSection();

  if (pathname !== "/") {
    return PATH_TO_NAV_ID[pathname] ?? sectionActive;
  }

  return sectionActive;
}
