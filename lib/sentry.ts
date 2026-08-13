import * as Sentry from "@sentry/nextjs";

/** Capture API / server errors when Sentry DSN is configured. */
export function captureServerError(error: unknown, context?: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.captureException(error, context ? { extra: context } : undefined);
}
