"use client";

import { useMemo, useState } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import { toast } from "sonner";
import {
  highlightCodeLine,
  parseHighlightedLines,
  type CodeTokenType,
} from "@/lib/sanity/syntax-highlight";
import { cn } from "@/lib/utils";

const LANG_LABEL: Record<string, string> = {
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  tsx: "TSX",
  jsx: "JSX",
  bash: "Shell",
  sh: "Shell",
  shell: "Shell",
  json: "JSON",
  groq: "GROQ",
  css: "CSS",
  html: "HTML",
  sql: "SQL",
  python: "Python",
  markdown: "Markdown",
  text: "Plain text",
};

function languageLabel(language?: string): string | undefined {
  if (!language) return undefined;
  return LANG_LABEL[language.toLowerCase()] ?? language.toUpperCase();
}

const TOKEN_CLASS: Record<CodeTokenType, string> = {
  keyword: "text-[var(--code-keyword)]",
  string: "text-[var(--code-string)]",
  comment: "text-[var(--code-comment)] italic",
  number: "text-[var(--code-number)]",
  function: "text-[var(--code-function)]",
  type: "text-[var(--code-type)]",
  tag: "text-[var(--code-tag)]",
  attr: "text-[var(--code-attr)]",
  operator: "text-[var(--code-operator)]",
  plain: "text-[var(--code-fg)]",
};

function HighlightedLine({ line, language }: { line: string; language?: string }) {
  const tokens = useMemo(() => highlightCodeLine(line, language), [line, language]);
  return (
    <>
      {tokens.map((token, index) => (
        <span key={index} className={TOKEN_CLASS[token.type]}>
          {token.text}
        </span>
      ))}
    </>
  );
}

export function BlogCodeBlock({
  code,
  filename,
  language,
  showLineNumbers,
  highlightedLines,
}: {
  code?: string;
  filename?: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightedLines?: string;
}) {
  const [copied, setCopied] = useState(false);
  const lines = code?.split("\n") ?? [];
  const highlightSet = useMemo(() => parseHighlightedLines(highlightedLines), [highlightedLines]);
  const label = languageLabel(language);
  const displayName = filename || "snippet";
  const withLineNumbers = showLineNumbers ?? false;

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Copied to clipboard", { description: displayName, duration: 2500 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy", { description: "Please copy manually." });
    }
  };

  return (
    <figure
      className={cn(
        "group/code mt-8 overflow-hidden rounded-2xl border shadow-premium",
        "border-[var(--code-border)] bg-[var(--code-bg)]",
        "[--code-bg:#f6f8fa] [--code-border:#d0d7de] [--code-fg:#24292f]",
        "[--code-keyword:#cf222e] [--code-string:#0a3069] [--code-comment:#6e7781]",
        "[--code-number:#0550ae] [--code-function:#8250df] [--code-type:#953800]",
        "[--code-tag:#116329] [--code-attr:#953800] [--code-operator:#57606a]",
        "[--code-gutter:#6e7781] [--code-gutter-bg:#eef1f4] [--code-highlight:rgba(84,174,255,0.18)]",
        "dark:[--code-bg:#1e1e1e] dark:[--code-border:#3c3c3c] dark:[--code-fg:#d4d4d4]",
        "dark:[--code-keyword:#569cd6] dark:[--code-string:#ce9178] dark:[--code-comment:#6a9955]",
        "dark:[--code-number:#b5cea8] dark:[--code-function:#dcdcaa] dark:[--code-type:#4ec9b0]",
        "dark:[--code-tag:#569cd6] dark:[--code-attr:#9cdcfe] dark:[--code-operator:#d4d4d4]",
        "dark:[--code-gutter:#858585] dark:[--code-gutter-bg:#252526] dark:[--code-highlight:rgba(83,140,255,0.14)]",
      )}
    >
      <figcaption className="flex items-center gap-3 border-b border-[var(--code-border)] bg-[var(--code-gutter-bg)] px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <FileCode2 className="h-3.5 w-3.5 shrink-0 text-[var(--code-gutter)]" aria-hidden />
          <span className="truncate font-mono text-xs text-[var(--code-fg)]/70">{displayName}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          {label ? (
            <span className="rounded-full bg-primary/12 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary ring-1 ring-primary/25">
              {label}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[11px] font-medium transition-all",
              copied
                ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-[var(--code-border)] bg-[var(--code-bg)] text-[var(--code-gutter)] hover:border-[var(--code-fg)]/20 hover:text-[var(--code-fg)]",
            )}
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </figcaption>

      <div className="relative overflow-x-auto">
        <pre className="p-4 text-[13px] leading-[1.7] sm:p-5 sm:text-sm">
          <code className="block min-w-full font-mono">
            {withLineNumbers
              ? lines.map((line, index) => {
                  const lineNum = index + 1;
                  const highlighted = highlightSet.has(lineNum);
                  return (
                    <span
                      key={index}
                      className={cn(
                        "table w-full table-fixed",
                        highlighted && "bg-[var(--code-highlight)]",
                      )}
                    >
                      <span
                        className={cn(
                          "table-cell w-10 select-none pr-4 text-right align-top font-mono text-[11px] tabular-nums",
                          highlighted ? "text-primary" : "text-[var(--code-gutter)]",
                        )}
                        aria-hidden
                      >
                        {lineNum}
                      </span>
                      <span className="table-cell whitespace-pre-wrap break-words align-top">
                        <HighlightedLine line={line} language={language} />
                      </span>
                    </span>
                  );
                })
              : lines.map((line, index) => (
                  <span key={index} className="block whitespace-pre-wrap break-words">
                    <HighlightedLine line={line} language={language} />
                  </span>
                ))}
          </code>
        </pre>
      </div>
    </figure>
  );
}
