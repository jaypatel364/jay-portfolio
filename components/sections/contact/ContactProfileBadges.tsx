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
    case "twitter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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
          <h2 className="text-sm font-semibold tracking-widest text-primary">{title}</h2>
          {intro ? (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</p>
          ) : null}
        </div>
      ) : null}

      <ul className="grid grid-cols-2 gap-1.5">
        {visible.map((profile) => (
          <li key={profile.id}>
            <a
              href={profile.href!}
              target="_blank"
              rel="noopener noreferrer me"
              className="group flex items-center gap-2 rounded-lg border border-border bg-background/70 px-2.5 py-2 transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ProfileIcon id={profile.id} className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1 text-xs leading-tight">
                <span className="font-semibold text-foreground">{profile.label}</span>
                <span className="text-muted-foreground"> · {profile.tagline}</span>
              </span>
              <ExternalLink
                className="h-3 w-3 shrink-0 text-muted-foreground/50 transition-opacity group-hover:text-muted-foreground"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
