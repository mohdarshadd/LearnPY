import Link from "next/link";
import { ReferenceExplorer } from "@/components/reference-explorer";
import { libraries } from "@/content/libraries";
import { references } from "@/content/registry";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Reference",
  description:
    "Search concise NumPy, pandas, Matplotlib, and scikit-learn function references with signatures, examples, and pitfalls.",
  path: "/reference",
  keywords: [
    "numpy reference",
    "pandas reference",
    "matplotlib reference",
    "scikit-learn reference",
    "python api cheat sheet",
  ],
});

export default function ReferencePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <div className="grid-lines relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-7 sm:p-10">
        <div className="relative max-w-3xl">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted">
            Reference / {references.length} entries
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-ink sm:text-5xl">
            The functions you will reach for most.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Signatures, parameters, working examples, and the mistakes that
            usually follow. Search across every track or narrow the list to the
            library you are using.
          </p>
        </div>

        <div className="relative mt-7 flex flex-wrap gap-2">
          <Link
            className="rounded-full border border-ink bg-ink px-3 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-ink-soft"
            href="/reference/ml"
          >
            Open the ML API atlas
          </Link>
          {libraries.map((library) => (
            <Link
              key={library.id}
              href={`/learn/${library.id}`}
              className="rounded-full border border-line bg-paper/70 px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-ink/25 hover:text-ink"
            >
              {library.name} track
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <ReferenceExplorer references={references} />
      </div>
    </div>
  );
}
