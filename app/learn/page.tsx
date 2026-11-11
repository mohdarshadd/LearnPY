import Link from "next/link";
import { LibraryCard } from "@/components/library-card";
import { libraries } from "@/content/libraries";
import { ProgressOverview } from "@/components/progress-overview";
import {
  getLessonHref,
  getLibraryCounts,
  getStartHereLesson,
  lessons,
} from "@/content/registry";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Learn",
  description:
    "Pick a track and learn NumPy, pandas, Matplotlib, or scikit-learn with short lessons and real Python exercises in your browser.",
  path: "/learn",
  keywords: [
    "learn numpy",
    "learn pandas",
    "learn matplotlib",
    "learn scikit-learn",
    "python data science course",
  ],
});

export default function LearnPage() {
  const counts = new Map(
    getLibraryCounts().map((entry) => [entry.library, entry.count]),
  );
  const startHere = getStartHereLesson();
  const progressLessons = lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    href: getLessonHref(lesson),
  }));

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="grid-lines absolute inset-0 opacity-60"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            The curriculum
          </p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Four libraries. One browser tab.
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
                Small lessons, real reps. Each track starts with the mental model,
                then hands you a code cell. No videos, no setup, no guessing
                whether it worked.
              </p>
            </div>

            <dl className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface/80 backdrop-blur-sm">
              <div className="px-4 py-4 text-center">
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
                  Tracks
                </dt>
                <dd className="mt-1 text-xl font-semibold">{libraries.length}</dd>
              </div>
              <div className="px-4 py-4 text-center">
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
                  Lessons
                </dt>
                <dd className="mt-1 text-xl font-semibold">{lessons.length}</dd>
              </div>
              <div className="px-4 py-4 text-center">
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
                  Setup
                </dt>
                <dd className="mt-1 text-xl font-semibold">None</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {startHere ? (
          <Link
            href="/learn/start-here"
            className="group mb-8 flex flex-col gap-4 rounded-[1.25rem] border border-ink/15 bg-ink px-6 py-5 text-paper transition-colors hover:bg-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-7"
          >
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-acid">
                New to Python notebooks?
              </p>
              <p className="mt-2 text-lg font-semibold">
                Start with the short orientation.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-acid">
              {startHere.title}
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </span>
          </Link>
        ) : null}

        <div className="mb-8">
          <ProgressOverview lessons={progressLessons} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {libraries.map((library) => (
            <LibraryCard
              key={library.id}
              library={library}
              lessonCount={counts.get(library.id) ?? 0}
            />
          ))}
        </div>

        <Link
          href="/capstone"
          className="group mt-5 flex flex-col gap-5 overflow-hidden rounded-[1.25rem] border border-ink/15 bg-ink p-6 text-paper transition-colors hover:bg-ink-soft sm:p-8 md:flex-row md:items-center md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-acid">
              The capstone
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              Connect all four libraries in one notebook.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-paper/60">
              Load and audit a table, plot the evidence, fit a pipeline, and
              evaluate it against a baseline. Seven runnable cells, one shared
              Python session.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-acid px-5 py-2.5 text-sm font-semibold text-acid-ink">
            Open the capstone
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </span>
        </Link>

        <div className="mt-5 grid gap-6 rounded-[1.25rem] border border-line bg-paper-deep/50 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Not sure where to begin?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              Start with NumPy. Arrays are the shared vocabulary for pandas,
              Matplotlib, and scikit-learn, so the ideas compound instead of
              piling up.
            </p>
          </div>
          <Link
            href="/learn/numpy"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
          >
            Explore NumPy
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
