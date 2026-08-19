/**
 * Returns true when the global pre-footer CTA should render.
 * Hidden on /contact (dedicated form page). On home it is the #contact target.
 */
export function shouldShowGlobalCta(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === "/contact") return false;
  return true;
}
