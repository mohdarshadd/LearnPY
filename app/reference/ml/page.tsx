import type { Metadata } from "next";
import Link from "next/link";
import { MlCatalog } from "@/components/ml-catalog";
import { mlApis, mlCategories } from "@/content/ml";

export const metadata: Metadata = {
  title: "ML API atlas",
  description:
    "Browse scikit-learn, NumPy, pandas, and Matplotlib APIs by machine-learning workflow, with signatures, summaries, and library filters.",
};

export default function MlReferencePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <div className="grid-lines relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-7 sm:p-10">
        <div className="relative max-w-3xl">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted">
            ML API atlas / {mlApis.length} entries / {mlCategories.length}{" "}
            categories
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-ink sm:text-5xl">
            The machine-learning map.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Search the APIs that carry a project from first split to saved
            pipeline. Filter by workflow stage or library, then read the
            signature before you reach for autocomplete.
          </p>
        </div>

        <div className="relative mt-7 flex flex-wrap gap-2">
          <Link
            className="rounded-full border border-line bg-paper/70 px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-ink/25 hover:text-ink"
            href="/reference"
          >
            Function reference
          </Link>
          <Link
            className="rounded-full border border-line bg-paper/70 px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-ink/25 hover:text-ink"
            href="/learn/sklearn"
          >
            Data science track
          </Link>
          <Link
            className="rounded-full border border-line bg-paper/70 px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-ink/25 hover:text-ink"
            href="/playground"
          >
            Try it in the playground
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <MlCatalog apis={mlApis} categories={mlCategories} />
      </div>
    </div>
  );
}
