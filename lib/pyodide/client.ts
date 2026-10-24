import {
  DEFAULT_TIMEOUT_MS,
  type ExecutionResult,
  type PyodideState,
  type WorkerRequest,
  type WorkerResponse,
} from "./protocol";

type StatusListener = (state: PyodideState, detail?: string) => void;

type PendingRun = {
  id: string;
  startedAt: number;
  timer: ReturnType<typeof setTimeout>;
  resolve: (result: ExecutionResult) => void;
};

type PendingReset = {
  id: string;
  timer: ReturnType<typeof setTimeout>;
  resolve: (ok: boolean) => void;
};

function emptyResult(id: string, startedAt: number): ExecutionResult {
  return {
    id,
    ok: false,
    stdout: "",
    stderr: "",
    value: null,
    plots: [],
    error: null,
    durationMs: Math.round(performance.now() - startedAt),
  };
}

export class PyodideRunner {
  private worker: Worker | null = null;
  private pendingRun: PendingRun | null = null;
  private pendingReset: PendingReset | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private readonly onStatus: StatusListener | undefined;

  constructor(options: { onStatus?: StatusListener } = {}) {
    this.onStatus = options.onStatus;
  }

  run(
    code: string,
    packages: string[] = [],
    timeoutMs = DEFAULT_TIMEOUT_MS,
  ): Promise<ExecutionResult> {
    const job = this.queue.then(() =>
      this.runNow(code, packages, timeoutMs),
    );
    this.queue = job.then(
      () => undefined,
      () => undefined,
    );
    return job;
  }

  reset(): Promise<boolean> {
    const job = this.queue.then(() => this.resetNow());
    this.queue = job.then(
      () => undefined,
      () => undefined,
    );
    return job;
  }

  dispose() {
    this.worker?.terminate();
    this.worker = null;

    if (this.pendingRun) {
      clearTimeout(this.pendingRun.timer);
      this.pendingRun = null;
    }

    if (this.pendingReset) {
      clearTimeout(this.pendingReset.timer);
      this.pendingReset = null;
    }
  }

  private spawnWorker(): Worker {
    const worker = new Worker("/pyodide.worker.js", { type: "module" });

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      this.handleMessage(event.data);
    };

    worker.onerror = (event) => {
      event.preventDefault();
      this.failWorker("The Python worker stopped unexpectedly.");
    };

    this.worker = worker;
    return worker;
  }

  private runNow(
    code: string,
    packages: string[],
    timeoutMs: number,
  ): Promise<ExecutionResult> {
    const worker = this.worker ?? this.spawnWorker();
    const id = crypto.randomUUID();
    const startedAt = performance.now();

    return new Promise<ExecutionResult>((resolve) => {
      const timer = setTimeout(() => {
        if (!this.pendingRun || this.pendingRun.id !== id) {
          return;
        }

        this.pendingRun = null;
        this.worker?.terminate();
        this.worker = null;
        this.onStatus?.("idle");

        const result = emptyResult(id, startedAt);
        resolve({
          ...result,
          error: {
            kind: "timeout",
            name: "TimeoutError",
            message: `Execution stopped after ${Math.round(
              timeoutMs / 1000,
            )} seconds. Check for an infinite loop or a very slow operation.`,
          },
        });
      }, timeoutMs);

      this.pendingRun = { id, startedAt, timer, resolve };

      const request: WorkerRequest = {
        type: "run",
        id,
        code,
        packages,
      };

      worker.postMessage(request);
    });
  }

  private resetNow(): Promise<boolean> {
    if (!this.worker) {
      return Promise.resolve(true);
    }

    const worker = this.worker;
    const id = crypto.randomUUID();

    return new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => {
        if (!this.pendingReset || this.pendingReset.id !== id) {
          return;
        }

        this.pendingReset = null;
        worker.terminate();

        if (this.worker === worker) {
          this.worker = null;
        }

        resolve(false);
      }, 10_000);

      this.pendingReset = { id, timer, resolve };
      worker.postMessage({ type: "reset", id } satisfies WorkerRequest);
    });
  }

  private handleMessage(message: WorkerResponse) {
    if (message.type === "status") {
      this.onStatus?.(message.state, message.detail);
      return;
    }

    if (message.type === "result") {
      const pending = this.pendingRun;

      if (!pending || pending.id !== message.result.id) {
        return;
      }

      clearTimeout(pending.timer);
      this.pendingRun = null;
      pending.resolve(message.result);
      return;
    }

    if (message.type === "reset-result") {
      const pending = this.pendingReset;

      if (!pending || pending.id !== message.id) {
        return;
      }

      clearTimeout(pending.timer);
      this.pendingReset = null;
      pending.resolve(message.ok);
      return;
    }

    if (message.type === "fatal") {
      this.failWorker(message.message, message.id);
    }
  }

  private failWorker(message: string, id?: string) {
    const pending = this.pendingRun;

    if (pending && (!id || pending.id === id)) {
      clearTimeout(pending.timer);
      this.pendingRun = null;

      const result = emptyResult(pending.id, pending.startedAt);
      pending.resolve({
        ...result,
        error: {
          kind: "internal",
          name: "WorkerError",
          message,
        },
      });
    }

    if (this.pendingReset) {
      clearTimeout(this.pendingReset.timer);
      const reset = this.pendingReset;
      this.pendingReset = null;
      reset.resolve(false);
    }

    this.worker?.terminate();
    this.worker = null;
    this.onStatus?.("idle");
  }
}
