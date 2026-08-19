import { isLocalHostname, isRecaptchaProductionRuntime } from "@/lib/recaptcha-runtime";

const SITEVERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export function isRecaptchaSecretConfigured(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}

export function shouldVerifyRecaptcha(hostHeader?: string | null): boolean {
  if (!isRecaptchaProductionRuntime()) return false;
  if (!process.env.RECAPTCHA_SECRET_KEY) return false;
  if (hostHeader && isLocalHostname(hostHeader)) return false;
  return true;
}

/**
 * Verifies a reCAPTCHA v2 checkbox token with Google.
 * Skipped outside production (dev / localhost / preview).
 */
export async function verifyRecaptchaToken(
  token: string | undefined,
  remoteIp?: string,
): Promise<boolean> {
  if (!isRecaptchaProductionRuntime()) return true;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token?.trim()) return false;

  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token.trim());
    if (remoteIp) body.set("remoteip", remoteIp);

    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return false;

    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

export function extractRecaptchaToken(body: unknown): string | undefined {
  if (!body || typeof body !== "object" || !("recaptchaToken" in body)) return undefined;
  const value = (body as Record<string, unknown>).recaptchaToken;
  return typeof value === "string" ? value : undefined;
}
