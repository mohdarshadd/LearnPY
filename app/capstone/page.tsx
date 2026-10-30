import type { Metadata } from "next";
import Link from "next/link";
import { CapstoneNotebook } from "@/components/capstone-notebook";

export const metadata: Metadata = {
  title: "Capstone",
  description:
    "Take one dataset from a pandas table to a plotted exploration, a scikit-learn pipeline, and an honest evaluation in seven runnable cells.",
};

const stages = [
  "pandas: load",
  "pandas: audit",
  "pandas: profile",
  "Matplotlib: explore",
  "scikit-learn: fit",
  "scikit-learn: evaluate",
  "stretch: compare",
];

export default function CapstonePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="grid-lines absolute inset-0 opacity-60"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            The capstone
          </p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end">
            <div>
              <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                One dataset. The whole stack.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
                Take wine chemistry measurements from a raw table to a plotted
                exploration, a scaled classification pipeline, and an evaluation
                that compares against a baseline. Seven cells, one shared Python
                session.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-ink-soft">
                  178 rows
                </span>
                <span className="rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-ink-soft">
                  13 features
                </span>
                <span className="rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-ink-soft">
                  3 cultivars
                </span>
                <span className="rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-ink-soft">
                  No download
                </span>
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-ink/15 bg-ink p-5 text-paper">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-acid">
                What you will produce
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-paper/75">
                <li>A cleaned pandas table with readable labels.</li>
                <li>A class profile and a two-panel figure.</li>
                <li>
                  A scikit-learn pipeline evaluated on held-out rows against a
                  majority-class baseline.
                </li>
              </ul>
              <Link
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-acid hover:text-paper"
                href="/reference"
              >
                Open the reference
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper-deep/40">
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
          <ol className="flex flex-wrap gap-2">
            {stages.map((stage, index) => (
              <li
                className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink-soft"
                key={stage}
              >
                <span className="font-mono text-[0.6rem] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {stage}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CapstoneNotebook />

      <section className="border-t border-line bg-paper-deep/40">
        <div className="mx-auto grid w-full max-w-5xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-2">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
              Before you call it done
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Check the reasoning, not just the score.
            </h2>
          </div>
          <ul className="space-y-2 text-sm leading-relaxed text-ink-soft">
            <li className="rounded-xl border border-line bg-surface px-3.5 py-2.5">
              Did the test set stay out of tuning and preprocessing?
            </li>
            <li className="rounded-xl border border-line bg-surface px-3.5 py-2.5">
              Is the model better than the majority-class baseline?
            </li>
            <li className="rounded-xl border border-line bg-surface px-3.5 py-2.5">
              Does the confusion matrix show a class the model struggles with?
            </li>
            <li className="rounded-xl border border-line bg-surface px-3.5 py-2.5">
              Can you explain what each cell adds to the conclusion?
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
