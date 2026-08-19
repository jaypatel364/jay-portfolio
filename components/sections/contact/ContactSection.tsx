"use client";

import { SectionHeading, SectionPageCta } from "@/components/shared";
import { innerPages } from "@/settings/pages";
import { cn } from "@/lib/utils";
import { ContactForm } from "./ContactForm";
import { ContactQuickPanel } from "./ContactQuickPanel";

interface ContactSectionProps {
  showHeading?: boolean;
  showPageCta?: boolean;
  className?: string;
}

export function ContactSection({
  showHeading = true,
  showPageCta = true,
  className,
}: ContactSectionProps) {
  return (
    <section id="contact" className={cn("px-6 py-14 md:py-28", className)}>
      <div className="mx-auto max-w-6xl">
        {showHeading ? <SectionHeading label="Contact" title="Work with Jay" /> : null}

        <div className={cn("grid gap-12 lg:grid-cols-5", showHeading ? "mt-16" : "mt-0")}>
          <ContactQuickPanel variant="compact" className="lg:col-span-2" />
          <ContactForm idPrefix="home-contact" className="lg:col-span-3" />
        </div>

        {showPageCta ? (
          <div className="mt-10 flex justify-center">
            <SectionPageCta href={`${innerPages.contact.path}/`}>
              {innerPages.contact.homeCta}
            </SectionPageCta>
          </div>
        ) : null}
      </div>
    </section>
  );
}
