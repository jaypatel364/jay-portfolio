"use client";

export function ResumePrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0" aria-hidden>
        <path
          d="M7.5 1v9m0 0L4 6.5m3.5 3.5L11 6.5M2 12.5h11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Save as PDF
    </button>
  );
}
