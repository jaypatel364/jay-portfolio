"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

function youtubeEmbedId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1) || null;
    if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v");
  } catch {
    return null;
  }
  return null;
}

function vimeoEmbedId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("vimeo.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? null;
  } catch {
    return null;
  }
}

function embedSrc(provider: string, url: string): string | null {
  if (provider === "youtube") {
    const id = youtubeEmbedId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (provider === "vimeo") {
    const id = vimeoEmbedId(url);
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (provider === "codepen") {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("codepen.io")) {
        const parts = parsed.pathname.split("/").filter(Boolean);
        if (parts[0] === "pen" && parts[1]) {
          return `https://codepen.io/embed/${parts[1]}?default-tab=result`;
        }
      }
    } catch {
      return null;
    }
  }
  if (provider === "twitter" || provider === "oembed") {
    return url;
  }
  return url;
}

export function BlogEmbedBlock({
  provider,
  url,
  caption,
}: {
  provider?: string;
  url?: string;
  caption?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  if (!provider || !url) return null;
  const src = embedSrc(provider, url);
  if (!src) return null;

  const isYoutube = provider === "youtube";
  const youtubeId = isYoutube ? youtubeEmbedId(url) : null;
  const thumb = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg` : null;
  const needsClickToLoad = isYoutube && thumb;

  return (
    <figure className="mt-10 overflow-hidden rounded-2xl border border-border/70 bg-card/40 shadow-sm">
      <div className="relative aspect-video bg-muted/30">
        {needsClickToLoad && !loaded ? (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group absolute inset-0 flex items-center justify-center"
            aria-label="Play video"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
            <span
              className={cn(
                "relative z-10 flex h-16 w-16 items-center justify-center rounded-full",
                "border border-white/30 bg-white/10 backdrop-blur-sm",
                "transition-transform group-hover:scale-110 group-active:scale-95",
              )}
            >
              <Play className="ml-1 h-7 w-7 fill-white text-white" />
            </span>
          </button>
        ) : (
          <iframe
            src={loaded && isYoutube ? `${src}?autoplay=1` : src}
            title={caption || "Embedded content"}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
      {caption ? (
        <figcaption className="border-t border-border/60 px-5 py-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
