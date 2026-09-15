import { cn } from "@/lib/utils";

/**
 * Canonical page chrome — same as Navbar / Footer / service heroes.
 *
 * ALWAYS put gutters on THIS element (padding inside max-w-6xl).
 * NEVER put `px-*` on a parent section and a bare `max-w-6xl` child —
 * that shifts the content edge left/right of the header.
 *
 * Nest narrower `max-w-*` inside for prose only.
 */
export const PAGE_CONTAINER = "mx-auto w-full min-w-0 max-w-6xl px-4 sm:px-6" as const;

/**
 * Same max width when a parent already applied PAGE_CONTAINER gutters
 * (e.g. skills/work page wrappers). Avoids double horizontal padding.
 */
export const PAGE_CONTAINER_BARE = "mx-auto w-full min-w-0 max-w-6xl" as const;

export function pageContainer(...extra: Array<string | false | null | undefined>) {
  return cn(PAGE_CONTAINER, ...extra);
}
