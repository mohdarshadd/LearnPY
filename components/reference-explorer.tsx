"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import {
  useDeferredValue,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LibraryBadge } from "@/components/library-badge";
import { libraries } from "@/content/libraries";
import type { LibraryId, Reference } from "@/content/schema";
import { cn } from "@/lib/cn";

type TrackFilter = "all" | LibraryId;

export function ReferenceExplorer({ references }: { references: Reference[] }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<TrackFilter>("all");
  const deferredQuery = useDeferredValue(query);

  const pool = useMemo(
    () =>
      track === "all"
        ? references
        : references.filter((reference) => reference.library === track),
    [references, track],
  );

  const fuse = useMemo(
    () =>
      new Fuse(pool, {
        keys: [
          { name: "symbol", weight: 3 },
          { name: "summary", weight: 2 },
          { name: "signature", weight: 1.5 },
          { name: "description", weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [pool],
  );

  const results = useMemo(() => {
    const normalized = deferredQuery.trim();
    return normalized
      ? fuse.search(normalized).map((result) => result.item)
      : pool;
  }, [deferredQuery, fuse, pool]);

  return (
    <div>
      <div className="rounded-[1.5rem] border border-line bg-surface p-4 shadow-sm shadow-ink/5 sm:p-5">
        <label className="sr-only" htmlFor={inputId}>
          Search the reference
        </label>
        <div className="relative">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search np.array, groupby, accuracy_score..."
            className="h-12 w-full rounded-full border border-line bg-paper/60 pl-11 pr-24 text-sm text-ink outline-none transition-colors placeholder:text-muted/75 focus:border-ink/30 focus:bg-paper"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-ink/5 hover:text-ink"
            >
              Clear
            </button>
          ) : (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted/70">
              {references.length} entries
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <FilterButton active={track === "all"} onClick={() => setTrack("all")}>
            All
          </FilterButton>
          {libraries.map((library) => (
            <FilterButton
              key={library.id}
              active={track === library.id}
              onClick={() => setTrack(library.id)}
            >
              {library.name}
            </FilterButton>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 px-1">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
        {deferredQuery.trim() ? (
          <p className="truncate text-xs text-muted">
            Matching “{deferredQuery.trim()}”
          </p>
        ) : null}
      </div>

      {results.length > 0 ? (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {results.map((reference) => (
            <li key={reference.id}>
              <Link
                href={`/reference/${reference.library}/${reference.slug}`}
                className="group flex h-full flex-col rounded-[1.2rem] border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-lg hover:shadow-ink/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <LibraryBadge track={reference.library} />
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/70">
                    {reference.library}
                  </span>
                </div>
                <h2 className="mt-4 font-mono text-lg font-semibold tracking-tight text-ink">
                  {reference.symbol}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                  {reference.summary}
                </p>
                <code className="mt-4 block overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-paper-deep px-3 py-2 font-mono text-[0.72rem] text-ink-soft">
                  {reference.signature}
                </code>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-[1.2rem] border border-dashed border-line bg-surface/60 p-10 text-center">
          <p className="text-sm font-semibold text-ink">No matches yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Try a shorter name, a library filter, or a word from the
            description.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTrack("all");
            }}
            className="mt-5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
          >
            Show every entry
          </button>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-paper/60 text-muted hover:border-ink/20 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
