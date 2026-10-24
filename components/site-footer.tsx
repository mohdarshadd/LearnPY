import Link from "next/link";
import { Logo } from "@/components/logo";

const columns = [
  {
    title: "Learn",
    links: [
      { href: "/learn/numpy", label: "NumPy" },
      { href: "/learn/pandas", label: "pandas" },
      { href: "/learn/matplotlib", label: "Matplotlib" },
      { href: "/learn/sklearn", label: "scikit-learn" },
    ],
  },
  {
    title: "Practice",
    links: [
      { href: "/playground", label: "Playground" },
      { href: "/reference", label: "Reference" },
      { href: "/progress", label: "Progress" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-deep/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Short, hands-on lessons for the Python data stack. Real Python runs
            locally in your browser — no installs, no accounts.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {column.title}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 LearnPY. Built for curious people.</p>
          <p>
            Powered by{" "}
            <a
              href="https://pyodide.org"
              className="underline decoration-line underline-offset-4 hover:text-ink"
              rel="noreferrer"
              target="_blank"
            >
              Pyodide
            </a>{" "}
            · Everything runs on your device.
          </p>
        </div>
      </div>
    </footer>
  );
}
