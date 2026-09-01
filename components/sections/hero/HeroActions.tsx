"use client";

import { ArrowRight, Download } from "lucide-react";
import { SiteButton } from "@/components/shared";
import { openResumeViewer } from "@/components/features/resume";

/** Client island — the resume viewer needs a handler; the contact CTA rides along. */
export function HeroActions() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
      <SiteButton
        onClick={openResumeViewer}
        className="w-full px-8 py-4 sm:w-auto cursor-pointer"
        aria-label="View Jay Patel's resume"
      >
        <Download className="h-4 w-4" aria-hidden />
        View Resume
      </SiteButton>

      <SiteButton
        href="/contact/"
        variant="secondary"
        className="group w-full rounded-full px-8 py-4 sm:w-auto"
      >
        Let&apos;s Work Together
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        />
      </SiteButton>
    </div>
  );
}
