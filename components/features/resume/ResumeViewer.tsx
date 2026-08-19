"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { RESUME_OPEN_EVENT } from "./open-resume";

export function ResumeViewer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(RESUME_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(RESUME_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!mounted) return null;

  const file = siteConfig.resumeUrl;
  const downloadName = siteConfig.resumeFileName;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="resume-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-md"
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            key="resume-stage"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-viewer-title"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="pointer-events-none fixed inset-0 z-[91] flex items-center justify-center p-2 sm:p-3 lg:p-4"
          >
            <div
              className="pointer-events-auto relative flex h-[min(98vh,1200px)] w-[min(100%,1680px)] flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-premium sm:rounded-2xl">
                <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-3 py-2.5 sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="hidden items-center gap-1.5 sm:flex" aria-hidden>
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    </span>
                    <div className="min-w-0">
                      <p
                        id="resume-viewer-title"
                        className="font-heading truncate text-sm font-semibold text-foreground"
                      >
                        {siteConfig.fullName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">Resume · PDF</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={file}
                      download={downloadName}
                      className="inline-flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-glow sm:px-3.5 sm:text-sm"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden />
                      Download
                    </a>
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 sm:inline-flex sm:text-sm"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      New tab
                    </a>
                    <button
                      ref={closeRef}
                      type="button"
                      onClick={close}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label="Close resume"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="relative min-h-0 flex-1 bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.16_55/0.08),transparent_55%)]">
                  <iframe
                    title={`${siteConfig.fullName} resume PDF`}
                    src={`${file}#zoom=page-width`}
                    className="hidden h-full w-full border-0 bg-background sm:block"
                  />

                  <div className="flex h-full flex-col items-center justify-center gap-5 px-6 py-10 text-center sm:hidden">
                    <div className="relative">
                      <div className="absolute -right-2 -top-2 h-28 w-20 rotate-6 rounded-md border border-border bg-muted" />
                      <div className="relative flex h-32 w-24 items-center justify-center rounded-md border border-border bg-background shadow-lg">
                        <FileText className="h-10 w-10 text-primary" aria-hidden />
                      </div>
                    </div>
                    <div>
                      <p className="font-heading text-lg font-bold">{siteConfig.fullName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Open or download the PDF — preview is desktop-only.
                      </p>
                    </div>
                    <div className="flex w-full max-w-xs flex-col gap-2">
                      <a
                        href={file}
                        download={downloadName}
                        className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                      >
                        <Download className="h-4 w-4" aria-hidden />
                        Download PDF
                      </a>
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold"
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden />
                        Open PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
