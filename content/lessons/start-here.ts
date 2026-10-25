import type { Lesson } from "@/content/schema";

export const startHereLessons: Lesson[] = [
  {
    id: "start-here",
    library: "start-here",
    slug: "welcome",
    title: "Start here: how LearnPY works",
    summary:
      "A four-minute orientation to the lessons, the code runner, and the habits that make practice stick.",
    minutes: 4,
    level: "beginner",
    packages: [],
    objectives: [
      "Describe how a LearnPY lesson is structured.",
      "Run Python in the browser and read the output.",
      "Know what to do when a cell raises an error.",
    ],
    sections: [
      {
        id: "what-this-is",
        title: "What this site is",
        blocks: [
          {
            type: "text",
            text: "LearnPY is a small, focused curriculum for Python's data stack. Each lesson gives you one mental model, a few short examples, and a place to run real code. Everything executes in your browser, so there is nothing to install and no account to create.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Lessons are short on purpose. Finish one idea, then move on.",
              "Code is real Python. The arrays, tables, plots, and models are the same ones you would use locally.",
              "You can edit every runnable example. Change a value, break it, and run it again.",
            ],
          },
        ],
      },
      {
        id: "the-loop",
        title: "The loop you will repeat",
        blocks: [
          {
            type: "text",
            text: "Most lessons follow the same rhythm. It is deliberately boring: read a little, type a little, check the result. That loop is what turns syntax you recognize into code you can write.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Read the explanation and predict what the code will do.",
              "Run the example, then change one thing and run it again.",
              "Work through the exercise without copying the solution.",
              "Answer the quiz question and read the explanation, even when you get it right.",
              "Use the reference pages when you need a signature instead of a lesson.",
            ],
          },
          {
            type: "code",
            code: "for value in [3, 6, 9]:\n    print(value * 2)",
            language: "python",
            caption: "A loop you can already read",
            output: "6\n12\n18",
            runnable: false,
          },
          {
            type: "callout",
            tone: "tip",
            title: "Predict before you run",
            text: "Guessing the output first is not busywork. It is the fastest way to find the gap between what you think the code does and what it actually does.",
          },
        ],
      },
      {
        id: "first-run",
        title: "Run your first cell",
        blocks: [
          {
            type: "text",
            text: "The panel below is a live Python session. Press Run to execute it. The first run downloads the Python runtime and can take a few seconds; later runs reuse the same session and start immediately.",
          },
          {
            type: "code",
            code: 'readings = [12, 15, 11, 18, 14]\ntotal = sum(readings)\naverage = total / len(readings)\n\nprint(f"Readings: {readings}")\nprint(f"Average: {average}")\naverage',
            language: "python",
            caption: "Your first cell",
            runnable: true,
          },
          {
            type: "text",
            text: "The last line is an expression, so the runner shows its value separately from the printed output. That mirrors the behavior of a notebook: print what a reader needs, and leave the final expression for a quick look.",
          },
        ],
      },
      {
        id: "the-tracks",
        title: "What each track covers",
        blocks: [
          {
            type: "text",
            text: "The four tracks share one vocabulary. NumPy introduces arrays, pandas builds labeled tables on top of them, Matplotlib turns values into charts, and scikit-learn turns clean tables into models. Taking them in that order makes each track easier.",
          },
          {
            type: "table",
            caption: "The four tracks at a glance",
            headers: ["Track", "What you will practice", "When to take it"],
            rows: [
              [
                "NumPy",
                "Arrays, broadcasting, indexing, random numbers, linear algebra",
                "First",
              ],
              [
                "pandas",
                "DataFrames, selection, grouping, joins, cleaning",
                "After NumPy basics",
              ],
              [
                "Matplotlib",
                "Figures, axes, layouts, styling, subplots",
                "Alongside pandas",
              ],
              [
                "scikit-learn",
                "Preprocessing, regression, classification, clustering, metrics",
                "After pandas and NumPy",
              ],
            ],
          },
        ],
      },
      {
        id: "when-stuck",
        title: "When something breaks",
        blocks: [
          {
            type: "text",
            text: "An error is information, not a verdict. Read the last line first: it names the error. Then scan upward for the line number in your code. Most beginner errors come from a missing quote, a missing colon, inconsistent indentation, or a name that was never defined.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "NameError means Python has not seen that variable yet. Check spelling and whether the defining line ran.",
              "IndentationError means the block structure is off. Use four spaces per level and do not mix tabs.",
              "ModuleNotFoundError usually means the package was not loaded. Lessons load what they need, but imports still have to be written.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Long-running cells",
            text: "The runner stops code that takes longer than 90 seconds. If a cell hangs, look for a loop that never reaches its stopping condition.",
          },
        ],
      },
      {
        id: "next",
        title: "What comes next",
        blocks: [
          {
            type: "text",
            text: "You do not need to memorize this page. Start the NumPy track, keep the reference pages nearby, and come back here whenever you want a reminder of how the lessons fit together.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "updated-average",
        prompt:
          "Add the new reading of 20 to the list, then compute the updated average.",
        starterCode: `readings = [12, 15, 11, 18, 14, 20]
average = 0.0`,
        tests: [
          {
            name: "average is updated to 15.0",
            code: "assert average == 15.0, f\"expected 15.0, got {average!r}\"",
          },
          {
            name: "the readings list keeps all six values",
            code: "assert readings == [12, 15, 11, 18, 14, 20]",
          },
        ],
        hints: [
          "Use sum(readings) divided by len(readings).",
          "The six readings add up to 90.",
        ],
        solution: `readings = [12, 15, 11, 18, 14, 20]
average = sum(readings) / len(readings)
print(average)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "track-after-orientation",
        question:
          "You need to clean a messy CSV and compute totals by category. Which track should you open next?",
        options: [
          { id: "numpy", label: "NumPy" },
          { id: "pandas", label: "pandas" },
          { id: "matplotlib", label: "Matplotlib" },
          { id: "sklearn", label: "scikit-learn" },
        ],
        answerId: "pandas",
        explanation:
          "pandas is built for labeled tables: loading CSV files, cleaning values, grouping rows, and aggregating totals. NumPy comes first for array fundamentals, but pandas is the direct tool for this job.",
      },
      {
        id: "where-code-runs",
        question: "Where does the code in a runnable cell execute?",
        options: [
          { id: "browser", label: "In your browser, using Pyodide" },
          { id: "server", label: "On the LearnPY server" },
          { id: "local", label: "In a local Python installation" },
        ],
        answerId: "browser",
        explanation:
          "Pyodide runs Python in a Web Worker in your browser. Your code is not sent to a LearnPY server, and you do not need Python installed locally.",
      },
    ],
    next: {
      label: "Open the NumPy track",
      href: "/learn/numpy",
    },
  },
];
