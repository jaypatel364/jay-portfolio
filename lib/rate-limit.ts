import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  limited: boolean;
  retryAfter: number;
}

/** Shared Upstash limiters — fall back to in-memory when Redis env is unset (local dev). */
function createLimiter(requests: number, window: `${number} s` | `${number} m` | `${number} h`) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    const redis = new Redis({ url, token });
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, window),
      analytics: true,
      prefix: "portfolio",
    });
  }

  return null;
}

const chatMinute = createLimiter(6, "60 s");
const chatHour = createLimiter(30, "3600 s");
const contactMinute = createLimiter(3, "60 s");

// In-memory fallback (single instance — dev only)
const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = memoryBuckets.get(key);

  if (!entry || now > entry.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfter: 0 };
  }

  entry.count++;
  if (entry.count > limit) {
    return { limited: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { limited: false, retryAfter: 0 };
}

async function upstashLimit(
  limiter: Ratelimit | null,
  key: string,
  fallbackLimit: number,
  fallbackWindowMs: number,
): Promise<RateLimitResult> {
  if (!limiter) {
    return memoryLimit(key, fallbackLimit, fallbackWindowMs);
  }

  const result = await limiter.limit(key);
  if (!result.success) {
    const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    return { limited: true, retryAfter };
  }
  return { limited: false, retryAfter: 0 };
}

export async function rateLimitChat(ip: string): Promise<RateLimitResult> {
  const minute = await upstashLimit(chatMinute, `chat:min:${ip}`, 6, 60_000);
  if (minute.limited) return minute;
  return upstashLimit(chatHour, `chat:hr:${ip}`, 30, 3_600_000);
}

export async function rateLimitContact(ip: string): Promise<RateLimitResult> {
  return upstashLimit(contactMinute, `contact:${ip}`, 3, 60_000);
}

export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headers.get("x-real-ip") ?? "unknown"
  );
}
