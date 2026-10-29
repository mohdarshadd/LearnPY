import type { Lesson } from "@/content/schema";

export const sklearnLessons: Lesson[] = [
  {
    id: "sklearn-workflow",
    library: "sklearn",
    slug: "workflow",
    title: "Start with the scikit-learn API",
    summary:
      "Learn the fit, predict, and score rhythm that every estimator shares, then protect the test set with a pipeline.",
    minutes: 12,
    level: "beginner",
    packages: ["scikit-learn", "numpy"],
    objectives: [
      "Recognize the fit, predict, and score API shared by estimators.",
      "Split data before learning anything from it.",
      "Distinguish transformers from predictors.",
      "Fit preprocessing on training data only.",
      "Use a Pipeline to keep training and inference consistent.",
    ],
    sections: [
      {
        id: "one-grammar",
        title: "One grammar for many models",
        blocks: [
          {
            type: "text",
            text: "scikit-learn wraps models and preprocessing steps in objects with a small, consistent API. A predictor learns with fit(X, y), produces outputs with predict(X), and summarizes held-out performance with score(X, y). A transformer learns with fit(X) and applies the learned rule with transform(X).",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data,
    iris.target,
    test_size=0.2,
    random_state=42,
    stratify=iris.target,
)

model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)

predictions = model.predict(X_test)
accuracy = model.score(X_test, y_test)
print(predictions[:5])
print(round(accuracy, 3))`,
            language: "python",
            caption: "Fit on the training split, then evaluate on the test split",
            runnable: true,
          },
          {
            type: "callout",
            tone: "tip",
            title: "The names carry meaning",
            text: "fit learns parameters, predict returns model outputs, transform returns a changed feature matrix, and score returns a task-specific default metric.",
          },
        ],
      },
      {
        id: "split-first",
        title: "Split before you look",
        blocks: [
          {
            type: "text",
            text: "The test set stands in for data the model has never seen. If you scale, impute, or select features using the full dataset before splitting, information from the test set leaks into training. Split first, then treat the test features as if they arrive tomorrow.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data,
    iris.target,
    test_size=0.25,
    random_state=7,
    stratify=iris.target,
)

print("train rows:", X_train.shape[0])
print("test rows: ", X_test.shape[0])
print("train class counts:", y_train.sum())
print("test class counts: ", y_test.sum())`,
            language: "python",
            caption: "A reproducible, stratified split",
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "random_state makes the split reproducible.",
              "stratify=iris.target keeps the class proportions in both splits.",
              "Keep X_test and y_test untouched until the final evaluation.",
            ],
          },
        ],
      },
      {
        id: "predict-and-score",
        title: "Predictions are not probabilities",
        blocks: [
          {
            type: "text",
            text: "predict returns the model's chosen label or value. Many classifiers also expose predict_proba for per-class probabilities. Use predict when you need a decision, and predict_proba when the confidence or ranking matters.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42, stratify=iris.target
)

model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)

labels = model.predict(X_test)
probabilities = model.predict_proba(X_test)

print("label shape:      ", labels.shape)
print("probability shape:", probabilities.shape)
print("classes:          ", model.classes_)
print("first probabilities:", probabilities[0].round(2))`,
            language: "python",
            caption: "A label plus a vector of class probabilities",
            runnable: true,
          },
          {
            type: "callout",
            tone: "note",
            title: "Shapes explain the output",
            text: "For a three-class problem with 30 test rows, predict returns shape (30,) while predict_proba returns (30, 3). Each row of probabilities sums to 1.",
          },
        ],
      },
      {
        id: "pipelines",
        title: "Put the steps in a pipeline",
        blocks: [
          {
            type: "text",
            text: "A Pipeline chains transformers and a final estimator. Calling fit on the pipeline fits each transformer on the training data, transforms it, and then fits the next step. Calling predict on the pipeline applies the saved transformations before predicting.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42, stratify=iris.target
)

model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", KNeighborsClassifier(n_neighbors=3)),
])

model.fit(X_train, y_train)
print(round(model.score(X_test, y_test), 3))
print(model.named_steps["scale"].mean_[:2])`,
            language: "python",
            caption: "Scaling and prediction as one object",
            runnable: true,
          },
          {
            type: "text",
            text: "The pipeline learns the scaler's mean and standard deviation from X_train only. At prediction time it applies those same training statistics to X_test. That is the behavior you want in production.",
          },
        ],
      },
      {
        id: "inspection",
        title: "Inspect what the model learned",
        blocks: [
          {
            type: "text",
            text: "Fitted attributes end in an underscore. A scaler stores mean_ and scale_; a classifier stores classes_; a pipeline exposes named_steps. Inspecting these values is often faster than guessing why a score changed.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42, stratify=iris.target
)

model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", KNeighborsClassifier()),
])
model.fit(X_train, y_train)

