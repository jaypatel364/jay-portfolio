"use client";

import { useLayoutEffect } from "react";

/** Clears any leftover pending flag so hero + nav paint immediately. */
export function PageReveal() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.pageReady = "true";
    root.removeAttribute("data-page-pending");
  }, []);

  return null;
}
