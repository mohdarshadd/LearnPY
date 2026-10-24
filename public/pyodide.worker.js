const PYODIDE_INDEX_URL =
  "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";

const MAX_OUTPUT_CHARS = 80000;
const MAX_PLOTS = 4;
const MAX_PLOT_CHARS = 3000000;

const HELPERS = String.raw`
import ast as _learnpy_ast
import base64 as _learnpy_base64
import io as _learnpy_io
import json as _learnpy_json
import os as _learnpy_os
import sys as _learnpy_sys
import warnings as _learnpy_warnings

_learnpy_os.environ["MPLBACKEND"] = "Agg"
_learnpy_warnings.filterwarnings("ignore", message=".*non-interactive.*")

_learnpy_ns = {"__name__": "__main__"}
_learnpy_plots = []


def _learnpy_capture_plots():
    if "matplotlib.pyplot" not in _learnpy_sys.modules:
        return
    import matplotlib
    matplotlib.use("Agg", force=True)
    import matplotlib.pyplot as plt
    for number in plt.get_fignums():
        figure = plt.figure(number)
        buffer = _learnpy_io.BytesIO()
        with _learnpy_warnings.catch_warnings():
            _learnpy_warnings.simplefilter("ignore")
            figure.savefig(
                buffer,
                format="png",
                dpi=144,
                bbox_inches="tight",
                facecolor=figure.get_facecolor(),
            )
        _learnpy_plots.append(
            _learnpy_base64.b64encode(buffer.getvalue()).decode("ascii")
        )
    plt.close("all")


def _learnpy_run(source):
    tree = _learnpy_ast.parse(source, filename="<learnpy>", mode="exec")
    value = None
    if tree.body and isinstance(tree.body[-1], _learnpy_ast.Expr):
        tail = _learnpy_ast.Expression(tree.body.pop().value)
        exec(compile(tree, "<learnpy>", "exec"), _learnpy_ns)
        value = eval(compile(tail, "<learnpy>", "eval"), _learnpy_ns)
    else:
        exec(compile(tree, "<learnpy>", "exec"), _learnpy_ns)
    _learnpy_capture_plots()
    return None if value is None else repr(value)


def _learnpy_take_plots_json():
    plots = _learnpy_plots[:]
    _learnpy_plots.clear()
    return _learnpy_json.dumps(plots)


def _learnpy_reset():
    _learnpy_ns.clear()
    _learnpy_ns["__name__"] = "__main__"
    _learnpy_plots.clear()
    try:
        import matplotlib.pyplot as plt
        plt.close("all")
    except Exception:
        pass
`;

let pyodide = null;
let pyodidePromise = null;
let loadedPackages = new Set();
let runStdout = "";
let runStderr = "";

function post(message) {
  self.postMessage(message);
}

function status(state, detail) {
  post({ type: "status", state, detail });
}

function appendOutput(kind, text) {
  const value = String(text ?? "");

  if (!value) {
    return;
  }

  const current = kind === "stdout" ? runStdout : runStderr;

  if (current.length >= MAX_OUTPUT_CHARS) {
    return;
  }

  const addition = value.endsWith("\n") ? value : `${value}\n`;
  const next = current + addition;
  const clipped =
    next.length > MAX_OUTPUT_CHARS
      ? `${next.slice(0, MAX_OUTPUT_CHARS)}\n[output truncated]\n`
      : next;

  if (kind === "stdout") {
    runStdout = clipped;
  } else {
    runStderr = clipped;
  }
}

async function boot() {
  if (pyodide) {
    return pyodide;
  }

  if (!pyodidePromise) {
    status("loading", "Downloading the Python runtime...");

    pyodidePromise = (async () => {
      const { loadPyodide } = await import(`${PYODIDE_INDEX_URL}pyodide.mjs`);

      const instance = await loadPyodide({
        indexURL: PYODIDE_INDEX_URL,
        stdout: (text) => appendOutput("stdout", text),
        stderr: (text) => appendOutput("stderr", text),
      });

      status("loading", "Preparing the Python environment...");
      await instance.runPythonAsync(HELPERS);

      pyodide = instance;
      status("ready");
      return instance;
    })().catch((error) => {
      pyodidePromise = null;
      throw error;
    });
  }

  return pyodidePromise;
}

