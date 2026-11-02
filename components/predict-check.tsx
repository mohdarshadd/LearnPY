"use client";

import { useId, useState } from "react";
import type { PredictCheck } from "@/content/schema";
import { cn } from "@/lib/cn";

export function PredictCheck({ check }: { check: PredictCheck }) {
  const baseId = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const isCorrect = selected === check.answerId;

  return (
    <section
      aria-labelledby={`${baseId}-heading`}
      className="rounded-[1.1rem] border border-ink/15 bg-surface p-4 sm:p-5"
    >
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
        Predict first
      </p>
      <h3
        className="mt-1.5 text-base font-semibold leading-6 tracking-tight"
        id={`${baseId}-heading`}
      >
        {check.question}
      </h3>

      {check.code ? (
        <pre className="mt-3 overflow-x-auto rounded-xl bg-ink p-3 font-mono text-xs leading-6 text-paper/85">
          <code>{check.code}</code>
        </pre>
      ) : null}

      <fieldset className="mt-3" disabled={checked}>
        <legend className="sr-only">{check.question}</legend>
        <div className="grid gap-2">
          {check.options.map((option) => {
            const optionId = `${baseId}-${option.id}`;
            const selectedOption = selected === option.id;

            return (
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                  selectedOption
                    ? "border-ink/35 bg-paper-deep/45"
                    : "border-line bg-paper hover:border-ink/25",
                  checked && option.id === check.answerId
                    ? "border-emerald-500/40 bg-emerald-50"
                    : null,
                  checked && selectedOption && !isCorrect
                    ? "border-red-400/50 bg-red-50"
                    : null,
                )}
                htmlFor={optionId}
                key={option.id}
              >
                <input
                  checked={selectedOption}
                  className="mt-1 accent-ink"
                  id={optionId}
                  name={baseId}
                  onChange={() => setSelected(option.id)}
                  type="radio"
                  value={option.id}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!selected || checked}
          onClick={() => setChecked(true)}
          type="button"
        >
          Reveal answer
        </button>
        {checked ? (
          <button
            className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-ink/30"
            onClick={() => {
              setChecked(false);
              setSelected(null);
            }}
            type="button"
          >
            Try again
          </button>
        ) : null}
      </div>

      {checked ? (
        <p
          className={cn(
            "mt-3 rounded-lg border px-3 py-2 text-sm leading-6",
            isCorrect
              ? "border-emerald-500/30 bg-emerald-50 text-emerald-900"
              : "border-red-400/40 bg-red-50 text-red-950",
          )}
          role="status"
        >
          <span className="font-semibold">
            {isCorrect ? "Correct. " : "Not quite. "}
          </span>
          {check.explanation}
        </p>
      ) : null}
    </section>
  );
}
