"use client";

import { usePathname } from "next/navigation";
import { resolveNavId } from "@/lib/nav";

/** Active nav id — pathname only so home teasers never steal page highlights. */
export function useNavActive() {
  const pathname = usePathname();
  return resolveNavId(pathname);
}
