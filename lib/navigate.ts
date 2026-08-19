import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { NavItem } from "@/lib/nav";

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

  if (item.href.startsWith("/#")) {
    const hashId = item.href.slice(2);
    if (pathname !== "/") {
      router.push(item.href);
      return;
    }
    document.getElementById(hashId)?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  router.push(item.href);
}
