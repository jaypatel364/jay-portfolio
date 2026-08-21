import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { NavItem } from "@/lib/nav";

function withTrailingSlash(path: string): string {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

/**
 * Navigate to a nav item — page routes or in-page hashes (`/#faq`, `/about/#experience`).
 */
export function navigateToNavItem(
  item: NavItem,
  opts: { pathname: string; router: AppRouterInstance },
) {
  const { pathname, router } = opts;

  if (item.href === "/") {
    if (pathname !== "/") {
      router.push("/");
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash) history.replaceState(null, "", "/");
    return;
  }

  const hashIdx = item.href.indexOf("#");
  if (hashIdx !== -1) {
    const pathPart = item.href.slice(0, hashIdx) || "/";
    const hashId = item.href.slice(hashIdx + 1);
    const targetPath = withTrailingSlash(pathPart);

    if (pathname === targetPath) {
      document.getElementById(hashId)?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `${targetPath}#${hashId}`);
      return;
    }

    router.push(targetPath === "/" ? `/#${hashId}` : `${targetPath}#${hashId}`);
    return;
  }

  router.push(item.href);
}
