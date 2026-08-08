import { siteConfig } from "@/lib/site-config";

// components/Brand.tsx
export function Brand({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="text-muted-foreground">{"<"}</span>
      <span className="gradient-text font-bold">{siteConfig.name}</span>
      <span className="text-muted-foreground">{" />"}</span>
    </span>
  );
}
