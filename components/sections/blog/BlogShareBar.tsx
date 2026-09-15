"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Mail, Share2 } from "lucide-react";
import { SiFacebook, SiLinkedin, SiWhatsapp, SiX } from "react-icons/si";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type BlogShareBarProps = {
  title: string;
  url: string;
  className?: string;
  compact?: boolean;
};

export function BlogShareBar({ title, url, className, compact }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedBody = encodeURIComponent(`${title}\n\n${url}`);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

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

  const btn = cn(
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border/70",
    "bg-background/50 text-sm font-medium text-muted-foreground",
    "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/[0.07] hover:text-foreground hover:shadow-sm",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
    compact ? "w-10 px-0" : "px-3",
  );

  const targets = [
    {
      id: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <SiX className="h-3.5 w-3.5" aria-hidden />,
      className: "hover:border-foreground/30 hover:bg-foreground/[0.06]",
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
  ] as const;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {!compact ? (
        <p className="mr-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Share
        </p>
      ) : null}

      {canNativeShare ? (
        <button
          type="button"
          onClick={shareNative}
          className={cn(btn, "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15")}
          aria-label="Share"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden />
          {!compact ? <span>Share</span> : null}
        </button>
      ) : null}

      {targets.map((target) => (
        <a
          key={target.id}
          href={target.href}
          target={target.id === "email" ? undefined : "_blank"}
          rel={target.id === "email" ? undefined : "noopener noreferrer"}
          className={cn(btn, target.className)}
          aria-label={`Share on ${target.label}`}
        >
          {target.icon}
          {!compact ? <span>{target.label}</span> : null}
        </a>
      ))}

      <button
        type="button"
        onClick={copy}
        className={cn(
          btn,
          copied && "border-primary/40 bg-primary/10 text-primary hover:text-primary",
        )}
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
        ) : (
          <Link2 className="h-3.5 w-3.5" aria-hidden />
        )}
        {!compact ? <span>{copied ? "Copied" : "Copy"}</span> : null}
      </button>
    </div>
  );
}
