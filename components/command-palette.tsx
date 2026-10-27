"use client";

import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type CommandItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: "lesson" | "track" | "reference";
  meta: string;
};

export function CommandPalette({ items }: { items: CommandItem[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 3 },
          { name: "description", weight: 2 },
          { name: "meta", weight: 1 },
        ],
        threshold: 0.34,
        ignoreLocation: true,
      }),
    [items],
  );

  const results = useMemo(() => {
    const normalized = query.trim();
    return normalized
      ? fuse.search(normalized).map((result) => result.item)
      : items;
  }, [fuse, items, query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const selected = document.getElementById(`command-item-${active}`);
    selected?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setOpen((current) => {
          if (!current) {
            setQuery("");
            setActive(0);
          }
          return !current;
        });
        return;
      }

      if (!open) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((current) =>
          results.length ? Math.min(current + 1, results.length - 1) : 0,
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((current) => Math.max(current - 1, 0));
        return;
      }

      if (event.key === "Enter") {
        const item = results[active];

        if (item) {
          event.preventDefault();
          setOpen(false);
          router.push(item.href);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, open, results, router]);

  function openPalette() {
    setQuery("");
    setActive(0);
    setOpen(true);
  }

  function choose(item: CommandItem) {
    setOpen(false);
    router.push(item.href);
  }

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        aria-label="Search lessons and reference"
        aria-haspopup="dialog"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-3 text-sm font-medium text-muted transition-colors hover:border-ink/20 hover:text-ink"
      >
        <SearchIcon />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded-md border border-line bg-paper-deep px-1.5 py-0.5 font-mono text-[0.6rem] text-muted/80 lg:inline">
          Ctrl K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-ink/45 p-4 pt-[12vh] backdrop-blur-sm sm:pt-[16vh]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search LearnPY"
            className="w-full max-w-xl overflow-hidden rounded-[1.4rem] border border-line bg-surface shadow-2xl shadow-ink/25"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <SearchIcon />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                placeholder="Search lessons, tracks, and functions..."
                className="h-9 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/75"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-line px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted transition-colors hover:border-ink/25 hover:text-ink"
              >
                Esc
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {results.length > 0 ? (
                <ul aria-label="Search results">
                  {results.map((item, index) => (
                    <li key={`${item.kind}-${item.id}`}>
                      <button
                        id={`command-item-${index}`}
                        type="button"
                        onClick={() => choose(item)}
                        onMouseEnter={() => setActive(index)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                          index === active
                            ? "bg-paper-deep text-ink"
                            : "text-ink-soft hover:bg-paper",
                        )}
                      >
                        <span className="mt-0.5 inline-flex min-w-16 justify-center rounded-full border border-line bg-surface px-2 py-1 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-muted">
                          {item.kind}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted">
                            {item.description}
                          </span>
                        </span>
                        <span className="mt-0.5 hidden shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted/70 sm:block">
                          {item.meta}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-ink">
                    Nothing matched.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Try a function name, a lesson title, or a shorter phrase.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-paper/50 px-4 py-2.5 text-[0.65rem] text-muted">
              <span>{results.length} results</span>
              <span className="font-mono uppercase tracking-[0.12em]">
                ↑↓ move · Enter open · Esc close
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
