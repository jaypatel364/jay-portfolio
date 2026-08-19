export const RESUME_OPEN_EVENT = "portfolio:open-resume";

/** Opens the in-site PDF viewer. Safe to call from any client handler. */
export function openResumeViewer() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(RESUME_OPEN_EVENT));
}