scaler = model.named_steps["scale"]
classifier = model.named_steps["classify"]
print("features:", scaler.n_features_in_)
print("means:   ", scaler.mean_.round(2))
print("classes: ", classifier.classes_)
assert hasattr(scaler, "mean_")
assert hasattr(classifier, "classes_")`,
            language: "python",
            caption: "Read the learned state from named steps",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Calling predict before fit fails",
            text: "An unfitted estimator has no learned state. Call fit first, or use the Pipeline so every preparation step is fitted in the right order.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "iris-workflow",
        prompt:
          "Split the iris data into 80% training and 20% test rows with random_state=42 and stratification. Fit KNeighborsClassifier(n_neighbors=3), predict the test labels, and store the test accuracy in accuracy.",
        starterCode: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

iris = load_iris()

# Split, fit, predict, and score.
X_train, X_test, y_train, y_test = None, None, None, None
model = None
predictions = None
accuracy = None`,
        tests: [
          {
            name: "the split has the expected sizes",
            code: 'import numpy as np\nassert X_train.shape == (120, 4), X_train.shape\nassert X_test.shape == (30, 4), X_test.shape\nassert y_train.shape == (120,)\nassert y_test.shape == (30,)',
          },
          {
            name: "the model was fitted and predicts labels",
            code: 'import numpy as np\nassert hasattr(model, "classes_"), "the model is not fitted"\nassert predictions.shape == (30,), predictions.shape\nassert set(np.unique(predictions)).issubset(set(model.classes_))',
          },
          {
            name: "the held-out accuracy is strong",
            code: 'assert 0.8 <= accuracy <= 1.0, f"accuracy was {accuracy}"\nassert abs(accuracy - model.score(X_test, y_test)) < 1e-12',
          },
        ],
        hints: [
          "Pass test_size=0.2, random_state=42, and stratify=iris.target to train_test_split.",
          "Call model.fit(X_train, y_train), then predictions = model.predict(X_test) and accuracy = model.score(X_test, y_test).",
        ],
        solution: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data,
    iris.target,
    test_size=0.2,
    random_state=42,
    stratify=iris.target,
)

