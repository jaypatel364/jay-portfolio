import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MongoClient } from "mongodb";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
});

// Simple in-memory rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

let cachedClient: MongoClient | null = null;

async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  return cachedClient;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data. Please check your inputs." },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

    // Save to MongoDB
    const client = await getMongoClient();
    const db = client.db("portfolio");
    await db.collection("contact").insertOne({
      name,
      email,
      message,
      ip,
      createdAt: new Date(),
    });

    console.log("[Contact Form] Saved to MongoDB:", { name, email });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error.";
    console.error("[Contact Form Error]", errorMessage);

    // If MongoDB isn't configured, still log but tell user
    if (errorMessage.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Contact service is not configured yet. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
