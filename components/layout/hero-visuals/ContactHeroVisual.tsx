"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Mail, MapPin } from "lucide-react";
import { CopyEmail } from "@/components/shared";
import { siteConfig } from "@/lib/site-config";
import { HeroVisualFrame } from "./HeroVisualFrame";

function formatIst(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

function istHour(date: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    }).format(date),
  );
  return hour;
}

/** Contact hero — live IST clock plus the fastest ways to reach out. */
export function ContactHeroVisual() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const hour = istHour(now);
  const typicallyOnline = hour >= 9 && hour < 22;

  return (
    <HeroVisualFrame>
      <div className="flex min-h-[280px] flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              India Standard Time
            </p>
            <p className="font-heading mt-1 text-3xl font-bold tabular-nums tracking-tight">
              {formatIst(now)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {typicallyOnline ? "Usually online" : "Replies next morning"}
          </span>
        </div>

        <ul className="mt-5 space-y-3">
          <li className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-3 py-2.5 backdrop-blur-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </p>
              <CopyEmail email={siteConfig.email} className="truncate text-sm font-medium" />
            </div>
          </li>
          <li className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-3 py-2.5 backdrop-blur-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Based
              </p>
              <p className="text-sm font-medium">{siteConfig.location} · remote-friendly</p>
            </div>
          </li>
        </ul>

        <Link
          href={siteConfig.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
        >
          <Calendar className="h-4 w-4" aria-hidden />
          Book a 15-minute call
        </Link>
      </div>
    </HeroVisualFrame>
  );
}
