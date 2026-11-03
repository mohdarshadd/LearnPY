"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PythonEditor } from "@/components/python-editor";
import { RunnerOutput } from "@/components/runner-output";
import { cn } from "@/lib/cn";
import { practiceChallenges } from "@/content/practice/challenges";
import { takePracticeHandoff } from "@/lib/practice/handoff";
import type { PyodideRunner as PyodideRunnerClient } from "@/lib/pyodide/client";
import type {
  ExecutionResult,
  PyodideState,
} from "@/lib/pyodide/protocol";

type Example = {
  id: string;
  label: string;
  blurb: string;
  packages: string[];
  code: string;
};

const examples: Example[] = [
  {
    id: "numpy",
    label: "NumPy warm-up",
    blurb: "Array math, weights, and clipping.",
    packages: ["numpy"],
    code: `import numpy as np

scores = np.array([72, 88, 91, 65, 79])
weights = np.array([0.1, 0.2, 0.3, 0.2, 0.2])

print("mean:    ", scores.mean())
print("weighted:", np.average(scores, weights=weights))
print("adjusted:", (scores + 5).clip(0, 100))`,
  },
  {
    id: "pandas",
    label: "pandas table",
    blurb: "Build a frame and group it.",
    packages: ["pandas"],
    code: `import pandas as pd

df = pd.DataFrame({
    "team": ["a", "a", "b", "b"],
    "points": [10, 14, 7, 21],
})

print(df.groupby("team")["points"].agg(["count", "mean"]))`,
  },
  {
    id: "matplotlib",
    label: "Matplotlib figure",
    blurb: "Draw a figure and capture it as a PNG.",
    packages: ["numpy", "matplotlib"],
    code: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2 * np.pi, 200)
fig, ax = plt.subplots(figsize=(7, 3), layout="constrained")
ax.plot(x, np.sin(x), label="sin")
ax.plot(x, np.cos(x), label="cos")
ax.axhline(0, color="gray", linewidth=0.8)
ax.set_title("Sine and cosine")
ax.legend()`,
  },
  {
    id: "sklearn",
    label: "scikit-learn model",
    blurb: "Fit a classifier and score it.",
    packages: ["sklearn"],
    code: `from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data,
    iris.target,
    test_size=0.2,
    random_state=42,
    stratify=iris.target,
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
print("accuracy:", round(model.score(X_test, y_test), 3))
print("classes: ", model.classes_)`,
  },
];

const packageOptions = [
  { id: "numpy", label: "NumPy" },
  { id: "pandas", label: "pandas" },
  { id: "matplotlib", label: "Matplotlib" },
  { id: "sklearn", label: "scikit-learn" },
];

const presetIds = [
  "numpy-even-mask",
  "pandas-groupby-mean",
  "sklearn-classify",
];

const practicePresets = practiceChallenges.filter((challenge) =>
  presetIds.includes(challenge.id),
);

const STORAGE_KEY = "learnpy-playground-v1";
const knownPackages = new Set(packageOptions.map((option) => option.id));

function restoreSession():
  | { code: string; packages: string[]; exampleId: string | null }
  | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const candidate = parsed as {
      code?: unknown;
      packages?: unknown;
      exampleId?: unknown;
    };
    if (typeof candidate.code !== "string") {
      return null;
    }

    const packages = Array.isArray(candidate.packages)
      ? candidate.packages.filter(
          (value): value is string =>
            typeof value === "string" && knownPackages.has(value),
        )
      : [];

    return {
      code: candidate.code,
      packages,
      exampleId:
        typeof candidate.exampleId === "string" ? candidate.exampleId : null,
    };
  } catch {
    return null;
  }
}

export function Playground() {
  const firstExample = examples[0];
  const [source, setSource] = useState(firstExample.code);
  const [packages, setPackages] = useState<string[]>(firstExample.packages);
  const [activeExample, setActiveExample] = useState<string | null>(
    firstExample.id,
  );
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [status, setStatus] = useState<PyodideState | null>(null);
  const [statusDetail, setStatusDetail] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [handoffTitle, setHandoffTitle] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);

  const runnerRef = useRef<PyodideRunnerClient | null>(null);
  const runnerPromiseRef = useRef<Promise<PyodideRunnerClient> | null>(null);
  const busyRef = useRef(false);
  const disposedRef = useRef(false);

  useEffect(() => {
    disposedRef.current = false;

    const timer = window.setTimeout(() => {
      if (disposedRef.current) {
        return;
      }

      const handoff = takePracticeHandoff();

      if (handoff) {
        setSource(handoff.code);
        setPackages(handoff.packages);
        setActiveExample(null);
        setHandoffTitle(handoff.title);
      } else {
        const saved = restoreSession();

        if (saved) {
          setSource(saved.code);
          setPackages(saved.packages);
          setActiveExample(saved.exampleId);
        }
      }

      setHydrated(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      disposedRef.current = true;
      runnerRef.current?.dispose();
      runnerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ code: source, packages, exampleId: activeExample }),
      );
    } catch {
      // Storage can be unavailable in private or restricted contexts.
    }
  }, [activeExample, hydrated, packages, source]);

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

    if (!source.trim()) {
      setBootError("Write some Python first, or load an example.");
      return;
    }

    busyRef.current = true;
    setBusy(true);
    setBootError(null);
    setCopied(false);

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
    setCopied(false);

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
          "The Python session could not be reset. Run again to start a fresh one.",
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

  const handleExample = (example: Example) => {
    if (busyRef.current) {
      return;
    }

    setSource(example.code);
    setPackages(example.packages);
    setActiveExample(example.id);
    setHandoffTitle(null);
    setResult(null);
    setBootError(null);
    setCopied(false);
  };

  const handlePreset = (preset: (typeof practicePresets)[number]) => {
    if (busyRef.current) {
      return;
    }

    setSource(preset.starterCode);
    setPackages(preset.packages);
    setActiveExample(null);
    setHandoffTitle(preset.title);
    setResult(null);
    setBootError(null);
    setCopied(false);
  };

  const handleClear = () => {
    if (busyRef.current) {
      return;
    }

    setSource("");
    setActiveExample(null);
    setHandoffTitle(null);
    setResult(null);
    setBootError(null);
    setCopied(false);
  };

  const togglePackage = (id: string) => {
    setPackages((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setBootError("The browser blocked clipboard access.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void handleRun();
    }
  };

  const loadingDetail = status === "loading" ? statusDetail : undefined;
  const isRunning = busy || status === "running";
  const lineCount = source ? source.split("\n").length : 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div
        className={cn(
          "grid gap-6 lg:items-start",
          focusMode
            ? "mx-auto max-w-5xl"
            : "lg:grid-cols-[minmax(0,1fr)_280px]",
        )}
      >
        <section
          aria-label="Python playground"
          className="overflow-hidden rounded-[1.25rem] border border-ink/20 bg-ink text-paper shadow-[0_18px_40px_-30px_rgba(16,20,15,0.9)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-paper/45">
                Scratchpad
              </p>
              <p className="mt-1 text-sm font-medium text-paper/90">
                {activeExample
                  ? examples.find((example) => example.id === activeExample)
                      ?.label ?? "Custom session"
                  : handoffTitle
                    ? `Practice: ${handoffTitle}`
                    : "Custom session"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-paper/35">
                {lineCount} {lineCount === 1 ? "line" : "lines"}
              </span>
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
          </div>

          <div
            className="border-y border-white/10 bg-[#0d120c]"
            onKeyDown={handleKeyDown}
          >
            <PythonEditor
              ariaLabel="Playground Python editor"
              height={460}
              onChange={setSource}
              value={source}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
            <button
              className="inline-flex items-center gap-2 rounded-full bg-acid px-4 py-2 text-sm font-semibold text-acid-ink transition-colors hover:bg-acid-deep disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy}
              onClick={handleRun}
              type="button"
            >
              {busy ? "Running\u2026" : "Run"}
              <span aria-hidden="true">&rarr;</span>
            </button>
            <button
              className="rounded-full border border-white/20 px-3.5 py-2 text-sm font-medium text-paper/75 transition-colors hover:border-white/35 hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
              disabled={busy}
              onClick={handleReset}
              type="button"
            >
              Reset session
            </button>
            <button
              className="rounded-full border border-white/20 px-3.5 py-2 text-sm font-medium text-paper/75 transition-colors hover:border-white/35 hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
              disabled={busy}
              onClick={handleClear}
              type="button"
            >
              Clear
            </button>
            <button
              className="rounded-full border border-white/20 px-3.5 py-2 text-sm font-medium text-paper/75 transition-colors hover:border-white/35 hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => void handleCopy()}
              type="button"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              aria-pressed={focusMode}
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                focusMode
                  ? "border-acid/50 bg-acid/10 text-acid"
                  : "border-white/20 text-paper/75 hover:border-white/35 hover:text-paper",
              )}
              onClick={() => setFocusMode((active) => !active)}
              type="button"
            >
              {focusMode ? "Exit focus" : "Focus mode"}
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
                <p className="text-right text-xs text-paper/50">
                  {loadingDetail}
                </p>
              ) : result ? (
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-paper/35">
                  {(result.durationMs / 1000).toFixed(2)}s
                </p>
              ) : null}
            </div>

            <div className="mt-3 min-h-24 space-y-3 text-sm">
              {bootError ? (
                <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-red-200">
                  {bootError}
                </p>
              ) : null}

              {!result && !bootError ? (
                <p className="text-paper/45">
                  {isRunning
                    ? "Preparing the Python session\u2026"
                    : "Run the cell to see stdout, errors, and captured figures here. The first run downloads Python; later runs reuse the session."}
                </p>
              ) : null}

              {result ? <RunnerOutput result={result} /> : null}
            </div>
          </div>
        </section>

        {!focusMode ? (
        <aside className="space-y-4 lg:sticky lg:top-24">
          <section
            aria-labelledby="playground-examples"
            className="rounded-[1.25rem] border border-line bg-surface p-5"
          >
            <h2
              className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted"
              id="playground-examples"
            >
              Load an example
            </h2>
            <div className="mt-3 space-y-2">
              {examples.map((example) => (
                <button
                  className={cn(
                    "w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                    activeExample === example.id
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-paper text-ink-soft hover:border-ink/30 hover:text-ink",
                  )}
                  disabled={busy}
                  key={example.id}
                  onClick={() => handleExample(example)}
                  type="button"
                >
                  <span className="block text-sm font-semibold">
                    {example.label}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block text-xs",
                      activeExample === example.id
                        ? "text-paper/60"
                        : "text-muted",
                    )}
                  >
                    {example.blurb}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="playground-presets"
            className="rounded-[1.25rem] border border-line bg-surface p-5"
          >
            <h2
              className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted"
              id="playground-presets"
            >
              Challenge presets
            </h2>
            <div className="mt-3 space-y-2">
              {practicePresets.map((preset) => (
                <button
                  className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-left text-sm font-semibold text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
                  disabled={busy}
                  key={preset.id}
                  onClick={() => handlePreset(preset)}
                  type="button"
                >
                  {preset.title}
                  <span className="mt-0.5 block text-xs font-normal text-muted">
                    {preset.summary}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="playground-packages"
            className="rounded-[1.25rem] border border-line bg-surface p-5"
          >
            <h2
              className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted"
              id="playground-packages"
            >
              Libraries to load
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Load only what you import. Packages stay available until you reset
              the session.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {packageOptions.map((option) => {
                const selected = packages.includes(option.id);
                return (
                  <button
                    aria-pressed={selected}
                    className={cn(
                      "rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors",
                      selected
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-paper text-ink-soft hover:border-ink/30 hover:text-ink",
                    )}
                    key={option.id}
                    onClick={() => togglePackage(option.id)}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[1.25rem] border border-line bg-paper-deep/60 p-5">
            <p className="text-xs leading-relaxed text-muted">
              Your draft is saved in this browser. The Python namespace persists
              between runs, so variables keep their values.
            </p>
            <Link
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-ink-soft"
              href="/reference"
            >
              Browse the reference
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </section>
        </aside>
        ) : null}
      </div>
    </div>
  );
}
