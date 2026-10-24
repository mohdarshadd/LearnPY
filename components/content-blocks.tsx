import type { ContentBlock } from "@/content/schema";
import { cn } from "@/lib/cn";
import { CodeBlock } from "@/components/code-block";
import { CodeRunner } from "@/components/code-runner";

const calloutStyles = {
  note: {
    container: "border-line bg-surface",
    label: "text-muted",
    title: "text-ink",
    text: "text-ink-soft",
  },
  tip: {
    container: "border-acid-deep/60 bg-acid/20",
    label: "text-acid-ink/65",
    title: "text-acid-ink",
    text: "text-ink-soft",
  },
  warning: {
    container: "border-amber-600/30 bg-amber-100/60",
    label: "text-amber-900/65",
    title: "text-amber-950",
    text: "text-amber-950/80",
  },
} as const;

const calloutLabels = {
  note: "Note",
  tip: "Tip",
  warning: "Watch out",
} as const;

type ContentBlocksProps = {
  blocks: ContentBlock[];
  packages?: string[];
};

export function ContentBlocks({ blocks, packages = [] }: ContentBlocksProps) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "text":
            return (
              <p
                key={index}
                className="text-pretty text-[1.0625rem] leading-8 text-ink-soft"
              >
                {block.text}
              </p>
            );

          case "code":
            return block.runnable ? (
              <CodeRunner
                key={index}
                caption={block.caption}
                code={block.code}
                packages={packages}
              />
            ) : (
              <CodeBlock
                key={index}
                caption={block.caption}
                code={block.code}
                language={block.language}
                output={block.output}
              />
            );

          case "callout": {
            const style = calloutStyles[block.tone];

            return (
              <aside
                key={index}
                className={cn("rounded-[1.1rem] border p-4 sm:p-5", style.container)}
              >
                <p
                  className={cn(
                    "font-mono text-[0.6rem] uppercase tracking-[0.18em]",
                    style.label,
                  )}
                >
                  {calloutLabels[block.tone]}
                </p>
                {block.title ? (
                  <p className={cn("mt-1.5 font-semibold", style.title)}>
                    {block.title}
                  </p>
                ) : null}
                <p className={cn("mt-1.5 text-sm leading-7", style.text)}>
                  {block.text}
                </p>
              </aside>
            );
          }

          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";

            return (
              <ListTag
                key={index}
                className={cn(
                  "space-y-2.5 pl-5 text-[1.0625rem] leading-8 text-ink-soft marker:text-muted",
                  block.ordered ? "list-decimal" : "list-disc",
                )}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="pl-1">
                    {item}
                  </li>
                ))}
              </ListTag>
            );
          }

          case "table":
            return (
              <figure key={index} className="overflow-hidden rounded-[1.1rem] border border-line">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                    <thead className="bg-paper-deep/70">
                      <tr>
                        {block.headers.map((header) => (
                          <th
                            key={header}
                            className="border-b border-line px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted"
                            scope="col"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="align-top">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className={cn(
                                "border-b border-line/70 px-4 py-3 leading-6 text-ink-soft last:border-r-0",
                                cellIndex === 0 && "font-medium text-ink",
                              )}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption ? (
                  <figcaption className="border-t border-line bg-surface px-4 py-3 text-xs text-muted">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
        }
      })}
    </>
  );
}
