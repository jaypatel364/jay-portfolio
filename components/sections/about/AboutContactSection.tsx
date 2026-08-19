"use client";

import { motion } from "framer-motion";
import { Calendar, Mail, MapPin } from "lucide-react";
import { ProfileImage } from "@/components/shared/ProfileImage";
import { CopyEmail } from "@/components/shared";
import { siteConfig } from "@/lib/site-config";
import { innerPages } from "@/settings/pages";
import { ContactForm } from "@/components/sections/contact/ContactForm";

export function AboutContactSection() {
  const copy = innerPages.about.contactSection;

  return (
    <section id="about-contact" className="relative px-6 py-14 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-2xl"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {copy.label}
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{copy.description}</p>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1">
            <div className="mb-6 space-y-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <CopyEmail email={siteConfig.email} className="text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm">{siteConfig.location}</span>
              </div>
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                <Calendar className="h-4 w-4" />
                Book a 15-min intro call
              </a>
            </div>
            <ContactForm idPrefix="about-contact" />
          </div>

          <div className="order-1 w-full min-w-0 lg:order-2 lg:sticky lg:top-28 lg:self-start">
            <ProfileImage priority />
          </div>
        </div>
      </div>
    </section>
  );
}
