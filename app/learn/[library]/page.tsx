import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LibraryBadge } from "@/components/library-badge";
import {
  getLibrary,
  libraryStyles,
  libraries,
} from "@/content/libraries";
import {
  getLibraryLessons,
  getStartHereLesson,
} from "@/content/registry";
import { cn } from "@/lib/cn";

type LibraryPageProps = {
  params: Promise<{ library: string }>;
};

export function generateStaticParams() {
  return libraries.map((library) => ({ library: library.id }));
}

export async function generateMetadata({
  params,
}: LibraryPageProps): Promise<Metadata> {
  const { library: libraryId } = await params;
  const library = getLibrary(libraryId);

  if (!library) {
    return {};
  }

  return {
    title: library.name,
    description: library.description,
  };
}

export default async function LibraryPage({ params }: LibraryPageProps) {
  const { library: libraryId } = await params;
  const library = getLibrary(libraryId);

  if (!library) {
    notFound();
  }

  const style = libraryStyles[library.id];
  const trackLessons = getLibraryLessons(library.id);
  const firstLesson = trackLessons[0];
  const startHere = getStartHereLesson();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line bg-paper-deep/35">
        <div aria-hidden="true" className={cn("h-1.5 w-full", style.bar)} />
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex items-center gap-2">
              <li>
                <Link className="hover:text-ink" href="/learn">
                  Learn
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {library.name}
              </li>
            </ol>
          </nav>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <LibraryBadge track={library.id} />
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                {library.name}
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
                {library.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {firstLesson ? (
                  <Link
                    href={`/learn/${library.id}/${firstLesson.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
                  >
                    Start the track
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs font-medium text-muted">
                    First lesson in progress
                  </span>
                )}

                {startHere ? (
                  <Link
                    href="/learn/start-here"
                    className="text-sm font-medium text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
                  >
                    New here? Read the orientation
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
                What you&apos;ll practice
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {library.topics.map((topic) => (
                  <li
                    key={topic}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium",
                      style.border,
                      style.soft,
                      style.text,
                    )}
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
              Lessons
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {trackLessons.length === 0
                ? "This track is just getting started"
                : `${trackLessons.length} ${
                    trackLessons.length === 1 ? "lesson" : "lessons"
                  }, in order`}
            </h2>
          </div>
          <p className="hidden text-sm text-muted sm:block">
            {library.tagline}
          </p>
        </div>

        {trackLessons.length > 0 ? (
          <ol className="mt-8 divide-y divide-line overflow-hidden rounded-[1.25rem] border border-line bg-surface">
            {trackLessons.map((lesson, index) => (
              <li key={lesson.id}>
                <Link
                  href={`/learn/${lesson.library}/${lesson.slug}`}
                  className="group flex items-start gap-4 p-5 transition-colors hover:bg-paper-deep/50 sm:items-center sm:gap-6 sm:p-6"
                >
                  <span className="font-mono text-xs text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold tracking-tight">
                      {lesson.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">
                      {lesson.summary}
                    </span>
                  </span>
                  <span className="hidden shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted sm:block">
                    {lesson.minutes} min
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-ink transition-transform group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-8 rounded-[1.25rem] border border-dashed border-line bg-surface/60 p-8 text-center sm:p-12">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
              Under construction
            </p>
            <p className="mx-auto mt-3 max-w-md text-pretty text-lg font-medium">
              Lessons for {library.name} are being written and tested. Check the
              other tracks in the meantime.
            </p>
            <Link
              href="/learn"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
            >
              Browse every track
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
