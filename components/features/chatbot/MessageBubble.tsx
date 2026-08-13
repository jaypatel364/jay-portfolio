"use client";

import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderContent, type Message } from "./chat-content";

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

export { TypingDots, MessageBubble };
