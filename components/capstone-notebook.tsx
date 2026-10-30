"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PythonEditor } from "@/components/python-editor";
import { RunnerOutput } from "@/components/runner-output";
import { cn } from "@/lib/cn";
import type { PyodideRunner as PyodideRunnerClient } from "@/lib/pyodide/client";
import type {
  ExecutionResult,
  PyodideState,
} from "@/lib/pyodide/protocol";

type Cell = {
  id: string;
  title: string;
  blurb: string;
  code: string;
};

const cells: Cell[] = [
  {
    id: "load",
    title: "Load the table",
    blurb:
      "Bring the wine measurements into pandas and keep the cultivar labels readable.",
    code: `import pandas as pd
from sklearn.datasets import load_wine

wine = load_wine(as_frame=True)
df = wine.frame.rename(columns={"target": "cultivar"})
df["cultivar_name"] = df["cultivar"].map(
    dict(enumerate(wine.target_names))
)

print("rows, columns:", df.shape)
print(df["cultivar_name"].value_counts())
print(df.head())`,
  },
  {
    id: "audit",
    title: "Audit the columns",
    blurb:
      "Check types, missing values, and the scale of the chemical measurements.",
    code: `summary = pd.DataFrame({
    "dtype": df.dtypes.astype(str),
    "missing": df.isna().sum(),
    "unique": df.nunique(),
})
print(summary)
print("total missing:", int(df.isna().sum().sum()))
print()
print(df[["alcohol", "flavanoids", "color_intensity", "proline"]].describe().round(2))`,
  },
  {
    id: "profile",
    title: "Profile the classes",
    blurb:
      "Compare group means before modeling. A feature that barely moves is not doing much work.",
    code: `chosen = ["alcohol", "flavanoids", "color_intensity", "proline"]
profile = df.groupby("cultivar_name")[chosen].mean().round(2)
print(profile)

spread = profile.max() - profile.min()
print("\\nlargest separation:")
print(spread.sort_values(ascending=False).round(2))`,
  },
  {
    id: "visualize",
    title: "Look before modeling",
    blurb:
      "Plot two candidate features and a distribution. Look for separation, overlap, and unusual points.",
    code: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(9, 3.6), layout="constrained")

for name, group in df.groupby("cultivar_name"):
    axes[0].scatter(
        group["alcohol"],
        group["flavanoids"],
        label=name,
        alpha=0.75,
    )
axes[0].set_title("Alcohol vs flavanoids")
axes[0].set_xlabel("alcohol")
axes[0].set_ylabel("flavanoids")
axes[0].legend()

axes[1].hist(df["alcohol"], bins=15, color="#4d6b3c", edgecolor="white")
axes[1].set_title("Alcohol distribution")
axes[1].set_xlabel("alcohol")
axes[1].set_ylabel("rows")`,
  },
  {
    id: "fit",
    title: "Split and fit a pipeline",
    blurb:
      "Keep the test rows untouched. Scale inside the pipeline so the test set never informs preprocessing.",
    code: `from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

feature_columns = [
    column
    for column in df.columns
    if column not in {"cultivar", "cultivar_name"}
]
X = df[feature_columns]
y = df["cultivar"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y,
)

model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)

print("train:", X_train.shape, "test:", X_test.shape)
print("test accuracy:", round(model.score(X_test, y_test), 3))`,
  },
  {
    id: "evaluate",
    title: "Evaluate honestly",
    blurb:
      "Compare against a majority-class baseline, inspect per-class quality, and look at the confusion matrix.",
    code: `import matplotlib.pyplot as plt
from sklearn.dummy import DummyClassifier
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import cross_val_score

predictions = model.predict(X_test)
cv_scores = cross_val_score(model, X_train, y_train, cv=5)

baseline = DummyClassifier(strategy="most_frequent")
baseline.fit(X_train, y_train)

print("baseline test accuracy:", round(baseline.score(X_test, y_test), 3))
print("cross-validation:      ", cv_scores.round(3))
print("mean CV accuracy:      ", round(cv_scores.mean(), 3))
print()
print(classification_report(
    y_test,
    predictions,
    target_names=wine.target_names,
    digits=3,
))

