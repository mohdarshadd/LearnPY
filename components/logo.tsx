import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 rounded-lg"
      aria-label="LearnPY home"
    >
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-[0.65rem] bg-ink font-mono text-[0.7rem] font-bold text-acid ring-1 ring-ink/10 transition-transform duration-200 group-hover:-rotate-6"
      >
        py
      </span>
      <span className="text-[1.05rem] font-semibold tracking-tight">
        Learn<span className="text-muted">PY</span>
      </span>
    </Link>
  );
}
