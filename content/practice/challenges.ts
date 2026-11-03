import type { Challenge } from "@/content/practice/schema";

export const practiceChallenges: Challenge[] = [
  {
    id: "numpy-array-summary",
    title: "Summarize an array",
    summary: "Build a small array and report its mean, maximum, and sum.",
    difficulty: "beginner",
    topics: ["numpy", "arrays"],
    lessonHref: "/learn/numpy/arrays-and-dtypes",
    prompt: "Create the array [4, 8, 15, 16, 23, 42] and store its mean, maximum, and total.",
    starterCode: `import numpy as np

values = ...
mean_value = ...
max_value = ...
total = ...`,
    tests: [
      {
        name: "the values match numpy",
        code: "assert np.array_equal(values, np.array([4, 8, 15, 16, 23, 42]))\nassert abs(mean_value - values.mean()) < 1e-12\nassert max_value == 42 and total == 108",
      },
    ],
    hints: ["Pass the list to np.array.", "Use .mean(), .max(), and .sum()."],
    solution: `import numpy as np

values = np.array([4, 8, 15, 16, 23, 42])
mean_value = values.mean()
max_value = values.max()
total = values.sum()`,
    packages: [],
  },
  {
    id: "numpy-standardize",
    title: "Standardize a column",
    summary: "Turn raw values into z-scores without a library helper.",
    difficulty: "beginner",
    topics: ["numpy", "statistics"],
    lessonHref: "/learn/numpy/aggregations",
    prompt: "Standardize values so the result has mean 0 and population standard deviation 1.",
    starterCode: `import numpy as np

values = np.array([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])
standardized = ...`,
    tests: [
      {
        name: "mean and population deviation are standardized",
        code: "assert abs(standardized.mean()) < 1e-12\nassert abs(standardized.std() - 1.0) < 1e-12",
      },
    ],
    hints: ["Subtract the mean before dividing.", "Divide by values.std()."],
    solution: `import numpy as np

values = np.array([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])
standardized = (values - values.mean()) / values.std()`,
    packages: [],
  },
  {
    id: "numpy-even-mask",
    title: "Filter with a boolean mask",
    summary: "Select even numbers and keep the original order.",
    difficulty: "beginner",
    topics: ["numpy", "indexing"],
    lessonHref: "/learn/numpy/indexing-and-slicing",
    prompt: "Select every even number from values using a boolean mask.",
    starterCode: `import numpy as np

values = np.arange(1, 21)
evens = ...`,
    tests: [
      {
        name: "only even values remain",
        code: "assert np.array_equal(evens, np.array([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]))",
      },
    ],
    hints: ["A comparison on an array produces a boolean mask.", "Index the array with values % 2 == 0."],
    solution: `import numpy as np

values = np.arange(1, 21)
evens = values[values % 2 == 0]`,
    packages: [],
  },
  {
    id: "numpy-reshape-transpose",
    title: "Reshape and transpose",
    summary: "Turn twelve values into a 3 by 4 matrix, then transpose it.",
    difficulty: "beginner",
    topics: ["numpy", "shape"],
    lessonHref: "/learn/numpy/shape-and-reshape",
    prompt: "Reshape 0 through 11 into a 3 by 4 matrix and store its transpose.",
    starterCode: `import numpy as np

values = np.arange(12)
matrix = ...
transposed = ...`,
    tests: [
      {
        name: "the shapes are correct",
        code: "assert matrix.shape == (3, 4)\nassert transposed.shape == (4, 3)\nassert np.array_equal(transposed, matrix.T)",
      },
    ],
    hints: ["Use .reshape(3, 4).", "The .T attribute transposes a matrix."],
    solution: `import numpy as np

values = np.arange(12)
matrix = values.reshape(3, 4)
transposed = matrix.T`,
    packages: [],
  },
  {
    id: "numpy-linear-system",
    title: "Solve a linear system",
    summary: "Use numpy.linalg.solve instead of inverting a matrix.",
    difficulty: "advanced",
    topics: ["numpy", "linear-algebra"],
    lessonHref: "/learn/numpy/linear-algebra",
    prompt: "Solve the system represented by coefficients and targets.",
    starterCode: `import numpy as np

coefficients = np.array([[3.0, 1.0], [1.0, 2.0]])
targets = np.array([9.0, 8.0])
solution = ...`,
    tests: [
      {
        name: "the solution satisfies both equations",
        code: "assert abs(solution[0] - 2.0) < 1e-12, solution\nassert abs(solution[1] - 3.0) < 1e-12, solution\nassert np.allclose(coefficients @ solution, targets)",
      },
    ],
    hints: ["Call np.linalg.solve(coefficients, targets).", "Avoid computing an explicit inverse."],
    solution: `import numpy as np

coefficients = np.array([[3.0, 1.0], [1.0, 2.0]])
targets = np.array([9.0, 8.0])
solution = np.linalg.solve(coefficients, targets)`,
    packages: [],
  },
  {
    id: "numpy-seeded-sampling",
    title: "Reproduce a random sample",
    summary: "Use a seeded generator so the sample is repeatable.",
    difficulty: "intermediate",
    topics: ["numpy", "random"],
    lessonHref: "/learn/numpy/random-numbers",
    prompt: "Draw 20 values from a normal distribution with a fixed seed.",
    starterCode: `import numpy as np

rng = ...
sample = ...`,
    tests: [
      {
        name: "the sample is reproducible",
        code: 'rng2 = np.random.default_rng(42)\nassert np.array_equal(sample, rng2.normal(size=20))\nassert len(sample) == 20',
      },
    ],
    hints: ["Create np.random.default_rng(42).", "Call rng.normal(size=20)."],
    solution: `import numpy as np

rng = np.random.default_rng(42)
sample = rng.normal(size=20)`,
    packages: [],
  },
  {
    id: "pandas-filter-rows",
    title: "Filter rows",
    summary: "Keep rows that pass a numeric condition.",
    difficulty: "beginner",
    topics: ["pandas", "filtering"],
    lessonHref: "/learn/pandas/filtering",
    prompt: "Keep only rows where score is at least 80.",
    starterCode: `import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Bo", "Cy", "Di"], "score": [92, 71, 80, 65]})
passed = ...`,
    tests: [
      {
        name: "only passing rows remain",
        code: 'assert passed["name"].tolist() == ["Ada", "Cy"]\nassert passed["score"].tolist() == [92, 80]',
      },
    ],
    hints: ["Build a boolean Series from df[\"score\"] >= 80.", "Index the DataFrame with that Series."],
    solution: `import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Bo", "Cy", "Di"], "score": [92, 71, 80, 65]})
passed = df[df["score"] >= 80]`,
    packages: [],
  },
  {
    id: "pandas-groupby-mean",
    title: "Group and average",
    summary: "Summarize a numeric column by category.",
    difficulty: "beginner",
    topics: ["pandas", "groupby"],
    lessonHref: "/learn/pandas/groupby",
    prompt: "Compute the average units sold for each store.",
    starterCode: `import pandas as pd

df = pd.DataFrame({
    "store": ["north", "south", "north", "south"],
    "units": [10, 4, 20, 8],
})
average_units = ...`,
    tests: [
      {
        name: "each store has the right average",
        code: 'assert average_units.loc["north"] == 15.0\nassert average_units.loc["south"] == 6.0\nassert len(average_units) == 2',
      },
    ],
    hints: ["Group by the store column.", "Select units, then call mean()."],
    solution: `import pandas as pd

df = pd.DataFrame({
    "store": ["north", "south", "north", "south"],
    "units": [10, 4, 20, 8],
})
average_units = df.groupby("store")["units"].mean()`,
    packages: [],
  },
  {
    id: "pandas-fill-median",
    title: "Fill missing values",
    summary: "Replace gaps with the column median.",
    difficulty: "beginner",
    topics: ["pandas", "missing-data"],
    lessonHref: "/learn/pandas/missing-data",
    prompt: "Fill missing values in units with that column's median.",
    starterCode: `import pandas as pd

df = pd.DataFrame({"units": [10.0, None, 30.0, None, 50.0]})
filled = ...`,
    tests: [
      {
        name: "missing values are gone and median is used",
        code: "assert filled.isna().sum().sum() == 0\nassert filled[\"units\"].tolist() == [10.0, 30.0, 30.0, 30.0, 50.0]",
      },
    ],
    hints: ["Call fillna with df[\"units\"].median().", "Assign the result to a new column or DataFrame."],
    solution: `import pandas as pd

df = pd.DataFrame({"units": [10.0, None, 30.0, None, 50.0]})
filled = df.fillna(df["units"].median())`,
    packages: [],
  },
  {
    id: "pandas-merge",
    title: "Join two tables",
    summary: "Merge orders with customer names on a shared key.",
    difficulty: "intermediate",
    topics: ["pandas", "merge"],
    lessonHref: "/learn/pandas/merge-and-join",
    prompt: "Merge orders and customers on customer_id and keep all orders.",
    starterCode: `import pandas as pd

orders = pd.DataFrame({"customer_id": [1, 2, 1], "total": [20, 35, 15]})
customers = pd.DataFrame({"customer_id": [1, 2], "name": ["Ada", "Bo"]})
joined = ...`,
    tests: [
      {
        name: "orders are joined with names",
        code: 'assert joined["name"].tolist() == ["Ada", "Bo", "Ada"]\nassert joined["total"].tolist() == [20, 35, 15]',
      },
    ],
    hints: ["Use pd.merge with how=\"left\".", "The join key is customer_id."],
    solution: `import pandas as pd

orders = pd.DataFrame({"customer_id": [1, 2, 1], "total": [20, 35, 15]})
customers = pd.DataFrame({"customer_id": [1, 2], "name": ["Ada", "Bo"]})
joined = orders.merge(customers, on="customer_id", how="left")`,
    packages: [],
  },
  {
    id: "pandas-top-n",
    title: "Find the top rows",
    summary: "Sort descending and take the largest values.",
    difficulty: "beginner",
    topics: ["pandas", "sorting"],
    lessonHref: "/learn/pandas/sorting-and-ranking",
    prompt: "Return the three rows with the highest score, highest first.",
    starterCode: `import pandas as pd

df = pd.DataFrame({"name": list("ABCDE"), "score": [70, 95, 88, 60, 91]})
top_three = ...`,
    tests: [
      {
        name: "the top three are ordered correctly",
        code: 'assert top_three["name"].tolist() == ["B", "E", "C"]\nassert top_three["score"].tolist() == [95, 91, 88]',
      },
    ],
    hints: ["Sort by score in descending order.", "Use .head(3)."],
    solution: `import pandas as pd

df = pd.DataFrame({"name": list("ABCDE"), "score": [70, 95, 88, 60, 91]})
top_three = df.sort_values("score", ascending=False).head(3)`,
    packages: [],
  },
  {
    id: "pandas-date-features",
    title: "Extract date parts",
    summary: "Turn text dates into structured features.",
    difficulty: "intermediate",
    topics: ["pandas", "dates"],
    lessonHref: "/learn/pandas/dates-and-times",
    prompt: "Parse the date column and add a weekday number.",
    starterCode: `import pandas as pd

df = pd.DataFrame({"date": ["2026-01-05", "2026-01-06", "2026-01-07"]})
df["date"] = ...
df["weekday"] = ...`,
    tests: [
      {
        name: "dates are parsed and weekdays are correct",
        code: 'assert str(df["date"].dtype).startswith("datetime64")\nassert df["weekday"].tolist() == [0, 1, 2]',
      },
    ],
    hints: ["Use pd.to_datetime.", "The .dt.dayofweek accessor returns Monday as 0."],
    solution: `import pandas as pd

df = pd.DataFrame({"date": ["2026-01-05", "2026-01-06", "2026-01-07"]})
df["date"] = pd.to_datetime(df["date"])
df["weekday"] = df["date"].dt.dayofweek`,
    packages: [],
  },
  {
    id: "matplotlib-line-data",
    title: "Inspect a line",
    summary: "Plot points and check the data stored on the line.",
    difficulty: "beginner",
    topics: ["matplotlib", "pyplot"],
    lessonHref: "/learn/matplotlib/plot-basics",
    prompt: "Plot x against y and store the created line.",
    starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3]
y = [4, 5, 6]
line, = ...`,
    tests: [
      {
        name: "the line contains the plotted points",
        code: "assert line.get_xdata().tolist() == [1, 2, 3]\nassert line.get_ydata().tolist() == [4, 5, 6]",
      },
    ],
    hints: ["plt.plot returns a list of lines.", "Unpack the first returned line."],
    solution: `import matplotlib.pyplot as plt

x = [1, 2, 3]
y = [4, 5, 6]
line, = plt.plot(x, y)`,
    packages: [],
  },
  {
    id: "matplotlib-axes",
    title: "Create one axes",
    summary: "Use the object-oriented Figure and Axes API.",
    difficulty: "beginner",
    topics: ["matplotlib", "axes"],
    lessonHref: "/learn/matplotlib/figures-and-axes",
    prompt: "Create a figure with one axes and give the axes a title.",
    starterCode: `import matplotlib.pyplot as plt

fig, ax = ...
ax.set_title(...)`,
    tests: [
      {
        name: "the figure has one titled axes",
        code: 'assert len(fig.axes) == 1\nassert ax.get_title() == "Revenue"',
      },
    ],
    hints: ["Use plt.subplots().", "The title should be exactly Revenue."],
    solution: `import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.set_title("Revenue")`,
    packages: [],
  },
  {
    id: "matplotlib-histogram",
    title: "Count a histogram",
    summary: "Create a histogram and inspect its bin counts.",
    difficulty: "beginner",
    topics: ["matplotlib", "histogram"],
    lessonHref: "/learn/matplotlib/histograms",
    prompt: "Histogram the values into four bins and store the counts.",
    starterCode: `import matplotlib.pyplot as plt

values = [1, 1, 2, 2, 3, 3, 4, 4]
counts, bins, patches = ...`,
    tests: [
      {
        name: "the histogram has four bins and eight values",
        code: "assert len(counts) == 4\nassert int(counts.sum()) == 8\nassert len(bins) == 5",
      },
    ],
    hints: ["Call ax.hist(values, bins=4).", "It returns counts, bin edges, and patches."],
    solution: `import matplotlib.pyplot as plt

values = [1, 1, 2, 2, 3, 3, 4, 4]
counts, bins, patches = plt.hist(values, bins=4)`,
    packages: [],
  },
  {
    id: "matplotlib-subplots",
    title: "Two panels",
    summary: "Share a figure between two plots.",
    difficulty: "beginner",
    topics: ["matplotlib", "subplots"],
    lessonHref: "/learn/matplotlib/subplots",
    prompt: "Create one row with two axes and title them Left and Right.",
    starterCode: `import matplotlib.pyplot as plt

fig, axes = ...
axes[0].set_title(...)
axes[1].set_title(...)`,
    tests: [
      {
        name: "both panels exist with titles",
        code: 'assert len(axes) == 2\nassert axes[0].get_title() == "Left"\nassert axes[1].get_title() == "Right"',
      },
    ],
    hints: ["Use plt.subplots(1, 2).", "Index the axes array for each title."],
    solution: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2)
axes[0].set_title("Left")
axes[1].set_title("Right")`,
    packages: [],
  },
  {
    id: "matplotlib-legend",
    title: "Label a series",
    summary: "Plot two lines and add a legend.",
    difficulty: "beginner",
    topics: ["matplotlib", "legend"],
    lessonHref: "/learn/matplotlib/legends",
    prompt: "Plot two labeled lines and call legend.",
    starterCode: `import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3], ...)
ax.plot([1, 2, 3], [3, 2, 1], ...)
ax....`,
    tests: [
      {
        name: "the legend has two labeled entries",
        code: 'legend = ax.get_legend()\nassert legend is not None\nassert [text.get_text() for text in legend.get_texts()] == ["Up", "Down"]',
      },
    ],
    hints: ["Pass label=\"Up\" and label=\"Down\".", "Call ax.legend() at the end."],
    solution: `import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3], label="Up")
ax.plot([1, 2, 3], [3, 2, 1], label="Down")
ax.legend()`,
    packages: [],
  },
  {
    id: "matplotlib-bar-heights",
    title: "Set bar heights",
    summary: "Create a bar chart from categorical totals.",
    difficulty: "beginner",
    topics: ["matplotlib", "bar"],
    lessonHref: "/learn/matplotlib/bar-and-scatter",
    prompt: "Create a bar chart with labels A, B, C and heights 3, 7, 5.",
    starterCode: `import matplotlib.pyplot as plt

fig, ax = plt.subplots()
bars = ...`,
    tests: [
      {
        name: "the bars match the requested heights",
        code: "assert [bar.get_height() for bar in bars] == [3, 7, 5]",
      },
    ],
    hints: ["Call ax.bar with labels and heights.", "Store the returned BarContainer."],
    solution: `import matplotlib.pyplot as plt

fig, ax = plt.subplots()
bars = ax.bar(["A", "B", "C"], [3, 7, 5])`,
    packages: [],
  },
  {
    id: "sklearn-split",
    title: "Make a holdout split",
    summary: "Split rows reproducibly and preserve class balance.",
    difficulty: "beginner",
    topics: ["scikit-learn", "validation"],
    lessonHref: "/learn/sklearn/evaluation",
    prompt: "Split the iris data with 25 percent held out, seed 42, and stratify by target.",
    starterCode: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

iris = load_iris()
X_train, X_test, y_train, y_test = ...`,
    tests: [
      {
        name: "the split has the expected sizes",
        code: "assert X_train.shape == (112, 4)\nassert X_test.shape == (38, 4)\nassert y_train.shape == (112,)",
      },
    ],
    hints: ["Pass test_size=0.25 and random_state=42.", "Set stratify=iris.target."],
    solution: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data,
    iris.target,
    test_size=0.25,
    random_state=42,
    stratify=iris.target,
)`,
    packages: [],
  },
  {
    id: "sklearn-scale",
    title: "Fit a scaler",
    summary: "Learn scaling parameters from training data only.",
    difficulty: "beginner",
    topics: ["scikit-learn", "preprocessing"],
    lessonHref: "/learn/sklearn/preprocessing",
    prompt: "Fit StandardScaler on X_train and transform both splits.",
    starterCode: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X_train, X_test, y_train, y_test = train_test_split(
    load_iris().data, load_iris().target, test_size=0.2, random_state=0
)
scaler = ...
X_train_scaled = ...
X_test_scaled = ...`,
    tests: [
      {
        name: "training data is standardized",
        code: "assert abs(X_train_scaled.mean(axis=0)).max() < 1e-9\nassert X_test_scaled.shape == X_test.shape",
      },
    ],
    hints: ["Create StandardScaler() and call fit on X_train.", "Transform each split with the same scaler."],
    solution: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X_train, X_test, y_train, y_test = train_test_split(
    load_iris().data, load_iris().target, test_size=0.2, random_state=0
)
scaler = StandardScaler()
scaler.fit(X_train)
X_train_scaled = scaler.transform(X_train)
X_test_scaled = scaler.transform(X_test)`,
    packages: [],
  },
  {
    id: "sklearn-classify",
    title: "Train a classifier",
    summary: "Fit logistic regression and report accuracy.",
    difficulty: "intermediate",
    topics: ["scikit-learn", "classification"],
    lessonHref: "/learn/sklearn/classification",
    prompt: "Fit LogisticRegression on the training split and store accuracy.",
    starterCode: `from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    load_iris().data, load_iris().target, test_size=0.25, random_state=7, stratify=load_iris().target
)
model = ...
accuracy = ...`,
    tests: [
      {
        name: "the fitted model has strong accuracy",
        code: "assert hasattr(model, \"coef_\")\nassert 0.85 <= accuracy <= 1.0, accuracy",
      },
    ],
    hints: ["Create LogisticRegression(max_iter=1000).", "Fit, then use model.score on the test split."],
    solution: `from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    load_iris().data, load_iris().target, test_size=0.25, random_state=7, stratify=load_iris().target
)
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
accuracy = model.score(X_test, y_test)`,
    packages: [],
  },
  {
    id: "sklearn-kmeans",
    title: "Cluster points",
    summary: "Fit k-means and inspect cluster assignments.",
    difficulty: "intermediate",
    topics: ["scikit-learn", "clustering"],
    lessonHref: "/learn/sklearn/clustering",
    prompt: "Fit KMeans with three clusters on the iris features.",
    starterCode: `from sklearn.cluster import KMeans
from sklearn.datasets import load_iris

X = load_iris().data
model = ...
labels = ...`,
    tests: [
      {
        name: "three clusters are assigned",
        code: "assert hasattr(model, \"cluster_centers_\")\nassert model.cluster_centers_.shape == (3, 4)\nassert len(set(labels)) == 3",
      },
    ],
    hints: ["Create KMeans(n_clusters=3, random_state=0, n_init=10).", "Call fit_predict or fit then access labels_."],
    solution: `from sklearn.cluster import KMeans
from sklearn.datasets import load_iris

X = load_iris().data
model = KMeans(n_clusters=3, random_state=0, n_init=10)
labels = model.fit_predict(X)`,
    packages: [],
  },
  {
    id: "sklearn-pca",
    title: "Reduce dimensions",
    summary: "Fit PCA and keep enough components to explain variance.",
    difficulty: "intermediate",
    topics: ["scikit-learn", "decomposition"],
    lessonHref: "/learn/sklearn/pca",
    prompt: "Fit PCA with two components on the iris data.",
    starterCode: `from sklearn.datasets import load_iris
from sklearn.decomposition import PCA

X = load_iris().data
pca = ...
transformed = ...`,
    tests: [
      {
        name: "two components are returned",
        code: "assert transformed.shape == (150, 2)\nassert pca.explained_variance_ratio_.shape == (2,)\nassert 0.9 < pca.explained_variance_ratio_.sum() <= 1.0",
      },
    ],
    hints: ["Create PCA(n_components=2).", "Call fit_transform(X)."],
    solution: `from sklearn.datasets import load_iris
from sklearn.decomposition import PCA

X = load_iris().data
pca = PCA(n_components=2)
transformed = pca.fit_transform(X)`,
    packages: [],
  },
  {
    id: "sklearn-cross-validate",
    title: "Cross-validate",
    summary: "Evaluate a model across several folds.",
    difficulty: "advanced",
    topics: ["scikit-learn", "validation"],
    lessonHref: "/learn/sklearn/model-selection",
    prompt: "Run five-fold cross-validation and store the mean score.",
    starterCode: `from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

X = load_iris().data
y = load_iris().target
scores = ...
mean_score = ...`,
    tests: [
      {
        name: "five fold scores were produced",
        code: "assert len(scores) == 5\nassert 0.8 <= mean_score <= 1.0\nassert abs(mean_score - scores.mean()) < 1e-12",
      },
    ],
    hints: ["Call cross_val_score(model, X, y, cv=5).", "Use scores.mean()."],
    solution: `from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

X = load_iris().data
y = load_iris().target
model = LogisticRegression(max_iter=1000)
scores = cross_val_score(model, X, y, cv=5)
mean_score = scores.mean()`,
    packages: [],
  },
];
