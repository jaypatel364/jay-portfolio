"use client";

import { useEffect, useRef, useState, useCallback, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Loader2,
  User,
  Bot,
  RotateCcw,
  ChevronDown,
  MessageCircle,
  Zap,
  ArrowUpRight,
  Hash,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  ts: number;
}

// ── Quick chips ───────────────────────────────────────────────────────────────

const CHIP_GROUPS = [
  [
    { icon: "👋", label: "Introduce yourself!" },
    { icon: "⚡", label: "What's your tech stack?" },
    { icon: "🧠", label: "How many years of experience?" },
    { icon: "📍", label: "Where are you based?" },
  ],
  [
    { icon: "🎨", label: "How did you build this portfolio?" },
    { icon: "✨", label: "What's the coolest feature here?" },
    { icon: "🔮", label: "What are you currently learning?" },
    { icon: "🛠️", label: "What are your favourite tools?" },
  ],
  [
    { icon: "💼", label: "Are you available for hire?" },
    { icon: "📬", label: "How can I contact you?" },
    { icon: "🤝", label: "Are you open to freelance?" },
    { icon: "📄", label: "Can I see your resume?" },
  ],
];

// ── User-facing error messages — never show raw API strings ──────────────────
// Maps internal error patterns to friendly messages the user can understand.

function toFriendlyError(raw: string): string {
  const s = raw.toLowerCase();
  if (s.includes("rate limit") || s.includes("429") || s.includes("slow down"))
    return "Getting a lot of questions right now — give me a second and try again 😄";
  if (s.includes("unavailable") || s.includes("503"))
    return "I'm taking a quick break — try again in a moment, or reach Jay directly at pjay99909@gmail.com";
  if (s.includes("too many messages"))
    return "Too many messages in a short time — wait a moment and try again 🙏";
  // Generic fallback — never expose internal details
  return "Something hiccuped on my end 🙈 Try again, or reach Jay at pjay99909@gmail.com";
}
// Known domains get a short human label. Nothing long ever renders in a bubble.

const URL_LABELS: { pattern: RegExp; label: string }[] = [
  { pattern: /linkedin\.com/i, label: "LinkedIn Profile" },
  { pattern: /github\.com\/[^/]+$/i, label: "GitHub Profile" },
  { pattern: /github\.com/i, label: "GitHub" },
  { pattern: /drive\.google\.com/i, label: "Resume (Google Drive)" },
  { pattern: /calendly\.com/i, label: "Book a Call" },
  { pattern: /vercel\.app/i, label: "Live Demo" },
  { pattern: /onrender\.com/i, label: "Live Demo" },
  { pattern: /render\.com/i, label: "Live Demo" },
];

function friendlyLabel(url: string): string {
  for (const { pattern, label } of URL_LABELS) {
    if (pattern.test(url)) return label;
  }
  try {
    const clean = new URL(url).hostname.replace(/^www\./, "");
    return clean.length > 28 ? clean.slice(0, 26) + "…" : clean;
  } catch {
    return "Link";
  }
}

// ── Inline markdown renderer ──────────────────────────────────────────────────

/**
 * renderContent — parses a flat string into React nodes.
 *
 * Supported tokens:
 *   **bold**   → <strong>
 *   `code`     → <code>
 *   https://…  → pill <a> with a friendly label (never raw URL)
 *
 * Consecutive link pills are wrapped in a flex container so they sit
 * 2 px apart and never overflow horizontally.
 */
function renderContent(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/\S+)/g);

  // First pass — convert each token to a React node
  const nodes: React.ReactNode[] = parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-primary/10 px-1 py-0.5 font-mono text-[11px] text-primary border border-primary/20"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("http")) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          // pill style — short label, never raw URL, never overflows
          className="inline-flex items-center gap-0.5 rounded-md border border-primary/25 bg-primary/8 px-1.5 py-0.5 text-[11px] font-medium text-primary no-underline transition-all hover:bg-primary/15 hover:border-primary/40 active:scale-[0.97]"
          data-link-pill
        >
          {friendlyLabel(part)}
          <ArrowUpRight className="h-2.5 w-2.5 shrink-0" />
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });

  // Second pass — group adjacent link pills into a 2px-gap flex row so they
  // never touch each other and never cause horizontal overflow.
  const result: React.ReactNode[] = [];
  let pillBuffer: React.ReactNode[] = [];

  const flushPills = (flushKey: string) => {
    if (pillBuffer.length === 0) return;
    if (pillBuffer.length === 1) {
      result.push(pillBuffer[0]);
    } else {
      result.push(
        <span key={flushKey} className="inline-flex flex-wrap gap-[2px] align-middle">
          {pillBuffer}
        </span>,
      );
    }
    pillBuffer = [];
  };

  nodes.forEach((node, i) => {
    const isLink =
      typeof node === "object" &&
      node !== null &&
      "props" in (node as object) &&
      typeof (node as { props?: Record<string, unknown> }).props === "object" &&
      (node as { props?: Record<string, unknown> }).props?.["data-link-pill"] !== undefined;

    if (isLink) {
      pillBuffer.push(node);
    } else {
      flushPills(`pill-group-${i}`);
      result.push(node);
    }
  });
  flushPills("pill-group-end");

  return result;
}

