import type { Lesson } from "@/content/schema";

export const matplotlibLessons: Lesson[] = [
  {
    id: "matplotlib-anatomy",
    library: "matplotlib",
    slug: "anatomy",
    title: "Understand figures and axes",
    summary:
      "Build a chart with the object-oriented API, then label the figure so another person can read it without guessing.",
    minutes: 10,
    level: "beginner",
    packages: ["matplotlib", "numpy"],
    objectives: [
      "Distinguish a Figure from an Axes.",
      "Create a chart with fig, ax = plt.subplots().",
      "Add a title and axis labels.",
      "Control grid lines and figure size.",
      "Inspect the Axes object instead of relying on the picture alone.",
    ],
    sections: [
      {
        id: "figure-versus-axes",
        title: "Figure versus Axes",
        blocks: [
          {
            type: "text",
            text: "A Figure is the whole canvas. An Axes is one plotting area inside that canvas, with its own x-axis, y-axis, data, title, and legend. A figure can contain one axes or many; most first charts use one.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Use the object-oriented API",
            text: "fig, ax = plt.subplots() gives you explicit objects. ax.plot(...) is easier to reason about than the implicit pyplot state, especially once a figure has more than one panel.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Figure: size, layout, and the space that holds axes.",
              "Axes: the coordinate system where data is drawn.",
              "Axis: the x or y scale, ticks, and labels belonging to an axes.",
            ],
          },
        ],
      },
      {
        id: "first-chart",
        title: "Your first chart",
        blocks: [
          {
            type: "text",
            text: "Pass x values and y values to ax.plot. Matplotlib connects the points in order, so the observation order matters. Here the week number is on the x-axis and study hours are on the y-axis.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt
import numpy as np

weeks = np.arange(1, 6)
hours = np.array([2.0, 3.5, 3.0, 5.0, 4.5])

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(weeks, hours, marker="o", linewidth=2)
ax.set_title("Study hours by week")
ax.set_xlabel("Week")
ax.set_ylabel("Hours")
ax.grid(True, alpha=0.3)
fig.tight_layout()`,
            language: "python",
            caption: "A titled, labelled line chart",
            runnable: true,
          },
          {
            type: "text",
            text: "This runner captures open figures after the code finishes, so the chart appears below the output. In a regular Python script you would finish with plt.show().",
          },
        ],
      },
      {
        id: "labels",
        title: "Labels are part of the chart",
        blocks: [
          {
            type: "text",
            text: "A title states the question. Axis labels name the units. Without them a reader has to infer what the numbers mean, and a chart that needs a paragraph of explanation is not finished.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
focus = [45, 60, 50, 75, 65]

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(days, focus, marker="o")
ax.set_title("Focused minutes by weekday")
ax.set_xlabel("Day")
ax.set_ylabel("Minutes")
ax.set_ylim(0, 90)
ax.grid(True, axis="y", alpha=0.3)`,
            language: "python",
            caption: "A fixed y range makes comparisons honest",
            runnable: true,
          },
          {
            type: "callout",
            tone: "note",
            title: "Choose limits deliberately",
            text: "The default limits are computed from the data. Setting ylim(0, 90) makes the empty space above the bars part of the message instead of letting the axes exaggerate small differences.",
          },
        ],
      },
      {
        id: "figure-size",
        title: "Size and layout",
        blocks: [
          {
            type: "text",
            text: "figsize is measured in inches before rendering. tight_layout adjusts spacing so labels do not collide with the figure edge. Neither changes the data; they change whether the chart is legible.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

labels = ["Search", "Direct", "Social", "Email"]
visits = [420, 260, 180, 90]

fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(labels, visits, color="#2563eb")
ax.set_title("Visits by channel")
ax.set_ylabel("Visits")
ax.grid(True, axis="y", alpha=0.25)
fig.tight_layout()`,
            language: "python",
            caption: "A figure sized for its labels",
            runnable: true,
          },
          {
            type: "text",
            text: "The next lesson compares series on one axes and uses bars for categorical totals. The same figure-and-axes pattern stays in place.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "study-figure",
        prompt:
          "Create fig and ax with plt.subplots(figsize=(7, 4)). Plot weeks against hours with marker \"o\", then set the title to \"Study hours by week\", xlabel to \"Week\", and ylabel to \"Hours\".",
        starterCode: `import matplotlib.pyplot as plt
import numpy as np

weeks = np.arange(1, 6)
hours = np.array([2.0, 3.5, 3.0, 5.0, 4.5])

# Build the figure and its labels.
fig, ax = None, None`,
        tests: [
          {
            name: "a Figure and an Axes exist",
            code: 'assert isinstance(fig, plt.Figure), f"expected a Figure, got {type(fig).__name__}"\nassert isinstance(ax, plt.Axes), f"expected an Axes, got {type(ax).__name__}"',
          },
          {
            name: "one line uses the supplied data",
            code: 'lines = ax.get_lines()\nassert len(lines) == 1, f"expected one line, got {len(lines)}"\nassert list(lines[0].get_xdata()) == list(weeks)\nassert list(lines[0].get_ydata()) == list(hours)\nassert lines[0].get_marker() == "o"',
          },
          {
            name: "the labels explain the chart",
            code: 'assert ax.get_title() == "Study hours by week", f"title: {ax.get_title()}"\nassert ax.get_xlabel() == "Week", f"xlabel: {ax.get_xlabel()}"\nassert ax.get_ylabel() == "Hours", f"ylabel: {ax.get_ylabel()}"',
          },
        ],
        hints: [
          "fig, ax = plt.subplots(figsize=(7, 4))",
          "Use ax.plot(weeks, hours, marker=\"o\"), then ax.set_title, ax.set_xlabel, and ax.set_ylabel.",
        ],
        solution: `import matplotlib.pyplot as plt
import numpy as np

weeks = np.arange(1, 6)
hours = np.array([2.0, 3.5, 3.0, 5.0, 4.5])

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(weeks, hours, marker="o")
ax.set_title("Study hours by week")
ax.set_xlabel("Week")
ax.set_ylabel("Hours")`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "figure-axes",
        question: "What is the difference between a Figure and an Axes?",
        options: [
          { id: "canvas", label: "A Figure is the canvas; an Axes is one plotting area inside it" },
          { id: "same", label: "They are two names for the same object" },
          { id: "axis", label: "A Figure is the x-axis; an Axes is the y-axis" },
        ],
        answerId: "canvas",
        explanation:
          "The Figure holds one or more Axes. Each Axes owns a coordinate system, data, labels, and legend.",
      },
      {
        id: "object-api",
        question: "Why prefer fig, ax = plt.subplots() over implicit pyplot calls?",
        options: [
          { id: "explicit", label: "The target axes stays explicit, even with several panels" },
          { id: "faster", label: "It always renders faster" },
          { id: "colors", label: "It removes the need for labels" },
        ],
        answerId: "explicit",
        explanation:
          "The object-oriented API makes it clear which axes receives each operation, which matters as soon as a figure contains multiple plots.",
      },
      {
        id: "labels",
        question: "What should a finished chart include?",
        options: [
          { id: "labels", label: "A title and labels that name the axes and units" },
          { id: "legend", label: "A legend even when there is only one series" },
          { id: "grid", label: "A grid on every axis" },
        ],
        answerId: "labels",
        explanation:
          "Titles and axis labels make the chart self-explanatory. Legends, grids, and limits are choices that depend on the chart.",
      },
    ],
    next: {
      label: "Compare series with lines and bars",
      href: "/learn/matplotlib/lines-and-bars",
    },
  },
  {
    id: "matplotlib-lines-and-bars",
    library: "matplotlib",
    slug: "lines-and-bars",
    title: "Compare series with lines and bars",
    summary:
      "Use line charts for ordered change, bars for categorical totals, and labels plus a legend to tell the series apart.",
    minutes: 11,
    level: "beginner",
    packages: ["matplotlib", "numpy"],
    objectives: [
      "Plot more than one series on the same axes.",
      "Use labels and legends instead of relying on color alone.",
      "Choose line charts for ordered data and bars for categories.",
      "Build a grouped bar chart with explicit x positions.",
      "Check the artists in the Axes to confirm what was drawn.",
    ],
    sections: [
      {
        id: "line-trends",
        title: "Lines show ordered change",
        blocks: [
          {
            type: "text",
            text: "A line chart implies that the x values have an order and that movement between neighboring points is meaningful. Months, weeks, and time are natural candidates. Unordered categories are usually better served by bars.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
signups = [120, 135, 128, 160, 175, 190]

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(months, signups, marker="o", linewidth=2)
ax.set_title("Monthly signups")
ax.set_xlabel("Month")
ax.set_ylabel("Signups")
ax.grid(True, alpha=0.3)`,
            language: "python",
            caption: "An ordered monthly series",
            runnable: true,
          },
          {
            type: "text",
            text: "The line does not prove causation, and it does not fill in missing months. It simply connects the observations in the order you supplied.",
          },
        ],
      },
      {
        id: "compare-series",
        title: "Compare two series",
        blocks: [
          {
            type: "text",
            text: "Give each call to plot a label, then call ax.legend. The label is the series name that appears in the legend; without it, the lines are anonymous even if their colors differ.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt
import numpy as np

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
north = np.array([12, 15, 14, 18, 20, 23])
south = np.array([9, 13, 14, 16, 19, 21])

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(months, north, marker="o", linewidth=2, label="North")
ax.plot(months, south, marker="s", linewidth=2, label="South")
ax.set_title("Monthly signups by region")
ax.set_xlabel("Month")
ax.set_ylabel("Signups")
ax.grid(True, alpha=0.3)
ax.legend()`,
            language: "python",
            caption: "A shared scale and a legend",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Color alone is not a label",
            text: "A legend plus distinct markers helps readers who cannot tell the colors apart. Do not make hue the only difference between series.",
          },
        ],
      },
      {
        id: "bar-totals",
        title: "Bars show categorical totals",
        blocks: [
          {
            type: "text",
            text: "A bar chart compares categories by length. The categories do not have to be ordered, and the baseline should usually be zero so that the visual length is proportional to the value.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

channels = ["Search", "Direct", "Social", "Email"]
visits = [420, 260, 180, 90]

fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(channels, visits, color="#2563eb")
ax.set_title("Visits by channel")
ax.set_xlabel("Channel")
ax.set_ylabel("Visits")
ax.grid(True, axis="y", alpha=0.25)`,
            language: "python",
            caption: "One bar per category",
            runnable: true,
          },
          {
            type: "text",
            text: "Horizontal bars are often easier to read when category names are long: use ax.barh and set the y label. The same baseline rule applies.",
          },
        ],
      },
      {
        id: "grouped-bars",
        title: "Grouped bars need positions",
        blocks: [
          {
            type: "text",
            text: "To place two bars in each category, convert the categories to numeric positions, then offset each series by half a bar width. Without explicit positions, the second ax.bar call draws on top of the first.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt
import numpy as np

months = ["Jan", "Feb", "Mar", "Apr"]
north = np.array([12, 15, 11, 18])
south = np.array([9, 13, 14, 16])
x = np.arange(len(months))
width = 0.35

fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(x - width / 2, north, width, label="North")
ax.bar(x + width / 2, south, width, label="South")
ax.set_xticks(x, months)
ax.set_title("Monthly signups by region")
ax.set_ylabel("Signups")
ax.legend()`,
            language: "python",
            caption: "Two series side by side",
            runnable: true,
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Create numeric positions for the category centers.",
              "Draw the first series shifted left by half the width.",
              "Draw the second series shifted right by half the width.",
              "Set the tick positions and labels back to the original categories.",
            ],
          },
        ],
      },
      {
        id: "check-artists",
        title: "Check what you drew",
        blocks: [
          {
            type: "text",
            text: "A chart can look plausible and still plot the wrong data. The Axes keeps its artists: lines, patches, labels, and legend. Testing those objects is faster and more reliable than inspecting a screenshot.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar"]
signups = [12, 15, 11]

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(months, signups, marker="o", label="Signups")
ax.set_title("Signups")
ax.legend()

assert len(ax.get_lines()) == 1
assert list(ax.get_lines()[0].get_ydata()) == signups
assert ax.get_title() == "Signups"
assert ax.get_legend() is not None`,
            language: "python",
            caption: "Assert the data and the labels",
            runnable: true,
          },
          {
            type: "text",
            text: "The next lesson moves from comparison to distribution: scatter plots for relationships and histograms for the shape of one variable.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "grouped-signups",
        prompt:
          "Build a grouped bar chart for north and south using numeric x positions and width 0.35. Add series labels, set the x tick labels to months, title the chart \"Monthly signups by region\", label the y-axis \"Signups\", and show a legend.",
        starterCode: `import matplotlib.pyplot as plt
import numpy as np

months = ["Jan", "Feb", "Mar", "Apr"]
north = np.array([12, 15, 11, 18])
south = np.array([9, 13, 14, 16])

# Build the grouped bars.
fig, ax = None, None`,
        tests: [
          {
            name: "eight bars were drawn",
            code: 'assert isinstance(ax, plt.Axes), f"expected an Axes, got {type(ax).__name__}"\nassert len(ax.patches) == 8, f"expected 8 bars, got {len(ax.patches)}"',
          },
          {
            name: "each series has the right heights",
            code: 'assert [bar.get_height() for bar in ax.patches[:4]] == list(north)\nassert [bar.get_height() for bar in ax.patches[4:]] == list(south)',
          },
          {
            name: "the categories and labels are readable",
            code: 'assert [tick.get_text() for tick in ax.get_xticklabels()] == months, [tick.get_text() for tick in ax.get_xticklabels()]\nassert ax.get_title() == "Monthly signups by region"\nassert ax.get_ylabel() == "Signups"\nassert ax.get_legend() is not None',
          },
        ],
        hints: [
          "Use x = np.arange(len(months)) and width = 0.35.",
          "Draw north at x - width / 2 and south at x + width / 2, then call ax.set_xticks(x, months).",
        ],
        solution: `import matplotlib.pyplot as plt
import numpy as np

months = ["Jan", "Feb", "Mar", "Apr"]
north = np.array([12, 15, 11, 18])
south = np.array([9, 13, 14, 16])
x = np.arange(len(months))
width = 0.35

fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(x - width / 2, north, width, label="North")
ax.bar(x + width / 2, south, width, label="South")
ax.set_xticks(x, months)
ax.set_title("Monthly signups by region")
ax.set_ylabel("Signups")
ax.legend()`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "line-or-bar",
        question: "Which chart is usually better for ordered monthly change?",
        options: [
          { id: "line", label: "A line chart" },
          { id: "bar", label: "A grouped bar chart" },
          { id: "hist", label: "A histogram" },
        ],
        answerId: "line",
        explanation:
          "Lines communicate movement and continuity across an ordered x-axis. Bars are better for comparing unordered categories.",
      },
      {
        id: "legend-label",
        question: "Where does a legend's text come from?",
        options: [
          { id: "label", label: "The label passed to each plotting call" },
          { id: "title", label: "The axes title" },
          { id: "file", label: "The Python file name" },
        ],
        answerId: "label",
        explanation:
          "legend reads the artist labels. Call ax.legend() after the labelled artists exist.",
      },
      {
        id: "baseline",
        question: "Why should a bar chart usually start its value axis at zero?",
        options: [
          { id: "length", label: "Bar length should be proportional to the value" },
          { id: "style", label: "Matplotlib requires zero" },
          { id: "legend", label: "It makes the legend shorter" },
        ],
        answerId: "length",
        explanation:
          "A truncated baseline exaggerates differences because the bar length no longer represents the full value.",
      },
    ],
    next: {
      label: "See relationships and distributions",
      href: "/learn/matplotlib/distributions",
    },
  },
  {
    id: "matplotlib-distributions",
    library: "matplotlib",
    slug: "distributions",
    title: "See relationships and distributions",
    summary:
      "Use scatter plots to inspect two-variable relationships and histograms to understand the shape of one variable.",
    minutes: 11,
    level: "beginner",
    packages: ["matplotlib", "numpy"],
    objectives: [
      "Draw a scatter plot for paired observations.",
      "Use point size and transparency without overloading the chart.",
      "Draw and interpret a histogram.",
      "Choose bins deliberately.",
      "Verify plotted values through Axes artists.",
    ],
    sections: [
      {
        id: "scatter",
        title: "Scatter plots show pairs",
        blocks: [
          {
            type: "text",
            text: "A scatter plot places one point for each observation. It is the right first look at the relationship between two numeric variables: direction, clusters, gaps, and outliers become visible before any model is fitted.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(7)
study = rng.normal(90, 20, 40).clip(30, 150)
score = 40 + 0.45 * study + rng.normal(0, 8, 40)

fig, ax = plt.subplots(figsize=(7, 4))
ax.scatter(study, score, s=45, alpha=0.75, edgecolor="white")
ax.set_title("Study time and score")
ax.set_xlabel("Minutes studied")
ax.set_ylabel("Score")
ax.grid(True, alpha=0.3)`,
            language: "python",
            caption: "One point per student",
            runnable: true,
          },
          {
            type: "text",
            text: "A pattern in a scatter plot is not proof of causation. It can suggest a relationship worth testing, but confounders and measurement choices still matter.",
          },
        ],
      },
      {
        id: "point-encoding",
        title: "Encode carefully",
        blocks: [
          {
            type: "text",
            text: "Point size, color, and transparency can carry additional information. Use them when the extra dimension matters, and stop when the chart becomes harder to read. Overlapping points often need transparency more than decoration.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

hours = [1, 2, 3, 4, 5, 6]
score = [48, 55, 63, 68, 76, 83]
class_size = [12, 18, 25, 30, 22, 15]

fig, ax = plt.subplots(figsize=(7, 4))
ax.scatter(hours, score, s=[size * 6 for size in class_size], alpha=0.7)
ax.set_title("Study time and score")
ax.set_xlabel("Hours studied")
ax.set_ylabel("Score")
ax.grid(True, alpha=0.3)`,
            language: "python",
            caption: "Size encodes class size",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Area is harder to compare than position",
            text: "Readers judge position more accurately than circle area. If size encodes an important value, add a short note or a legend explaining what larger points mean.",
          },
        ],
      },
      {
        id: "histogram",
        title: "Histograms show one variable's shape",
        blocks: [
          {
            type: "text",
            text: "A histogram divides the range of one numeric variable into bins and counts how many observations fall in each bin. It answers questions about center, spread, skew, and gaps that a list of numbers does not.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt
import numpy as np

scores = np.array([52, 61, 58, 70, 66, 74, 81, 77, 85, 69, 63, 72, 88, 79, 75, 68])

fig, ax = plt.subplots(figsize=(7, 4))
ax.hist(scores, bins=6, edgecolor="white")
ax.set_title("Score distribution")
ax.set_xlabel("Score")
ax.set_ylabel("Students")
ax.grid(True, axis="y", alpha=0.3)`,
            language: "python",
            caption: "Counts across six score bins",
            runnable: true,
          },
          {
            type: "text",
            text: "The bin count changes the picture. Too few bins hide structure; too many bins turn random noise into apparent spikes. Try a few sensible values before drawing a conclusion.",
          },
        ],
      },
      {
        id: "reference-lines",
        title: "Add a reference line",
        blocks: [
          {
            type: "text",
            text: "A vertical or horizontal reference line can show a mean, target, or threshold. Draw it after the data so it sits on top, and label it in the title or a legend rather than leaving an unexplained line.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt
import numpy as np

scores = np.array([52, 61, 58, 70, 66, 74, 81, 77, 85, 69, 63, 72, 88, 79, 75, 68])
mean_score = scores.mean()

fig, ax = plt.subplots(figsize=(7, 4))
ax.hist(scores, bins=6, edgecolor="white", label="Students")
ax.axvline(mean_score, color="#dc2626", linestyle="--", label=f"Mean {mean_score:.1f}")
ax.set_title("Score distribution with mean")
ax.set_xlabel("Score")
ax.set_ylabel("Students")
ax.grid(True, axis="y", alpha=0.3)
ax.legend()`,
            language: "python",
            caption: "A labelled reference line",
            runnable: true,
          },
          {
            type: "text",
            text: "The next lesson controls layouts and styling across a whole figure: multiple axes, spacing, annotations, and a visual system that stays legible.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "score-histogram",
        prompt:
          "Draw a histogram of scores with 6 bins and white edges. Set the title to \"Score distribution\", xlabel to \"Score\", ylabel to \"Students\", and add a horizontal-only grid.",
        starterCode: `import matplotlib.pyplot as plt
import numpy as np

scores = np.array([52, 61, 58, 70, 66, 74, 81, 77, 85, 69, 63, 72, 88, 79, 75, 68])

# Draw the distribution.
fig, ax = None, None`,
        tests: [
          {
            name: "six histogram bars were drawn",
            code: 'assert isinstance(ax, plt.Axes), f"expected an Axes, got {type(ax).__name__}"\nassert len(ax.patches) == 6, f"expected 6 bins, got {len(ax.patches)}"',
          },
          {
            name: "every score is counted once",
            code: 'total = sum(bar.get_height() for bar in ax.patches)\nassert total == len(scores), f"expected {len(scores)} students, got {total}"',
          },
          {
            name: "the chart is labelled",
            code: 'assert ax.get_title() == "Score distribution", f"title: {ax.get_title()}"\nassert ax.get_xlabel() == "Score", f"xlabel: {ax.get_xlabel()}"\nassert ax.get_ylabel() == "Students", f"ylabel: {ax.get_ylabel()}"',
          },
        ],
        hints: [
          "Use ax.hist(scores, bins=6, edgecolor=\"white\").",
          "Add the grid with ax.grid(True, axis=\"y\", alpha=0.3).",
        ],
        solution: `import matplotlib.pyplot as plt
import numpy as np

scores = np.array([52, 61, 58, 70, 66, 74, 81, 77, 85, 69, 63, 72, 88, 79, 75, 68])

fig, ax = plt.subplots(figsize=(7, 4))
ax.hist(scores, bins=6, edgecolor="white")
ax.set_title("Score distribution")
ax.set_xlabel("Score")
ax.set_ylabel("Students")
ax.grid(True, axis="y", alpha=0.3)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "scatter-purpose",
        question: "What is a scatter plot most useful for?",
        options: [
          { id: "pairs", label: "Inspecting the relationship between two numeric variables" },
          { id: "parts", label: "Showing parts of a whole" },
          { id: "order", label: "Showing an ordered time series" },
        ],
        answerId: "pairs",
        explanation:
          "Each point represents a pair of observations, making direction, clusters, and outliers visible.",
      },
      {
        id: "bin-count",
        question: "What happens when a histogram has too few bins?",
        options: [
          { id: "hide", label: "It can hide structure and merge distinct groups" },
          { id: "duplicate", label: "It duplicates every observation" },
          { id: "sort", label: "It sorts the underlying data" },
        ],
        answerId: "hide",
        explanation:
          "Fewer, wider bins summarize more aggressively, which can hide gaps and multiple peaks.",
      },
      {
        id: "reference",
        question: "Why add a labelled mean line to a histogram?",
        options: [
          { id: "context", label: "It gives the center a concrete visual reference" },
          { id: "required", label: "Matplotlib requires a mean line" },
          { id: "causal", label: "It proves what caused the values" },
        ],
        answerId: "context",
        explanation:
          "A reference line helps readers locate the mean relative to the full distribution, but it does not explain causes.",
      },
    ],
  },
];
