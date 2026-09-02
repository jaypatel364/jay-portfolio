import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type PortableTextComponents, type PortableTextBlockComponent } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { headingIdFromBlock } from "@/lib/sanity/headings";
import { cn } from "@/lib/utils";
import {
  BlogCallout,
  BlogCodeBlock,
  BlogCtaBlock,
  BlogDividerBlock,
  BlogEmbedBlock,
  BlogFaqBlock,
  BlogGalleryBlock,
  BlogImageBlock,
  BlogQuoteBlock,
  BlogStatsBlock,
  BlogTableBlock,
  BlogTocBlock,
} from "./blocks";

const h2: PortableTextBlockComponent = ({ children, value }) => (
  <h2
    id={value ? headingIdFromBlock(value as PortableTextBlock) : undefined}
    className="font-heading mt-14 scroll-mt-28 text-[1.65rem] font-bold tracking-tight text-foreground first:mt-0 sm:text-3xl"
  >
    <span className="relative">
      {children}
      <span
        className="absolute -bottom-1 left-0 h-[3px] w-12 rounded-full bg-primary/40"
        aria-hidden
      />
    </span>
  </h2>
);

const h3: PortableTextBlockComponent = ({ children, value }) => (
  <h3
    id={value ? headingIdFromBlock(value as PortableTextBlock) : undefined}
    className="font-heading mt-10 scroll-mt-28 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
  >
    {children}
  </h3>
);

const h4: PortableTextBlockComponent = ({ children, value }) => (
  <h4
    id={value ? headingIdFromBlock(value as PortableTextBlock) : undefined}
    className="font-heading mt-8 scroll-mt-28 text-lg font-semibold tracking-tight text-foreground sm:text-xl"
  >
    {children}
  </h4>
);

