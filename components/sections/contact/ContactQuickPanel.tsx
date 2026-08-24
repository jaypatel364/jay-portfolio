"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  Clock,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { CopyEmail } from "@/components/shared";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { ContactProfileBadges } from "./ContactProfileBadges";

const AVAILABILITY_ICONS: Record<string, LucideIcon> = {
  clock: Clock,
  globe: Globe,
  briefcase: Briefcase,
};

interface ContactQuickPanelProps {
  variant?: "compact" | "full";
  className?: string;
}

function QuickRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 text-sm">{children}</div>
      </div>
    </div>
  );
}

export function ContactQuickPanel({ variant = "full", className }: ContactQuickPanelProps) {
  const copy = siteConfig.contactPage;
  const isFull = variant === "full";
  const activeProfiles = siteConfig.profileLinks.filter((p) => p.href);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className={cn("min-w-0 space-y-6", className)}
      aria-label="Quick contact"
    >
      {isFull ? (
        <p className="text-base leading-relaxed text-muted-foreground">{copy.intro}</p>
      ) : (
        <p className="text-muted-foreground">
          Open to freelance and collaboration — remote or hybrid from India. Email or book a call. I
          reply to every message.
        </p>
      )}

      <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm">
        {isFull ? (
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            {copy.quickContactTitle}
          </h2>
        ) : null}

        <div className="space-y-4">
          <QuickRow icon={Mail} label="Email">
            <CopyEmail email={siteConfig.email} className="text-foreground" />
          </QuickRow>

          {siteConfig.phone ? (
            <QuickRow icon={Phone} label="Phone">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="font-medium transition-colors hover:text-primary"
              >
                {siteConfig.phone}
              </a>
            </QuickRow>
          ) : null}

          <QuickRow icon={MapPin} label="Location">
            <span>{siteConfig.location}</span>
          </QuickRow>

          <QuickRow icon={Calendar} label="Intro call">
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Book 15 minutes
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </a>
          </QuickRow>
        </div>
      </div>

      {isFull ? (
        <ul className="flex flex-wrap gap-2" aria-label="Availability">
          {copy.availability.map(({ icon, text }) => {
            const Icon = AVAILABILITY_ICONS[icon] ?? Clock;
            return (
              <li key={text}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm">
                  <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                  {text}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}

      {activeProfiles.length > 0 ? (
        <ContactProfileBadges
          title={isFull ? copy.profilesTitle : undefined}
          intro={isFull ? copy.profilesIntro : undefined}
          profiles={activeProfiles}
        />
      ) : null}

      {isFull ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Prefer email? Drop me a note at{" "}
          <Link
            href={`mailto:${siteConfig.email}`}
            className="font-medium text-primary hover:underline"
          >
            {siteConfig.email}.
          </Link>{" "}
          It reaches the same inbox as the contact form.{" "}
        </p>
      ) : null}
    </motion.aside>
  );
}
