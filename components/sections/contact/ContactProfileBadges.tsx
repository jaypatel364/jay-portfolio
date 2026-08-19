"use client";

import { ExternalLink } from "lucide-react";
import type { ProfileLink } from "@/settings/types";
import { cn } from "@/lib/utils";

function ProfileIcon({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case "linkedin":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "github":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case "upwork":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.561 13.158c-1.102 0-2.135.467-3.074 1.227l.228-1.076.007-.034c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.702 1.228 2.702 2.742 0 1.512-1.21 2.201-2.702 2.201zm-9.197 4.034c-2.503 0-3.801-1.745-3.801-4.605 0-2.861 1.298-4.605 3.801-4.605 1.148 0 2.087.378 2.799 1.032l-.466 2.201c-.678-.612-1.416-.934-2.233-.934-1.335 0-2.233 1.012-2.233 2.768 0 1.757.898 2.769 2.233 2.769.817 0 1.555-.322 2.233-.934l.466 2.201c-.712.654-1.651 1.032-2.799 1.032zm11.636 0c-2.503 0-3.801-1.745-3.801-4.605 0-2.861 1.298-4.605 3.801-4.605 1.148 0 2.087.378 2.799 1.032l-.466 2.201c-.678-.612-1.416-.934-2.233-.934-1.335 0-2.233 1.012-2.233 2.768 0 1.757.898 2.769 2.233 2.769.817 0 1.555-.322 2.233-.934l.466 2.201c-.712.654-1.651 1.032-2.799 1.032zM6.364 6.364h3.273v11.272H6.364V6.364z" />
        </svg>
      );
    case "freelancer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M14.096 3.064 8.816 8.343 5.904 5.43l-1.768 1.768 2.912 2.912L3.136 13.02l1.768 1.768 4.28-4.28 2.912 2.912 1.768-1.768-2.912-2.912 5.28-5.28-1.768-1.768zm5.904 0-5.28 5.28 2.912 2.912-1.768 1.768-2.912-2.912-4.28 4.28 1.768 1.768 4.28-4.28 2.912 2.912 1.768-1.768-2.912-2.912 5.28-5.28-1.768-1.768z" />
        </svg>
      );
    default:
      return (
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center text-[10px] font-bold",
            className,
          )}
          aria-hidden
        >
          {id.slice(0, 1).toUpperCase()}
        </span>
      );
  }
}

interface ContactProfileBadgesProps {
  profiles: ProfileLink[];
  title?: string;
  intro?: string;
  className?: string;
}

export function ContactProfileBadges({
  profiles,
  title,
  intro,
  className,
}: ContactProfileBadgesProps) {
  const visible = profiles.filter((p) => p.href);
  if (visible.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {title ? (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">{title}</h2>
          {intro ? (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</p>
          ) : null}
        </div>
      ) : null}

      <ul className="grid gap-2 sm:grid-cols-2">
        {visible.map((profile) => (
          <li key={profile.id}>
            <a
              href={profile.href!}
              target="_blank"
              rel="noopener noreferrer me"
              className="group flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3.5 py-3 transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ProfileIcon id={profile.id} className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  {profile.label}
                  <ExternalLink
                    className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60"
                    aria-hidden
                  />
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {profile.tagline}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
