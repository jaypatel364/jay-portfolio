import { afterEach, describe, expect, it, vi } from "vitest";
import { getExperienceLabel } from "@/lib/utils";
import { hashClientIp } from "@/lib/client-ip";
import { isAllowedRequestOrigin } from "@/lib/request-origin";
import { contactSchema } from "@/lib/contact-schema";

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

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = contactSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const parsed = contactSchema.safeParse({
      name: "Ada",
      email: "not-an-email",
      message: "Hello",
    });
    expect(parsed.success).toBe(false);
  });
});
