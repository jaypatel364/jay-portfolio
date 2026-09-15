import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { cn } from "@/lib/utils";

export function BlogTableBlock({
  rows,
  headerRows = 1,
  inlineComponents,
}: {
  rows: Array<{ cells?: Array<{ value?: PortableTextBlock[] }> }>;
  headerRows?: number;
  inlineComponents: PortableTextComponents;
}) {
  if (!rows.length) return null;

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-border/70 bg-card/30 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "border-b border-border/50 transition-colors last:border-0",
                  rowIndex >= headerRows && rowIndex % 2 === 1 && "bg-muted/20",
                  rowIndex >= headerRows && "hover:bg-primary/[0.03]",
                )}
              >
                {row.cells?.map((cell, cellIndex) => {
                  const Tag = rowIndex < headerRows ? "th" : "td";
                  return (
                    <Tag
                      key={cellIndex}
                      className={cn(
                        "px-5 py-3.5 text-left align-top",
                        rowIndex < headerRows
                          ? "bg-muted/40 font-heading text-xs font-bold uppercase tracking-wider text-foreground"
                          : "text-[0.95rem] leading-relaxed text-foreground/85",
                      )}
                    >
                      {cell.value?.length ? (
                        <PortableText value={cell.value} components={inlineComponents} />
                      ) : null}
                    </Tag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
