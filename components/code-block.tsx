import { cn } from "@/lib/cn";

type CodeBlockProps = {
  code: string;
  language?: string;
  caption?: string;
  output?: string;
  className?: string;
};

export function CodeBlock({
  code,
  language = "python",
  caption,
  output,
  className,
}: CodeBlockProps) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[1.15rem] border border-ink/15 bg-ink text-paper",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper/45">
          {language}
        </span>
        {caption ? (
          <span className="truncate text-xs text-paper/55">{caption}</span>
        ) : null}
      </div>

      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.82rem] leading-relaxed text-paper/90 sm:px-5">
        <code>{code}</code>
      </pre>

      {output ? (
        <figcaption className="border-t border-white/10 bg-[#0a0e09] px-4 py-3 sm:px-5">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper/35">
            Output
          </p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[0.8rem] leading-relaxed text-paper/70">
            {output}
          </pre>
        </figcaption>
      ) : null}
    </figure>
  );
}
