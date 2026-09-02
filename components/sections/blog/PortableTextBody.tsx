import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { cn } from "@/lib/utils";
import { BlogBodyProvider } from "./BlogBodyContext";
import { portableTextComponents } from "./portable-text-components";

export function PortableTextBody({
  value,
  className,
}: {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
}) {
  if (!value?.length) {
    return <p className="text-muted-foreground">This post has no body content yet.</p>;
  }

  return (
    <BlogBodyProvider body={value}>
      <div
        className={cn(
          "min-w-0 [&_>p:first-of-type]:text-[1.2rem] [&_>p:first-of-type]:leading-[1.75] [&_>p:first-of-type]:text-foreground/90",
          className,
        )}
      >
        <PortableText value={value} components={portableTextComponents} />
      </div>
    </BlogBodyProvider>
  );
}
