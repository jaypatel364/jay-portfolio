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
        "group inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:border-primary/40 hover:bg-primary/10",
        className,
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}