model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)
predictions = model.predict(X_test)
accuracy = model.score(X_test, y_test)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "fit-meaning",
        question: "What does fit(X, y) do for a predictor?",
        options: [
          { id: "learn", label: "Learns parameters from the training data" },
          { id: "evaluate", label: "Returns the final test accuracy" },
          { id: "plot", label: "Draws the model's decision boundary" },
        ],
        answerId: "learn",
        explanation:
          "fit estimates the model's learned state from the supplied examples.",
      },
      {
        id: "pipeline-order",
        question: "Why put scaling and a classifier in one Pipeline?",
        options: [
          { id: "consistent", label: "The same training transformations are reused at prediction time" },
          { id: "faster", label: "It removes the need to split the data" },
          { id: "accuracy", label: "It guarantees perfect accuracy" },
        ],
        answerId: "consistent",
        explanation:
          "The pipeline stores the fitted transformers and applies them consistently to every later prediction.",
      },
      {
        id: "leakage",
        question: "Which action causes data leakage?",
        options: [
          { id: "full", label: "Fitting a scaler on all rows before splitting" },
          { id: "train", label: "Fitting a scaler on the training rows only" },
          { id: "holdout", label: "Keeping the test set untouched" },
        ],
        answerId: "full",
        explanation:
          "Fitting on all rows lets test-set statistics influence preprocessing, so the held-out score is no longer honest.",
      },
    ],
    next: {
      label: "Prepare features without leakage",
      href: "/learn/sklearn/preprocessing",
    },
  },
  {
    id: "sklearn-preprocessing",
    library: "sklearn",
    slug: "preprocessing",
    title: "Prepare features without leakage",
    summary:
      "Handle missing values, scale numeric columns, encode categories, and combine those steps with ColumnTransformer.",
    minutes: 14,
    level: "beginner",
    packages: ["scikit-learn", "numpy", "pandas"],
    objectives: [
      "Impute missing numeric values with training statistics.",
      "Scale features after splitting the data.",
      "One-hot encode categorical columns.",
      "Build a ColumnTransformer for mixed data.",
      "Keep preprocessing inside a fitted pipeline.",
    ],
    sections: [
      {
        id: "missing-values",
        title: "Missing values need a rule",
        blocks: [
          {
            type: "text",
            text: "Most scikit-learn estimators do not accept NaN. SimpleImputer replaces missing entries with a learned statistic such as the mean or median. Fit the imputer on training data, then use the same learned values on test data.",
          },
          {
            type: "code",
            code: `import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split

X = np.array([
    [1.0, 10.0],
    [2.0, np.nan],
    [3.0, 30.0],
    [4.0, 40.0],
    [5.0, 50.0],
    [6.0, 60.0],
])
X_train, X_test = train_test_split(X, test_size=0.33, random_state=42)

imputer = SimpleImputer(strategy="median")
X_train_ready = imputer.fit_transform(X_train)
X_test_ready = imputer.transform(X_test)

print("learned medians:", imputer.statistics_)
print("training shape: ", X_train_ready.shape)
print("test shape:     ", X_test_ready.shape)`,
            language: "python",
            caption: "Learn imputation values on the training split",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "fit_transform belongs on training data",
            text: "Use fit_transform on X_train, then transform on X_test. Calling fit_transform on the test set would learn a separate rule and leak information.",
          },
        ],
      },
      {
        id: "scaling",
        title: "Scale on the training distribution",
        blocks: [
          {
            type: "text",
            text: "StandardScaler subtracts the training mean and divides by the training standard deviation. The transformed training columns have mean 0 and standard deviation 1; the test columns use those same training values, so they will not necessarily be centered at 0 themselves.",
          },
          {
            type: "code",
            code: `import numpy as np
from sklearn.preprocessing import StandardScaler

X_train = np.array([[10.0, 100.0], [12.0, 120.0], [14.0, 140.0], [16.0, 160.0]])
X_test = np.array([[20.0, 200.0], [8.0, 80.0]])

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("train means: ", X_train_scaled.mean(axis=0).round(3))
print("train stds:  ", X_train_scaled.std(axis=0).round(3))
print("test means:  ", X_test_scaled.mean(axis=0).round(3))`,
            language: "python",
            caption: "The test set is transformed, not refitted",
            runnable: true,
          },
          {
            type: "text",
            text: "Scaling matters for distance-based models such as K-nearest neighbors, for regularized linear models, and for PCA. Tree-based models usually do not need it.",
          },
        ],
      },
      {
        id: "categories",
        title: "Turn categories into columns",
        blocks: [
          {
            type: "text",
            text: "OneHotEncoder creates one binary column per known category. handle_unknown=\"ignore\" keeps prediction working when a new category appears, and sparse_output=False returns a dense array that is easy to inspect.",
          },
          {
            type: "code",
            code: `import numpy as np
from sklearn.preprocessing import OneHotEncoder

cities = np.array([["Pune"], ["Delhi"], ["Pune"], ["Mumbai"], ["Delhi"]])
encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
encoded = encoder.fit_transform(cities)

print("categories:", encoder.categories_[0])
print(encoded)
print("shape:", encoded.shape)`,
            language: "python",
            caption: "One binary column per category",
            runnable: true,
          },
          {
            type: "callout",
            tone: "note",
            title: "Avoid dummy-variable traps",
            text: "For some linear models, drop=\"first\" avoids perfect collinearity between the encoded columns. Tree-based models generally do not need that adjustment.",
          },
        ],
      },
      {
        id: "column-transformer",
        title: "Apply different rules to different columns",
        blocks: [
          {
            type: "text",
            text: "Real tables mix numeric and categorical columns. ColumnTransformer applies one preprocessing pipeline to the numeric columns and another to the categorical columns, then concatenates the results.",
          },
          {
            type: "code",
            code: `import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

frame = pd.DataFrame({
    "age": [25.0, np.nan, 41.0, 33.0, 52.0, 29.0],
    "city": ["Pune", "Delhi", "Pune", "Mumbai", "Delhi", "Pune"],
    "spend": [100.0, 150.0, np.nan, 130.0, 220.0, 140.0],
})
y = np.array([0, 1, 0, 1, 1, 0])

X_train, X_test, y_train, y_test = train_test_split(
    frame, y, test_size=0.33, random_state=42, stratify=y
)

numeric = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler()),
])
categorical = OneHotEncoder(handle_unknown="ignore", sparse_output=False)

preprocessor = ColumnTransformer([
    ("num", numeric, ["age", "spend"]),
    ("cat", categorical, ["city"]),
])

X_train_ready = preprocessor.fit_transform(X_train)
X_test_ready = preprocessor.transform(X_test)
print(X_train_ready.shape)
print(X_test_ready.shape)`,
            language: "python",
            caption: "A mixed-data preprocessing recipe",
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Numeric columns are imputed with the training median, then standardized.",
              "The city column becomes one binary column per known city.",
              "The fitted preprocessor is now ready to sit in front of a model.",
            ],
          },
        ],
      },
      {
        id: "preprocess-then-model",
        title: "Make preprocessing part of the model",
        blocks: [
          {
            type: "text",
            text: "The safest place for preprocessing is inside the same Pipeline as the estimator. Then cross-validation, fitting, and prediction all reuse the same learned rules without manual bookkeeping.",
          },
          {
            type: "code",
            code: `import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.datasets import load_iris
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42, stratify=iris.target
)

model = Pipeline([
    ("prepare", ColumnTransformer([
        ("numeric", Pipeline([
            ("impute", SimpleImputer(strategy="median")),
            ("scale", StandardScaler()),
        ]), [0, 1, 2, 3]),
    ])),
    ("classify", KNeighborsClassifier(n_neighbors=3)),
])

model.fit(X_train, y_train)
print(round(model.score(X_test, y_test), 3))`,
            language: "python",
            caption: "Cross-validation would refit this whole recipe",
            runnable: true,
          },
          {
            type: "callout",
            tone: "tip",
            title: "A pipeline is a reusable recipe",
            text: "You can pass the whole pipeline to cross_val_score or GridSearchCV. Each fold refits the imputer and scaler on its own training portion.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "mixed-preprocessing",
        prompt:
          "Build a ColumnTransformer named preprocessor. Apply median imputation then StandardScaler to age and spend, and OneHotEncoder(handle_unknown=\"ignore\", sparse_output=False) to city. Fit it on X_train and transform both X_train and X_test into X_train_ready and X_test_ready.",
        starterCode: `import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

frame = pd.DataFrame({
    "age": [25.0, np.nan, 41.0, 33.0, 52.0, 29.0],
    "city": ["Pune", "Delhi", "Pune", "Mumbai", "Delhi", "Pune"],
    "spend": [100.0, 150.0, np.nan, 130.0, 220.0, 140.0],
})
y = np.array([0, 1, 0, 1, 1, 0])

X_train, X_test, y_train, y_test = train_test_split(
    frame, y, test_size=0.33, random_state=42, stratify=y
)

# Build the mixed-data preprocessor.
preprocessor = None
X_train_ready = None
X_test_ready = None`,
        tests: [
          {
            name: "the preprocessor fits the training rows",
            code: 'import numpy as np\nassert preprocessor is not None, "preprocessor is still None"\nassert X_train_ready.shape[0] == len(X_train)\nassert X_test_ready.shape[0] == len(X_test)\nassert X_train_ready.shape[1] == 5, X_train_ready.shape\nassert X_test_ready.shape[1] == 5, X_test_ready.shape',
          },
          {
            name: "the prepared data is complete",
            code: 'import numpy as np\nassert not np.isnan(X_train_ready).any(), "NaNs remain in training data"\nassert not np.isnan(X_test_ready).any(), "NaNs remain in test data"',
          },
          {
            name: "the learned steps are retained",
            code: 'import numpy as np\nassert hasattr(preprocessor, "transformers_")\nassert len(preprocessor.transformers_) == 2\nnumeric = preprocessor.named_transformers_["num"]\nassert hasattr(numeric.named_steps["impute"], "statistics_")\nassert hasattr(numeric.named_steps["scale"], "mean_")\nassert np.allclose(X_train_ready[:, :2].mean(axis=0), 0)',
          },
        ],
        hints: [
          "Put SimpleImputer and StandardScaler in a Pipeline for the numeric columns.",
          "ColumnTransformer takes (name, transformer, columns) tuples; use [\"age\", \"spend\"] and [\"city\"].",
          "Call fit_transform on X_train, then transform on X_test.",
        ],
        solution: `import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

frame = pd.DataFrame({
    "age": [25.0, np.nan, 41.0, 33.0, 52.0, 29.0],
    "city": ["Pune", "Delhi", "Pune", "Mumbai", "Delhi", "Pune"],
    "spend": [100.0, 150.0, np.nan, 130.0, 220.0, 140.0],
})
y = np.array([0, 1, 0, 1, 1, 0])

X_train, X_test, y_train, y_test = train_test_split(
    frame, y, test_size=0.33, random_state=42, stratify=y
)

numeric = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler()),
])
categorical = OneHotEncoder(handle_unknown="ignore", sparse_output=False)

preprocessor = ColumnTransformer([
    ("num", numeric, ["age", "spend"]),
    ("cat", categorical, ["city"]),
])

X_train_ready = preprocessor.fit_transform(X_train)
X_test_ready = preprocessor.transform(X_test)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "imputer-fit",
        question: "Where should SimpleImputer learn its fill values?",
        options: [
          { id: "train", label: "On the training data only" },
          { id: "all", label: "On the full dataset before splitting" },
          { id: "test", label: "On the test data only" },
        ],
        answerId: "train",
        explanation:
          "Imputation statistics belong to the training data; applying them to test data keeps the evaluation honest.",
      },
      {
        id: "unknown-category",
        question: "What does handle_unknown=\"ignore\" do for unseen categories?",
        options: [
          { id: "zeros", label: "Encodes them as all zeros instead of failing" },
          { id: "error", label: "Raises an error for every new category" },
          { id: "delete", label: "Drops the entire row" },
        ],
        answerId: "zeros",
        explanation:
          "The encoder leaves the unknown category without an active indicator column, which keeps prediction running.",
      },
      {
        id: "column-transformer",
        question: "What is ColumnTransformer for?",
        options: [
          { id: "mixed", label: "Applying different preprocessing to different column groups" },
          { id: "rows", label: "Selecting a random subset of rows" },
          { id: "models", label: "Comparing several fitted models at once" },
        ],
        answerId: "mixed",
        explanation:
          "It routes numeric and categorical columns through their own transformers, then combines the outputs.",
      },
    ],
  },
];
