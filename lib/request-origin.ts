/**
 * Origin allowlist for public POST APIs.
 * Preview hosts are taken from VERCEL_URL (this deployment only), not *.vercel.app.
 */

function extraAllowedHosts(): string[] {
  const hosts: string[] = [];
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    try {
      hosts.push(new URL(site).hostname);
    } catch {
      /* ignore malformed SITE_URL */
    }
  }
  if (process.env.VERCEL_URL) {
    hosts.push(process.env.VERCEL_URL.replace(/^https?:\/\//, ""));
  }
  return hosts;
}

export function isAllowedRequestOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const allowed = new Set(["jaypateldev.com", "www.jaypateldev.com", ...extraAllowedHosts()]);

  if (process.env.NODE_ENV !== "production") {
    allowed.add("localhost");
    allowed.add("127.0.0.1");
    if (!origin) return true;
  }

  if (!origin) return false;

  try {
    const { hostname } = new URL(origin);
    return allowed.has(hostname);
  } catch {
    return false;
  }
}
