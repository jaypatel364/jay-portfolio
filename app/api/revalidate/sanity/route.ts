/**
 * POST /api/revalidate/sanity
 *
 * Receives webhook calls from Sanity when documents are published, updated,
 * or deleted. Validates the shared secret, then selectively invalidates the
 * relevant Next.js cache tags.
 *
 * Expected flow:
 *   Sanity publish/update/delete
 *     → Sanity Webhook (GROQ filter: _type in ["post","blogSettings","category"])
 *     → POST /api/revalidate/sanity  { Authorization: Bearer <secret> }
 *     → Validate secret
 *     → revalidateTag(...)
 *     → Next.js Data Cache invalidated
 *     → 200 { revalidated: true, tags: [...] }
 *
 * Security:
 *   The secret is compared with a constant-time comparison to prevent
 *   timing attacks. Requests without a valid secret → 401.
 *
 * Configuration:
 *   SANITY_REVALIDATE_SECRET — set in .env.local, Vercel UAT, and Vercel Prod.
 *   Do NOT reuse the Sanity API read token for this value.
 */

import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import {
  BLOG_LISTING_TAG,
  BLOG_SETTINGS_TAG,
  BLOG_SLUGS_TAG,
  BLOG_TAG,
  BLOG_TAXONOMY_TAG,
  blogPostTag,
} from "@/lib/sanity/cache-tags";

export const runtime = "nodejs";

// ─── Sanity document types this webhook cares about ──────────────────────────

const BLOG_POST_TYPE = "post" as const;
const BLOG_SETTINGS_TYPE = "blogSettings" as const;
const CATEGORY_TYPE = "category" as const;

type SanityDocumentType =
  | typeof BLOG_POST_TYPE
  | typeof BLOG_SETTINGS_TYPE
  | typeof CATEGORY_TYPE
  | string;

/**
 * Minimal shape of the Sanity webhook payload.
 *
 * Sanity sends the full document body, but we only need these fields.
 * The GROQ projection configured on the webhook side MUST include:
 *
 *   {
 *     _id,
 *     _type,
 *     "slug": slug.current,
 *     "operation": delta::operation()
 *   }
 *
 * - `_id`       — document id, used for logging/observability.
 * - `_type`     — document type ("post" | "blogSettings" | "category").
 * - `slug`      — post slug as a plain string (via slug.current projection).
 * - `operation` — "create" | "update" | "delete" via delta::operation().
 *
 * Without the projection, Sanity sends the full document and operation
 * is not included — tag selection will fall back to the conservative
 * "unknown operation" branch, which still works but is less precise.
 */
