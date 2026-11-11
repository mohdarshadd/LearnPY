import Link from "next/link";
import { ProgressBreakdown } from "@/components/progress-breakdown";
import { ProgressOverview } from "@/components/progress-overview";
import { libraries } from "@/content/libraries";
import { getLessonHref, lessons } from "@/content/registry";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Progress",
  description:
    "See which LearnPY lessons you have completed, pick up where you left off, and reset saved progress on this device.",
  path: "/progress",
});

export default function ProgressPage() {
  const progressLessons = lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    href: getLessonHref(lesson),
  }));

  const breakdownLessons = lessons.flatMap((lesson) =>
    lesson.library === "start-here"
      ? []
      : [
          {
            id: lesson.id,
            title: lesson.title,
            href: getLessonHref(lesson),
            library: lesson.library,
          },
        ],
  );

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="grid-lines absolute inset-0 opacity-60"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Your progress
          </p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end">
            <div>
              <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Keep the thread.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
                See what is done, what is next, and where you last stopped.
                Completion is stored in this browser, so it follows you between
                visits on this device without an account.
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-line bg-surface p-5">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                How saving works
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
                <li>Lessons are marked complete from the lesson page.</li>
                <li>Playground drafts and capstone cells save separately.</li>
                <li>Clearing site data also clears this progress.</li>
              </ul>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
                href="/learn"
              >
                Back to the curriculum
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <ProgressOverview lessons={progressLessons} />

        <div className="mt-10">
          <ProgressBreakdown
            lessons={breakdownLessons}
            tracks={libraries.map((library) => ({
              id: library.id,
              name: library.name,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
