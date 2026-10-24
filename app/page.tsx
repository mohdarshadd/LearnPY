import Link from "next/link";

const libraries = [
  {
    name: "NumPy",
    href: "/learn/numpy",
    mark: "np",
    tag: "Arrays & math",
    description:
      "Build a mental model for ndarrays, broadcasting, and vectorized thinking.",
    topics: ["ndarray basics", "Indexing", "Broadcasting", "Linear algebra"],
    accent: "bg-numpy/10 text-numpy ring-numpy/20",
    bar: "bg-numpy",
  },
  {
    name: "pandas",
    href: "/learn/pandas",
    mark: "pd",
    tag: "Tabular data",
    description:
      "Load messy data, reshape it, and answer questions with groupby and joins.",
    topics: ["Series & frames", "Cleaning", "Groupby", "Time series"],
    accent: "bg-pandas/10 text-pandas ring-pandas/20",
    bar: "bg-pandas",
  },
  {
    name: "Matplotlib",
    href: "/learn/matplotlib",
    mark: "plt",
    tag: "Visualization",
    description:
      "Turn numbers into clear figures — then make them look like you meant it.",
    topics: ["Figures & axes", "Plot types", "Layouts", "Styling"],
    accent: "bg-matplotlib/10 text-matplotlib ring-matplotlib/20",
    bar: "bg-matplotlib",
  },
  {
    name: "scikit-learn",
    href: "/learn/sklearn",
    mark: "sk",
    tag: "Machine learning",
    description:
      "Fit models with the estimator API and evaluate them without fooling yourself.",
    topics: ["Preprocessing", "Regression", "Classification", "Validation"],
    accent: "bg-sklearn/10 text-sklearn ring-sklearn/20",
    bar: "bg-sklearn",
  },
];

const steps = [
  {
    number: "01",
    title: "Read a short lesson",
    body: "Each idea gets a page, a mental model, and a runnable example — no 40-minute videos.",
  },
  {
    number: "02",
    title: "Run the real thing",
    body: "Python loads in a Web Worker. Edit code, press Run, and see genuine library output.",
  },
  {
    number: "03",
    title: "Prove it with exercises",
    body: "Auto-checked tasks and quick quizzes tell you when an idea has actually landed.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]"
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface/80 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-soft">
              <span className="size-1.5 rounded-full bg-acid-deep" />
              Interactive Python · zero setup
            </p>

            <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Learn the Python data stack{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">in your browser.</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 rounded-sm bg-acid sm:h-4"
                />
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              NumPy, pandas, Matplotlib, and scikit-learn — taught with real code
              you can edit and run. No installs, no accounts, nothing to configure.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
              >
                Start learning
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface/70 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
              >
                Open playground
              </Link>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
              {[
                ["14", "lessons"],
                ["46", "exercises"],
                ["4", "libraries"],
              ].map(([value, label]) => (
                <div key={label} className="flex items-baseline gap-2">
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight">{value}</dd>
                  <dd className="text-xs uppercase tracking-[0.14em] text-muted">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rotate-2 rounded-[1.6rem] bg-acid/25"
            />
            <div className="relative overflow-hidden rounded-[1.3rem] border border-ink/10 bg-ink shadow-2xl shadow-ink/20">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 font-mono text-[0.7rem] text-white/50">
                  warmup.py
                </span>
                <span className="ml-auto flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-acid">
                  <span className="size-1 rounded-full bg-acid" />
                  live
                </span>
              </div>

              <pre className="overflow-x-auto p-5 font-mono text-[0.8rem] leading-7 text-[#e7eadf] sm:text-[0.84rem]">
                <code>
                  <span className="text-[#7bb3ff]">import</span> numpy{" "}
                  <span className="text-[#7bb3ff]">as</span> np{"\n"}
                  {"\n"}
                  x = np.arange(<span className="text-[#ffc86b]">5</span>){"\n"}
                  squares = x **{" "}
                  <span className="text-[#ffc86b]">2</span>{"\n"}
                  {"\n"}
                  <span className="text-[#8ddb7a]">print</span>(squares){"\n"}
                  <span className="text-[#8ddb7a]">print</span>(squares.mean())
                </code>
              </pre>

              <div className="border-t border-white/10 bg-black/30 px-5 py-4">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/35">
                  Output
                </p>
                <pre className="mt-2 font-mono text-[0.8rem] leading-6 text-[#c9f24d]">
                  <code>
                    [ 0 1 4 9 16]{"\n"}
                    6.0
                  </code>
                </pre>
              </div>
            </div>
            <p className="mt-3 text-right font-mono text-[0.68rem] text-muted">
              Real Python. Running locally.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              The curriculum
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Four libraries. One coherent path.
            </h2>
          </div>
          <Link
            href="/learn"
            className="text-sm font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
          >
            Browse all lessons →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {libraries.map((library) => (
            <Link
              key={library.name}
              href={library.href}
              className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-ink/20 hover:shadow-xl hover:shadow-ink/5"
            >
              <div
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-1 ${library.bar} opacity-70`}
              />
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`grid size-11 place-items-center rounded-xl font-mono text-sm font-bold ring-1 ${library.accent}`}
                >
                  {library.mark}
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                  {library.tag}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                {library.name}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                {library.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {library.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full border border-line px-2.5 py-1 text-[0.7rem] text-ink-soft"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                Explore
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Learn less passively.
            </h2>
            <p className="mt-4 text-muted">
              Reading about an API is not the same as using it. Every lesson ends
              with code you write yourself, checked by tests that run where the
              code runs.
            </p>
          </div>

          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.number}
                className="relative rounded-[var(--radius-card)] border border-line bg-surface p-6"
              >
                <span className="font-mono text-xs font-semibold text-muted">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 font-mono text-[0.7rem] text-muted">
            <span className="size-1.5 rounded-full bg-acid-deep" />
            Powered by Pyodide · no install · nothing leaves your device
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-paper sm:px-12">
          <div
            aria-hidden="true"
            className="dotted-line absolute inset-0 opacity-[0.13]"
          />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-acid">
                Ready when you are
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Your first array is about ten seconds away.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                Start with a two-minute orientation, or jump straight into NumPy.
                Progress is saved on this device.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/learn/start-here"
                className="inline-flex items-center gap-2 rounded-full bg-acid px-6 py-3 text-sm font-semibold text-acid-ink transition-transform hover:-translate-y-0.5"
              >
                Start here
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/reference"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-white/10"
              >
                Browse reference
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
