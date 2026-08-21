"use client";

import { usePathname } from "next/navigation";
import { PATH_TO_NAV_ID } from "@/lib/nav";

/** Active nav id — pathname only so home teasers never steal page highlights. */
export function useNavActive() {
  const pathname = usePathname();
  return PATH_TO_NAV_ID[pathname] ?? "home";
}
