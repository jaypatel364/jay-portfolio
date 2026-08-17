import { createHash } from "crypto";

/** SHA-256 of the client IP. Used for rate-limit keys — never persist the raw IP. */
export function hashClientIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "jay-portfolio";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
