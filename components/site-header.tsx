import Link from "next/link";
import { CommandPalette, type CommandItem } from "@/components/command-palette";
import { Logo } from "@/components/logo";
import { libraries } from "@/content/libraries";
import {
  getLessonHref,
  lessons,
  references,
} from "@/content/registry";

const links = [
  { href: "/learn", label: "Learn" },
  { href: "/reference", label: "Reference" },
  { href: "/playground", label: "Playground" },
  { href: "/progress", label: "Progress" },
];

const libraryNames = new Map(
  libraries.map((library) => [library.id, library.name]),
);

const searchItems: CommandItem[] = [
  ...libraries.map((library) => ({
    id: library.id,
    title: `${library.name} track`,
    description: library.tagline,
    href: `/learn/${library.id}`,
    kind: "track" as const,
    meta: `${library.topics.length} topics`,
  })),
  ...lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.summary,
    href: getLessonHref(lesson),
    kind: "lesson" as const,
    meta:
      lesson.library === "start-here"
        ? "Start here"
        : `${libraryNames.get(lesson.library) ?? lesson.library} · ${lesson.minutes} min`,
  })),
  ...references.map((reference) => ({
    id: reference.id,
    title: reference.symbol,
    description: reference.summary,
    href: `/reference/${reference.library}/${reference.slug}`,
    kind: "reference" as const,
    meta: libraryNames.get(reference.library) ?? reference.library,
  })),
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <CommandPalette items={searchItems} />

          <div className="hidden md:block">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
            >
              Start learning
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <details className="group relative md:hidden">
            <summary
              aria-label="Open menu"
              className="grid size-10 cursor-pointer list-none place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-paper-deep [&::-webkit-details-marker]:hidden"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ≡
              </span>
            </summary>
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-xl shadow-ink/10">
              <nav aria-label="Mobile">
                <ul className="flex flex-col">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper-deep hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
