import Image from "next/image";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlockComponent,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { headingIdFromBlock } from "@/lib/sanity/headings";
import { sanityImageUrl } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";

const h2: PortableTextBlockComponent = ({ children, value }) => (
  <h2
    id={value ? headingIdFromBlock(value as PortableTextBlock) : undefined}
    className="font-heading mt-12 scroll-mt-28 text-[1.65rem] font-bold tracking-tight text-foreground first:mt-0 sm:text-3xl"
  >
    {children}
  </h2>
);

const h3: PortableTextBlockComponent = ({ children, value }) => (
  <h3
    id={value ? headingIdFromBlock(value as PortableTextBlock) : undefined}
    className="font-heading mt-9 scroll-mt-28 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
  >
    {children}
  </h3>
);

const components: PortableTextComponents = {
  block: {
    h2,
    h3,
    normal: ({ children }) => (
      <p className="mt-5 text-[1.05rem] leading-[1.8] text-foreground/85 first:mt-0 sm:text-[1.125rem] sm:leading-[1.85]">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="relative mt-8 rounded-r-xl border-l-[3px] border-primary bg-primary/5 py-4 pl-5 pr-4 text-[1.05rem] leading-relaxed text-foreground/90 italic sm:pl-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2.5 pl-6 text-[1.05rem] leading-relaxed text-foreground/85 marker:text-primary sm:text-[1.125rem]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2.5 pl-6 text-[1.05rem] leading-relaxed text-foreground/85 marker:font-semibold marker:text-primary sm:text-[1.125rem]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded-md border border-border/60 bg-muted/80 px-1.5 py-0.5 font-mono text-[0.86em] text-foreground">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = value?.href as string | undefined;
      const blank = Boolean(value?.blank);
      if (!href) return <>{children}</>;
      return (
        <a
          href={href}
          className="font-medium text-primary underline decoration-primary/35 underline-offset-[3px] transition-colors hover:decoration-primary"
          {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    codeBlock: ({ value }) => (
      <figure className="group mt-8 overflow-hidden rounded-2xl border border-border/70 bg-[#0b0f14] shadow-premium">
        {(value?.filename || value?.language) && (
          <figcaption className="flex items-center justify-between gap-3 border-b border-white/8 bg-white/[0.03] px-4 py-2.5 text-xs text-white/55">
            <span className="truncate font-mono">{value.filename || "snippet"}</span>
            <span className="rounded-md bg-white/5 px-2 py-0.5 font-medium uppercase tracking-wider">
              {value.language}
            </span>
          </figcaption>
        )}
        <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-[#e6edf3] sm:p-5 sm:text-sm">
          <code>{value?.code}</code>
        </pre>
      </figure>
    ),
    imageBlock: ({ value }) => {
      const url = sanityImageUrl(value?.image, 1400);
      if (!url) return null;
      const alt = (value?.alt as string) || "Article image";
      return (
        <figure className="mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-sm">
            <Image
              src={url}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          {value?.caption ? (
            <figcaption className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    callout: ({ value }) => {
      const tone = (value?.tone as string) || "info";
      return (
        <aside
          className={cn(
            "mt-8 rounded-2xl border px-5 py-4 sm:px-6 sm:py-5",
            tone === "warning" && "border-amber-500/35 bg-amber-500/[0.08]",
            tone === "tip" && "border-emerald-500/35 bg-emerald-500/[0.08]",
            tone === "info" && "border-primary/30 bg-primary/[0.07]",
          )}
        >
          {value?.title ? (
            <p className="text-sm font-semibold tracking-tight text-foreground">{value.title}</p>
          ) : null}
          <p
            className={cn(
              "text-[0.98rem] leading-relaxed text-foreground/80",
              value?.title && "mt-1.5",
            )}
          >
            {value?.body}
          </p>
        </aside>
      );
    },
  },
};

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
    <div
      className={cn(
        "min-w-0 [&_>p:first-of-type]:text-[1.2rem] [&_>p:first-of-type]:leading-[1.75] [&_>p:first-of-type]:text-foreground/90",
        className,
      )}
    >
      <PortableText value={value} components={components} />
    </div>
  );
}
