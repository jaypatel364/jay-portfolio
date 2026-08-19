"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { cn, publicAssetPath } from "@/lib/utils";

interface ProfileImageProps {
  className?: string;
  priority?: boolean;
  size?: "md" | "lg";
}

export function ProfileImage({ className, priority = false, size = "lg" }: ProfileImageProps) {
  const reducedMotion = useReducedMotion();
  const raw = siteConfig.profileImage;
  const src = raw ? publicAssetPath(raw) : null;
  const hasPhoto = Boolean(src);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative pb-4", className)}
    >
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-3xl border-2 border-primary/25 bg-card shadow-premium",
          size === "lg"
            ? "aspect-[4/5] min-h-[280px] w-full"
            : "aspect-square min-h-[200px] w-full",
        )}
      >
        {/* Decorative layers — only when no photo (avoid washing out the portrait) */}
        {!hasPhoto && (
          <>
            <div
              className="pointer-events-none absolute inset-0 z-0 bg-grid opacity-25"
              aria-hidden
            />
            <div
              className="aurora-blob pointer-events-none absolute -left-8 top-0 z-0 h-32 w-32 bg-primary opacity-60"
              aria-hidden
            />
            <div
              className="aurora-blob pointer-events-none absolute -bottom-6 right-0 z-0 h-28 w-28 bg-glow opacity-60"
              aria-hidden
            />
          </>
        )}

        {hasPhoto && src ? (
          <Image
            src={src}
            alt={`${siteConfig.fullName} — Full Stack Developer`}
            fill
            priority={priority}
            className="z-10 object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 480px"
          />
        ) : (
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
            <span className="flex h-24 w-24 items-center justify-center rounded-3xl gradient-primary text-4xl font-bold text-primary-foreground shadow-glow sm:h-28 sm:w-28 sm:text-5xl">
              {siteConfig.name.charAt(0)}
            </span>
            <p className="font-heading mt-5 text-xl font-bold">{siteConfig.fullName}</p>
            <p className="mt-1 text-sm text-muted-foreground">Full Stack Developer</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-primary/20 bg-background/95 px-4 py-2 text-xs font-semibold text-primary shadow-lg backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        Available for work
      </div>
    </motion.div>
  );
}
