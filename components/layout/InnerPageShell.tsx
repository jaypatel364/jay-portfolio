import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageBackLinkProps {
  href?: string;
  label?: string;
}

export function PageBackLink({ href = "/", label = "Back to home" }: PageBackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </Link>
  );
}

interface InnerPageHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export function InnerPageHeader({ label, title, description }: InnerPageHeaderProps) {
  return (
    <header className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-widest text-primary">{label}</span>
      <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}

interface InnerPageShellProps {
  children: React.ReactNode;
}

/** Standard padding + back link wrapper for inner routes inside SiteChrome. */
export function InnerPageShell({ children }: InnerPageShellProps) {
  return (
    <main id="main" className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <PageBackLink />
      <div className="mt-8">{children}</div>
    </main>
  );
}

interface InnerPagePlaceholderProps {
  text: string;
}

export function InnerPagePlaceholder({ text }: InnerPagePlaceholderProps) {
  return (
    <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-premium">
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
