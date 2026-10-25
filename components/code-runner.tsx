"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PythonEditor } from "@/components/python-editor";
import { RunnerOutput } from "@/components/runner-output";
import type { PyodideRunner as PyodideRunnerClient } from "@/lib/pyodide/client";
import type {
  ExecutionResult,
  PyodideState,
} from "@/lib/pyodide/protocol";
import { cn } from "@/lib/cn";

type CodeRunnerProps = {
  code: string;
  packages?: string[];
  caption?: string;
  className?: string;
};

export function CodeRunner({
  code,
  packages = [],
  caption,
  className,
}: CodeRunnerProps) {
  const [source, setSource] = useState(code);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [status, setStatus] = useState<PyodideState | null>(null);
  const [statusDetail, setStatusDetail] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);

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

    try {
      const runner = await getRunner();
      const nextResult = await runner.run(source, packages);
      if (!disposedRef.current) {
        setResult(nextResult);
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
  }, [getRunner, packages, source]);

  const handleReset = useCallback(async () => {
    if (busyRef.current) {
      return;
    }

    setResult(null);
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
        setBootError("The Python session could not be reset. Run the cell again to start a fresh one.");
      }
    } catch (error) {
      if (!disposedRef.current) {
        setBootError(
          error instanceof Error ? error.message : "The Python session could not be reset.",
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

  const loadingDetail = status === "loading" ? statusDetail : undefined;
  const isRunning = busy || status === "running";

  return (
    <section
      aria-label={caption ? `Code runner: ${caption}` : "Python code runner"}
      className={cn(
        "overflow-hidden rounded-[1.25rem] border border-ink/20 bg-ink text-paper shadow-[0_18px_40px_-30px_rgba(16,20,15,0.9)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-paper/45">
            Python
          </p>
          {caption ? (
            <p className="mt-1 truncate text-sm font-medium text-paper/90">
              {caption}
            </p>
          ) : null}
        </div>

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
        <PythonEditor onChange={setSource} value={source} />
      </div>

      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
        <button
          className="inline-flex items-center gap-2 rounded-full bg-acid px-4 py-2 text-sm font-semibold text-acid-ink transition-colors hover:bg-acid-deep disabled:cursor-not-allowed disabled:opacity-50"
          disabled={busy}
          onClick={handleRun}
          type="button"
        >
          {busy ? "Running\u2026" : "Run code"}
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
        className="border-t border-white/10 bg-[#0a0e09] px-4 py-4 sm:px-5"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper/40">
            Output
          </p>
          {loadingDetail ? (
            <p className="text-right text-xs text-paper/50">{loadingDetail}</p>
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
                : "Press Run to execute this cell. The first run downloads Python; later runs reuse the session."}
            </p>
          ) : null}

          {result ? <RunnerOutput result={result} /> : null}
        </div>
      </div>
    </section>
  );
}
