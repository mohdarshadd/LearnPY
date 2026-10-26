"use client";

import Link from "next/link";
import { useProgressHydrated } from "@/lib/progress/use-progress";
import { useProgressStore } from "@/lib/progress/store";

type ProgressLesson = {
  id: string;
  title: string;
  href: string;
};

type ProgressOverviewProps = {
  lessons: ProgressLesson[];
};

export function ProgressOverview({ lessons }: ProgressOverviewProps) {
  const hydrated = useProgressHydrated();
  const completedLessonIds = useProgressStore(
    (state) => state.completedLessonIds,
  );
  const lastLessonId = useProgressStore((state) => state.lastLessonId);
  const resetProgress = useProgressStore((state) => state.resetProgress);

  if (lessons.length === 0) {
    return null;
  }

  const completed = lessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id),
  ).length;
  const total = lessons.length;
  const percent = Math.round((completed / total) * 100);
  const lastLesson = lessons.find((lesson) => lesson.id === lastLessonId);
  const nextLesson =
    lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ??
    lastLesson ??
    lessons[0];
  const allComplete = completed === total;
  const hasProgress = completed > 0 || lastLessonId !== null;

  return (
    <section
      aria-labelledby="progress-heading"
      className="rounded-[1.25rem] border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
            Your progress
          </p>
          <h2
            className="mt-1.5 text-lg font-semibold tracking-tight"
            id="progress-heading"
          >
            {hydrated
              ? allComplete
                ? "Every lesson is complete."
                : `${completed} of ${total} lessons complete`
              : "Loading your progress"}
          </h2>
        </div>
        {hydrated && hasProgress ? (
          <button
            className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-ink/30"
            onClick={() => {
              if (window.confirm("Reset all saved lesson progress?")) {
                resetProgress();
              }
            }}
            type="button"
          >
            Reset progress
          </button>
        ) : null}
      </div>

      <div
        aria-label={`${completed} of ${total} lessons complete`}
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={hydrated ? completed : 0}
        className="mt-5 h-2 overflow-hidden rounded-full bg-paper-deep"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-acid-deep transition-[width] duration-300"
          style={{ width: `${hydrated ? percent : 0}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
          href={nextLesson.href}
        >
          {allComplete ? "Review a lesson" : completed > 0 ? "Continue" : "Start here"}
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <p className="min-w-0 text-sm text-muted">
          {hydrated && nextLesson
            ? allComplete
              ? `Revisit ${nextLesson.title}.`
              : `Next up: ${nextLesson.title}.`
            : "Progress is saved in this browser only."}
        </p>
      </div>
    </section>
  );
}
