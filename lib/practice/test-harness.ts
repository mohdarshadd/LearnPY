import type { Exercise } from "@/content/schema";

export const TEST_MARKER = "__LEARNPY_TESTS__";

export type TestResult = {
  name: string;
  passed: boolean;
  message: string;
};

export function buildTestScript(
  exercise: Pick<Exercise, "tests">,
  source: string,
) {
  const lines = [
    source.trimEnd(),
    "",
    "import json as _learnpy_exercise_json",
    "_learnpy_exercise_results = []",
  ];

  for (const test of exercise.tests) {
    lines.push("try:");

    for (const line of test.code.replace(/\r\n/g, "\n").split("\n")) {
      lines.push(`    ${line}`);
    }

    lines.push(
      `    _learnpy_exercise_results.append({"name": ${JSON.stringify(test.name)}, "passed": True, "message": ""})`,
      "except Exception as _learnpy_exercise_error:",
      `    _learnpy_exercise_results.append({"name": ${JSON.stringify(test.name)}, "passed": False, "message": f"{type(_learnpy_exercise_error).__name__}: {_learnpy_exercise_error}"})`,
    );
  }

  lines.push(
    `print(${JSON.stringify(TEST_MARKER)} + _learnpy_exercise_json.dumps(_learnpy_exercise_results))`,
  );

  return lines.join("\n");
}

export function parseTestOutput(stdout: string): {
  results: TestResult[] | null;
  stdout: string;
} {
  const lines = stdout.split("\n");
  let markerIndex = -1;

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index].startsWith(TEST_MARKER)) {
      markerIndex = index;
      break;
    }
  }

  if (markerIndex === -1) {
    return { results: null, stdout };
  }

  const payload = lines[markerIndex].slice(TEST_MARKER.length);

  try {
    const parsed: unknown = JSON.parse(payload);

    if (!Array.isArray(parsed)) {
      return { results: null, stdout };
    }

    const results: TestResult[] = [];

    for (const item of parsed) {
      if (
        typeof item === "object" &&
        item !== null &&
        "name" in item &&
        "passed" in item &&
        "message" in item &&
        typeof item.name === "string" &&
        typeof item.passed === "boolean" &&
        typeof item.message === "string"
      ) {
        results.push({
          name: item.name,
          passed: item.passed,
          message: item.message,
        });
      }
    }

    return {
      results,
      stdout: lines
        .filter((_, index) => index !== markerIndex)
        .join("\n")
        .trimEnd(),
    };
  } catch {
    return { results: null, stdout };
  }
}
