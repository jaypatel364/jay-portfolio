import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import { rateLimitContact, getClientIp } from "@/lib/rate-limit";
import { captureServerError } from "@/lib/sentry";

export const runtime = "nodejs";

// ── Validation ───────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
});

// ── MongoDB service ──────────────────────────────────────────────────────────
// Gracefully no-ops when MONGODB_URI is not set.

let cachedClient: MongoClient | null = null;

async function saveToDatabase(payload: {
  name: string;
  email: string;
  message: string;
  ip: string;
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
    captureServerError(err, { route: "contact", ip: payload.ip });
    console.error("[Contact] MongoDB save failed:", err instanceof Error ? err.message : err);
    // Reset client so next request retries a fresh connection
    cachedClient = null;
    return { saved: false };
  }
}

// ── SMTP service ─────────────────────────────────────────────────────────────
// Gracefully no-ops when any required SMTP env var is missing.

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
}

function resolveSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;
  const to = process.env.CONTACT_NOTIFY_TO;

  if (!host || !portRaw || !user || !pass || !from || !to) return null;

  const port = Number.parseInt(portRaw, 10);
  if (!Number.isFinite(port)) return null;

  const secure = process.env.SMTP_SECURE?.toLowerCase() === "true";
  return { host, port, secure, user, pass, from, to };
}

let cachedTransporter: nodemailer.Transporter | null = null;

async function sendEmail(payload: {
  name: string;
  email: string;
  message: string;
  ip: string;
  createdAt: Date;
}): Promise<{ sent: boolean }> {
  const config = resolveSmtpConfig();

  if (!config) {
    console.warn("[Contact] SMTP not configured — skipping email notification.");
    return { sent: false };
  }

  try {
    if (!cachedTransporter) {
      cachedTransporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: { user: config.user, pass: config.pass },
      });
    }

    await cachedTransporter.sendMail({
      from: config.from,
      to: config.to,
      subject: `New Contact Message from ${payload.name}`,
      replyTo: payload.email,
      text: buildTextBody(payload),
      html: buildHtmlBody(payload),
    });

    console.log("[Contact] Email sent to:", config.to);
    return { sent: true };
  } catch (err) {
    captureServerError(err, { route: "contact-email", ip: payload.ip });
    console.error("[Contact] Email send failed:", err instanceof Error ? err.message : err);
    // Reset transporter so next request tries a fresh connection
    cachedTransporter = null;
    return { sent: false };
  }
}

// ── Email body builders ──────────────────────────────────────────────────────

function buildTextBody(p: {
  name: string;
  email: string;
  message: string;
  ip: string;
  createdAt: Date;
}): string {
  return [
    "New contact form submission",
    "",
    `Name:    ${p.name}`,
    `Email:   ${p.email}`,
    `IP:      ${p.ip}`,
    `Time:    ${p.createdAt.toISOString()}`,
    "",
    "Message:",
    p.message,
  ].join("\n");
}

function buildHtmlBody(p: {
  name: string;
  email: string;
  message: string;
  ip: string;
  createdAt: Date;
}): string {
  const e = escapeHtml;
  return `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;max-width:600px;">
      <h2 style="margin:0 0 16px;font-size:18px;">New contact form submission</h2>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px;">
        <tr><td style="padding:4px 12px 4px 0;color:#6b7280;font-size:14px;">Name</td>
            <td style="padding:4px 0;font-size:14px;">${e(p.name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6b7280;font-size:14px;">Email</td>
            <td style="padding:4px 0;font-size:14px;"><a href="mailto:${e(p.email)}">${e(p.email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6b7280;font-size:14px;">IP</td>
            <td style="padding:4px 0;font-size:14px;">${e(p.ip)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6b7280;font-size:14px;">Time</td>
            <td style="padding:4px 0;font-size:14px;">${e(p.createdAt.toISOString())}</td></tr>
      </table>
      <div style="padding:14px 16px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
        <p style="margin:0 0 6px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Message</p>
        <pre style="white-space:pre-wrap;margin:0;font-size:14px;font-family:inherit;">${e(p.message)}</pre>
      </div>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const { limited } = await rateLimitContact(ip);
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  // 3. Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // 4. Honeypot — silently accept to not reveal bot detection
  if (
    body &&
    typeof body === "object" &&
    "website" in body &&
    (body as Record<string, unknown>).website
  ) {
    return NextResponse.json({ success: true });
  }

  // 5. Validate
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid form data. Please check your inputs." },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;
  const createdAt = new Date();
  const payload = { name, email, message, ip, createdAt };

  // 6. Fire both services independently — neither blocks nor breaks the other.
  //    We run them in parallel for speed.
  const [dbResult, emailResult] = await Promise.all([saveToDatabase(payload), sendEmail(payload)]);

  // 7. Always return 200 to the user.
  //    Log a warning if both services were unavailable (config issue, not user fault).
  if (!dbResult.saved && !emailResult.sent) {
    console.warn(
      "[Contact] Neither MongoDB nor SMTP is configured. " + "Message received but not persisted.",
      { name, email },
    );
  }

  return NextResponse.json({ success: true });
}
