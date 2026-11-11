import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/code-block";
import { LibraryBadge } from "@/components/library-badge";
import { getLibrary } from "@/content/libraries";
import {
  getReference,
  getReferenceById,
  references,
} from "@/content/registry";
import { createPageMetadata } from "@/lib/seo";

type ReferencePageProps = {
  params: Promise<{ library: string; slug: string }>;
};

export function generateStaticParams() {
  return references.map((reference) => ({
    library: reference.library,
    slug: reference.slug,
  }));
}

export async function generateMetadata({
  params,
}: ReferencePageProps): Promise<Metadata> {
  const { library, slug } = await params;
  const reference = getReference(library, slug);

  if (!reference) {
    return {};
  }

  return createPageMetadata({
    title: `${reference.symbol} reference`,
    description: reference.summary,
    path: `/reference/${reference.library}/${reference.slug}`,
    type: "article",
    keywords: [
      reference.symbol,
      `${reference.library} ${reference.symbol}`,
      `${reference.symbol} example`,
      "python reference",
    ],
  });
}

export default async function ReferencePage({ params }: ReferencePageProps) {
  const { library, slug } = await params;
  const reference = getReference(library, slug);

  if (!reference) {
    notFound();
  }

  const libraryInfo = getLibrary(reference.library);
  const related = reference.related
    .map((id) => getReferenceById(id))
    .filter((item) => item !== undefined);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="hover:text-ink" href="/reference">
              Reference
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted/50">
            /
          </li>
          <li className="text-ink-soft">{libraryInfo?.name ?? reference.library}</li>
          <li aria-hidden="true" className="text-muted/50">
            /
          </li>
          <li className="font-mono text-xs text-muted">{reference.slug}</li>
        </ol>
      </nav>

      <header className="mt-8 border-b border-line pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <LibraryBadge track={reference.library} />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
            function reference
          </span>
        </div>
        <h1 className="mt-4 font-mono text-4xl font-black tracking-[-0.04em] text-ink sm:text-5xl">
          {reference.symbol}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          {reference.summary}
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <article className="min-w-0">
          <div className="rounded-[1.15rem] border border-line bg-surface p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
              Signature
            </p>
            <code className="mt-3 block overflow-x-auto whitespace-pre font-mono text-sm text-ink">
              {reference.signature}
            </code>
          </div>

          <section className="mt-8" aria-labelledby="about-heading">
            <h2
              id="about-heading"
              className="text-sm font-semibold uppercase tracking-[0.14em] text-ink"
            >
              What it does
            </h2>
            <p className="mt-3 text-base leading-8 text-muted">
              {reference.description}
            </p>
          </section>

          {reference.parameters.length > 0 ? (
            <section className="mt-9" aria-labelledby="parameters-heading">
              <h2
                id="parameters-heading"
                className="text-sm font-semibold uppercase tracking-[0.14em] text-ink"
              >
                Parameters
              </h2>
              <div className="mt-4 overflow-hidden rounded-[1.15rem] border border-line bg-surface">
                <dl className="divide-y divide-line">
                  {reference.parameters.map((parameter) => (
                    <div key={parameter.name} className="p-4 sm:p-5">
                      <dt className="flex flex-wrap items-baseline gap-2">
                        <code className="font-mono text-sm font-semibold text-ink">
                          {parameter.name}
                        </code>
                        <code className="rounded-full bg-paper-deep px-2 py-0.5 font-mono text-[0.68rem] text-muted">
                          {parameter.type}
                        </code>
                        {parameter.optional ? (
                          <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted/70">
                            optional
                          </span>
                        ) : null}
                      </dt>
                      <dd className="mt-2 text-sm leading-6 text-muted">
                        {parameter.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          ) : null}

          {reference.returns ? (
            <section className="mt-9" aria-labelledby="returns-heading">
              <h2
                id="returns-heading"
                className="text-sm font-semibold uppercase tracking-[0.14em] text-ink"
              >
                Returns
              </h2>
              <p className="mt-3 rounded-[1rem] border border-line bg-surface px-4 py-3 font-mono text-sm text-ink-soft">
                {reference.returns}
              </p>
            </section>
          ) : null}

          {reference.example ? (
            <section className="mt-9" aria-labelledby="example-heading">
              <h2
                id="example-heading"
                className="text-sm font-semibold uppercase tracking-[0.14em] text-ink"
              >
                Example
              </h2>
              <CodeBlock
                className="mt-4"
                code={reference.example.code}
                output={reference.example.output}
                caption={`${reference.symbol} example`}
              />
            </section>
          ) : null}

          {reference.pitfalls.length > 0 ? (
            <section className="mt-9" aria-labelledby="pitfalls-heading">
              <h2
                id="pitfalls-heading"
                className="text-sm font-semibold uppercase tracking-[0.14em] text-ink"
              >
                Watch out for
              </h2>
              <ul className="mt-4 space-y-3">
                {reference.pitfalls.map((pitfall) => (
                  <li
                    key={pitfall}
                    className="flex gap-3 rounded-[1rem] border border-line bg-surface p-4 text-sm leading-6 text-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-matplotlib"
                    />
                    {pitfall}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        <aside className="space-y-6">
          <div className="rounded-[1.2rem] border border-line bg-surface p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
              At a glance
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted">Library</dt>
                <dd className="mt-0.5 font-semibold text-ink">
                  {libraryInfo?.name ?? reference.library}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Symbol</dt>
                <dd className="mt-0.5 font-mono text-ink">{reference.symbol}</dd>
              </div>
              {reference.returns ? (
                <div>
                  <dt className="text-muted">Returns</dt>
                  <dd className="mt-0.5 font-mono text-xs text-ink-soft">
                    {reference.returns}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          {related.length > 0 ? (
            <div className="rounded-[1.2rem] border border-line bg-surface p-5">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                Related
              </p>
              <ul className="mt-3 space-y-2">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/reference/${item.library}/${item.slug}`}
                      className="block rounded-lg px-2 py-2 text-sm text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
                    >
                      <code className="font-mono text-[0.78rem]">{item.symbol}</code>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <Link
            href="/reference"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-muted"
          >
            <span aria-hidden="true">&larr;</span>
            Back to the reference
          </Link>
        </aside>
      </div>
    </div>
  );
}
