"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, Heart, Link2, Mail, Share2 } from "lucide-react";
import { SiFacebook, SiLinkedin, SiWhatsapp, SiX } from "react-icons/si";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type BlogArticleEngagementBarProps = {
  title: string;
  url: string;
  className?: string;
};

type ShareTarget = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  className: string;
};

export function BlogArticleEngagementBar({ title, url, className }: BlogArticleEngagementBarProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedBody = encodeURIComponent(`${title}\n\n${url}`);

  useEffect(() => {
    try {
      setLiked(window.localStorage.getItem(`blog-liked:${url}`) === "1");
    } catch {
      /* ignore */
    }
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, [url]);

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(`blog-liked:${url}`, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      if (next) toast.success("Thanks for the support");
      return next;
    });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const shareNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url, text: title });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await copy();
  };

  const targets: ShareTarget[] = [
    {
      id: "x",
      label: "Post on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <SiX className="h-3.5 w-3.5" aria-hidden />,
      className: "hover:border-foreground/30 hover:bg-foreground/[0.06] hover:text-foreground",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <SiLinkedin className="h-3.5 w-3.5" aria-hidden />,
      className: "hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedBody}`,
      icon: <SiWhatsapp className="h-3.5 w-3.5" aria-hidden />,
      className: "hover:border-[#25D366]/40 hover:bg-[#25D366]/10 hover:text-[#25D366]",
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <SiFacebook className="h-3.5 w-3.5" aria-hidden />,
      className: "hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
    },
    {
      id: "email",
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedBody}`,
      icon: <Mail className="h-3.5 w-3.5" aria-hidden />,
      className: "hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
    },
  ];

  const actionBtn =
    "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]";

  return (
    <div
      className={cn(
        "relative mt-10 overflow-hidden rounded-3xl border border-border/70",
        "bg-gradient-to-br from-card/90 via-card/70 to-primary/[0.06]",
        "shadow-premium backdrop-blur-sm",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-10 h-40 w-40 rounded-full bg-glow/20 blur-3xl"
        aria-hidden
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
            <div
              className={cn(
                "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                "border border-primary/25 bg-primary/10 shadow-[0_8px_28px_-8px_color-mix(in_oklch,var(--primary)_45%,transparent)]",
                liked && "border-primary/40 bg-primary/15",
              )}
              aria-hidden
            >
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-md" />
              <Heart
                className={cn(
                  "relative h-5 w-5 transition-transform duration-300",
                  liked ? "scale-110 fill-primary text-primary" : "text-primary",
                )}
              />
            </div>
            <div className="min-w-0">
              <p className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg">
                Found this article helpful?
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Like it or share it with someone who would benefit.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0 sm:justify-end">
            <button
              type="button"
              onClick={toggleLike}
              className={cn(
                actionBtn,
                liked
                  ? "border-primary/45 bg-primary/15 text-primary shadow-[0_0_24px_-8px_color-mix(in_oklch,var(--primary)_50%,transparent)]"
                  : "border-border/70 bg-background/50 text-foreground hover:border-primary/35 hover:bg-primary/[0.07] hover:text-primary",
              )}
              aria-pressed={liked}
              aria-label={liked ? "Unlike article" : "Like article"}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-primary")} aria-hidden />
              <span>{liked ? "Liked" : "Like"}</span>
            </button>

            <button
              type="button"
              onClick={shareNative}
              className={cn(
                actionBtn,
                "border-primary/30 bg-primary text-primary-foreground shadow-glow hover:brightness-110",
              )}
              aria-label={canNativeShare ? "Share article" : "Copy article link"}
            >
              <Share2 className="h-4 w-4" aria-hidden />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="relative mt-5 border-t border-border/60 pt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Share via
            </p>
            <button
              type="button"
              onClick={copy}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                copied
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/70 bg-background/40 text-muted-foreground hover:border-primary/35 hover:text-foreground",
              )}
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <Link2 className="h-3.5 w-3.5" aria-hidden />
              )}
              <span>{copied ? "Copied" : "Copy link"}</span>
            </button>
          </div>

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {targets.map((target) => (
              <li key={target.id}>
                <a
                  href={target.href}
                  target={target.id === "email" ? undefined : "_blank"}
                  rel={target.id === "email" ? undefined : "noopener noreferrer"}
                  className={cn(
                    "group flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-border/70",
                    "bg-background/45 text-sm font-medium text-muted-foreground",
                    "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    target.className,
                  )}
                  aria-label={`Share on ${target.label}`}
                >
                  <span className="transition-transform duration-200 group-hover:scale-110">
                    {target.icon}
                  </span>
                  <span>{target.label === "Post on X" ? "X" : target.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
