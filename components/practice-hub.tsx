"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExerciseCard } from "@/components/exercise-card";
import type { Challenge } from "@/content/practice/schema";
import { cn } from "@/lib/cn";

type PracticeHubProps = {
  challenges: Challenge[];
  topics: string[];
};

export function PracticeHub({ challenges, topics }: PracticeHubProps) {
  const [difficulty, setDifficulty] = useState("all");
  const [topic, setTopic] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      challenges.filter(
        (challenge) =>
          (difficulty === "all" || challenge.difficulty === difficulty) &&
          (topic === "all" || challenge.topics.includes(topic)),
      ),
    [challenges, difficulty, topic],
  );

  const selected =
    challenges.find((challenge) => challenge.id === selectedId) ??
    filtered[0] ??
    null;

  return (
    <div>
      <div className="rounded-[1.25rem] border border-line bg-surface p-4 sm:p-5">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
          Filter the deck
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["all", "beginner", "intermediate", "advanced"].map((value) => (
            <button
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                difficulty === value
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink-soft hover:border-ink/30",
              )}
              key={value}
              onClick={() => setDifficulty(value)}
              type="button"
            >
              {value === "all" ? "All levels" : value}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {["all", ...topics].map((value) => (
            <button
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                topic === value
                  ? "border-ink/40 bg-paper-deep text-ink"
                  : "border-line bg-paper text-muted hover:border-ink/25",
              )}
              key={value}
              onClick={() => setTopic(value)}
              type="button"
            >
              {value === "all" ? "All topics" : value}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted" role="status">
          {filtered.length} challenge{filtered.length === 1 ? "" : "s"} match.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {filtered.map((challenge) => (
            <button
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                selected?.id === challenge.id
                  ? "border-ink/40 bg-paper-deep/60"
                  : "border-line bg-surface hover:border-ink/25",
              )}
              key={challenge.id}
              onClick={() => setSelectedId(challenge.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted">
                  {challenge.difficulty}
                </span>
                <span className="text-[0.68rem] text-muted">
                  {challenge.topics.join(" / ")}
                </span>
              </div>
              <p className="mt-2 font-semibold tracking-tight">
                {challenge.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {challenge.summary}
              </p>
            </button>
          ))}
          {filtered.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line p-5 text-sm text-muted">
              No challenges match those filters. Try a wider topic.
            </p>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-24">
          {selected ? (
            <div>
              <ExerciseCard exercise={selected} />
              <Link
                className="mt-3 inline-flex text-sm font-semibold text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
                href={selected.lessonHref}
              >
                Review the related lesson
              </Link>
            </div>
          ) : (
            <p className="rounded-xl border border-line bg-surface p-6 text-sm text-muted">
              Pick a challenge to start.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
