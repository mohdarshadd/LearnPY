"use client";

import { useId, useState } from "react";
import type { QuizQuestion } from "@/content/schema";
import { cn } from "@/lib/cn";

type QuizProps = {
  questions: QuizQuestion[];
};

export function Quiz({ questions }: QuizProps) {
  const baseId = useId();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const headingId = `${baseId}-heading`;

  if (questions.length === 0) {
    return null;
  }

  const checkedCount = questions.filter(
    (question) => checked[question.id],
  ).length;
  const correctCount = questions.filter(
    (question) =>
      checked[question.id] && selected[question.id] === question.answerId,
  ).length;

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-[1.25rem] border border-line bg-surface p-5 sm:p-6"
      id={baseId}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
            Quiz
          </p>
          <h3
            className="mt-1.5 text-lg font-semibold tracking-tight"
            id={headingId}
          >
            Check your understanding
          </h3>
        </div>
        {checkedCount > 0 ? (
          <p
            className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted"
            role="status"
          >
            {correctCount} of {questions.length} correct
          </p>
        ) : null}
      </div>

      <div className="mt-5 space-y-5">
        {questions.map((question, index) => {
          const selectedId = selected[question.id];
          const isChecked = checked[question.id] === true;
          const isCorrect = selectedId === question.answerId;

          return (
            <div
              className="rounded-[1rem] border border-line bg-paper p-4"
              key={question.id}
            >
              <fieldset disabled={isChecked}>
                <legend className="text-sm font-semibold leading-6 text-ink">
                  <span className="mr-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {question.question}
                </legend>

                <div className="mt-3 grid gap-2">
                  {question.options.map((option) => {
                    const optionId = `${question.id}-${option.id}`;

                    return (
                      <label
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                          selectedId === option.id
                            ? "border-ink/35 bg-surface"
                            : "border-line bg-surface/60 hover:border-ink/20",
                          isChecked && option.id === question.answerId
                            ? "border-emerald-500/40 bg-emerald-50"
                            : null,
                          isChecked &&
                            selectedId === option.id &&
                            !isCorrect
                            ? "border-red-400/50 bg-red-50"
                            : null,
                        )}
                        htmlFor={optionId}
                        key={option.id}
                      >
                        <input
                          checked={selectedId === option.id}
                          className="mt-1 accent-ink"
                          id={optionId}
                          name={question.id}
                          onChange={() =>
                            setSelected((current) => ({
                              ...current,
                              [question.id]: option.id,
                            }))
                          }
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
                  disabled={!selectedId || isChecked}
                  onClick={() =>
                    setChecked((current) => ({
                      ...current,
                      [question.id]: true,
                    }))
                  }
                  type="button"
                >
                  Check answer
                </button>
                {isChecked ? (
                  <button
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-ink/30"
                    onClick={() => {
                      setChecked((current) => {
                        const next = { ...current };
                        delete next[question.id];
                        return next;
                      });
                      setSelected((current) => {
                        const next = { ...current };
                        delete next[question.id];
                        return next;
                      });
                    }}
                    type="button"
                  >
                    Try again
                  </button>
                ) : null}
              </div>

              {isChecked ? (
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
                  {question.explanation}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