async function loadPackages(packages) {
  if (!packages || packages.length === 0) {
    return;
  }

  const requested = [
    ...new Set(
      packages.map((name) =>
        name === "sklearn" ? "scikit-learn" : String(name),
      ),
    ),
  ];

  for (const name of requested) {
    if (loadedPackages.has(name)) {
      continue;
    }

    status("loading", `Loading ${name}...`);

    await pyodide.loadPackage(name, {
      messageCallback: (message) => {
        if (message) {
          status("loading", String(message).slice(0, 160));
        }
      },
    });

    loadedPackages.add(name);
  }
}

function splitError(error) {
  const raw =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : String(error);

  const lines = raw.trim().split("\n");
  const finalLine = lines[lines.length - 1] || "Python error";
  const match = /^([A-Za-z_][\w.]*):\s*(.*)$/.exec(finalLine);
  const isPython =
    Boolean(error) &&
    typeof error === "object" &&
    "type" in error &&
    Boolean(error.type);

  return {
    kind: isPython ? "python" : "internal",
    name: isPython ? match?.[1] || String(error.type) : "WorkerError",
    message: match?.[2] || finalLine,
    traceback: isPython ? raw : undefined,
  };
}

function parsePlots(json) {
  if (!json) {
    return [];
  }

  try {
    const encoded = JSON.parse(json);

    if (!Array.isArray(encoded)) {
      return [];
    }

    return encoded
      .filter(
        (item) =>
          typeof item === "string" && item.length > 0 && item.length <= MAX_PLOT_CHARS,
      )
      .slice(0, MAX_PLOTS)
      .map((item) => ({
        mimeType: "image/png",
        dataUrl: `data:image/png;base64,${item}`,
      }));
  } catch {
    return [];
  }
}

async function takePlots() {
  if (!pyodide) {
    return [];
  }

  try {
    const json = await pyodide.runPythonAsync("_learnpy_take_plots_json()");
    return parsePlots(json);
  } catch {
    return [];
  }
}

async function handleRun(message) {
  const startedAt = performance.now();
  runStdout = "";
  runStderr = "";

  let result;

  try {
    const instance = await boot();
    await loadPackages(message.packages);
    status("running");

    instance.globals.set("__learnpy_source", message.code);

    let value = null;

    try {
      value = await instance.runPythonAsync("_learnpy_run(__learnpy_source)");
    } finally {
      instance.globals.set("__learnpy_source", "");
    }

    const plots = await takePlots();

    result = {
      id: message.id,
      ok: true,
      stdout: runStdout,
      stderr: runStderr,
      value: value == null ? null : String(value),
      plots,
      error: null,
      durationMs: Math.round(performance.now() - startedAt),
    };
  } catch (error) {
    const plots = await takePlots();

    result = {
      id: message.id,
      ok: false,
      stdout: runStdout,
      stderr: runStderr,
      value: null,
      plots,
      error: splitError(error),
      durationMs: Math.round(performance.now() - startedAt),
    };
  } finally {
    status("idle");
  }

  post({ type: "result", result });
}

async function handleReset(message) {
  runStdout = "";
  runStderr = "";

  if (pyodide) {
    try {
      await pyodide.runPythonAsync("_learnpy_reset()");
    } catch {
      // A reset of a broken session still allows the next run to proceed.
    }
  }

  post({ type: "reset-result", id: message.id, ok: true });
}

self.onmessage = (event) => {
  const message = event.data;

  if (!message || typeof message !== "object") {
    return;
  }

  if (message.type === "run") {
    handleRun(message).catch((error) => {
      post({
        type: "fatal",
        id: message.id,
        message:
          error && typeof error === "object" && "message" in error
            ? String(error.message)
            : "The Python worker failed.",
      });
    });
    return;
  }

  if (message.type === "reset") {
    handleReset(message).catch(() => {
      post({ type: "reset-result", id: message.id, ok: false });
    });
  }
};

