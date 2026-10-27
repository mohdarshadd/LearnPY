import type { Reference } from "@/content/schema";

export const matplotlibReferences: Reference[] = [
  {
    id: "matplotlib-subplots",
    library: "matplotlib",
    slug: "subplots",
    symbol: "plt.subplots",
    signature: "plt.subplots(nrows=1, ncols=1, figsize=None, sharex=False, sharey=False)",
    summary: "Create a figure and one or more axes in one call.",
    description:
      "plt.subplots is the recommended starting point for most figures. It returns a Figure and an Axes object, or an array of axes when you request more than one panel. Explicit figure and axes objects make it easier to control layout and reuse code.",
    parameters: [
      {
        name: "nrows",
        type: "int, optional",
        description: "Number of rows of subplots.",
        optional: true,
      },
      {
        name: "ncols",
        type: "int, optional",
        description: "Number of columns of subplots.",
        optional: true,
      },
      {
        name: "figsize",
        type: "tuple of numbers, optional",
        description: "Figure width and height in inches.",
        optional: true,
      },
      {
        name: "sharex",
        type: "bool, optional",
        description: "Share the x-axis across panels.",
        optional: true,
      },
    ],
    returns: "tuple containing a Figure and an Axes or ndarray of Axes",
    example: {
      code: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(6, 3))
ax.plot([1, 2, 3], [2, 4, 3])
ax.set(title="A small line chart", xlabel="step", ylabel="value")
fig.savefig("chart.png", bbox_inches="tight")`,
    },
    pitfalls: [
      "With multiple panels, indexing can return a 1D or 2D array; inspect the shape before assuming ax[0, 1].",
      "Use the object-oriented fig, ax API instead of relying on the global pyplot state in reusable code.",
    ],
    related: ["matplotlib-plot", "matplotlib-set"],
  },
  {
    id: "matplotlib-plot",
    library: "matplotlib",
    slug: "plot",
    symbol: "Axes.plot",
    signature: "Axes.plot(*args, label=None, color=None)",
    summary: "Draw lines and markers on an axes.",
    description:
      "Axes.plot connects x/y pairs with a line by default. A format string such as \"o--\" chooses markers and line style. Repeated calls on the same axes overlay additional series.",
    parameters: [
      {
        name: "x, y",
        type: "array_like",
        description: "The horizontal and vertical values to plot.",
      },
      {
        name: "label",
        type: "str, optional",
        description: "Legend label for the series.",
        optional: true,
      },
      {
        name: "color",
        type: "color, optional",
        description: "Line or marker color.",
        optional: true,
      },
    ],
    returns: "list of Line2D",
    example: {
      code: `import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [3, 1, 2], marker="o", label="scores")
ax.plot([1, 2, 3], [2, 2, 3], linestyle="--", label="target")
ax.legend()`,
    },
    pitfalls: [
      "Plotting without an explicit axes uses the current global axes, which can surprise you in larger scripts.",
      "If x is omitted, plot uses the indices of y as the x values.",
    ],
    related: ["matplotlib-subplots", "matplotlib-legend"],
  },
  {
    id: "matplotlib-set",
    library: "matplotlib",
    slug: "set",
    symbol: "Axes.set",
    signature: "Axes.set(xlabel=None, ylabel=None, title=None, xlim=None, ylim=None)",
    summary: "Set common axes labels, title, and limits in one call.",
    description:
      "Axes.set groups several familiar setters into one method. It is a compact way to label a chart and control the visible range without repeating ax.set_xlabel, ax.set_ylabel, and ax.set_title.",
    parameters: [
      {
        name: "xlabel",
        type: "str, optional",
        description: "Label for the horizontal axis.",
        optional: true,
      },
      {
        name: "ylabel",
        type: "str, optional",
        description: "Label for the vertical axis.",
        optional: true,
      },
      {
        name: "title",
        type: "str, optional",
        description: "Title shown above the axes.",
        optional: true,
      },
      {
        name: "xlim, ylim",
        type: "tuple, optional",
        description: "Lower and upper limits for each axis.",
        optional: true,
      },
    ],
    returns: "None",
    example: {
      code: `import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([0, 1, 2, 3], [1, 4, 2, 5])
ax.set(
    title="Reading over time",
    xlabel="minute",
    ylabel="value",
    ylim=(0, 6),
)`,
    },
    pitfalls: [
      "Only the arguments you pass are changed; the others keep their current values.",
      "Limits are data coordinates, not pixel sizes.",
    ],
    related: ["matplotlib-plot", "matplotlib-subplots"],
  },
  {
    id: "matplotlib-legend",
    library: "matplotlib",
    slug: "legend",
    symbol: "Axes.legend",
    signature: "Axes.legend(loc='best', frameon=True)",
    summary: "Show a legend for labeled artists.",
    description:
      "Axes.legend reads the label arguments from plotted artists and builds a key. Call it after the series you want included. loc controls placement, while frameon controls the background box.",
    parameters: [
      {
        name: "loc",
        type: "str, optional",
        description: "Placement such as 'upper right' or 'best'.",
        optional: true,
      },
      {
        name: "frameon",
        type: "bool, optional",
        description: "Whether to draw a frame behind the legend.",
        optional: true,
      },
    ],
    returns: "Legend",
    example: {
      code: `import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [2, 4, 3], label="actual")
ax.plot([1, 2, 3], [3, 3, 3], label="target")
ax.legend(loc="upper left", frameon=False)`,
    },
    pitfalls: [
      "Series without a label do not appear in the legend.",
      "Calling legend before plotting can produce an empty legend.",
    ],
    related: ["matplotlib-plot", "matplotlib-subplots"],
  },
  {
    id: "matplotlib-savefig",
    library: "matplotlib",
    slug: "savefig",
    symbol: "Figure.savefig",
    signature: "Figure.savefig(fname, dpi='figure', bbox_inches=None)",
    summary: "Write a figure to an image file.",
    description:
      "savefig renders the current figure to a path. The extension chooses the format. bbox_inches=\"tight\" trims surrounding whitespace, which is often useful for reports and web pages.",
    parameters: [
      {
        name: "fname",
        type: "str or path-like",
        description: "Destination path, including the file extension.",
      },
      {
        name: "dpi",
        type: "number or 'figure', optional",
        description: "Resolution in dots per inch.",
        optional: true,
      },
      {
        name: "bbox_inches",
        type: "str or Bbox, optional",
        description: "Use 'tight' to trim extra whitespace.",
        optional: true,
      },
    ],
    returns: "None",
    example: {
      code: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(4, 3))
ax.plot([1, 2, 3], [1, 4, 2])
fig.savefig("readings.png", dpi=150, bbox_inches="tight")`,
    },
    pitfalls: [
      "Save before plt.show in scripts that close figures, or the canvas may already be cleared.",
      "A missing extension can cause the wrong format or an error depending on the backend.",
    ],
    related: ["matplotlib-subplots", "matplotlib-set"],
  },
];
