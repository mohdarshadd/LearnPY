"use client";

import Fuse from "fuse.js";
import { useDeferredValue, useId, useMemo, useState } from "react";
import {
  mlLibraryLabels,
  type MlApi,
  type MlCategory,
} from "@/content/ml";
import { cn } from "@/lib/cn";

type CategoryMeta = {
  id: MlCategory;
  label: string;
  description: string;
};

type LibraryFilter = "all" | MlApi["library"];

const libraries = Object.keys(mlLibraryLabels) as MlApi["library"][];

export function MlCatalog({
  apis,
  categories,
}: {
  apis: MlApi[];
  categories: CategoryMeta[];
}) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | MlCategory>("all");
  const [library, setLibrary] = useState<LibraryFilter>("all");
  const deferredQuery = useDeferredValue(query);

  const pool = useMemo(
    () =>
      apis.filter(
        (api) =>
          (category === "all" || api.category === category) &&
          (library === "all" || api.library === library),
      ),
    [apis, category, library],
  );

  const fuse = useMemo(
    () =>
      new Fuse(pool, {
        keys: [
          { name: "name", weight: 3 },
          { name: "summary", weight: 2 },
          { name: "signature", weight: 1.5 },
          { name: "tags", weight: 1 },
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

  const grouped = useMemo(
    () =>
      categories
        .map((meta) => ({
          meta,
          items: results.filter((api) => api.category === meta.id),
        }))
        .filter((group) => group.items.length > 0),
    [categories, results],
  );

  return (
    <div>
      <div className="rounded-[1.5rem] border border-line bg-surface p-4 shadow-sm shadow-ink/5 sm:p-5">
        <label className="sr-only" htmlFor={inputId}>
          Search the ML API atlas
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
            className="h-12 w-full rounded-full border border-line bg-paper/60 pl-11 pr-24 text-sm text-ink outline-none transition-colors placeholder:text-muted/75 focus:border-ink/30 focus:bg-paper"
            id={inputId}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search GradientBoosting, roc_auc_score, StandardScaler..."
            type="search"
            value={query}
          />
          {query ? (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-ink/5 hover:text-ink"
              onClick={() => setQuery("")}
              type="button"
            >
              Clear
            </button>
          ) : (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted/70">
              {apis.length} APIs
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <FilterButton
            active={category === "all"}
            onClick={() => setCategory("all")}
          >
            All categories
          </FilterButton>
          {categories.map((meta) => (
            <FilterButton
              active={category === meta.id}
              key={meta.id}
              onClick={() => setCategory(meta.id)}
            >
              {meta.label}
            </FilterButton>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <FilterButton active={library === "all"} onClick={() => setLibrary("all")}>
            All libraries
          </FilterButton>
          {libraries.map((id) => (
            <FilterButton
              active={library === id}
              key={id}
              onClick={() => setLibrary(id)}
            >
              {mlLibraryLabels[id]}
            </FilterButton>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 px-1">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
          {results.length} {results.length === 1 ? "API" : "APIs"}
        </p>
        {deferredQuery.trim() ? (
          <p className="truncate text-xs text-muted">
            Matching &ldquo;{deferredQuery.trim()}&rdquo;
          </p>
        ) : null}
      </div>

      <div className="mt-4 space-y-10">
        {grouped.map(({ meta, items }) => (
          <section id={meta.id} key={meta.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {meta.label}
              </h2>
              <p className="text-xs text-muted">
                {items.length} {items.length === 1 ? "API" : "APIs"}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              {meta.description}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {items.map((api) => (
                <article
                  className="rounded-xl border border-line bg-surface p-4"
                  key={api.id}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-mono text-sm font-semibold text-ink">
                      {api.name}
                    </h3>
                    <span className="shrink-0 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted">
                      {api.kind}
                    </span>
                  </div>
                  <code className="mt-2 block overflow-x-auto whitespace-nowrap rounded-md bg-paper-deep/60 px-2 py-1.5 font-mono text-[0.68rem] text-ink-soft">
                    {api.signature}
                  </code>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {api.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-line px-2 py-0.5 text-[0.62rem] text-muted">
                      {mlLibraryLabels[api.library]}
                    </span>
                    {api.tags.slice(0, 3).map((tag) => (
                      <span
                        className="rounded-full bg-paper-deep/50 px-2 py-0.5 text-[0.62rem] text-muted"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {grouped.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-6 text-sm text-muted">
            No APIs match those filters. Try a broader search.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-paper text-ink-soft hover:border-ink/30 hover:text-ink",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
