"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import React from "react";
import { BOOT_LINES, buildOutput, type OutputLine } from "./terminal-commands";

function TerminalBlock() {
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);
  const [bootStep, setBootStep] = useState(0);
  const [booted, setBooted] = useState(false);
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [cursorOn, setCursorOn] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Boot: one line per 300 ms (skipped when reduced motion)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBootStep(BOOT_LINES.length);
      setBooted(true);
      return;
    }
    if (bootStep < BOOT_LINES.length) {
      const t = setTimeout(() => setBootStep((s) => s + 1), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBooted(true), 200);
    return () => clearTimeout(t);
  }, [bootStep]);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Scroll terminal body to bottom — scoped, never affects page
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [history, bootStep, booted]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    if (cmd.toLowerCase() === "clear") {
      setHistory([]);
      setInput("");
      return;
    }
    const out = buildOutput(cmd, expLabel, runCommand);
    setHistory((h) => [...h, { type: "input", text: cmd }, ...out]);
    if (cmd) setCmdHistory((h) => [cmd, ...h]);
    setHistoryIdx(-1);
    setInput("");
    const sideEffect = out.find(
      (l) =>
        l.type === "output" &&
        (l as { type: "output"; nodes: React.ReactNode[]; _sideEffect?: string })._sideEffect,
    );
    if (
      sideEffect &&
      (sideEffect as { type: "output"; nodes: React.ReactNode[]; _sideEffect?: string })
        ._sideEffect === "contact"
    ) {
      setTimeout(() => window.location.assign("/contact/"), 800);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIdx - 1;
      if (next < 0) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(next);
        setInput(cmdHistory[next] ?? "");
      }
    } else if (e.ctrlKey && e.key === "c") {
      setInput("");
      setHistory((h) => [...h, { type: "input", text: `${input}^C` }]);
    } else if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-premium cursor-text"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
        </div>
        <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Terminal className="h-3 w-3" />
          jay@portfolio ~ zsh
        </span>
        <span className="w-14" />
      </div>

      {/* Body — fixed height prevents layout shift as boot lines appear */}
      <div
        ref={bodyRef}
        className="h-64 lg:h-[21rem] overflow-y-auto p-4 font-mono text-sm"
        style={{ scrollbarWidth: "none" }}
        onWheel={(e) => {
          const el = bodyRef.current;
          if (!el) return;
          const atTop = el.scrollTop === 0 && e.deltaY < 0;
          const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;
          if (!atTop && !atBottom) e.stopPropagation();
        }}
      >
        {BOOT_LINES.slice(0, bootStep).map((l, i) => (
          <div key={`b${i}`} className={cn("leading-relaxed", l.color)}>
            {l.text}
          </div>
        ))}
        {booted && <div className="h-2" />}
        {booted &&
          history.map((line, i) => {
            if (line.type === "input")
              return (
                <div key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="select-none text-primary/30 shrink-0 text-xs mt-0.5">$</span>
                  <span className="text-foreground/70 break-all">{line.text}</span>
                </div>
              );
            if (line.type === "output")
              return (
                <div
                  key={i}
                  className="ml-5 mt-0.5 mb-3 space-y-0.5 leading-relaxed text-foreground/80"
                >
                  {line.nodes}
                </div>
              );
            if (line.type === "error")
              return (
                <div key={i} className="ml-5 mt-0.5 mb-2 text-red-400/80 leading-relaxed">
                  {line.text}
                </div>
              );
            return null;
          })}
        {booted && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runCommand(input);
            }}
            className="flex items-center gap-2 leading-relaxed mt-1"
          >
            <span className="select-none text-primary/50 shrink-0">❯</span>
            <span className="relative flex-1 flex items-center min-w-0">
              <span className="text-foreground whitespace-pre">{input}</span>
              <span
                className={cn(
                  "inline-block h-[1.05em] w-[0.5em] rounded-[2px] bg-primary ml-px shrink-0 transition-opacity duration-75",
                  cursorOn ? "opacity-100" : "opacity-0",
                )}
              />
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="fixed top-[-9999px] left-[-9999px] h-px w-px border-0 bg-transparent p-0 text-transparent outline-none pointer-events-none opacity-0"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="text"
              enterKeyHint="send"
              aria-label="Terminal input"
              tabIndex={-1}
            />
          </form>
        )}
      </div>

      {booted && (
        <div className="border-t border-border/40 px-4 py-2 font-mono text-[10px] text-muted-foreground text-center select-none">
          click · type a command · try "neofetch" · ↑↓ history
        </div>
      )}
    </div>
  );
}

export { TerminalBlock };
