"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PythonEditor } from "@/components/python-editor";
import { RunnerOutput } from "@/components/runner-output";
import type { Exercise } from "@/content/schema";
import type { PyodideRunner as PyodideRunnerClient } from "@/lib/pyodide/client";
import type {
  ExecutionResult,
  PyodideState,
} from "@/lib/pyodide/protocol";
import {
  buildTestScript,
  parseTestOutput,
  type TestResult,
} from "@/lib/practice/test-harness";
import { cn } from "@/lib/cn";

type ExerciseCardProps = {
  exercise: Exercise;
  lessonPackages?: string[];
  compact?: boolean;
  mode?: "build" | "fix";
  onPassed?: () => void;
};

export function ExerciseCard({
  exercise,
  lessonPackages = [],
  compact = false,
  mode = "build",
  onPassed,
}: ExerciseCardProps) {
  const packages = Array.from(
    new Set([...lessonPackages, ...exercise.packages]),
  );

  const [source, setSource] = useState(exercise.starterCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [status, setStatus] = useState<PyodideState | null>(null);
  const [statusDetail, setStatusDetail] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [draftBeforeSolution, setDraftBeforeSolution] = useState<string | null>(
    null,
  );

  const runnerRef = useRef<PyodideRunnerClient | null>(null);
  const runnerPromiseRef = useRef<Promise<PyodideRunnerClient> | null>(null);
  const busyRef = useRef(false);
  const disposedRef = useRef(false);

  useEffect(() => {
    disposedRef.current = false;

    return () => {
      disposedRef.current = true;
      runnerRef.current?.dispose();
      runnerRef.current = null;
    };
  }, []);

  const getRunner = useCallback(() => {
    if (runnerRef.current) {
      return Promise.resolve(runnerRef.current);
    }

    if (!runnerPromiseRef.current) {
      runnerPromiseRef.current = import("@/lib/pyodide/client").then(
        ({ PyodideRunner }) => {
          const runner = new PyodideRunner({
            onStatus: (state, detail) => {
              if (!disposedRef.current) {
                setStatus(state);
                setStatusDetail(detail);
              }
            },
          });

          if (disposedRef.current) {
            runner.dispose();
          } else {
            runnerRef.current = runner;
          }

          return runner;
        },
      );
    }

    return runnerPromiseRef.current;
  }, []);

  const handleRun = useCallback(async () => {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setBusy(true);
    setBootError(null);
    setTestResults(null);

    try {
      const runner = await getRunner();
      const script = buildTestScript(exercise, source);
      const nextResult = await runner.run(script, packages);
      const parsed = parseTestOutput(nextResult.stdout);

      if (!disposedRef.current) {
        setResult({ ...nextResult, stdout: parsed.stdout });
        setTestResults(parsed.results);

        if (
          parsed.results &&
          parsed.results.length > 0 &&
          parsed.results.every((test) => test.passed)
        ) {
          onPassed?.();
        }
      }
    } catch (error) {
      runnerPromiseRef.current = null;
      if (!disposedRef.current) {
        setBootError(
          error instanceof Error
            ? error.message
            : "The Python runner could not start.",
        );
      }
    } finally {
      busyRef.current = false;
      if (!disposedRef.current) {
        setBusy(false);
      }
    }
  }, [exercise, getRunner, onPassed, packages, source]);

  const handleReset = useCallback(async () => {
    if (busyRef.current) {
      return;
    }

    setResult(null);
    setTestResults(null);
    setBootError(null);

    const runner = runnerRef.current;
    if (!runner) {
      return;
    }

    busyRef.current = true;
    setBusy(true);

    try {
      const ok = await runner.reset();
      if (!ok && !disposedRef.current) {
        setBootError(
          "The Python session could not be reset. Run the exercise again to start a fresh one.",
        );
      }
    } catch (error) {
      if (!disposedRef.current) {
        setBootError(
          error instanceof Error
            ? error.message
            : "The Python session could not be reset.",
        );
      }
    } finally {
      busyRef.current = false;
      if (!disposedRef.current) {
        setBusy(false);
      }
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void handleRun();
    }
  };

  const handleSourceChange = (value: string) => {
    setSource(value);
    setResult(null);
    setTestResults(null);
    setBootError(null);
  };

  const handleSolutionToggle = () => {
    if (solutionVisible) {
      setSource(draftBeforeSolution ?? exercise.starterCode);
      setDraftBeforeSolution(null);
      setSolutionVisible(false);
      setResult(null);
      setTestResults(null);
      return;
    }

    setDraftBeforeSolution(source);
    setSource(exercise.solution);
    setSolutionVisible(true);
    setResult(null);
    setTestResults(null);
  };

  const loadingDetail = status === "loading" ? statusDetail : undefined;
  const isRunning = busy || status === "running";
  const passedCount = testResults?.filter((test) => test.passed).length ?? 0;
  const failedCount = testResults ? testResults.length - passedCount : 0;

  return (
    <article
      aria-labelledby={`${exercise.id}-heading`}
      className="overflow-hidden rounded-[1.25rem] border border-line bg-surface"
      id={exercise.id}
    >
      <div
        className={cn(
          "border-b border-line",
          compact ? "px-4 py-3" : "px-5 py-4 sm:px-6",
        )}
      >
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
          {mode === "fix" ? "Bug hunt" : compact ? "Try it" : "Exercise"}
        </p>
        <h3
          className={cn(
            "mt-1.5 font-semibold tracking-tight",
            compact ? "text-base" : "text-lg",
          )}
          id={`${exercise.id}-heading`}
        >
          {exercise.prompt}
        </h3>
      </div>

      <div
        className={cn(
          "grid gap-4",
          compact ? "px-4 py-4" : "px-5 py-5 sm:px-6",
        )}
      >
        <div className="overflow-hidden rounded-[1.15rem] border border-ink/20 bg-ink text-paper">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-paper/45">
              Your solution
            </p>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em]",
                isRunning
                  ? "border-acid/40 bg-acid/10 text-acid"
                  : "border-white/15 bg-white/5 text-paper/55",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full",
                  isRunning ? "animate-pulse bg-acid" : "bg-paper/40",
                )}
              />
              {isRunning ? "Running" : "Ready"}
            </span>
          </div>

          <div
            className="border-y border-white/10 bg-[#0d120c]"
            onKeyDown={handleKeyDown}
          >
            <PythonEditor
              ariaLabel={`Python code editor for ${exercise.prompt}`}
              height={compact ? 160 : 220}
              onChange={handleSourceChange}
              value={source}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 px-4 py-3">
            <button
              className="inline-flex items-center gap-2 rounded-full bg-acid px-4 py-2 text-sm font-semibold text-acid-ink transition-colors hover:bg-acid-deep disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy}
              onClick={handleRun}
              type="button"
            >
              {busy ? "Running tests\u2026" : "Run tests"}
              <span aria-hidden="true">&rarr;</span>
            </button>
            <button
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-paper/75 transition-colors hover:border-white/35 hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
              disabled={busy}
              onClick={handleReset}
              type="button"
            >
              Reset session
            </button>
            <p className="ml-auto hidden font-mono text-[0.6rem] uppercase tracking-[0.12em] text-paper/35 sm:block">
              Ctrl / &#8984; + Enter
            </p>
          </div>

          <div
            aria-live="polite"
            className="border-t border-white/10 bg-[#0a0e09] px-4 py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper/40">
                Results
              </p>
              {loadingDetail ? (
                <p className="text-right text-xs text-paper/50">
                  {loadingDetail}
                </p>
              ) : result ? (
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-paper/35">
                  {(result.durationMs / 1000).toFixed(2)}s
                </p>
              ) : null}
            </div>

            <div className="mt-3 space-y-3 text-sm">
              {bootError ? (
                <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-red-200">
                  {bootError}
                </p>
              ) : null}

              {!result && !bootError ? (
                <p className="text-paper/45">
                  {isRunning
                    ? "Preparing the Python session\u2026"
                    : "Run the tests to check your solution. The first run downloads Python; later runs reuse the session."}
                </p>
              ) : null}

              {testResults ? (
                <div>
                  <p
                    className={cn(
                      "rounded-lg border px-3 py-2 font-medium",
                      failedCount === 0
                        ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
                        : "border-amber-300/25 bg-amber-300/10 text-amber-100",
                    )}
                    role="status"
                  >
                    {failedCount === 0
                      ? `All ${passedCount} test${passedCount === 1 ? "" : "s"} pass.`
                      : `${passedCount} of ${testResults.length} tests pass.`}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {testResults.map((test, index) => (
                      <li
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                        key={`${test.name}-${index}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-paper/85">{test.name}</span>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.1em]",
                              test.passed
                                ? "bg-emerald-300/15 text-emerald-200"
                                : "bg-red-400/15 text-red-200",
                            )}
                          >
                            {test.passed ? "Pass" : "Fail"}
                          </span>
                        </div>
                        {test.passed ? null : (
                          <p className="mt-1 font-mono text-xs leading-relaxed text-red-100/80">
                            {test.message}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {result ? (
                <RunnerOutput result={result} showEmptySuccess={false} />
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-2">
          {exercise.hints.length > 0 && hintsShown < exercise.hints.length ? (
            <button
              className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-ink/30"
              onClick={() => setHintsShown((count) => count + 1)}
              type="button"
            >
              Reveal hint {hintsShown + 1} of {exercise.hints.length}
            </button>
          ) : null}
          <button
            className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-ink/30"
            onClick={handleSolutionToggle}
            type="button"
          >
            {solutionVisible ? "Restore your draft" : "Show solution"}
          </button>
        </div>

        {hintsShown > 0 ? (
          <ol className="space-y-2 rounded-[1rem] border border-line bg-paper-deep/40 p-4 text-sm text-ink-soft">
            {exercise.hints.slice(0, hintsShown).map((hint, index) => (
              <li className="flex gap-3" key={`${hint}-${index}`}>
                <span className="font-mono text-xs text-muted">
                  {index + 1}
                </span>
                <span>{hint}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </article>
  );
}
