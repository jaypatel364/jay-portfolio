"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyEmailProps {
  email: string;
  /** Extra classes forwarded to the wrapper button */
  className?: string;
}

/**
 * Renders the email address as a button.
 * On click: copies to clipboard and shows a toast + a transient checkmark.
 */
export function CopyEmail({ email, className }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Copied to clipboard", { description: email, duration: 3000 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard API without user gesture
      toast.error("Could not copy", { description: "Please copy the address manually." });
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={`Copy email address: ${email}`}
      className={cn(
        "group inline-flex items-center gap-1.5 text-sm transition-colors hover:text-primary",
        className,
      )}
    >
      <span>{email}</span>
      <span className="opacity-0 transition-opacity group-hover:opacity-100">
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </span>
    </button>
  );
}
