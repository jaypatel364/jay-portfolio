"use client";

/**
 * TypingSpeedTest — type Jay's real code
 * ──────────────────────────────────────────────────────────────────────────
 * • 6 real code snippets from Jay's actual stack
 * • Live WPM and accuracy calculated character-by-character
 * • Correct chars → green, wrong → red underline, upcoming → muted
 * • Timer starts on first keystroke
 * • Results screen with WPM, accuracy, time — persisted best WPM in localStorage
 * • Hire CTA at the end
 * • Escape = close
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, RotateCcw, Trophy, Timer, Target, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Snippets ──────────────────────────────────────────────────────────────────

const SNIPPETS = [
  {
    label: "React Hook",
    lang: "TypeScript",
    code: `const useDebounce = <T>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};`,
  },
  {
    label: "API Route",
    lang: "Next.js",
    code: `export async function POST(req: Request) {
  const { email, message } = await req.json();
  if (!email || !message) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }
  await sendEmail({ to: email, body: message });
  return Response.json({ success: true });
}`,
  },
  {
    label: "Prisma Query",
    lang: "TypeScript",
    code: `const posts = await prisma.post.findMany({
  where: { published: true, authorId: userId },
  orderBy: { createdAt: "desc" },
  include: { author: true, tags: true },
  take: 10,
  skip: (page - 1) * 10,
});`,
  },
  {
    label: "Auth Middleware",
    lang: "Node.js",
    code: `export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(payload.id).lean();
  next();
};`,
  },
  {
    label: "Socket Event",
    lang: "Socket.io",
    code: `io.on("connection", (socket) => {
  socket.on("join_room", ({ roomId, userId }) => {
    socket.join(roomId);
    socket.to(roomId).emit("user_joined", { userId });
  });
  socket.on("send_message", (msg) => {
    io.to(msg.roomId).emit("receive_message", msg);
  });
});`,
  },
  {
    label: "Zustand Store",
    lang: "TypeScript",
    code: `const useStore = create<AppState>((set) => ({
  user: null,
  theme: "dark",
  setUser: (user) => set({ user }),
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
  reset: () => set({ user: null, theme: "dark" }),
}));`,
  },
];

const LS_KEY = "typing_best_wpm";

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcWPM(chars: number, elapsedSec: number): number {
  if (elapsedSec < 1) return 0;
  return Math.round(chars / 5 / (elapsedSec / 60));
}

function calcAccuracy(typed: string, target: string): number {
  if (!typed.length) return 100;
  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++;
  }
  return Math.round((correct / typed.length) * 100);
}

// ── Component ─────────────────────────────────────────────────────────────────

type Phase = "idle" | "typing" | "done";

export function TypingSpeedTest({ onClose }: { onClose: () => void }) {
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState(0);
  const [newRecord, setNewRecord] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  const snippet = SNIPPETS[snippetIdx];
  const target = snippet.code;

  // load best WPM
  useEffect(() => {
    try {
      const v = localStorage.getItem(LS_KEY);
      if (v) setBestWpm(parseInt(v, 10));
    } catch {
      /* ignore */
    }
  }, []);

  // Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // RAF timer
  useEffect(() => {
    if (phase !== "typing") {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = () => {
      if (!startRef.current) return;
      const e = (Date.now() - startRef.current) / 1000;
      setElapsed(e);
      setWpm(calcWPM(typed.length, e));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, typed.length]);

  // ── Input handler ─────────────────────────────────────────────────────────

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;

      // Start timer on first char
      if (phase === "idle" || phase === "typing") {
        if (phase === "idle" && val.length > 0) {
          const now = Date.now();
          startRef.current = now;
          setPhase("typing");
        }
        setTyped(val);
        setAccuracy(calcAccuracy(val, target));

        // Completed?
        if (val === target) {
          cancelAnimationFrame(rafRef.current);
          const finalElapsed = (Date.now() - (startRef.current ?? Date.now())) / 1000;
          const finalWpm = calcWPM(target.length, finalElapsed);
          const finalAcc = calcAccuracy(val, target);
          setWpm(finalWpm);
          setAccuracy(finalAcc);
          setPhase("done");

          // Check record
          setBestWpm((prev) => {
            if (finalWpm > prev) {
              setNewRecord(true);
              try {
                localStorage.setItem(LS_KEY, String(finalWpm));
              } catch {
                /* ignore */
              }
              toast("🏆 New best WPM!", {
                description: `${finalWpm} WPM at ${finalAcc}% accuracy. Impressive.`,
                duration: 3500,
              });
              return finalWpm;
            }
            return prev;
          });
        }
      }
    },
    [phase, target],
  );

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(
    (newIdx?: number) => {
      cancelAnimationFrame(rafRef.current);
      const idx = newIdx ?? snippetIdx;
      setSnippetIdx(idx);
      setTyped("");
      setPhase("idle");
      startRef.current = null;
      setElapsed(0);
      setWpm(0);
      setAccuracy(100);
      setNewRecord(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [snippetIdx],
  );

  const nextSnippet = useCallback(() => {
    reset((snippetIdx + 1) % SNIPPETS.length);
  }, [reset, snippetIdx]);

  // ── Rendered characters ────────────────────────────────────────────────────

  const chars = target.split("").map((ch, i) => {
    const typedChar = typed[i];
    const state = typedChar === undefined ? "upcoming" : typedChar === ch ? "correct" : "wrong";
    return { ch, state, i };
  });

  const cursorPos = typed.length;
  const progress = Math.min(100, Math.round((typed.length / target.length) * 100));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[9999999] overflow-y-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
      role="dialog"
      aria-label="Typing Speed Test"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />
      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-premium"
        >
          <div className="h-[3px] w-full gradient-primary" />

          {/* ── Header ── */}
          <div className="flex items-center justify-between border-b border-border/50 bg-card/80 px-5 py-3.5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
                <Keyboard className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">Typing Speed Test</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {snippet.label} · {snippet.lang}
                </p>
              </div>
            </div>

            {/* Live stats row */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground/60">WPM</p>
                  <p className="text-sm font-black tabular-nums gradient-text">{wpm}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground/60">Acc</p>
                  <p className="text-sm font-black tabular-nums text-foreground">{accuracy}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground/60">Best</p>
                  <p className="text-sm font-black tabular-nums text-foreground">{bestWpm}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-col gap-4 p-5 sm:p-6">
            {/* Progress bar */}
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted/50">
              <motion.div
                className="h-full rounded-full gradient-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Snippet selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {SNIPPETS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => reset(i)}
                  className={cn(
                    "shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all",
                    i === snippetIdx
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/40 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Code display */}
            <div
              className="relative cursor-text overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-4 font-mono text-[13px] leading-7"
              onClick={() => inputRef.current?.focus()}
            >
              {/* dot grid */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(128,128,128,0.15) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <pre className="relative whitespace-pre-wrap break-words">
                {chars.map(({ ch, state, i }) => (
                  <span
                    key={i}
                    className={cn(
                      "relative transition-colors duration-75",
                      state === "correct"
                        ? "text-emerald-500"
                        : state === "wrong"
                          ? "text-red-500 underline decoration-red-500/70 decoration-2"
                          : "text-muted-foreground/40",
                    )}
                  >
                    {/* blinking cursor */}
                    {i === cursorPos && phase !== "done" && (
                      <motion.span
                        className="absolute -left-px top-0 h-full w-0.5 rounded-full bg-primary"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                    {ch}
                  </span>
                ))}
              </pre>

              {/* idle overlay */}
              {phase === "idle" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/70 backdrop-blur-[2px]"
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow"
                    >
                      <Keyboard className="h-5 w-5 text-primary-foreground" />
                    </motion.div>
                    <p className="text-sm font-bold text-foreground">Start typing to begin</p>
                    <p className="text-[11px] text-muted-foreground">
                      The timer starts on your first keystroke
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Hidden textarea */}
            <textarea
              ref={inputRef}
              value={typed}
              onChange={handleInput}
              disabled={phase === "done"}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="sr-only"
              aria-label="Type the code snippet here"
            />

            {/* Timer + controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Timer className="h-3.5 w-3.5 text-primary/60" />
                <span className="tabular-nums font-mono font-semibold text-foreground">
                  {elapsed.toFixed(1)}s
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={nextSnippet}
                  className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/60 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
                >
                  Next snippet →
                </button>
                <button
                  onClick={() => reset()}
                  className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/60 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>
            </div>

            {/* ── Done overlay ── */}
            <AnimatePresence>
              {phase === "done" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex flex-col gap-4"
                >
                  {/* Stats card */}
                  <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/90">
                    <div className="h-[3px] gradient-primary" />
                    <div className="grid grid-cols-3 divide-x divide-border/40 px-2 py-4">
                      {[
                        {
                          icon: <Zap className="h-4 w-4" />,
                          label: "WPM",
                          value: wpm,
                          extra: newRecord ? " 🏆" : "",
                        },
                        {
                          icon: <Target className="h-4 w-4" />,
                          label: "Accuracy",
                          value: `${accuracy}%`,
                          extra: "",
                        },
                        {
                          icon: <Timer className="h-4 w-4" />,
                          label: "Time",
                          value: `${elapsed.toFixed(1)}s`,
                          extra: "",
                        },
                      ].map((s) => (
                        <div key={s.label} className="flex flex-col items-center gap-1 px-3">
                          <span className="text-primary/60">{s.icon}</span>
                          <span
                            className={cn(
                              "text-2xl font-black tabular-nums",
                              s.label === "WPM" && newRecord ? "gradient-text" : "text-foreground",
                            )}
                          >
                            {s.value}
                            {s.extra}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    {newRecord && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-1.5 border-t border-border/40 bg-primary/6 py-2"
                      >
                        <Trophy className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[11px] font-bold text-primary">
                          New personal best!
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={nextSnippet}
                        className="btn-shine flex flex-1 items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-[13px] font-bold text-primary-foreground shadow-glow"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Try another snippet
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-all"
                      >
                        Retry
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
