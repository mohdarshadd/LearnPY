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
    next: {
      label: "Lay out multiple charts",
      href: "/learn/matplotlib/subplots",
    },
  },
  {
    id: "matplotlib-subplots",
    library: "matplotlib",
    slug: "subplots",
    title: "Lay out multiple charts",
    summary:
      "Compose a figure from several axes, share scales where comparison needs them, and use layout engines to keep labels from colliding.",
    minutes: 11,
    level: "beginner",
    packages: ["matplotlib", "numpy"],
    objectives: [
      "Create a row or grid of axes in one figure.",
      "Index a single axes and loop over a two-dimensional grid.",
      "Share axes so comparison uses the same scale.",
      "Use constrained layout or tight_layout deliberately.",
      "Build an uneven layout with GridSpec.",
    ],
    sections: [
      {
        id: "many-axes",
        title: "One figure, many axes",
        blocks: [
          {
            type: "text",
            text: "A figure can hold several axes. Each axes has its own data, title, and limits, while the figure owns the overall size and background. This is how you place related charts side by side without opening separate windows.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt
import numpy as np

weeks = np.arange(1, 7)
north = np.array([12, 15, 14, 18, 20, 23])
south = np.array([9, 13, 14, 16, 19, 21])

fig, axes = plt.subplots(1, 2, figsize=(10, 4), sharey=True)
axes[0].plot(weeks, north, marker="o")
axes[0].set_title("North")
axes[0].set_xlabel("Week")
axes[0].set_ylabel("Signups")

axes[1].plot(weeks, south, marker="o")
axes[1].set_title("South")
axes[1].set_xlabel("Week")

fig.suptitle("Weekly signups by region")
fig.tight_layout()`,
            language: "python",
            caption: "Two axes in one figure",
            runnable: true,
          },
          {
            type: "text",
            text: "sharey=True gives both panels the same y scale. Without it, Matplotlib can choose different limits for each panel, which makes a visual comparison misleading.",
          },
        ],
      },
      {
        id: "axes-arrays",
        title: "Know the shape of axes",
        blocks: [
          {
            type: "text",
            text: "plt.subplots(1, 2) returns a one-dimensional array with two axes. plt.subplots(2, 2) returns a two-dimensional array. Always check the shape before indexing so a row does not accidentally receive the wrong chart.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(9, 6), sharex=True)
series = {
    "A": [1, 2, 3, 4],
    "B": [4, 3, 2, 1],
    "C": [2, 4, 3, 5],
    "D": [5, 3, 4, 2],
}

for ax, (label, values) in zip(axes.flat, series.items()):
    ax.plot(values, marker="o")
    ax.set_title(label)

fig.suptitle("Four small multiples")
fig.tight_layout()`,
            language: "python",
            caption: "Flatten a grid when every panel is treated the same",
            runnable: true,
          },
          {
            type: "callout",
            tone: "tip",
            title: "axes.flat is a convenient iterator",
            text: "For a uniform grid, axes.flat yields every axes in reading order. For an uneven layout, keep the explicit indices so the placement stays clear.",
          },
        ],
      },
      {
        id: "layout-engines",
        title: "Give labels room",
        blocks: [
          {
            type: "text",
            text: "Titles, tick labels, and axis labels can overlap when several axes share a figure. Layout engines adjust the axes rectangles after the artists exist. Use layout=\"constrained\" when creating the figure, or call fig.tight_layout() near the end.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr"]
north = [12, 15, 11, 18]
south = [9, 13, 14, 16]

fig, axes = plt.subplots(1, 2, figsize=(10, 4), layout="constrained")
axes[0].bar(months, north, color="#2563eb")
axes[0].set_title("North signups")
axes[0].set_ylabel("Signups")
axes[1].bar(months, south, color="#0f766e")
axes[1].set_title("South signups")
axes[1].set_ylabel("Signups")
fig.suptitle("Monthly signups by region")`,
            language: "python",
            caption: "Constrained layout reserves space for labels",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Do not stack layout engines",
            text: "Constrained layout and tight_layout solve the same problem in different ways. Pick one; calling both can produce warnings or surprising spacing.",
          },
        ],
      },
      {
        id: "gridspec",
        title: "Build an uneven layout",
        blocks: [
          {
            type: "text",
            text: "Use GridSpec when panels should not all have the same width or height. width_ratios and height_ratios control the proportions, and add_subplot places each axes into a cell.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt
import numpy as np

months = np.arange(1, 7)
signups = np.array([120, 135, 128, 160, 175, 190])
spend = np.array([40, 45, 42, 55, 58, 65])

fig = plt.figure(figsize=(10, 4), layout="constrained")
grid = fig.add_gridspec(2, 2, width_ratios=[2, 1])

main = fig.add_subplot(grid[:, 0])
side = fig.add_subplot(grid[0, 1])
summary = fig.add_subplot(grid[1, 1])

main.plot(months, signups, marker="o")
main.set_title("Signups")
main.set_xlabel("Month")

side.bar(months, spend)
side.set_title("Spend")

summary.axis("off")
summary.text(0.5, 0.5, "Q2 review", ha="center", va="center")`,
            language: "python",
            caption: "A wide main panel with two small summaries",
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "grid[:, 0] spans both rows in the left column.",
              "grid[0, 1] is the upper-right cell.",
              "grid[1, 1] is the lower-right cell.",
              "summary.axis(\"off\") removes ticks and spines for a text-only panel.",
            ],
          },
        ],
      },
      {
        id: "layout-checklist",
        title: "A layout checklist",
        blocks: [
          {
            type: "text",
            text: "A good multi-panel figure has a clear reading order, shared scales where comparison depends on them, and enough space for every label. Check those three things before adding more decoration.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(10, 4), sharey=True, layout="constrained")
axes[0].plot([1, 2, 3], [2, 4, 3], marker="o")
axes[0].set_title("Before")
axes[1].plot([1, 2, 3], [3, 5, 6], marker="o")
axes[1].set_title("After")
fig.suptitle("A before-and-after comparison")

for ax in axes:
    ax.set_xlabel("Week")
axes[0].set_ylabel("Score")
assert len(axes) == 2
assert axes[0].get_ylim() == axes[1].get_ylim()`,
            language: "python",
            caption: "Compare panels on one scale",
            runnable: true,
          },
          {
            type: "text",
            text: "The next lesson adds the visual layer: a restrained palette, direct annotation, and style choices that survive grayscale and color-vision differences.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "two-panel-compare",
        prompt:
          "Create a 1x2 figure with shared y axes and figsize (10, 4). Plot north on the left and south on the right, both with markers. Title the panels \"North\" and \"South\", label each x-axis \"Week\", label the left y-axis \"Signups\", and add the figure title \"Weekly signups by region\".",
        starterCode: `import matplotlib.pyplot as plt
import numpy as np

weeks = np.arange(1, 7)
north = np.array([12, 15, 14, 18, 20, 23])
south = np.array([9, 13, 14, 16, 19, 21])

# Build a two-panel comparison.
fig, axes = None, None`,
        tests: [
          {
            name: "there are two axes with the same y scale",
            code: 'assert isinstance(axes, np.ndarray), f"expected an array of axes, got {type(axes).__name__}"\nassert len(axes) == 2, f"expected 2 axes, got {len(axes)}"\nassert axes[0].get_ylim() == axes[1].get_ylim(), "the y scales differ"',
          },
          {
            name: "each panel has the right series",
            code: 'left = axes[0].get_lines()\nright = axes[1].get_lines()\nassert len(left) == 1 and len(right) == 1\nassert list(left[0].get_ydata()) == list(north)\nassert list(right[0].get_ydata()) == list(south)\nassert left[0].get_marker() == "o"\nassert right[0].get_marker() == "o"',
          },
          {
            name: "the panel and figure labels are set",
            code: 'assert axes[0].get_title() == "North"\nassert axes[1].get_title() == "South"\nassert axes[0].get_xlabel() == "Week"\nassert axes[1].get_xlabel() == "Week"\nassert axes[0].get_ylabel() == "Signups"\nassert fig.get_suptitle() == "Weekly signups by region"',
          },
        ],
        hints: [
          "Use plt.subplots(1, 2, figsize=(10, 4), sharey=True).",
          "Set the overall title with fig.suptitle(...), not on either panel.",
        ],
        solution: `import matplotlib.pyplot as plt
import numpy as np

weeks = np.arange(1, 7)
north = np.array([12, 15, 14, 18, 20, 23])
south = np.array([9, 13, 14, 16, 19, 21])

fig, axes = plt.subplots(1, 2, figsize=(10, 4), sharey=True)
axes[0].plot(weeks, north, marker="o")
axes[0].set_title("North")
axes[0].set_xlabel("Week")
axes[0].set_ylabel("Signups")

axes[1].plot(weeks, south, marker="o")
axes[1].set_title("South")
axes[1].set_xlabel("Week")

fig.suptitle("Weekly signups by region")`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "sharey",
        question: "Why use sharey=True for comparison panels?",
        options: [
          { id: "same", label: "It gives both panels the same y scale" },
          { id: "remove", label: "It removes the y-axis from both panels" },
          { id: "colors", label: "It assigns matching colors" },
        ],
        answerId: "same",
        explanation:
          "A shared y scale keeps bar heights and line positions comparable across panels.",
      },
      {
        id: "layout-constrained",
        question: "When should constrained layout be selected?",
        options: [
          { id: "create", label: "When creating the figure, with layout=\"constrained\"" },
          { id: "never", label: "Never; it only works with one axes" },
          { id: "after", label: "After saving the figure" },
        ],
        answerId: "create",
        explanation:
          "layout=\"constrained\" is a figure-level setting applied as the figure is created. It then recalculates spacing around the artists.",
      },
      {
        id: "gridspec",
        question: "What does width_ratios=[2, 1] do in GridSpec?",
        options: [
          { id: "ratio", label: "Makes the first column about twice as wide as the second" },
          { id: "rows", label: "Creates two rows instead of columns" },
          { id: "height", label: "Sets the figure height to two inches" },
        ],
        answerId: "ratio",
        explanation:
          "width_ratios controls the relative widths of the grid columns.",
      },
    ],
    next: {
      label: "Style and annotate the message",
      href: "/learn/matplotlib/style",
    },
  },
  {
    id: "matplotlib-style",
    library: "matplotlib",
    slug: "style",
    title: "Style and annotate the message",
    summary:
      "Choose color with purpose, remove visual noise, annotate the important point, and keep the chart readable without color.",
    minutes: 11,
    level: "beginner",
    packages: ["matplotlib", "numpy"],
    objectives: [
      "Use a restrained palette with enough contrast.",
      "Remove spines and grid lines that do not help comparison.",
      "Annotate a specific data point directly.",
      "Reuse a Matplotlib style safely.",
      "Keep labels and markers meaningful in grayscale.",
    ],
    sections: [
      {
        id: "visual-hierarchy",
        title: "Decide what the eye should see",
        blocks: [
          {
            type: "text",
            text: "Styling is not decoration. Every line, grid, spine, and label competes for attention. Keep the data prominent, make labels easy to read, and remove chart furniture that does not help the comparison.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
signups = [120, 135, 128, 160, 175, 190]

fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.plot(months, signups, color="#2563eb", marker="o", linewidth=2)
ax.set_title("Monthly signups")
ax.set_xlabel("Month")
ax.set_ylabel("Signups")
ax.grid(True, axis="y", alpha=0.25)

for side in ["top", "right"]:
    ax.spines[side].set_visible(False)`,
            language: "python",
            caption: "A quieter frame around the data",
            runnable: true,
          },
          {
            type: "callout",
            tone: "tip",
            title: "Remove before adding",
            text: "If a chart feels busy, first remove the top and right spines, simplify the grid, and cut redundant labels. Adding more styling rarely fixes clutter.",
          },
        ],
      },
      {
        id: "color",
        title: "Use color with purpose",
        blocks: [
          {
            type: "text",
            text: "Color can separate series, encode a category, or highlight one observation. It should not be the only difference between series. Pair hue with markers, line styles, or direct labels so the chart still works in grayscale.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr"]
north = [12, 15, 11, 18]
south = [9, 13, 14, 16]

fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.plot(months, north, color="#2563eb", marker="o", linewidth=2, label="North")
ax.plot(months, south, color="#0f766e", marker="s", linewidth=2, label="South")
ax.set_title("Monthly signups by region")
ax.set_ylabel("Signups")
ax.legend()
for side in ["top", "right"]:
    ax.spines[side].set_visible(False)`,
            language: "python",
            caption: "Distinct colors and distinct markers",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Avoid red-green as the only contrast",
            text: "Red and green can be difficult to distinguish with common color-vision differences. Use different lightness levels, line styles, or markers as well.",
          },
        ],
      },
      {
        id: "annotation",
        title: "Annotate the point that matters",
        blocks: [
          {
            type: "text",
            text: "A direct annotation explains an unusual point where it appears. ax.annotate connects text at xytext to a data coordinate at xy. Use it for a peak, a gap, or a threshold rather than making the reader hunt through the caption.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt
import numpy as np

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
signups = np.array([120, 135, 128, 160, 175, 190])

fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.plot(months, signups, color="#2563eb", marker="o", linewidth=2)

peak = int(np.argmax(signups))
ax.annotate(
    f"Peak: {signups[peak]}",
    xy=(peak, signups[peak]),
    xytext=(peak - 0.8, signups[peak] + 15),
    arrowprops={"arrowstyle": "->", "color": "#334155"},
)
ax.set_title("Monthly signups")
ax.set_ylabel("Signups")
for side in ["top", "right"]:
    ax.spines[side].set_visible(False)`,
            language: "python",
            caption: "A label connected to the data",
            runnable: true,
          },
          {
            type: "text",
            text: "Annotation coordinates are in data units for both xy and xytext by default. If the text lands off the axes, adjust the offset or use axes-fraction coordinates deliberately.",
          },
        ],
      },
      {
        id: "style-context",
        title: "Reuse a style without surprises",
        blocks: [
          {
            type: "text",
            text: "Matplotlib ships with named styles. plt.style.use changes the active settings globally; plt.style.context applies a style only inside a block. The context manager is safer when one figure needs a different visual system.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr"]
north = [12, 15, 11, 18]

with plt.style.context("seaborn-v0_8-whitegrid"):
    fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
    ax.plot(months, north, color="#2563eb", marker="o", linewidth=2)
    ax.set_title("Monthly signups")
    ax.set_ylabel("Signups")`,
            language: "python",
            caption: "Apply a style to one figure",
            runnable: true,
          },
          {
            type: "text",
            text: "A style changes defaults, not your data. Still provide titles, units, and legends; a theme cannot supply the meaning of the chart.",
          },
        ],
      },
      {
        id: "export",
        title: "Export a chart worth keeping",
        blocks: [
          {
            type: "text",
            text: "Use savefig with a vector format such as PDF or SVG for reports, or PNG at a deliberate DPI for the web. bbox_inches=\"tight\" removes excess whitespace. In this runner, open figures are captured automatically.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr"]
signups = [120, 135, 128, 160]

fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.plot(months, signups, color="#2563eb", marker="o", linewidth=2)
ax.set_title("Monthly signups")
ax.set_ylabel("Signups")`,
            language: "python",
            caption: "The figure captured by this runner",
            runnable: true,
          },
          {
            type: "callout",
            tone: "note",
            title: "A saved figure is a publication surface",
            text: "Check the title, units, legend, and spelling after the export. A PNG can travel without its surrounding article, so it has to stand on its own.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "annotated-line",
        prompt:
          "Plot signups with color \"#2563eb\", marker \"o\", and line width 2. Add an annotation containing the word \"Peak\" at the maximum value. Set the title to \"Monthly signups\" and hide the top and right spines.",
        starterCode: `import matplotlib.pyplot as plt
import numpy as np

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
signups = np.array([120, 135, 128, 160, 175, 190])

# Style the line and annotate the peak.
fig, ax = None, None`,
        tests: [
          {
            name: "the styled line is present",
            code: 'assert isinstance(ax, plt.Axes), f"expected an Axes, got {type(ax).__name__}"\nlines = ax.get_lines()\nassert len(lines) == 1, f"expected one line, got {len(lines)}"\nassert lines[0].get_color() == "#2563eb", lines[0].get_color()\nassert lines[0].get_marker() == "o"\nassert lines[0].get_linewidth() == 2',
          },
          {
            name: "the peak is annotated",
            code: 'assert len(ax.texts) >= 1, "no annotation was added"\nassert any("Peak" in text.get_text() for text in ax.texts), [text.get_text() for text in ax.texts]',
          },
          {
            name: "the frame is simplified",
            code: 'assert ax.get_title() == "Monthly signups", f"title: {ax.get_title()}"\nassert not ax.spines["top"].get_visible(), "top spine is visible"\nassert not ax.spines["right"].get_visible(), "right spine is visible"',
          },
        ],
        hints: [
          "Use ax.plot(months, signups, color=\"#2563eb\", marker=\"o\", linewidth=2).",
          "Find the peak with int(np.argmax(signups)), then call ax.annotate with xy=(peak, signups[peak]).",
        ],
        solution: `import matplotlib.pyplot as plt
import numpy as np

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
signups = np.array([120, 135, 128, 160, 175, 190])

fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.plot(months, signups, color="#2563eb", marker="o", linewidth=2)

peak = int(np.argmax(signups))
ax.annotate(
    f"Peak: {signups[peak]}",
    xy=(peak, signups[peak]),
    xytext=(peak - 0.8, signups[peak] + 15),
    arrowprops={"arrowstyle": "->", "color": "#334155"},
)
ax.set_title("Monthly signups")

for side in ["top", "right"]:
    ax.spines[side].set_visible(False)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "color-plus-marker",
        question: "Why pair color with a marker or line style?",
        options: [
          { id: "redundant", label: "The series stays distinguishable without relying on hue alone" },
          { id: "faster", label: "It makes rendering faster" },
          { id: "required", label: "Matplotlib refuses two solid lines" },
        ],
        answerId: "redundant",
        explanation:
          "Redundant encoding keeps the chart readable in grayscale and for readers with color-vision differences.",
      },
      {
        id: "annotate",
        question: "What does ax.annotate connect?",
        options: [
          { id: "point", label: "Text near the chart to a data coordinate" },
          { id: "axes", label: "Two separate figures" },
          { id: "legend", label: "The legend to the title" },
        ],
        answerId: "point",
        explanation:
          "xy is the data point and xytext is the text position, with an optional arrow connecting them.",
      },
      {
        id: "style-context",
        question: "What is the advantage of plt.style.context over plt.style.use?",
        options: [
          { id: "scoped", label: "The style applies only inside the with block" },
          { id: "faster", label: "It renders at a higher DPI" },
          { id: "labels", label: "It adds automatic titles" },
        ],
        answerId: "scoped",
        explanation:
          "The context manager restores the previous style after the block, which avoids leaking settings into later figures.",
      },
    ],
  },
];
