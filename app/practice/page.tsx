import type { Metadata } from "next";
import { PracticeHub } from "@/components/practice-hub";
import { challengeTopics, challenges } from "@/content/practice";

export const metadata: Metadata = {
  title: "Practice",
  description:
    "Short, runnable Python challenges for NumPy, pandas, Matplotlib, and scikit-learn with instant tests.",
};

export default function PracticePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="grid-lines absolute inset-0 opacity-60"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Practice deck
          </p>
          <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Small code reps, instant feedback.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
            Pick a challenge, edit the code, and run the tests in your browser.
            Every card links back to the lesson that explains the idea.
          </p>
          <dl className="mt-8 grid max-w-lg grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface/80">
            <div className="px-4 py-3 text-center">
              <dt className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted">
                Challenges
              </dt>
              <dd className="mt-1 text-lg font-semibold">{challenges.length}</dd>
            </div>
            <div className="px-4 py-3 text-center">
              <dt className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted">
                Topics
              </dt>
              <dd className="mt-1 text-lg font-semibold">
                {challengeTopics.length}
              </dd>
            </div>
            <div className="px-4 py-3 text-center">
              <dt className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted">
                Setup
              </dt>
              <dd className="mt-1 text-lg font-semibold">None</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <PracticeHub challenges={challenges} topics={challengeTopics} />
      </section>
    </div>
  );
}
