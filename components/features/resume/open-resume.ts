export const RESUME_OPEN_EVENT = "portfolio:open-resume";

let pendingOpen = false;

/** Opens the in-site PDF viewer. Safe to call from any client handler. */
export function openResumeViewer() {
  if (typeof window === "undefined") return;
  pendingOpen = true;
  window.dispatchEvent(new Event(RESUME_OPEN_EVENT));
}

/** ResumeViewer reads this once on mount so opens aren't lost before the chunk loads. */
export function consumePendingResumeOpen() {
  const shouldOpen = pendingOpen;
  pendingOpen = false;
  return shouldOpen;
}
