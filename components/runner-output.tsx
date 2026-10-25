import { PlotGallery } from "@/components/plot-gallery";
import type { ExecutionResult } from "@/lib/pyodide/protocol";

type RunnerOutputProps = {
  result: ExecutionResult;
  showEmptySuccess?: boolean;
};

export function RunnerOutput({
  result,
  showEmptySuccess = true,
}: RunnerOutputProps) {
  return (
    <div className="space-y-3 text-sm">
      {result.error ? (
        <div
          className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2"
          role="alert"
        >
          <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-red-200">
            {result.error.name}
          </p>
          <p className="mt-1 text-red-100">{result.error.message}</p>
          {result.error.traceback ? (
            <details className="mt-2">
              <summary className="cursor-pointer font-mono text-[0.65rem] uppercase tracking-[0.1em] text-red-200/80">
                Traceback
              </summary>
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-red-100/80">
                {result.error.traceback}
              </pre>
            </details>
          ) : null}
        </div>
      ) : null}

      {result.stdout ? (
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words font-mono text-[0.82rem] leading-relaxed text-paper/90">
          {result.stdout}
        </pre>
      ) : null}

      {result.value ? (
        <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-[0.82rem] text-paper/75">
          <span className="text-paper/35">Out: </span>
          {result.value}
        </p>
      ) : null}

      {result.stderr ? (
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-amber-300/25 bg-amber-300/5 px-3 py-2 font-mono text-xs leading-relaxed text-amber-100/85">
          {result.stderr}
        </pre>
      ) : null}

      {result.plots.length > 0 ? <PlotGallery plots={result.plots} /> : null}

      {showEmptySuccess &&
      result.ok &&
      !result.stdout &&
      !result.value &&
      !result.stderr &&
      result.plots.length === 0 ? (
        <p className="text-paper/45">Ran successfully with no output.</p>
      ) : null}
    </div>
  );
}