interface SanityWebhookPayload {
  _id?: string;
  _type?: SanityDocumentType;
  /** Post slug — populated by `"slug": slug.current` in the GROQ projection. */
  slug?: string | { current?: string };
  /** Operation that triggered the webhook — populated by `"operation": delta::operation()`. */
  operation?: "create" | "update" | "delete";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Constant-time string comparison — prevents timing-based secret extraction.
 * Falls back to a simple compare when the runtime lacks `crypto.timingSafeEqual`.
 */
function timingSafeEqual(a: string, b: string): boolean {
  try {
    const enc = new TextEncoder();
    const ab = enc.encode(a);
    const bb = enc.encode(b);
    if (ab.length !== bb.length) return false;
    // crypto is available on Node.js 18+ and the Edge runtime.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { timingSafeEqual: nodeTSE } = require("crypto") as typeof import("crypto");
    return nodeTSE(ab, bb);
  } catch {
    // Fallback — length check above already prevents short-circuit leakage.
    return a === b;
  }
}

function extractSlug(payload: SanityWebhookPayload): string | null {
  if (!payload.slug) return null;
  if (typeof payload.slug === "string") return payload.slug || null;
  return payload.slug.current ?? null;
}

function extractSecret(request: NextRequest): string | null {
  // Preferred: x-sanity-secret header (configured in the Sanity webhook).
  const sanityHeader = request.headers.get("x-sanity-secret");
  if (sanityHeader) return sanityHeader.trim();

  // Fallback: standard Authorization: Bearer <token>.
  const authHeader = request.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  // Query-parameter fallback intentionally omitted — secrets in URLs can leak
  // into access logs, proxy logs, browser history, and analytics systems.
  return null;
}

// ─── Tag invalidation logic ───────────────────────────────────────────────────

/**
 * Determines which cache tags to invalidate based on document type and operation.
 *
 * Rules (spec §8):
 *
 *  post — create:           blog, blog:listing, blog:slugs
 *  post — update:           blog, blog:post:<slug>, blog:listing
 *  post — delete/unpublish: blog, blog:post:<slug>, blog:listing, blog:slugs
 *
 *  blogSettings — any:      blog:settings
 *  category     — any:      blog:taxonomy
 */
function tagsToInvalidate(payload: SanityWebhookPayload): string[] {
  const { _type, operation } = payload;
  const slug = extractSlug(payload);
  const tags = new Set<string>();

  if (_type === BLOG_POST_TYPE) {
    // Every post operation refreshes the broad tag and the listing.
    tags.add(BLOG_TAG);
    tags.add(BLOG_LISTING_TAG);

    if (operation === "create") {
      // New post: listing count changes, new slug appears.
      tags.add(BLOG_SLUGS_TAG);
    } else if (operation === "update") {
      // Updated post: invalidate its specific cache entry.
      if (slug) tags.add(blogPostTag(slug));
    } else if (operation === "delete") {
      // Deleted/unpublished post: remove from slug list and its own cache entry.
      if (slug) tags.add(blogPostTag(slug));
      tags.add(BLOG_SLUGS_TAG);
    } else {
      // Unknown operation — be conservative.
      if (slug) tags.add(blogPostTag(slug));
      tags.add(BLOG_SLUGS_TAG);
    }
  } else if (_type === BLOG_SETTINGS_TYPE) {
    // Settings change: only the settings tag — no need to bust post/listing caches.
    tags.add(BLOG_SETTINGS_TAG);
  } else if (_type === CATEGORY_TYPE) {
    // Category change: only the taxonomy tag.
    tags.add(BLOG_TAXONOMY_TAG);
  } else {
    // Unknown type — invalidate broadly so nothing stale is served.
    console.warn("[revalidate/sanity] Unknown document type:", _type);
    tags.add(BLOG_TAG);
  }

  return [...tags];
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const receivedAt = new Date().toISOString();

  // ── 1. Authenticate ──────────────────────────────────────────────────────
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    // Misconfiguration on our side — don't leak details, just refuse.
    console.error("[revalidate/sanity] SANITY_REVALIDATE_SECRET is not set.");
    return NextResponse.json({ error: "Revalidation not configured." }, { status: 500 });
  }

  const incomingToken = extractSecret(request);

  if (!incomingToken || !timingSafeEqual(incomingToken, secret)) {
    console.warn("[revalidate/sanity] Rejected: invalid or missing secret.", { receivedAt });
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // ── 2. Parse payload ─────────────────────────────────────────────────────
  let payload: SanityWebhookPayload;

  try {
    payload = (await request.json()) as SanityWebhookPayload;
  } catch {
    console.error("[revalidate/sanity] Failed to parse JSON body.");
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const docId = payload._id ?? "(unknown)";
  const docType = payload._type ?? "(unknown)";
  const slug = extractSlug(payload);
  const operation = payload.operation ?? "(unknown)";

  console.log("[revalidate/sanity] Webhook received.", {
    receivedAt,
    docId,
    docType,
    slug,
    operation,
  });

  // ── 3. Determine tags & revalidate ────────────────────────────────────────
  const tags = tagsToInvalidate(payload);

  // revalidateTag marks data as stale; the next request for that tag will
  // trigger a background refresh using stale-while-revalidate semantics.
  // We call it once per tag — Next.js handles deduplication internally.
  try {
    for (const tag of tags) {
      revalidateTag(tag);
    }
  } catch (err) {
    console.error("[revalidate/sanity] revalidateTag failed.", { tags, err });
    return NextResponse.json({ error: "Cache revalidation failed." }, { status: 500 });
  }

  // ── 4. Log success & respond ──────────────────────────────────────────────
  console.log("[revalidate/sanity] Cache invalidated.", {
    receivedAt,
    docId,
    docType,
    slug,
    operation,
    tags,
  });

  return NextResponse.json({
    revalidated: true,
    tags,
    meta: {
      docId,
      docType,
      slug,
      operation,
      revalidatedAt: receivedAt,
    },
  });
}

// Reject every other HTTP method cleanly.
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
