"use client";

import Link from "next/link";
import { LibraryBadge } from "@/components/library-badge";
import type { LibraryId } from "@/content/schema";
import { useProgressStore } from "@/lib/progress/store";
import { useProgressHydrated } from "@/lib/progress/use-progress";

export type ProgressBreakdownLesson = {
  id: string;
  title: string;
  href: string;
  library: LibraryId;
};

type Track = {
  id: LibraryId;
  name: string;
};

type ProgressBreakdownProps = {
  lessons: ProgressBreakdownLesson[];
  tracks: Track[];
};

export function ProgressBreakdown({
  lessons,
  tracks,
}: ProgressBreakdownProps) {
  const hydrated = useProgressHydrated();
  const completedLessonIds = useProgressStore(
    (state) => state.completedLessonIds,
  );
  const lastLessonId = useProgressStore((state) => state.lastLessonId);

  return (
    <section aria-labelledby="progress-tracks-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
            By track
          </p>
          <h2
            className="mt-1.5 text-2xl font-semibold tracking-tight"
            id="progress-tracks-heading"
          >
            The full map
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          Lesson completion is saved on this device. Exercise checks stay
          separate, so you can revisit a lesson without losing your notes or
          playground drafts.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {tracks.map((track) => {
          const trackLessons = lessons.filter(
            (lesson) => lesson.library === track.id,
          );
          const completed = trackLessons.filter((lesson) =>
            completedLessonIds.includes(lesson.id),
          ).length;
          const total = trackLessons.length;
          const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

          return (
            <article
              className="overflow-hidden rounded-[1.25rem] border border-line bg-surface"
              key={track.id}
            >
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
                <div className="flex items-center gap-3">
                  <LibraryBadge track={track.id} />
                  <h3 className="text-base font-semibold tracking-tight">
                    {track.name}
                  </h3>
                </div>
                <p className="font-mono text-xs text-muted">
                  {hydrated ? `${completed}/${total}` : `–/${total}`}
                </p>
              </div>

              <div className="px-5 pt-4">
                <div
                  aria-label={`${track.name}: ${hydrated ? completed : 0} of ${total} lessons complete`}
                  aria-valuemax={total}
                  aria-valuemin={0}
                  aria-valuenow={hydrated ? completed : 0}
                  className="h-1.5 overflow-hidden rounded-full bg-paper-deep"
                  role="progressbar"
                >
                  <div
                    className="h-full rounded-full bg-acid-deep transition-[width] duration-300"
                    style={{ width: `${hydrated ? percent : 0}%` }}
                  />
                </div>
              </div>

              <ul className="mt-3 divide-y divide-line/70 px-2 py-2">
                {trackLessons.map((lesson) => {
                  const done =
                    hydrated && completedLessonIds.includes(lesson.id);
                  const last = hydrated && lesson.id === lastLessonId;

                  return (
                    <li key={lesson.id}>
                      <Link
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-paper-deep"
                        href={lesson.href}
                      >
                        <span
                          aria-hidden="true"
                          className={
                            done
                              ? "grid size-5 shrink-0 place-items-center rounded-full bg-acid-deep text-[0.65rem] font-bold text-paper"
                              : "size-5 shrink-0 rounded-full border border-line"
                          }
                        >
                          {done ? "✓" : ""}
                        </span>
                        <span className="min-w-0 flex-1 text-sm text-ink-soft">
                          {lesson.title}
                        </span>
                        {last ? (
                          <span className="shrink-0 rounded-full border border-line px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-muted">
                            Last visited
                          </span>
                        ) : null}
                        <span className="sr-only">
                          {done ? "complete" : "not complete"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
