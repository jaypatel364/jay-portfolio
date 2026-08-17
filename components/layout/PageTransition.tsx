import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/** Layout slots — page entrance is handled by PageReveal + .site-shell CSS. */
export function PageTransition({ children }: PageTransitionProps) {
  return <div className="contents">{children}</div>;
}

export function PageTransitionItem({ children }: PageTransitionProps) {
  return <div className="contents">{children}</div>;
}
