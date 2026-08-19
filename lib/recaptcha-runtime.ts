/** True for localhost / loopback — never show or enforce reCAPTCHA here. */
export function isLocalHostname(hostname: string): boolean {
  const host = hostname.split(":")[0]?.toLowerCase() ?? "";
  return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
}

/**
 * reCAPTCHA v2 checkbox is production-only.
 * Skipped in `next dev`, Vitest, localhost `next start`, and Vercel preview.
 */
export function isRecaptchaProductionRuntime(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const vercelEnv = process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (vercelEnv && vercelEnv !== "production") return false;
  return true;
}
