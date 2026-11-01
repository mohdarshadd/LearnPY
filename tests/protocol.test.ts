import { describe, expect, it } from "vitest";
import {
  DEFAULT_TIMEOUT_MS,
  MAX_OUTPUT_CHARS,
  PYODIDE_INDEX_URL,
  PYODIDE_VERSION,
} from "../lib/pyodide/protocol";

describe("pyodide protocol", () => {
  it("pins the Pyodide runtime and CDN path", () => {
    expect(PYODIDE_VERSION).toBe("314.0.7");
    expect(PYODIDE_INDEX_URL).toBe(
      "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/",
    );
  });

  it("keeps execution limits explicit", () => {
    expect(DEFAULT_TIMEOUT_MS).toBe(90_000);
    expect(MAX_OUTPUT_CHARS).toBe(80_000);
  });
});
