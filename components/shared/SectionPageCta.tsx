import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionPageCtaProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/** Keyword-rich link from a homepage section to its full inner page. */
export function SectionPageCta({ href, children, className }: SectionPageCtaProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full border border-border bg-card",
        "px-5 py-2.5 text-sm font-semibold text-foreground",
        "transition-all duration-200 hover:border-primary/35 hover:bg-primary/5 hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
    >
      {children}
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
