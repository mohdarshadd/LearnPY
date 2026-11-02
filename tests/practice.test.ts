import { describe, expect, it } from "vitest";
import {
  buildTestScript,
  parseTestOutput,
  TEST_MARKER,
} from "../lib/practice/test-harness";

const exercise = {
  tests: [
    { name: "answer is 42", code: "assert answer == 42" },
    { name: "answer is positive", code: "assert answer > 0" },
  ],
};

describe("practice test harness", () => {
  it("builds a script that reports each test", () => {
    const script = buildTestScript(exercise, "answer = 42");

    expect(script).toContain("answer = 42");
    expect(script).toContain("answer is 42");
    expect(script).toContain("answer is positive");
    expect(script).toContain(TEST_MARKER);
  });

  it("parses results and removes the marker from stdout", () => {
    const payload = JSON.stringify([
      { name: "answer is 42", passed: true, message: "" },
    ]);
    const parsed = parseTestOutput(`hello\n${TEST_MARKER}${payload}\n`);

    expect(parsed.stdout).toBe("hello");
    expect(parsed.results).toEqual([
      { name: "answer is 42", passed: true, message: "" },
    ]);
  });

  it("returns null when no marker is present", () => {
    expect(parseTestOutput("plain output").results).toBeNull();
  });
});
