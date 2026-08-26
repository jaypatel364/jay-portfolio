import type { PortableTextBlock } from "@portabletext/types";

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function blockPlainText(block: PortableTextBlock): string {
  const children = (block as { children?: Array<{ text?: string }> }).children;
  if (!Array.isArray(children)) return "";
  return children
    .map((child) => child.text ?? "")
    .join("")
    .trim();
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Stable id for a Portable Text heading block (used by TOC + anchors). */
export function headingIdFromBlock(block: PortableTextBlock): string {
  const text = blockPlainText(block);
  const fromText = slugifyHeading(text);
  if (fromText) return fromText;
  return `section-${block._key || "heading"}`;
}

/**
 * Table of contents for developer posts.
 * Only h2/h3 — skip if fewer than 2 headings (short notes don't need a TOC).
 */
export function extractToc(body: PortableTextBlock[] | null | undefined): TocHeading[] {
  if (!body?.length) return [];

  const headings: TocHeading[] = [];
  for (const block of body) {
    if (block._type !== "block") continue;
    const style = (block as { style?: string }).style;
    if (style !== "h2" && style !== "h3") continue;
    const text = blockPlainText(block);
    if (!text) continue;
    headings.push({
      id: headingIdFromBlock(block),
      text,
      level: style === "h2" ? 2 : 3,
    });
  }

  return headings.length >= 2 ? headings : [];
}
