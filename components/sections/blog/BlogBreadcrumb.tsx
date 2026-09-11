import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogBreadcrumbProps {
  post: Pick<{ slug: string; title: string }, "slug" | "title">;
  className?: string;
}

/** Semantic breadcrumb: Home → Blog → Post */
export function BlogBreadcrumb({ post, className }: BlogBreadcrumbProps) {
  const items: { label: string; href: string; current?: boolean }[] = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog/" },
    { label: post.title, href: `/blog/${post.slug}/`, current: true },
  ];

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-8", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={item.href} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />}
            {item.current ? (
              <span
                className="truncate font-medium text-foreground/80"
                aria-current="page"
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="shrink-0 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