// ── Typing dots ───────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-[5px] w-[5px] rounded-full bg-muted-foreground/50"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({ msg, isLatest }: { msg: Message; isLatest: boolean }) {
  const isUser = msg.role === "user";
  const time = new Date(msg.ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group flex items-end gap-2", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "gradient-primary text-primary-foreground shadow-glow"
            : "border border-border bg-muted text-muted-foreground",
        )}
      >
        {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
      </div>

      {/* Bubble + timestamp */}
      <div className={cn("flex max-w-[80%] flex-col gap-1", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
            isUser
              ? "gradient-primary text-primary-foreground rounded-br-sm shadow-glow"
              : "border border-border/60 bg-card text-foreground rounded-bl-sm",
          )}
        >
          {msg.streaming && msg.content === "" ? (
            <TypingDots />
          ) : (
            <p className="break-words whitespace-pre-wrap" style={{ overflowWrap: "anywhere" }}>
              {renderContent(msg.content)}
            </p>
          )}
          {msg.streaming && msg.content !== "" && (
            <motion.span
              className="ml-0.5 inline-block h-[13px] w-[2px] rounded-full bg-current align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.55, repeat: Infinity }}
            />
          )}
        </div>
        <span
          className={cn(
            "px-1 text-[10px] text-muted-foreground/40 transition-opacity duration-200",
            isLatest ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          {time}
        </span>
      </div>
    </motion.div>
  );
}

// ── Welcome screen — no scroll, compact ──────────────────────────────────────

function WelcomeScreen({ chipGroup, onChip }: { chipGroup: number; onChip: (s: string) => void }) {
  const chips = CHIP_GROUPS[chipGroup % CHIP_GROUPS.length];

  return (
    <div className="flex flex-col gap-4">
      {/* Identity card */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-transparent to-transparent p-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 28px)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground leading-tight">Jay Patel</p>
            <p className="text-[11px] text-muted-foreground">Full Stack Dev · Ahmedabad, IN</p>
          </div>
          <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-500">Online</span>
          </span>
        </div>
        <p className="relative mt-2.5 text-[12px] leading-relaxed text-muted-foreground">
          Ask me about my stack, how I built this, availability — or anything else.
        </p>
      </div>

      {/* Chips */}
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          <Hash className="h-2.5 w-2.5" />
          Quick questions
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {chips.map((c) => (
            <button
              key={c.label}
              onClick={() => onChip(c.label)}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-left text-[12px] font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground active:scale-[0.98]"
            >
              <span className="shrink-0 text-sm leading-none">{c.icon}</span>
              <span className="leading-tight">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unread, setUnread] = useState(0);
  const [chipGroup] = useState(() => Math.floor(Math.random() * CHIP_GROUPS.length));
  const [showLabel, setShowLabel] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Show the "Chat with Jay" label after a short delay so it catches attention
  useEffect(() => {
    const t = setTimeout(() => setShowLabel(true), 2800);
    return () => clearTimeout(t);
  }, []);
  // Hide label when chat opens
  useEffect(() => {
    if (open) setShowLabel(false);
  }, [open]);

  // ── Scroll ─────────────────────────────────────────────────────────────────
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => scrollToBottom("instant"), 60);
      setUnread(0);
    }
  }, [open, scrollToBottom]);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
  }, []);

  // ── Focus + keyboard ───────────────────────────────────────────────────────
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 160);
  }, [open]);
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  // ── Send ───────────────────────────────────────────────────────────────────
  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      setInput("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        ts: Date.now(),
      };
      const asstMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        streaming: true,
        ts: Date.now(),
      };

      setMessages((p) => [...p, userMsg, asstMsg]);
      setLoading(true);

      const history = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: trimmed },
      ];
      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: abortRef.current.signal,
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          const raw = (d as { error?: string }).error ?? `Error ${res.status}`;
          throw new Error(raw);
        }

        // Off-topic canned reply — JSON response, not a stream
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const d = (await res.json()) as { offTopic?: boolean; reply?: string; error?: string };
          if (d.offTopic && d.reply) {
            setMessages((p) =>
              p.map((m) =>
                m.id === asstMsg.id ? { ...m, content: d.reply!, streaming: false } : m,
              ),
            );
            if (!open) setUnread((n) => n + 1);
            return;
          }
          if (d.error) throw new Error(d.error);
        }

        // Streamed response
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No response stream.");
        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const snap = acc;
          setMessages((p) => p.map((m) => (m.id === asstMsg.id ? { ...m, content: snap } : m)));
        }
        setMessages((p) => p.map((m) => (m.id === asstMsg.id ? { ...m, streaming: false } : m)));
        if (!open) setUnread((n) => n + 1);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          setMessages((p) => p.filter((m) => m.id !== asstMsg.id));
          return;
        }
        const raw = err instanceof Error ? err.message : "";
        setError(toFriendlyError(raw));
        setMessages((p) => p.filter((m) => m.id !== asstMsg.id));
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [loading, messages, open],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 112) + "px";
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setInput("");
    setLoading(false);
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const isEmpty = messages.length === 0;
  // 5 full exchanges (10 msgs) = comfortable read, low input-token cost
  const CONV_LIMIT = 10;
  const isAtLimit = messages.length >= CONV_LIMIT;

  return (
    <>
      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-[88px] right-6 z-50 flex w-[375px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-premium"
            role="dialog"
            aria-label="Chat with Jay"
            aria-modal="true"
          >
            {/* Accent bar */}
            <div className="h-[3px] w-full gradient-primary" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 bg-card px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full gradient-primary shadow-glow">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold leading-none text-foreground">
                      Jay's Assistant
                    </p>
                    <span className="rounded-full border border-primary/25 bg-primary/8 px-1.5 py-[2px] text-[9px] font-semibold uppercase tracking-wide text-primary">
                      AI
                    </span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Zap className="h-2.5 w-2.5 text-primary/60" />
                    {loading ? "Thinking…" : "Ask me anything about Jay"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    title="Clear chat"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  title="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages — no fixed min-height on welcome state */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className={cn("flex flex-col gap-3 px-4 py-4", isEmpty ? "" : "overflow-y-auto")}
              style={isEmpty ? {} : { maxHeight: 380 }}
            >
              {isEmpty ? (
                <WelcomeScreen chipGroup={chipGroup} onChip={send} />
              ) : (
                messages.map((msg, i) => (
                  <MessageBubble key={msg.id} msg={msg} isLatest={i === messages.length - 1} />
                ))
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-xs text-destructive"
                >
                  {error}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll-down button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-[76px] right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card shadow-md transition-colors hover:bg-muted"
                >
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Suggestion chips during conversation */}
            {!isEmpty && !isAtLimit && (
              <div className="border-b border-border/30 px-3 py-2">
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                  {CHIP_GROUPS[chipGroup].map((c) => (
                    <button
                      key={c.label}
                      onClick={() => send(c.label)}
                      disabled={loading}
                      className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground disabled:opacity-40"
                    >
                      <span className="text-xs leading-none">{c.icon}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input — swaps to a "start fresh" banner at the conversation limit */}
            <div className="border-t border-border/50 bg-card px-3 py-3">
              {isAtLimit ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center"
                >
                  <p className="text-[12px] font-medium text-foreground leading-snug">
                    This chat is getting long — my brain is full! 🧠💥
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Hit the button below to start a fresh conversation. I promise I won't forget how
                    cool you are. 😄
                  </p>
                  <button
                    onClick={clearChat}
                    className="flex items-center gap-1.5 rounded-lg gradient-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Start fresh
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      disabled={loading}
                      placeholder="Ask about Jay…"
                      className="flex-1 resize-none bg-transparent py-2.5 text-[13px] leading-snug text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-50"
                      style={{ minHeight: "38px", maxHeight: "112px" }}
                      aria-label="Chat message"
                    />
                    <button
                      onClick={() => send(input)}
                      disabled={!input.trim() || loading}
                      aria-label="Send"
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150",
                        input.trim() && !loading
                          ? "gradient-primary text-primary-foreground shadow-glow hover:scale-105 active:scale-95"
                          : "bg-muted text-muted-foreground cursor-not-allowed opacity-40",
                      )}
                    >
                      {loading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-center text-[10px] text-muted-foreground/40">
                    ↵ send · ⇧↵ new line · AI may make mistakes
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB + label */}
      <div className="fixed bottom-8 right-6 z-50 flex items-center gap-3">
        {/* Animated label — appears after delay, hides on open */}
        <AnimatePresence>
          {showLabel && !open && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-3.5 py-2 shadow-lg"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-[12px] font-semibold text-foreground whitespace-nowrap">
                Chat with Jay
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB */}
        <motion.button
          onClick={() => {
            setOpen((v) => !v);
            if (!open) setUnread(0);
          }}
          aria-label={open ? "Close chat" : "Chat with Jay's AI assistant"}
          aria-expanded={open}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 26, delay: 1.4 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full gradient-primary shadow-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {/* Pulse ring when closed */}
          {!open && (
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full bg-primary"
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.16 }}
              >
                <X className="h-6 w-6 text-primary-foreground" />
              </motion.span>
            ) : (
              <motion.span
                key="msg"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.16 }}
              >
                <MessageCircle className="h-6 w-6 text-primary-foreground" />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Unread badge */}
          <AnimatePresence>
            {unread > 0 && !open && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm"
              >
                {unread}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