matrix = confusion_matrix(y_test, predictions)
fig, ax = plt.subplots(figsize=(5.4, 4), layout="constrained")
ConfusionMatrixDisplay(matrix, display_labels=wine.target_names).plot(
    ax=ax,
    colorbar=False,
    cmap="Greens",
)
ax.set_title("Held-out confusion matrix")`,
  },
  {
    id: "stretch",
    title: "Stretch: try another model",
    blurb:
      "Optional. Swap the estimator and compare cross-validated accuracy. Change one thing at a time.",
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

forest = RandomForestClassifier(n_estimators=300, random_state=42)
forest.fit(X_train, y_train)
forest_cv = cross_val_score(forest, X_train, y_train, cv=5)

print("logistic CV:", round(cv_scores.mean(), 3))
print("forest CV:  ", round(forest_cv.mean(), 3))
print("forest test:", round(forest.score(X_test, y_test), 3))`,
  },
];

const starterSources = Object.fromEntries(
  cells.map((cell) => [cell.id, cell.code]),
) as Record<string, string>;

const packages = ["numpy", "pandas", "matplotlib", "sklearn"];
const STORAGE_KEY = "learnpy-capstone-v1";
const knownCells = new Set(cells.map((cell) => cell.id));

function restoreSources(): Record<string, string> | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const restored = { ...starterSources };
    let found = false;

    for (const [id, value] of Object.entries(parsed)) {
      if (knownCells.has(id) && typeof value === "string") {
        restored[id] = value;
        found = true;
      }
    }

    return found ? restored : null;
  } catch {
    return null;
  }
}

