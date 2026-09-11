import { cn } from "@/lib/utils";

export function BlogDividerBlock({ style = "line" }: { style?: string }) {
  if (style === "space") {
    return <div className="my-14" role="separator" aria-hidden />;
  }

  if (style === "dots") {
    return (
      <div className="my-12 flex items-center justify-center gap-2" role="separator">
        <span className="h-1 w-1 rounded-full bg-muted-foreground/35" aria-hidden />
        <span className="h-1.5 w-1.5 rounded-full bg-primary/45" aria-hidden />
        <span className="h-1 w-1 rounded-full bg-muted-foreground/35" aria-hidden />
      </div>
    );
  }

  return (
    <div className="my-12 flex items-center gap-4" role="separator">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <span className="h-1.5 w-1.5 rounded-full bg-primary/40" aria-hidden />
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
