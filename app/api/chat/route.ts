import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { z } from "zod";
import { buildChatSystemPrompt, getCannedAnswers, randomOffTopicReply } from "@/settings/chat";
import { rateLimitChat, getClientIp } from "@/lib/rate-limit";
import { isAllowedRequestOrigin } from "@/lib/request-origin";
import { captureServerError } from "@/lib/sentry";

export const runtime = "nodejs";

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN BUDGET — Groq free tier: 6,000 TPM, 30 RPM, 14,400 RPD
// ─────────────────────────────────────────────────────────────────────────────

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(1200), // generous — token budget enforced later
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(10),
});

// ── Prompt injection guard ────────────────────────────────────────────────────

const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above|prior)\s+(instructions?|prompts?|rules?)/i,
  /you\s+are\s+now\s+a/i,
  /act\s+as\s+(a\s+)?(?:different|another|new|evil|dan|jailbreak)/i,
  /forget\s+(everything|all|your|prior)/i,
  /system\s*prompt/i,
  /override\s+(your|the)\s+(instructions?|rules?|personality)/i,
  /disregard\s+(all|any|previous)/i,
];

function hasInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(text));
}

// ── Off-topic guard — zero tokens spent on clearly irrelevant queries ─────────
//
// Only block asks that are unambiguously NOT about Jay / his work.
// Borderline or Jay-adjacent questions go to Groq — the system prompt answers
// fully when relevant, and redirects gently when not.
//
// Strategy: when in doubt, let it through. Polite copy lives in settings/chat.ts.

const OFF_TOPIC_PATTERNS: RegExp[] = [
  // Asking to WRITE code for them (not asking about Jay's code)
  /\b(write me|generate me|create me|give me|build me)\b.{0,30}\b(function|algorithm|script|program|app|component|code)\b/i,
  // Current events / news — never about Jay
  /\b(latest news|current events|breaking news|what happened today|headlines)\b/i,
  // Famous people clearly not Jay
  /\b(elon musk|mark zuckerberg|sam altman|bill gates|trump|biden|taylor swift|elon|zuckerberg)\b/i,
  // Pure trivia with no Jay context
  /\b(capital of|population of|who invented|history of the|when was the)\b/i,
  // Food / lifestyle with no Jay context
  /\b(recipe for|how to cook|calories in|workout plan|diet plan|best restaurant|hotel in|flight to)\b/i,
  // Pure math homework
  /\b(solve this equation|calculate the integral|find the derivative|math homework|algebra problem)\b/i,
  // Asking about other AI chatbots / general AI tooling
  /\bcompare (chatgpt|gpt-?4|claude|gemini) (to|with|vs)\b/i,
  /\bwhich (ai|llm|model) is (better|best|smarter)\b/i,
  /\b(write|generate|summarize|explain)\b.{0,40}\b(essay|homework|thesis|cover letter)\b/i,
];

// JAY_CONTEXT — if the message contains these words, never block it regardless
// of pattern matches. "introduce yourself", "your stack", "your experience" etc.
const JAY_CONTEXT_WORDS = [
  "you",
  "your",
  "jay",
  "yourself",
  "portfolio",
  "stack",
  "experience",
  "skills",
  "hire",
  "available",
  "contact",
  "work",
  "built",
  "project",
  "who are",
  "tell me",
  "introduce",
];

function isOffTopic(text: string): boolean {
  const lower = text.toLowerCase();
  // If it clearly mentions Jay or is about the person → always let it through
  if (JAY_CONTEXT_WORDS.some((w) => lower.includes(w))) return false;
  return OFF_TOPIC_PATTERNS.some((re) => re.test(text));
}

function getCannedAnswer(text: string): string | null {
  for (const { patterns, reply } of getCannedAnswers()) {
    if (patterns.some((re) => re.test(text))) return reply;
  }
  return null;
}

// ── Token budget guard ────────────────────────────────────────────────────────
// Rough estimator: 1 token ≈ 4 chars. Drop oldest pairs until we're safe.
// Hard ceiling: 3,500 input tokens (leaves headroom under 6,000 TPM).

const INPUT_TOKEN_CEILING = 3_500;
const CHARS_PER_TOKEN = 4;

function enforceTokenBudget(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  systemPromptChars: number,
): Array<{ role: "user" | "assistant"; content: string }> {
  const ceiling = INPUT_TOKEN_CEILING * CHARS_PER_TOKEN; // in chars
  let work = [...messages];

  // Always keep at least the last user message
  while (work.length > 1) {
    const totalChars = systemPromptChars + work.reduce((sum, m) => sum + m.content.length, 0);
    if (totalChars <= ceiling) break;
    // Drop the oldest pair (first 2 messages)
    work = work.slice(2);
  }

  return work;
}

// ── History trimmer — hard cap on pairs ──────────────────────────────────────

const MAX_HISTORY_PAIRS = 4; // 8 messages max (was 6)

function trimHistory(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
): Array<{ role: "user" | "assistant"; content: string }> {
  const max = MAX_HISTORY_PAIRS * 2;
  const trimmed = messages.length > max ? messages.slice(messages.length - max) : messages;
  return enforceTokenBudget(trimmed, buildChatSystemPrompt().length);
}

// ── Groq client ───────────────────────────────────────────────────────────────

let groqClient: Groq | null = null;

function getGroq(): Groq {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is not set");
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!isAllowedRequestOrigin(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // 1. IP + rate limit (Upstash Redis on Vercel, in-memory fallback locally)
  const ip = getClientIp(req);
  const { limited, retryAfter } = await rateLimitChat(ip);
  if (limited) {
    return NextResponse.json(
      { error: "Sorry — too many messages just now. Please try again in a moment." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  // 3. Parse + validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message format." }, { status: 400 });
  }

  const { messages } = parsed.data;

  // 4. Injection check
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (lastUserMsg && hasInjection(lastUserMsg.content)) {
    return NextResponse.json(
      {
        error:
          "Happy to chat about Jay's work, stack, and availability — what would you like to know?",
      },
      { status: 400 },
    );
  }

  // 5. Pre-built answer — free, instant, zero tokens
  if (lastUserMsg) {
    const canned = getCannedAnswer(lastUserMsg.content);
    if (canned) {
      return NextResponse.json({ offTopic: false, reply: canned });
    }
  }

  // 6. Off-topic guard — free, zero tokens
  if (lastUserMsg && isOffTopic(lastUserMsg.content)) {
    return NextResponse.json({ offTopic: true, reply: randomOffTopicReply() });
  }

  // 7. Groq
  let groq: Groq;
  try {
    groq = getGroq();
  } catch {
    return NextResponse.json(
      {
        error:
          "Sorry, chat isn't available right now. Please use the contact form or email Jay directly.",
      },
      { status: 503 },
    );
  }

  try {
    const safeHistory = trimHistory(messages);

    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: buildChatSystemPrompt() },
        ...safeHistory.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 250, // was 300 — trimmed further
      temperature: 0.65,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("429") || msg.toLowerCase().includes("rate limit")) {
      return NextResponse.json(
        {
          error:
            "Sorry — I'm getting a lot of questions right now. Please try again in a few seconds.",
        },
        { status: 429 },
      );
    }
    captureServerError(err, { route: "chat" });
    console.error("[Chat] Groq error:", msg);
    return NextResponse.json(
      {
        error:
          "Sorry about that — something went wrong. Please try again, or use the contact form to reach Jay.",
      },
      { status: 500 },
    );
  }
}
