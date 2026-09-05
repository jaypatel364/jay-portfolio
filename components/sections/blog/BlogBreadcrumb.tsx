import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BlogBreadcrumbProps {
  post: Pick<{ slug: string; title: string }, "slug" | "title">;
}

/** Semantic breadcrumb: Home → Blog → Post */
export function BlogBreadcrumb({ post }: BlogBreadcrumbProps) {
  const items: { label: string; href: string; current?: boolean }[] = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog/" },
    { label: post.title, href: `/blog/${post.slug}/`, current: true },
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />}
            {item.current ? (
              <span className="font-medium text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
