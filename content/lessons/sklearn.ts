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
    next: {
      label: "Predict a number with regression",
      href: "/learn/sklearn/regression",
    },
  },
  {
    id: "sklearn-regression",
    library: "sklearn",
    slug: "regression",
    title: "Predict a number with regression",
    summary:
      "Fit a continuous target, read coefficients carefully, and evaluate predictions in the target's own units.",
    minutes: 14,
    level: "beginner",
    packages: ["scikit-learn", "numpy", "matplotlib"],
    objectives: [
      "Fit and predict a continuous target with LinearRegression.",
      "Interpret coefficients when features are scaled.",
      "Measure MAE, RMSE, and R² on held-out rows.",
      "Inspect residuals for structure the metrics hide.",
      "Use Ridge regularization when coefficients are unstable.",
    ],
    sections: [
      {
        id: "continuous-target",
        title: "Start from the target",
        blocks: [
          {
            type: "text",
            text: "Regression predicts a continuous quantity: a price, a duration, a demand count, or a disease-progression score. The target determines the metric. An error of 50 means something different for dollars than for days, so always report metrics in the target's units.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_diabetes

diabetes = load_diabetes()
print("rows:    ", diabetes.data.shape[0])
print("features:", diabetes.data.shape[1])
print("target range:", diabetes.target.min(), "to", diabetes.target.max())
print("feature names:", diabetes.feature_names[:4])`,
            language: "python",
            caption: "A small regression dataset with a continuous target",
            runnable: true,
          },
          {
            type: "callout",
            tone: "note",
            title: "Features are already standardized here",
            text: "The diabetes dataset ships with each feature centered and scaled. In your own data, place StandardScaler inside the pipeline before the regressor.",
          },
        ],
      },
      {
        id: "fit-a-model",
        title: "Fit a regression pipeline",
        blocks: [
          {
            type: "text",
            text: "LinearRegression finds coefficients that minimize squared error on the training rows. A pipeline keeps any feature preparation with the model, so the same learned transformation is used at prediction time.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data,
    diabetes.target,
    test_size=0.2,
    random_state=42,
)

model = Pipeline([
    ("scale", StandardScaler()),
    ("regress", LinearRegression()),
])
model.fit(X_train, y_train)
predictions = model.predict(X_test)

print("predictions:", predictions[:4].round(1))
print("test rows:  ", len(predictions))`,
            language: "python",
            caption: "Fit on training rows, predict held-out rows",
            runnable: true,
          },
          {
            type: "text",
            text: "Calling model.score on a regressor returns R² by default. That is useful, but it is not the whole story. A model can have a respectable R² and still make errors that are too large for the decision at hand.",
          },
        ],
      },
      {
        id: "coefficients",
        title: "Read coefficients in context",
        blocks: [
          {
            type: "text",
            text: "For a scaled feature, a coefficient estimates the target change for a one-standard-deviation increase in that feature, holding the others fixed. Positive and negative signs describe association, not proof of causation.",
          },
          {
            type: "code",
            code: `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("regress", LinearRegression()),
])
model.fit(X_train, y_train)

coefs = model.named_steps["regress"].coef_
order = np.argsort(np.abs(coefs))[::-1]
for index in order[:5]:
    print(f"{diabetes.feature_names[index]:>8}: {coefs[index]: .1f}")`,
            language: "python",
            caption: "The largest coefficients in absolute value",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Collinearity splits credit",
            text: "When two features carry similar information, their individual coefficients can become unstable or flip sign. Interpret them together, or use regularization.",
          },
        ],
      },
      {
        id: "metrics",
        title: "Measure error in target units",
        blocks: [
          {
            type: "text",
            text: "Mean absolute error is the average absolute miss and is easy to explain. Root mean squared error punishes large misses more strongly. R² compares the model's squared error with the squared error of predicting the training mean; 1 is perfect, 0 is that baseline, and values can be negative on held-out data.",
          },
          {
            type: "code",
            code: `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("regress", LinearRegression()),
])
model.fit(X_train, y_train)
predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))
r2 = r2_score(y_test, predictions)
print(f"MAE:  {mae:.1f}")
print(f"RMSE: {rmse:.1f}")
print(f"R2:   {r2:.3f}")`,
            language: "python",
            caption: "Three views of the same regression errors",
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "MAE is robust and has the same units as the target.",
              "RMSE grows faster when a few predictions are very wrong.",
              "R² is scale-free but can hide the size of the actual error.",
            ],
          },
        ],
      },
      {
        id: "residuals",
        title: "Plot what the metrics miss",
        blocks: [
          {
            type: "text",
            text: "A residual is actual minus predicted. Plot residuals against predictions. A random cloud around zero is reassuring; a curve, a funnel, or a cluster suggests the linear model is missing structure.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("regress", LinearRegression()),
])
model.fit(X_train, y_train)
predictions = model.predict(X_test)
residuals = y_test - predictions

fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.scatter(predictions, residuals, alpha=0.6)
ax.axhline(0, color="#334155", linewidth=1)
ax.set_title("Residuals vs predictions")
ax.set_xlabel("Predicted target")
ax.set_ylabel("Actual - predicted")`,
            language: "python",
            caption: "Look for a pattern, not just a score",
            runnable: true,
          },
          {
            type: "callout",
            tone: "tip",
            title: "Residuals are diagnostic, not decoration",
            text: "If residuals fan out as predictions grow, a constant-error assumption may be wrong. If they curve, a nonlinear feature or transformation may help.",
          },
        ],
      },
      {
        id: "ridge",
        title: "Stabilize with Ridge",
        blocks: [
          {
            type: "text",
            text: "Ridge adds a penalty on the size of the coefficients. A larger alpha shrinks them toward zero. This can improve held-out performance when features are correlated or the sample is small, but it also introduces bias.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)

for alpha in [0.01, 0.1, 1.0, 10.0]:
    model = Pipeline([
        ("scale", StandardScaler()),
        ("regress", Ridge(alpha=alpha)),
    ])
    model.fit(X_train, y_train)
    print(f"alpha={alpha:>4}: R2={model.score(X_test, y_test):.3f}")`,
            language: "python",
            caption: "Compare regularization strengths on the same split",
            runnable: true,
          },
          {
            type: "text",
            text: "Do not choose alpha by peeking repeatedly at the test score. Use cross-validation on the training rows, then evaluate the chosen model once on the test set.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "diabetes-regression",
        prompt:
          "Fit a StandardScaler plus LinearRegression pipeline on the diabetes training rows. Predict X_test, then store mean absolute error in mae, root mean squared error in rmse, and R² in r2.",
        starterCode: `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)

# Fit, predict, and measure.
model = None
predictions = None
mae = None
rmse = None
r2 = None`,
        tests: [
          {
            name: "the regression pipeline made predictions",
            code: 'import numpy as np\nfrom sklearn.pipeline import Pipeline\nassert isinstance(model, Pipeline), type(model).__name__\nassert hasattr(model, "predict")\nassert predictions.shape == (89,), predictions.shape\nassert np.isfinite(predictions).all()',
          },
          {
            name: "the errors are in target units",
            code: 'import numpy as np\nfrom sklearn.metrics import mean_absolute_error, mean_squared_error\nassert 20 < mae < 70, mae\nassert 20 < rmse < 80, rmse\nassert np.isclose(mae, mean_absolute_error(y_test, predictions))\nassert np.isclose(rmse, np.sqrt(mean_squared_error(y_test, predictions)))',
          },
          {
            name: "R² matches the predictions",
            code: 'from sklearn.metrics import r2_score\nassert -0.5 < r2 < 1.0, r2\nassert abs(r2 - r2_score(y_test, predictions)) < 1e-12',
          },
        ],
        hints: [
          "Build Pipeline([(\"scale\", StandardScaler()), (\"regress\", LinearRegression())]).",
          "Use mean_absolute_error(y_test, predictions) and np.sqrt(mean_squared_error(y_test, predictions)).",
        ],
        solution: `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)

model = Pipeline([
    ("scale", StandardScaler()),
    ("regress", LinearRegression()),
])
model.fit(X_train, y_train)
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))
r2 = r2_score(y_test, predictions)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "rmse-vs-mae",
        question: "What does RMSE emphasize compared with MAE?",
        options: [
          { id: "large", label: "Large errors are penalized more strongly" },
          { id: "units", label: "It removes the target units" },
          { id: "classification", label: "It only works for class labels" },
        ],
        answerId: "large",
        explanation:
          "Squaring before averaging gives large residuals more influence on RMSE.",
      },
      {
        id: "r2-zero",
        question: "What does an R² of 0 mean on held-out data?",
        options: [
          { id: "baseline", label: "The model is no better than predicting the training mean" },
          { id: "perfect", label: "The predictions are perfect" },
          { id: "zero-error", label: "The target values are all zero" },
        ],
        answerId: "baseline",
        explanation:
          "R² compares squared error with the mean-prediction baseline; 0 matches that baseline.",
      },
      {
        id: "ridge-alpha",
        question: "What happens as Ridge alpha increases?",
        options: [
          { id: "shrink", label: "Coefficients are shrunk more strongly toward zero" },
          { id: "more", label: "The model always fits the training data more closely" },
          { id: "remove", label: "The intercept is removed" },
        ],
        answerId: "shrink",
        explanation:
          "A larger penalty reduces coefficient magnitude, trading some training fit for stability.",
      },
    ],
    next: {
      label: "Evaluate with validation",
      href: "/learn/sklearn/evaluation",
    },
  },
  {
    id: "sklearn-evaluation",
    library: "sklearn",
    slug: "evaluation",
    title: "Evaluate with validation",
    summary:
      "Go beyond one train/test split with baselines, cross-validation, and honest comparisons that separate signal from noise.",
    minutes: 13,
    level: "beginner",
    packages: ["scikit-learn", "numpy"],
    objectives: [
      "Compare a model with a simple baseline.",
      "Use cross-validation to estimate variability.",
      "Read a train-versus-validation gap.",
      "Use negative-error scoring correctly.",
      "Keep test data out of model selection.",
    ],
    sections: [
      {
        id: "baseline",
        title: "Earn the right to be complicated",
        blocks: [
          {
            type: "text",
            text: "A baseline is the simplest reasonable prediction. For regression, predicting the training mean is a strong starting point. If a complex model cannot beat that baseline on held-out data, the complexity has not earned its place.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_diabetes
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)

baseline = DummyRegressor(strategy="mean")
baseline.fit(X_train, y_train)
baseline_predictions = baseline.predict(X_test)
print("baseline MAE:", round(mean_absolute_error(y_test, baseline_predictions), 1))`,
            language: "python",
            caption: "A mean predictor is the floor to beat",
            runnable: true,
          },
          {
            type: "callout",
            tone: "tip",
            title: "Baselines make progress measurable",
            text: "A score alone is hard to judge. The improvement over a baseline tells you whether the model learned useful structure.",
          },
        ],
      },
      {
        id: "cross-validation",
        title: "Average over several folds",
        blocks: [
          {
            type: "text",
            text: "A single split can be lucky or unlucky. Cross-validation divides the training rows into folds, fits on the other folds, and scores the held-out fold. The mean estimates performance and the spread shows how stable that estimate is.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)

model = Pipeline([
    ("scale", StandardScaler()),
    ("regress", Ridge(alpha=1.0)),
])
scores = cross_val_score(model, X_train, y_train, cv=5, scoring="r2")
print("fold scores:", scores.round(3))
print("mean:       ", scores.mean().round(3))
print("spread:     ", scores.std().round(3))`,
            language: "python",
            caption: "Five estimates from the same training set",
            runnable: true,
          },
          {
            type: "text",
            text: "cross_val_score refits the entire pipeline in every fold, including the scaler. That is why preprocessing belongs inside the pipeline: it prevents each validation fold from seeing its own holdout statistics.",
          },
        ],
      },
      {
        id: "negative-scoring",
        title: "Mind the sign of error scores",
        blocks: [
          {
            type: "text",
            text: "scikit-learn follows the convention that higher is better. Error metrics such as MAE are therefore exposed as negative scores. Select with scoring=\"neg_mean_absolute_error\" and negate the result for interpretation.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("regress", Ridge(alpha=1.0)),
])

negative_mae = cross_val_score(
    model, X_train, y_train, cv=5, scoring="neg_mean_absolute_error"
)
print("negative scores:", negative_mae.round(1))
print("MAE:", round(-negative_mae.mean(), 1))`,
            language: "python",
            caption: "Negate negative-error scores before reporting",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Do not compare raw signs",
            text: "A larger negative MAE is better because it is closer to zero. Sort scores in descending order, or negate them first.",
          },
        ],
      },
      {
        id: "overfitting",
        title: "Compare training and validation",
        blocks: [
          {
            type: "text",
            text: "A large gap between training and validation performance suggests overfitting. cross_validate can return both scores, which is more informative than a single validation number.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_validate, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("regress", LinearRegression()),
])

results = cross_validate(
    model,
    X_train,
    y_train,
    cv=5,
    scoring="r2",
    return_train_score=True,
)
print("train R2:     ", results["train_score"].mean().round(3))
print("validation R2:", results["test_score"].mean().round(3))`,
            language: "python",
            caption: "Separate memorization from generalization",
            runnable: true,
          },
          {
            type: "text",
            text: "A small gap is healthy. A huge gap with strong training scores means the model is memorizing. A low score in both places usually means the features or model are too weak.",
          },
        ],
      },
      {
        id: "test-set-discipline",
        title: "Protect the final test set",
        blocks: [
          {
            type: "text",
            text: "Use training data for exploration and cross-validation. Compare models, tune hyperparameters, and choose a preprocessing recipe there. Touch the test set once, after the decisions are made, to estimate final performance.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("regress", Ridge(alpha=1.0)),
])

cv_mae = -cross_val_score(
    model, X_train, y_train, cv=5, scoring="neg_mean_absolute_error"
).mean()
model.fit(X_train, y_train)
test_predictions = model.predict(X_test)
test_mae = mean_absolute_error(y_test, test_predictions)
print(f"cross-validated MAE: {cv_mae:.1f}")
print(f"final test MAE:      {test_mae:.1f}")`,
            language: "python",
            caption: "Choose with validation, report once on test",
            runnable: true,
          },
          {
            type: "callout",
            tone: "note",
            title: "A single test number is still noisy",
            text: "The test estimate is not a guarantee. Report the metric, the split, and the uncertainty you know about rather than implying a level of precision the data cannot support.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "baseline-and-cv",
        prompt:
          "Fit DummyRegressor(strategy=\"mean\") on the training rows and store its test MAE in baseline_mae. Build a StandardScaler plus Ridge(alpha=1.0) pipeline, then use 5-fold cross-validation on the training rows with scoring=\"neg_mean_absolute_error\"; store the fold scores in cv_scores and their negated mean in cv_mae.",
        starterCode: `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)

# Compare the baseline with cross-validated Ridge.
baseline = None
baseline_mae = None
model = None
cv_scores = None
cv_mae = None`,
        tests: [
          {
            name: "the baseline is the mean predictor",
            code: 'import numpy as np\nfrom sklearn.metrics import mean_absolute_error\nassert baseline is not None\nbaseline_predictions = baseline.predict(X_test)\nassert np.isclose(baseline_mae, mean_absolute_error(y_test, baseline_predictions))\nassert 40 < baseline_mae < 90, baseline_mae',
          },
          {
            name: "cross-validation returned five folds",
            code: 'import numpy as np\nassert cv_scores.shape == (5,), cv_scores.shape\nassert (cv_scores <= 0).all(), cv_scores\nassert np.isclose(cv_mae, -cv_scores.mean())',
          },
          {
            name: "the model beats the baseline",
            code: 'assert cv_mae > 0\nassert cv_mae < baseline_mae, (cv_mae, baseline_mae)',
          },
        ],
        hints: [
          "DummyRegressor(strategy=\"mean\") predicts the training target mean.",
          "Use cross_val_score(model, X_train, y_train, cv=5, scoring=\"neg_mean_absolute_error\"), then cv_mae = -cv_scores.mean().",
        ],
        solution: `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

diabetes = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    diabetes.data, diabetes.target, test_size=0.2, random_state=42
)

baseline = DummyRegressor(strategy="mean")
baseline.fit(X_train, y_train)
baseline_predictions = baseline.predict(X_test)
baseline_mae = mean_absolute_error(y_test, baseline_predictions)

model = Pipeline([
    ("scale", StandardScaler()),
    ("regress", Ridge(alpha=1.0)),
])
cv_scores = cross_val_score(
    model, X_train, y_train, cv=5, scoring="neg_mean_absolute_error"
)
cv_mae = -cv_scores.mean()`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "baseline-purpose",
        question: "Why compare a model with a mean-prediction baseline?",
        options: [
          { id: "earn", label: "It shows whether the model learned useful structure" },
          { id: "required", label: "It is required by scikit-learn before fitting" },
          { id: "perfect", label: "It guarantees the model will generalize" },
        ],
        answerId: "earn",
        explanation:
          "The baseline turns a raw score into an improvement you can judge.",
      },
      {
        id: "neg-mae",
        question: "Why is neg_mean_absolute_error negative?",
        options: [
          { id: "higher", label: "scikit-learn treats higher scores as better" },
          { id: "bug", label: "It is a bug in the metric" },
          { id: "units", label: "It changes the target units" },
        ],
        answerId: "higher",
        explanation:
          "Negating an error metric lets the common higher-is-better convention apply to model selection.",
      },
      {
        id: "test-once",
        question: "When should the final test set be used?",
        options: [
          { id: "final", label: "Once, after model and preprocessing choices are complete" },
          { id: "every", label: "After every hyperparameter change" },
          { id: "train", label: "During preprocessing so the scaler sees it" },
        ],
        answerId: "final",
        explanation:
          "Repeated peeking turns the test set into a tuning set and inflates the reported performance.",
      },
    ],
    next: {
      label: "Classify with probabilities",
      href: "/learn/sklearn/classification",
    },
  },
  {
    id: "sklearn-classification",
    library: "sklearn",
    slug: "classification",
    title: "Classify with probabilities",
    summary:
      "Train a binary classifier, read predicted probabilities, and choose a threshold that matches the cost of mistakes.",
    minutes: 14,
    level: "beginner",
    packages: ["scikit-learn", "numpy"],
    objectives: [
      "Fit a logistic regression classifier with a pipeline.",
      "Distinguish predicted labels from predicted probabilities.",
      "Move the decision threshold deliberately.",
      "Reason about class imbalance and error costs.",
      "Interpret coefficients as log-odds changes.",
    ],
    sections: [
      {
        id: "discrete-target",
        title: "Predict a category",
        blocks: [
          {
            type: "text",
            text: "Classification predicts a discrete label. In binary classification the target has two values, such as malignant versus benign. Accuracy is a starting point, but it can hide a model that ignores the smaller class.",
          },
          {
            type: "code",
            code: `import numpy as np
from sklearn.datasets import load_breast_cancer

cancer = load_breast_cancer()
print("rows:    ", cancer.data.shape[0])
print("features:", cancer.data.shape[1])
print("classes: ", cancer.target_names)
labels, counts = np.unique(cancer.target, return_counts=True)
print("counts:  ", dict(zip(labels, counts)))`,
            language: "python",
            caption: "A binary target with named classes",
            runnable: true,
          },
          {
            type: "callout",
            tone: "note",
            title: "Accuracy is not automatically the goal",
            text: "If one class is rare, predicting the majority everywhere can look accurate while being useless. The cost of false positives and false negatives belongs in the decision.",
          },
        ],
      },
      {
        id: "logistic-regression",
        title: "Fit logistic regression",
        blocks: [
          {
            type: "text",
            text: "LogisticRegression models the log-odds of the positive class with a linear combination of features. Standardize the features inside a pipeline so the coefficients and optimizer behave consistently.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data,
    cancer.target,
    test_size=0.2,
    random_state=42,
    stratify=cancer.target,
)

model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
predictions = model.predict(X_test)

print("first labels:", predictions[:8])
print("test rows:   ", len(predictions))`,
            language: "python",
            caption: "Fit on training rows and predict labels",
            runnable: true,
          },
          {
            type: "text",
            text: "max_iter=1000 gives the solver enough iterations to converge on this scaled dataset. If scikit-learn warns about convergence, increase the limit or check the feature scale rather than ignoring it.",
          },
        ],
      },
      {
        id: "probabilities",
        title: "Look behind the label",
        blocks: [
          {
            type: "text",
            text: "predict_proba returns one probability per class for every row. The columns follow model.classes_ order, so for classes [0, 1] the second column is the probability of class 1.",
          },
          {
            type: "code",
            code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
probabilities = model.predict_proba(X_test)

print("classes:      ", model.named_steps["classify"].classes_)
print("shape:        ", probabilities.shape)
print("row sums:     ", probabilities.sum(axis=1)[:3].round(6))
print("positive probs:", probabilities[:5, 1].round(3))`,
            language: "python",
            caption: "Probabilities are per class and sum to one",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "A probability is not a guarantee",
            text: "Calibration can drift when the training distribution changes. Treat probabilities as model estimates, and validate them on data that resembles deployment.",
          },
        ],
      },
      {
        id: "threshold",
        title: "The threshold is a decision",
        blocks: [
          {
            type: "text",
            text: "predict applies a 0.5 threshold to the positive-class probability. Lowering it catches more positives but also raises false positives. Raising it does the reverse. Choose the threshold from the cost of each mistake, not from habit.",
          },
          {
            type: "code",
            code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
positive_probability = model.predict_proba(X_test)[:, 1]

for threshold in [0.3, 0.5, 0.7]:
    labels = (positive_probability >= threshold).astype(int)
    print(f"threshold={threshold}: positives={labels.sum()}")`,
            language: "python",
            caption: "Changing the cutoff changes the decisions",
            runnable: true,
          },
          {
            type: "text",
            text: "The model's ranking can stay the same while the threshold changes. Metrics that use probabilities, such as ROC-AUC, measure ranking quality; metrics that use labels depend on the threshold.",
          },
        ],
      },
      {
        id: "imbalance",
        title: "Account for imbalance",
        blocks: [
          {
            type: "text",
            text: "When one class is much rarer, the optimizer can favor the majority. class_weight=\"balanced\" gives the classes weights inversely proportional to their frequency. It changes the tradeoff, not the underlying information.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)

for weight in [None, "balanced"]:
    model = Pipeline([
        ("scale", StandardScaler()),
        ("classify", LogisticRegression(max_iter=1000, class_weight=weight)),
    ])
    model.fit(X_train, y_train)
    print(weight, round(model.score(X_test, y_test), 3))`,
            language: "python",
            caption: "Compare class weighting",
            runnable: true,
          },
          {
            type: "callout",
            tone: "tip",
            title: "Resampling is not automatically better",
            text: "Class weights are simple and keep every row. Oversampling, undersampling, and synthetic data change the training distribution and need their own validation.",
          },
        ],
      },
      {
        id: "coefficients",
        title: "Read coefficients as log-odds",
        blocks: [
          {
            type: "text",
            text: "For a scaled feature, a positive coefficient increases the log-odds of the positive class when that feature rises by one standard deviation. Exponentiating the coefficient gives an odds multiplier, not a probability.",
          },
          {
            type: "code",
            code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)

coefs = model.named_steps["classify"].coef_[0]
order = np.argsort(np.abs(coefs))[::-1]
for index in order[:4]:
    odds = np.exp(coefs[index])
    print(f"{cancer.feature_names[index]:>22}: coef={coefs[index]: .2f}, odds={odds:.2f}")`,
            language: "python",
            caption: "Coefficients are additive on the log-odds scale",
            runnable: true,
          },
          {
            type: "text",
            text: "Correlated features still split credit. A large coefficient is not proof that changing that feature causes the outcome.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "cancer-classifier",
        prompt:
          "Fit a StandardScaler plus LogisticRegression(max_iter=1000) pipeline on the breast-cancer training rows. Store labels in predictions, class probabilities in probabilities, and test accuracy in accuracy.",
        starterCode: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)

# Fit, predict, and evaluate.
model = None
predictions = None
probabilities = None
accuracy = None`,
        tests: [
          {
            name: "the classifier predicted labels and probabilities",
            code: 'import numpy as np\nassert predictions.shape == (114,), predictions.shape\nassert probabilities.shape == (114, 2), probabilities.shape\nassert set(np.unique(predictions)).issubset({0, 1})',
          },
          {
            name: "the probabilities are valid",
            code: 'import numpy as np\nassert np.allclose(probabilities.sum(axis=1), 1), probabilities.sum(axis=1)[:3]\nassert ((probabilities >= 0) & (probabilities <= 1)).all()',
          },
          {
            name: "the held-out accuracy is strong",
            code: 'from sklearn.metrics import accuracy_score\nassert 0.9 < accuracy <= 1.0, accuracy\nassert abs(accuracy - accuracy_score(y_test, predictions)) < 1e-12',
          },
        ],
        hints: [
          "Build Pipeline([(\"scale\", StandardScaler()), (\"classify\", LogisticRegression(max_iter=1000))]).",
          "Use model.predict(X_test) for labels and model.predict_proba(X_test) for probabilities.",
        ],
        solution: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)

model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)
accuracy = accuracy_score(y_test, predictions)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "predict-vs-proba",
        question: "What does predict_proba add beyond predict?",
        options: [
          { id: "confidence", label: "A per-class probability for each row" },
          { id: "label", label: "A guaranteed correct label" },
          { id: "split", label: "A new train/test split" },
        ],
        answerId: "confidence",
        explanation:
          "predict_proba exposes the model's estimated class probabilities before a threshold turns them into labels.",
      },
      {
        id: "threshold-cost",
        question: "What should guide the threshold choice?",
        options: [
          { id: "cost", label: "The relative cost of false positives and false negatives" },
          { id: "default", label: "Always 0.5, regardless of context" },
          { id: "accuracy", label: "Only the training accuracy" },
        ],
        answerId: "cost",
        explanation:
          "The threshold encodes a decision policy; different error costs call for different cutoffs.",
      },
      {
        id: "class-weight",
        question: "What does class_weight=\"balanced\" change?",
        options: [
          { id: "weight", label: "The weight each class contributes to the fit" },
          { id: "rows", label: "The number of test rows" },
          { id: "features", label: "The feature names" },
        ],
        answerId: "weight",
        explanation:
          "It adjusts class contributions inversely to frequency so the minority class is not ignored.",
      },
    ],
    next: {
      label: "Choose the right classification metric",
      href: "/learn/sklearn/classification-metrics",
    },
  },
  {
    id: "sklearn-classification-metrics",
    library: "sklearn",
    slug: "classification-metrics",
    title: "Choose the right classification metric",
    summary:
      "Read a confusion matrix, balance precision and recall, and use ranking metrics when the threshold is not fixed.",
    minutes: 14,
    level: "beginner",
    packages: ["scikit-learn", "numpy", "matplotlib"],
    objectives: [
      "Read true positives, false positives, and false negatives.",
      "Compute precision, recall, and F1.",
      "Use ROC-AUC to evaluate ranking.",
      "Relate threshold changes to error types.",
      "Choose a metric from the decision, not from habit.",
    ],
    sections: [
      {
        id: "confusion-matrix",
        title: "Start with the four outcomes",
        blocks: [
          {
            type: "text",
            text: "For binary classification, every prediction falls into one of four cells: true negative, false positive, false negative, or true positive. The confusion matrix keeps those counts separate, which accuracy collapses into one number.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
predictions = model.predict(X_test)

matrix = confusion_matrix(y_test, predictions)
print(matrix)
tn, fp, fn, tp = matrix.ravel()
print("TN, FP, FN, TP:", tn, fp, fn, tp)`,
            language: "python",
            caption: "The four cells behind one accuracy number",
            runnable: true,
          },
          {
            type: "callout",
            tone: "note",
            title: "Rows are actual, columns are predicted",
            text: "With labels [0, 1], the matrix is [[TN, FP], [FN, TP]]. Read the axes before interpreting the numbers.",
          },
        ],
      },
      {
        id: "precision-recall",
        title: "Precision and recall answer different questions",
        blocks: [
          {
            type: "text",
            text: "Precision asks: of the rows predicted positive, how many were positive? Recall asks: of the actual positives, how many did we find? Improving one often costs the other when the threshold moves.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
predictions = model.predict(X_test)

print("precision:", round(precision_score(y_test, predictions), 3))
print("recall:   ", round(recall_score(y_test, predictions), 3))`,
            language: "python",
            caption: "Two views of the positive-class errors",
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "High precision means few false alarms.",
              "High recall means few missed positives.",
              "A spam filter and a cancer screen usually need different balances.",
            ],
          },
        ],
      },
      {
        id: "f1",
        title: "Summarize with F1, carefully",
        blocks: [
          {
            type: "text",
            text: "F1 is the harmonic mean of precision and recall. It drops when either side is poor and is useful when both errors matter similarly. It is not a universal score: it ignores true negatives and assumes precision and recall deserve equal weight.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
predictions = model.predict(X_test)

print(classification_report(
    y_test,
    predictions,
    target_names=cancer.target_names,
    digits=3,
))`,
            language: "python",
            caption: "Per-class precision, recall, and F1",
            runnable: true,
          },
          {
            type: "text",
            text: "classification_report is a useful first look, but still report the confusion matrix when the cost of each error matters. A compact score cannot carry the full decision context.",
          },
        ],
      },
      {
        id: "roc-auc",
        title: "Evaluate ranking with ROC-AUC",
        blocks: [
          {
            type: "text",
            text: "ROC-AUC measures how well the model ranks a random positive above a random negative across all thresholds. It is threshold-independent, so it is useful before committing to a cutoff. It does not tell you the precision at the operating point you will deploy.",
          },
          {
            type: "code",
            code: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
positive_probability = model.predict_proba(X_test)[:, 1]
print("ROC-AUC:", round(roc_auc_score(y_test, positive_probability), 3))`,
            language: "python",
            caption: "Ranking quality across all thresholds",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "AUC can look strong with poor deployment decisions",
            text: "A high AUC does not guarantee useful precision at the threshold you choose. Evaluate the operating point with a confusion matrix or precision-recall curve.",
          },
        ],
      },
      {
        id: "threshold-tradeoff",
        title: "Connect the threshold to the errors",
        blocks: [
          {
            type: "text",
            text: "As the threshold falls, more rows become positive: recall tends to rise and precision tends to fall. Plot the tradeoff on validation data, choose an operating point that matches the cost of errors, then report the chosen threshold.",
          },
          {
            type: "code",
            code: `import matplotlib.pyplot as plt
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)
model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
positive_probability = model.predict_proba(X_test)[:, 1]

thresholds = np.linspace(0.05, 0.95, 19)
precisions = []
recalls = []
for threshold in thresholds:
    labels = (positive_probability >= threshold).astype(int)
    precisions.append(precision_score(y_test, labels, zero_division=0))
    recalls.append(recall_score(y_test, labels, zero_division=0))

fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.plot(thresholds, precisions, marker="o", label="Precision")
ax.plot(thresholds, recalls, marker="s", label="Recall")
ax.set_title("Precision and recall by threshold")
ax.set_xlabel("Threshold")
ax.set_ylabel("Score")
ax.legend()`,
            language: "python",
            caption: "The threshold is an explicit operating decision",
            runnable: true,
          },
          {
            type: "text",
            text: "Choose the threshold on validation folds or a dedicated validation split. If you tune it on the test set, the final reported metric is no longer an honest estimate.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "classification-metrics",
        prompt:
          "Fit the scaled logistic regression pipeline on the training rows. Store the confusion matrix in matrix, unpack tn, fp, fn, tp, and compute precision, recall, F1, and ROC-AUC from the positive-class probabilities.",
        starterCode: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (confusion_matrix, f1_score, precision_score,
                             recall_score, roc_auc_score)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)

# Fit and measure.
model = None
predictions = None
probabilities = None
matrix = None
tn = fp = fn = tp = None
precision = None
recall = None
f1 = None
roc_auc = None`,
        tests: [
          {
            name: "the confusion matrix accounts for every test row",
            code: 'import numpy as np\nassert matrix.shape == (2, 2), matrix.shape\nassert matrix.sum() == len(y_test)\nassert tn + fp + fn + tp == len(y_test)\nassert np.isclose(tn, matrix[0, 0]) and np.isclose(tp, matrix[1, 1])',
          },
          {
            name: "precision, recall, and F1 match the matrix",
            code: 'import numpy as np\nassert np.isclose(precision, tp / (tp + fp))\nassert np.isclose(recall, tp / (tp + fn))\nassert np.isclose(f1, 2 * precision * recall / (precision + recall))',
          },
          {
            name: "the ranking metric uses positive probabilities",
            code: 'from sklearn.metrics import roc_auc_score\nassert 0.9 < roc_auc <= 1.0, roc_auc\nassert abs(roc_auc - roc_auc_score(y_test, probabilities[:, 1])) < 1e-12',
          },
        ],
        hints: [
          "Use confusion_matrix(y_test, predictions).ravel() to unpack tn, fp, fn, tp.",
          "Pass probabilities[:, 1], the positive-class column, to roc_auc_score.",
        ],
        solution: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (confusion_matrix, f1_score, precision_score,
                             recall_score, roc_auc_score)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target
)

model = Pipeline([
    ("scale", StandardScaler()),
    ("classify", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)
matrix = confusion_matrix(y_test, predictions)
tn, fp, fn, tp = matrix.ravel()
precision = precision_score(y_test, predictions)
recall = recall_score(y_test, predictions)
f1 = f1_score(y_test, predictions)
roc_auc = roc_auc_score(y_test, probabilities[:, 1])`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "precision-question",
        question: "What question does precision answer?",
        options: [
          { id: "predicted", label: "Of the predicted positives, how many were actually positive?" },
          { id: "actual", label: "Of the actual positives, how many were found?" },
          { id: "negatives", label: "How many true negatives were there?" },
        ],
        answerId: "predicted",
        explanation:
          "Precision is TP / (TP + FP): it measures the purity of the positive predictions.",
      },
      {
        id: "recall-question",
        question: "What question does recall answer?",
        options: [
          { id: "actual", label: "Of the actual positives, how many were found?" },
          { id: "predicted", label: "Of the predicted positives, how many were correct?" },
          { id: "auc", label: "What is the area under the ROC curve?" },
        ],
        answerId: "actual",
        explanation:
          "Recall is TP / (TP + FN): it measures coverage of the positive class.",
      },
      {
        id: "auc-threshold",
        question: "Why is ROC-AUC called threshold-independent?",
        options: [
          { id: "ranking", label: "It evaluates ranking across all thresholds" },
          { id: "labels", label: "It ignores the true labels" },
          { id: "accuracy", label: "It always equals accuracy" },
        ],
        answerId: "ranking",
        explanation:
          "ROC-AUC summarizes how well positive rows are ranked above negative rows across every cutoff.",
      },
    ],
  },
];
