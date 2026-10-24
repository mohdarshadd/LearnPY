import Link from "next/link";
import { libraryStyles, type Library } from "@/content/libraries";
import { cn } from "@/lib/cn";

export function LibraryCard({
  library,
  lessonCount,
}: {
  library: Library;
  lessonCount: number;
}) {
  const style = libraryStyles[library.id];

  return (
    <Link
      href={`/learn/${library.id}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-surface transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_-30px_rgb(16_20_15/0.5)]",
        style.hover,
      )}
    >
      <span aria-hidden="true" className={cn("h-1.5 w-full", style.bar)} />

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={cn("font-mono text-[0.65rem] uppercase tracking-[0.18em]", style.text)}>
              Track {library.kicker}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {library.name}
            </h2>
          </div>
          <span
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-xl font-mono text-sm font-bold",
              style.soft,
              style.text,
            )}
          >
            {library.shortName}
          </span>
        </div>

        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
          {library.tagline}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {library.topics.slice(0, 3).map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-line bg-paper px-2.5 py-1 text-[0.7rem] text-ink-soft"
            >
              {topic}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-4 pt-7">
          <span className="text-xs font-medium text-muted">
            {lessonCount === 0
              ? "Lessons in progress"
              : `${lessonCount} ${lessonCount === 1 ? "lesson" : "lessons"}`}
          </span>
          <span
            aria-hidden="true"
            className="text-lg text-ink transition-transform duration-200 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
