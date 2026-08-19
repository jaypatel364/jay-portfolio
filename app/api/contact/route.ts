import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { rateLimitContact, getClientIp } from "@/lib/rate-limit";
import { isAllowedRequestOrigin } from "@/lib/request-origin";
import { contactSchema, contactDisplayName } from "@/lib/contact-schema";
import { captureServerError } from "@/lib/sentry";
import { isMailConfigured, sendContactEmail } from "@/lib/contact-mail";
import {
  extractRecaptchaToken,
  isRecaptchaSecretConfigured,
  shouldVerifyRecaptcha,
  verifyRecaptchaToken,
} from "@/lib/recaptcha";

export const runtime = "nodejs";

let cachedClient: MongoClient | null = null;

async function saveToDatabase(payload: {
  firstName: string;
  lastName: string;
  name: string;
  phone?: string;
  email: string;
  message: string;
  createdAt: Date;
}): Promise<{ saved: boolean }> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("[Contact] MONGODB_URI not set — skipping database save.");
    return { saved: false };
  }

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }

    const db = cachedClient.db("portfolio");
    await db.collection("contact").insertOne(payload);
    console.log("[Contact] Saved to MongoDB:", { name: payload.name, email: payload.email });
    return { saved: true };
  } catch (err) {
    captureServerError(err, { route: "contact" });
    console.error("[Contact] MongoDB save failed:", err instanceof Error ? err.message : err);
    cachedClient = null;
    return { saved: false };
  }
}

function backendsConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI) || isMailConfigured();
}

export async function POST(request: NextRequest) {
  if (!isAllowedRequestOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const ip = getClientIp(request);

  const { limited } = await rateLimitContact(ip);
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    body &&
    typeof body === "object" &&
    "website" in body &&
    (body as Record<string, unknown>).website
  ) {
    return NextResponse.json({ success: true });
  }

  if (shouldVerifyRecaptcha(request.headers.get("host"))) {
    const recaptchaOk = await verifyRecaptchaToken(extractRecaptchaToken(body), ip);
    if (!recaptchaOk) {
      const hint = isRecaptchaSecretConfigured()
        ? "Please complete the captcha and try again."
        : "Captcha verification failed. Please try again.";
      return NextResponse.json({ error: hint }, { status: 400 });
    }
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid form data. Please check your inputs." },
      { status: 400 },
    );
  }

  const { firstName, lastName, phone, email, message } = parsed.data;
  const createdAt = new Date();
  const name = contactDisplayName({ firstName, lastName });
  const payload = { firstName, lastName, name, phone, email, message, createdAt };

  if (!backendsConfigured()) {
    captureServerError(new Error("Contact backends not configured"), { route: "contact" });
    return NextResponse.json(
      {
        error:
          "The contact form is temporarily unavailable. Please email pjay99909@gmail.com instead.",
      },
      { status: 503 },
    );
  }

  const [dbResult, emailResult] = await Promise.all([
    saveToDatabase(payload),
    sendContactEmail(payload),
  ]);

  if (!dbResult.saved && !emailResult.sent) {
    captureServerError(new Error("Contact backends failed"), { route: "contact" });
    return NextResponse.json(
      {
        error:
          "Message could not be delivered. Please email pjay99909@gmail.com or try again later.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true });
}