/** Minimal inline renderer for table cells and callout bodies. */
export const inlineComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <span>{children}</span>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline underline-offset-2">{children}</span>,
    "strike-through": ({ children }) => (
      <span className="text-muted-foreground line-through">{children}</span>
    ),
    strikethrough: ({ children }) => (
      <span className="text-muted-foreground line-through">{children}</span>
    ),
    code: ({ children }) => (
      <code className="rounded border border-border/60 bg-muted/80 px-1 py-0.5 font-mono text-[0.86em]">
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
          className="font-medium text-primary underline underline-offset-2"
          {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

function resolveInternalHref(reference: { _type?: string; slug?: string | null }): string | null {
  if (!reference?.slug) return null;
  if (reference._type === "post") return `/blog/${reference.slug}/`;
  return `/${reference.slug}/`;
}

function stripUnsafeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2,
    h3,
    h4,
    normal: ({ children }) => (
      <p className="mt-5 text-[1.05rem] leading-[1.8] text-foreground/85 first:mt-0 sm:text-[1.125rem] sm:leading-[1.85]">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="relative mt-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-transparent py-5 pl-6 pr-5 text-[1.05rem] leading-relaxed text-foreground/90 italic sm:pl-7">
        <span
          className="absolute left-0 top-4 h-[calc(100%-2rem)] w-[3px] rounded-full bg-primary/50"
          aria-hidden
        />
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 space-y-2.5 pl-0 text-[1.05rem] leading-relaxed text-foreground/85 sm:text-[1.125rem] [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.65em] [&>li]:before:h-1.5 [&>li]:before:w-1.5 [&>li]:before:rounded-full [&>li]:before:bg-primary">
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
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <span className="underline decoration-primary/40 underline-offset-[3px]">{children}</span>
    ),
    "strike-through": ({ children }) => (
      <span className="text-muted-foreground line-through">{children}</span>
    ),
    strikethrough: ({ children }) => (
      <span className="text-muted-foreground line-through">{children}</span>
    ),
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
    internalLink: ({ children, value }) => {
      const href = resolveInternalHref(
        (value?.reference as { _type?: string; slug?: string | null }) ?? {},
      );
      if (!href) return <>{children}</>;
      return (
        <Link
          href={href}
          className="inline-flex items-center gap-0.5 font-medium text-primary underline decoration-primary/35 underline-offset-[3px] transition-colors hover:decoration-primary"
        >
          {children}
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
        </Link>
      );
    },
  },
  types: {
    code: ({ value }) => (
      <BlogCodeBlock
        code={value?.code as string | undefined}
        filename={value?.filename as string | undefined}
        language={value?.language as string | undefined}
      />
    ),
    codeBlock: ({ value }) => (
      <BlogCodeBlock
        code={value?.code as string | undefined}
        filename={value?.filename as string | undefined}
        language={value?.language as string | undefined}
        showLineNumbers={value?.showLineNumbers !== false}
        highlightedLines={value?.highlightedLines as string | undefined}
      />
    ),
    imageBlock: ({ value }) => (
      <BlogImageBlock
        image={value?.image}
        alt={value?.alt as string | undefined}
        caption={value?.caption as string | undefined}
        title={value?.title as string | undefined}
        alignment={(value?.alignment as string | undefined) ?? "default"}
        linkUrl={value?.linkUrl as string | undefined}
      />
    ),
    galleryBlock: ({ value }) => (
      <BlogGalleryBlock
        layout={value?.layout as string | undefined}
        images={
          (value?.images as Array<{
            alt?: string;
            caption?: string;
            image?: Parameters<typeof BlogImageBlock>[0]["image"];
          }>) ?? []
        }
      />
    ),
    callout: ({ value }) => (
      <BlogCallout
        title={value?.title as string | undefined}
        body={value?.body as PortableTextBlock[] | undefined}
        tone={(value?.tone as string) || "info"}
        inlineComponents={inlineComponents}
      />
    ),
    quoteBlock: ({ value }) => (
      <BlogQuoteBlock
        text={value?.text as string | undefined}
        author={value?.author as string | undefined}
        source={value?.source as string | undefined}
        sourceUrl={value?.sourceUrl as string | undefined}
        variant={value?.variant as string | undefined}
      />
    ),
    table: ({ value }) => (
      <BlogTableBlock
        rows={(value?.rows as Array<{ cells?: Array<{ value?: PortableTextBlock[] }> }>) ?? []}
        headerRows={Number(value?.headerRows ?? 1)}
        inlineComponents={inlineComponents}
      />
    ),
    statsBlock: ({ value }) => (
      <BlogStatsBlock items={(value?.items as Array<{ label?: string; value?: string }>) ?? []} />
    ),
    faqBlock: ({ value }) => (
      <BlogFaqBlock
        title={value?.title as string | undefined}
        items={(value?.items as Array<{ question?: string; answer?: string }>) ?? []}
      />
    ),
    embedBlock: ({ value }) => (
      <BlogEmbedBlock
        provider={value?.provider as string | undefined}
        url={value?.url as string | undefined}
        caption={value?.caption as string | undefined}
      />
    ),
    dividerBlock: ({ value }) => (
      <BlogDividerBlock style={(value?.style as string | undefined) ?? "line"} />
    ),
    tocBlock: ({ value }) => (
      <BlogTocBlock
        title={(value?.title as string | undefined) ?? "On this page"}
        includeH2={value?.includeH2 !== false}
        includeH3={value?.includeH3 !== false}
        includeH4={Boolean(value?.includeH4)}
      />
    ),
    ctaBlock: ({ value }) => (
      <BlogCtaBlock
        title={value?.title as string | undefined}
        description={value?.description as string | undefined}
        buttonText={value?.buttonText as string | undefined}
        buttonUrl={value?.buttonUrl as string | undefined}
        secondaryButtonText={value?.secondaryButtonText as string | undefined}
        secondaryButtonUrl={value?.secondaryButtonUrl as string | undefined}
        template={(value?.template as string | undefined) ?? "primary"}
        alignment={(value?.alignment as string | undefined) ?? "center"}
      />
    ),
    buttonBlock: ({ value }) => {
      if (!value?.label || !value?.url) return null;
      const external = Boolean(value?.openInNewTab);
      const style = value?.style as string | undefined;
      const className = cn(
        "group mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
        style === "secondary"
          ? "border border-border/70 bg-card/60 text-foreground hover:border-primary/30 hover:bg-card hover:shadow-sm"
          : style === "outline"
            ? "border border-primary/35 bg-transparent text-primary hover:bg-primary/8"
            : "gradient-primary text-primary-foreground shadow-glow hover:scale-[1.02] active:scale-[0.98]",
      );
      if (external) {
        return (
          <a
            href={value.url as string}
            className={className}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value.label as string}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        );
      }
      const href = (value.url as string).startsWith("/") ? (value.url as string) : `/${value.url}`;
      return (
        <Link href={href} className={className}>
          {value.label as string}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      );
    },
    htmlBlock: ({ value }) => {
      const html = value?.html as string | undefined;
      if (!html) return null;
      return (
        <div
          className="mt-6 overflow-hidden rounded-xl border border-border/60 bg-card/40 p-4"
          dangerouslySetInnerHTML={{ __html: stripUnsafeHtml(html) }}
        />
      );
    },
  },
};
