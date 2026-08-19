import { Resend } from "resend";
import { captureServerError } from "@/lib/sentry";

export interface ContactMailPayload {
  firstName: string;
  lastName: string;
  name: string;
  phone?: string;
  email: string;
  message: string;
  createdAt: Date;
}

function resolveResendConfig(): { apiKey: string; from: string; to: string } | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.CONTACT_NOTIFY_TO;
  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to };
}

export function isMailConfigured(): boolean {
  return resolveResendConfig() !== null;
}

let cachedResend: Resend | null = null;

export async function sendContactEmail(payload: ContactMailPayload): Promise<{ sent: boolean }> {
  const config = resolveResendConfig();

  if (!config) {
    console.warn("[Contact] Resend not configured — skipping email notification.");
    return { sent: false };
  }

  try {
    if (!cachedResend) cachedResend = new Resend(config.apiKey);

    const { error } = await cachedResend.emails.send({
      from: config.from,
      to: config.to,
      replyTo: payload.email,
      subject: `New Contact Message from ${payload.name}`,
      text: buildTextBody(payload),
      html: buildHtmlBody(payload),
    });

    if (error) {
      captureServerError(new Error(error.message), { route: "contact-email" });
      console.error("[Contact] Resend failed:", error.message);
      cachedResend = null;
      return { sent: false };
    }

    console.log("[Contact] Email sent via Resend to:", config.to);
    return { sent: true };
  } catch (err) {
    captureServerError(err, { route: "contact-email" });
    console.error("[Contact] Resend send failed:", err instanceof Error ? err.message : err);
    cachedResend = null;
    return { sent: false };
  }
}

function buildTextBody(p: ContactMailPayload): string {
  return [
    "New contact form submission",
    "",
    `Name:    ${p.name}`,
    `Email:   ${p.email}`,
    ...(p.phone ? [`Phone:   ${p.phone}`] : []),
    `Time:    ${p.createdAt.toISOString()}`,
    "",
    "Message:",
    p.message,
  ].join("\n");
}

function buildHtmlBody(p: ContactMailPayload): string {
  const e = escapeHtml;
  const phoneRow = p.phone
    ? `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;font-size:14px;">Phone</td>
            <td style="padding:4px 0;font-size:14px;">${e(p.phone)}</td></tr>`
    : "";
  return `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;max-width:600px;">
      <h2 style="margin:0 0 16px;font-size:18px;">New contact form submission</h2>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px;">
        <tr><td style="padding:4px 12px 4px 0;color:#6b7280;font-size:14px;">Name</td>
            <td style="padding:4px 0;font-size:14px;">${e(p.name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6b7280;font-size:14px;">Email</td>
            <td style="padding:4px 0;font-size:14px;"><a href="mailto:${e(p.email)}">${e(p.email)}</a></td></tr>
        ${phoneRow}
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
