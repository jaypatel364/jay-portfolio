"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { ContactForm } from "./ContactForm";
import { ContactQuickPanel } from "./ContactQuickPanel";

interface ContactPageSectionProps {
  className?: string;
}

export function ContactPageSection({ className }: ContactPageSectionProps) {
  const copy = siteConfig.contactPage;

  return (
    <section
      id="contact-form"
      className={cn("px-4 pb-10 pt-10 sm:px-6 md:pb-14 md:pt-14", className)}
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <div className="grid min-w-0 items-start gap-10 lg:grid-cols-5 lg:gap-14">
          <ContactQuickPanel
            variant="full"
            className="lg:col-span-2 lg:sticky lg:top-28 lg:self-start"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="min-w-0 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm sm:p-8 lg:col-span-3"
          >
            <div className="mb-6 max-w-lg">
              <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                {copy.formTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {copy.formIntro}
              </p>
            </div>

            <ContactForm idPrefix="page-contact" showHeader />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
