import type { Metadata } from "next";
import { Playground } from "@/components/playground";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "A scratchpad for real Python in your browser. Load NumPy, pandas, Matplotlib, and scikit-learn, then run and inspect the output.",
};

export default function PlaygroundPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="grid-lines absolute inset-0 opacity-60"
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            No notebook required
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                A scratchpad for the whole data stack.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
                Write Python, load only the libraries you need, and see real
                output without installing anything. The session keeps your
                variables between runs until you reset it.
              </p>
            </div>
            <ul className="grid gap-2 text-sm text-ink-soft sm:grid-cols-2 lg:grid-cols-1">
              <li className="rounded-xl border border-line bg-surface/80 px-3 py-2">
                Runs in a Web Worker
              </li>
              <li className="rounded-xl border border-line bg-surface/80 px-3 py-2">
                Figures captured automatically
              </li>
              <li className="rounded-xl border border-line bg-surface/80 px-3 py-2">
                Draft saved in this browser
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Playground />
    </div>
  );
}
