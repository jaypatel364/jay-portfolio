import { afterEach, describe, expect, it, vi } from "vitest";
import { getExperienceLabel } from "@/lib/utils";
import { hashClientIp } from "@/lib/client-ip";
import { isAllowedRequestOrigin } from "@/lib/request-origin";

describe("getExperienceLabel", () => {
  it("returns < 1 under six months", () => {
    expect(getExperienceLabel("2026-01", new Date(2026, 3, 1))).toBe("< 1");
  });

  it("steps in half years", () => {
    expect(getExperienceLabel("2022-12", new Date(2024, 11, 1))).toBe("2+");
    expect(getExperienceLabel("2022-12", new Date(2024, 5, 1))).toBe("1.5+");
  });
});

describe("hashClientIp", () => {
  it("is stable for the same IP", () => {
    expect(hashClientIp("1.2.3.4")).toBe(hashClientIp("1.2.3.4"));
  });

  it("differs across IPs", () => {
    expect(hashClientIp("1.2.3.4")).not.toBe(hashClientIp("5.6.7.8"));
  });
});

describe("isAllowedRequestOrigin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows jaypateldev.com in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const req = new Request("https://jaypateldev.com/api/contact", {
      headers: { origin: "https://jaypateldev.com" },
    });
    expect(isAllowedRequestOrigin(req)).toBe(true);
  });

  it("rejects a foreign origin in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const req = new Request("https://jaypateldev.com/api/contact", {
      headers: { origin: "https://evil.example" },
    });
    expect(isAllowedRequestOrigin(req)).toBe(false);
  });
});

describe("contributionYearQuery", () => {
  it("asks for last year and this year", async () => {
    const { contributionYearQuery } = await import("@/lib/github-years");
    expect(contributionYearQuery(new Date(2026, 7, 17))).toBe("y=2025&y=2026");
  });
});

describe("verifyRecaptchaToken", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("skips verification outside production even if a secret is set", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "test-secret");
    const { verifyRecaptchaToken } = await import("@/lib/recaptcha");
    await expect(verifyRecaptchaToken(undefined)).resolves.toBe(true);
  });

  it("skips verification when no secret is configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "");
    const { verifyRecaptchaToken } = await import("@/lib/recaptcha");
    await expect(verifyRecaptchaToken(undefined)).resolves.toBe(true);
  });

  it("rejects an empty token when a secret is set in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "test-secret");
    const { verifyRecaptchaToken } = await import("@/lib/recaptcha");
    await expect(verifyRecaptchaToken("")).resolves.toBe(false);
  });

  it("returns Google's success flag", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "test-secret");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      }),
    );
    const { verifyRecaptchaToken } = await import("@/lib/recaptcha");
    await expect(verifyRecaptchaToken("tok")).resolves.toBe(true);
  });
});
