import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

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

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
};

function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const to = process.env.CONTACT_NOTIFY_TO;

  if (!host || !portRaw || !user || !pass || !from || !to) return null;

  const port = Number.parseInt(portRaw, 10);
  if (!Number.isFinite(port)) return null;

  const secure = (process.env.SMTP_SECURE || "").toLowerCase() === "true";

  return { host, port, secure, user, pass, from, to };
}

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter(config: SmtpConfig): nodemailer.Transporter {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
  }
  return cachedTransporter;
}

async function sendContactEmail(input: {
  name: string;
  email: string;
  message: string;
  ip: string;
  createdAt: Date;
}) {
  const config = getSmtpConfig();
  if (!config) return;

  const transporter = getTransporter(config);

  const subject = `New Contact Message: ${input.name}`;
  const text = [
    "New contact form submission",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `IP: ${input.ip}`,
    `Time: ${input.createdAt.toISOString()}`,
    "",
    "Message:",
    input.message,
  ].join("\n");

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
      <h2 style="margin:0 0 12px;">New contact form submission</h2>
      <p style="margin:0 0 6px;"><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p style="margin:0 0 6px;"><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p style="margin:0 0 6px;"><strong>IP:</strong> ${escapeHtml(input.ip)}</p>
      <p style="margin:0 0 14px;"><strong>Time:</strong> ${escapeHtml(input.createdAt.toISOString())}</p>
      <div style="padding:12px;border:1px solid #e5e7eb;border-radius:10px;background:#f9fafb;">
        <pre style="white-space:pre-wrap;margin:0;">${escapeHtml(input.message)}</pre>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    subject,
    text,
    html,
    replyTo: input.email,
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
    const createdAt = new Date();

    // Save to MongoDB
    const client = await getMongoClient();
    const db = client.db("portfolio");
    await db.collection("contact").insertOne({
      name,
      email,
      message,
      ip,
      createdAt,
    });

    console.log("[Contact Form] Saved to MongoDB:", { name, email });

    try {
      await sendContactEmail({ name, email, message, ip, createdAt });
      console.log("[Contact Form] Email sent:", { to: process.env.CONTACT_NOTIFY_TO });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send email.";
      console.error("[Contact Form Email Error]", errorMessage);
    }

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
