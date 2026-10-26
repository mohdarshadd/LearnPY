"use client";

import { useEffect } from "react";
import { useProgressHydrated } from "@/lib/progress/use-progress";
import { useProgressStore } from "@/lib/progress/store";
import { cn } from "@/lib/cn";

type LessonCompletionProps = {
  lessonId: string;
  trackLessonIds: string[];
};

export function LessonCompletion({
  lessonId,
  trackLessonIds,
}: LessonCompletionProps) {
  const hydrated = useProgressHydrated();
  const completedLessonIds = useProgressStore(
    (state) => state.completedLessonIds,
  );
  const markComplete = useProgressStore((state) => state.markComplete);
  const markIncomplete = useProgressStore((state) => state.markIncomplete);
  const visitLesson = useProgressStore((state) => state.visitLesson);

  useEffect(() => {
    if (hydrated) {
      visitLesson(lessonId);
    }
  }, [hydrated, lessonId, visitLesson]);

  if (!hydrated) {
    return (
      <div className="mt-14 rounded-[1.15rem] border border-line bg-surface p-5 sm:p-6">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
          Lesson progress
        </p>
        <div className="mt-4 h-2 animate-pulse rounded-full bg-paper-deep" />
      </div>
    );
  }

  const isComplete = completedLessonIds.includes(lessonId);
  const completedInTrack = trackLessonIds.filter((id) =>
    completedLessonIds.includes(id),
  ).length;
  const total = trackLessonIds.length;
  const percent = total === 0 ? 0 : Math.round((completedInTrack / total) * 100);

  return (
    <div className="mt-14 rounded-[1.15rem] border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
            Lesson progress
          </p>
          <p aria-live="polite" className="mt-2 text-sm leading-6 text-ink-soft">
            {isComplete
              ? "You have marked this lesson complete."
              : "Finished reading? Mark it complete to track your way through the track."}
          </p>
        </div>
        <span className="rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
          {completedInTrack} / {total} in track
        </span>
      </div>

      <div
        aria-label={`${completedInTrack} of ${total} lessons complete in this track`}
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={completedInTrack}
        className="mt-5 h-2 overflow-hidden rounded-full bg-paper-deep"
        role="progressbar"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            isComplete ? "bg-acid-deep" : "bg-ink/35",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          aria-pressed={isComplete}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            isComplete
              ? "border border-line bg-paper text-ink-soft hover:border-ink/30"
              : "bg-ink text-paper hover:bg-ink-soft",
          )}
          onClick={() =>
            isComplete ? markIncomplete(lessonId) : markComplete(lessonId)
          }
          type="button"
        >
          {isComplete ? "Completed — undo" : "Mark lesson complete"}
          {isComplete ? null : <span aria-hidden="true">&rarr;</span>}
        </button>
        <p className="text-xs text-muted">
          Saved in this browser only. No account needed.
        </p>
      </div>
    </div>
  );
}
