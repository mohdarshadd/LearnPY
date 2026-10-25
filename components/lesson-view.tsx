import Link from "next/link";
import { LibraryBadge } from "@/components/library-badge";
import { ContentBlocks } from "@/components/content-blocks";
import { ExerciseCard } from "@/components/exercise-card";
import { Quiz } from "@/components/quiz";
import { getLibrary, getTrackStyle } from "@/content/libraries";
import { getLessonNavigation } from "@/content/registry";
import { isLibraryId, type Lesson } from "@/content/schema";
import { cn } from "@/lib/cn";

function getLessonHref(lesson: Lesson) {
  return isLibraryId(lesson.library)
    ? `/learn/${lesson.library}/${lesson.slug}`
    : "/learn/start-here";
}

function getTrackHref(lesson: Lesson) {
  return isLibraryId(lesson.library)
    ? `/learn/${lesson.library}`
    : "/learn/start-here";
}

function getTrackName(lesson: Lesson) {
  if (!isLibraryId(lesson.library)) {
    return "Start here";
  }

  return getLibrary(lesson.library)?.name ?? lesson.library;
}

export function LessonView({ lesson }: { lesson: Lesson }) {
  const style = getTrackStyle(lesson.library);
  const trackName = getTrackName(lesson);
  const trackHref = getTrackHref(lesson);
  const navigation = getLessonNavigation(lesson);
  const hasPractice = lesson.exercises.length > 0 || lesson.quiz.length > 0;

  const previousLesson = navigation.previous;
  const nextLesson = navigation.next;
  const nextHref = nextLesson ? getLessonHref(nextLesson) : lesson.next?.href;
  const nextLabel = nextLesson ? nextLesson.title : lesson.next?.label;
  const nextEyebrow = nextLesson ? "Next lesson" : "Continue";

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line bg-paper-deep/35">
        <div aria-hidden="true" className={cn("h-1.5 w-full", style.bar)} />
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link className="hover:text-ink" href="/learn">
                  Learn
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link className="hover:text-ink" href={trackHref}>
                  {trackName}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {lesson.title}
              </li>
            </ol>
          </nav>

          <div className="mt-7 max-w-3xl">
            <LibraryBadge track={lesson.library} />
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              {lesson.title}
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
              {lesson.summary}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-line bg-surface px-3 py-1.5 font-medium text-ink-soft">
                {lesson.minutes} min read
              </span>
              <span className="rounded-full border border-line bg-surface px-3 py-1.5 font-medium capitalize text-ink-soft">
                {lesson.level}
              </span>
              {lesson.packages.length > 0 ? (
                <span className="rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[0.68rem] text-muted">
                  {lesson.packages.join(", ")}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-8 grid gap-4 rounded-[1.15rem] border border-line bg-surface p-5 sm:grid-cols-[7rem_1fr] sm:gap-6 sm:p-6">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
              By the end
            </p>
            <ul className="space-y-2">
              {lesson.objectives.map((objective) => (
                <li
                  key={objective}
                  className="flex gap-3 text-sm leading-6 text-ink-soft"
                >
                  <span
                    aria-hidden="true"
                    className={cn("mt-2 size-1.5 shrink-0 rounded-full", style.bar)}
                  />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
        <article className="min-w-0">
          <div className="space-y-12">
            {lesson.sections.map((section) => (
              <section
                key={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-28"
                id={section.id}
              >
                <h2
                  className="text-xl font-semibold tracking-tight sm:text-2xl"
                  id={`${section.id}-heading`}
                >
                  {section.title}
                </h2>
                <div className="mt-5 space-y-5">
                  <ContentBlocks
                    blocks={section.blocks}
                    packages={lesson.packages}
                  />
                </div>
              </section>
            ))}
          </div>

          {hasPractice ? (
            <section
              aria-labelledby="practice-heading"
              className="mt-14 scroll-mt-28 border-t border-line pt-10"
              id="practice"
            >
              <div className="max-w-2xl">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
                  Practice
                </p>
                <h2
                  className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl"
                  id="practice-heading"
                >
                  Make it stick
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Run the tests as often as you like. Hints and the solution
                  are available when you need them.
                </p>
              </div>

              {lesson.exercises.length > 0 ? (
                <div className="mt-6 space-y-5">
                  {lesson.exercises.map((exercise) => (
                    <ExerciseCard
                      exercise={exercise}
                      key={exercise.id}
                      lessonPackages={lesson.packages}
                    />
                  ))}
                </div>
              ) : null}

              {lesson.quiz.length > 0 ? (
                <div className="mt-6">
                  <Quiz questions={lesson.quiz} />
                </div>
              ) : null}
            </section>
          ) : null}

          <nav
            aria-label="Lesson navigation"
            className="mt-14 grid gap-3 border-t border-line pt-8 sm:grid-cols-2"
          >
            {previousLesson ? (
              <Link
                className="group rounded-[1.1rem] border border-line bg-surface p-4 transition-colors hover:border-ink/30"
                href={getLessonHref(previousLesson)}
              >
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
                  Previous
                </span>
                <span className="mt-1.5 block text-sm font-semibold group-hover:text-ink">
                  <span aria-hidden="true">&larr; </span>
                  {previousLesson.title}
                </span>
              </Link>
            ) : (
              <Link
                className="group rounded-[1.1rem] border border-line bg-surface p-4 transition-colors hover:border-ink/30"
                href={trackHref}
              >
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
                  Back to track
                </span>
                <span className="mt-1.5 block text-sm font-semibold group-hover:text-ink">
                  <span aria-hidden="true">&larr; </span>
                  {trackName}
                </span>
              </Link>
            )}

            {nextHref && nextLabel ? (
              <Link
                className="group rounded-[1.1rem] border border-line bg-ink p-4 text-paper transition-colors hover:bg-ink-soft sm:text-right"
                href={nextHref}
              >
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper/45">
                  {nextEyebrow}
                </span>
                <span className="mt-1.5 block text-sm font-semibold">
                  {nextLabel}
                  <span aria-hidden="true"> &rarr;</span>
                </span>
              </Link>
            ) : (
              <Link
                className="group rounded-[1.1rem] border border-line bg-surface p-4 transition-colors hover:border-ink/30 sm:text-right"
                href="/learn"
              >
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
                  Finished
                </span>
                <span className="mt-1.5 block text-sm font-semibold group-hover:text-ink">
                  Browse every track <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            )}
          </nav>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
              On this page
            </p>
            <nav aria-label="Sections" className="mt-3">
              <ol className="space-y-2 border-l border-line">
                {lesson.sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      className="group flex gap-3 border-l border-transparent py-1 pl-3 text-sm leading-6 text-muted transition-colors hover:border-ink hover:text-ink"
                      href={`#${section.id}`}
                    >
                      <span className="font-mono text-[0.62rem] text-muted/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
                {hasPractice ? (
                  <li>
                    <a
                      className="group flex gap-3 border-l border-transparent py-1 pl-3 text-sm leading-6 text-muted transition-colors hover:border-ink hover:text-ink"
                      href="#practice"
                    >
                      <span className="font-mono text-[0.62rem] text-muted/70">
                        {String(lesson.sections.length + 1).padStart(2, "0")}
                      </span>
                      <span>Practice</span>
                    </a>
                  </li>
                ) : null}
              </ol>
            </nav>

            <div className="mt-7 rounded-[1.1rem] border border-line bg-surface p-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
                Track
              </p>
              <Link
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold hover:text-ink"
                href={trackHref}
              >
                {trackName}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
