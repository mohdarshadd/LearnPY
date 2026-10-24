export const PYODIDE_VERSION = "314.0.7";

export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export const DEFAULT_TIMEOUT_MS = 90_000;

export const MAX_OUTPUT_CHARS = 80_000;

export type PyodideState = "idle" | "loading" | "ready" | "running";

export type PlotOutput = {
  mimeType: "image/png";
  dataUrl: string;
};

export type ExecutionErrorKind = "python" | "internal" | "timeout";

export type ExecutionError = {
  kind: ExecutionErrorKind;
  name: string;
  message: string;
  traceback?: string;
};

export type ExecutionResult = {
  id: string;
  ok: boolean;
  stdout: string;
  stderr: string;
  value: string | null;
  plots: PlotOutput[];
  error: ExecutionError | null;
  durationMs: number;
};

export type RunRequest = {
  type: "run";
  id: string;
  code: string;
  packages: string[];
};

export type ResetRequest = {
  type: "reset";
  id: string;
};

export type WorkerRequest = RunRequest | ResetRequest;

export type WorkerStatusMessage = {
  type: "status";
  state: PyodideState;
  detail?: string;
};

export type WorkerResultMessage = {
  type: "result";
  result: ExecutionResult;
};

export type WorkerResetMessage = {
  type: "reset-result";
  id: string;
  ok: boolean;
};

export type WorkerFatalMessage = {
  type: "fatal";
  id?: string;
  message: string;
};

export type WorkerResponse =
  | WorkerStatusMessage
  | WorkerResultMessage
  | WorkerResetMessage
  | WorkerFatalMessage;