export function CapstoneNotebook() {
  const [sources, setSources] = useState<Record<string, string>>(() => ({
    ...starterSources,
  }));
  const [results, setResults] = useState<
    Record<string, ExecutionResult | null>
  >({});
  const [status, setStatus] = useState<PyodideState | null>(null);
  const [statusDetail, setStatusDetail] = useState<string | undefined>();
  const [busyCell, setBusyCell] = useState<string | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

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

      const saved = restoreSources();
      if (saved) {
        setSources(saved);
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
    } catch {
      // Storage can be unavailable in private or restricted contexts.
    }
  }, [hydrated, sources]);

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

  const executeCell = useCallback(
    async (cell: Cell, code: string, label: string) => {
      setBusyCell(cell.id);
      setProgressLabel(label);
      const runner = await getRunner();
      const result = await runner.run(code, packages);
      if (!disposedRef.current) {
        setResults((current) => ({ ...current, [cell.id]: result }));
      }
      return result;
    },
    [getRunner],
  );

  const handleRunCell = useCallback(
    async (index: number) => {
      if (busyRef.current) {
        return;
      }

      const cell = cells[index];
      if (!cell) {
        return;
      }

      busyRef.current = true;
      setBatchRunning(false);
      setBootError(null);
      setCopied(false);

      try {
        await executeCell(cell, sources[cell.id], `Cell ${index + 1} of ${cells.length}`);
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
          setBusyCell(null);
          setProgressLabel(null);
        }
      }
    },
    [executeCell, sources],
  );

  const handleRunAll = useCallback(async () => {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setBatchRunning(true);
    setBootError(null);
    setCopied(false);

    try {
      for (let index = 0; index < cells.length; index += 1) {
        const cell = cells[index];
        if (!cell || disposedRef.current) {
          break;
        }

        const result = await executeCell(
          cell,
          sources[cell.id],
          `Cell ${index + 1} of ${cells.length}`,
        );

        if (result.error) {
          break;
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
        setBatchRunning(false);
        setBusyCell(null);
        setProgressLabel(null);
      }
    }
  }, [executeCell, sources]);

  const handleReset = useCallback(async () => {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setResetting(true);
    setBootError(null);
    setCopied(false);
    setResults({});
    setProgressLabel("Resetting the Python session\u2026");

    try {
      const runner = runnerRef.current;
      if (runner) {
        const ok = await runner.reset();
        if (!ok && !disposedRef.current) {
          setBootError(
            "The Python session could not be reset. Run a cell again to start a fresh one.",
          );
        }
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
        setResetting(false);
        setProgressLabel(null);
      }
    }
  }, []);

  const handleRestore = () => {
    if (busyRef.current) {
      return;
    }

    setSources({ ...starterSources });
    setResults({});
    setBootError(null);
    setCopied(false);
  };

  const handleChange = (id: string, value: string) => {
    setSources((current) => ({ ...current, [id]: value }));
    setResults((current) => ({ ...current, [id]: null }));
  };

  const handleCopy = async () => {
    const script = cells
      .map((cell) => `# ${cell.title}\n${sources[cell.id]}`)
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setBootError("The browser blocked clipboard access.");
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void handleRunCell(index);
    }
  };

  const busy = busyCell !== null || batchRunning || resetting;
  const loadingDetail = status === "loading" ? statusDetail : undefined;

  return (
    <div>
      <div className="sticky top-16 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-3 px-5 py-3 sm:px-8">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy}
            onClick={() => void handleRunAll()}
            type="button"
          >
            {batchRunning ? "Running notebook\u2026" : "Run all cells"}
            <span aria-hidden="true">&rarr;</span>
          </button>
          <button
            className="rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            disabled={busy}
            onClick={() => void handleReset()}
            type="button"
          >
            {resetting ? "Resetting\u2026" : "Reset session"}
          </button>
          <button
            className="rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            disabled={busy}
            onClick={handleRestore}
            type="button"
          >
            Restore starter
          </button>
          <button
            className="rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => void handleCopy()}
            type="button"
          >
            {copied ? "Copied" : "Copy script"}
          </button>

          <p
            aria-live="polite"
            className="ml-auto hidden text-xs text-muted sm:block"
          >
            {loadingDetail ??
              progressLabel ??
              (busyCell ? "Running a cell\u2026" : "Draft saved locally")}
          </p>
        </div>
      </div>

      {bootError ? (
        <div className="mx-auto w-full max-w-5xl px-5 pt-5 sm:px-8">
          <p
            className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {bootError}
          </p>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-5xl space-y-6 px-5 py-8 sm:px-8 sm:py-10">
        {cells.map((cell, index) => {
          const result = results[cell.id] ?? null;
          const isRunning = busyCell === cell.id;
          const done = result?.ok === true;

          return (
            <article
              className="overflow-hidden rounded-[1.25rem] border border-line bg-surface"
              key={cell.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-4">
                <div className="min-w-0">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                    Cell {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight">
                    {cell.title}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                    {cell.blurb}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.1em]",
                      isRunning
                        ? "border-ink/20 bg-ink/5 text-ink"
                        : done
                          ? "border-acid-deep/30 bg-acid/20 text-acid-ink"
                          : "border-line bg-paper text-muted",
                    )}
                  >
                    {isRunning ? "Running" : done ? "Passed" : "Not run"}
                  </span>
                  <button
                    className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={busy}
                    onClick={() => void handleRunCell(index)}
                    type="button"
                  >
                    Run cell
                  </button>
                </div>
              </div>

              <div
                className="border-b border-white/10 bg-[#0d120c]"
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <PythonEditor
                  ariaLabel={`Cell ${index + 1}: ${cell.title}`}
                  height={index === 5 || index === 6 ? 300 : 250}
                  onChange={(value) => handleChange(cell.id, value)}
                  readOnly={busy}
                  value={sources[cell.id]}
                />
              </div>

              <div
                aria-live="polite"
                className="bg-[#0a0e09] px-4 py-4 text-paper sm:px-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper/40">
                    Output
                  </p>
                  {result ? (
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-paper/35">
                      {(result.durationMs / 1000).toFixed(2)}s
                    </p>
                  ) : null}
                </div>

                <div className="mt-3 text-sm">
                  {isRunning ? (
                    <p className="text-paper/45">
                      {loadingDetail ?? "Running this cell\u2026"}
                    </p>
                  ) : result ? (
                    <RunnerOutput result={result} />
                  ) : (
                    <p className="text-paper/40">
                      Run this cell to see its output. Cells share one Python
                      session, so run them in order.
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
