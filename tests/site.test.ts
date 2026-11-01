import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "../lib/site";

function clearSiteEnvironment() {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
  vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
  vi.stubEnv("VERCEL_URL", "");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("site URL", () => {
  it("prefers the explicit public URL", () => {
    clearSiteEnvironment();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://learnpy.example");

    expect(getSiteUrl().toString()).toBe("https://learnpy.example/");
  });

  it("uses the Vercel production hostname when no public URL is set", () => {
    clearSiteEnvironment();
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "learnpy.vercel.app");

    expect(getSiteUrl().toString()).toBe("https://learnpy.vercel.app/");
  });

  it("falls back to localhost for local builds", () => {
    clearSiteEnvironment();

    expect(getSiteUrl().toString()).toBe("http://localhost:3000/");
  });
});
