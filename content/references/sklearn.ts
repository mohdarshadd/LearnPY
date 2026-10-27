import type { Reference } from "@/content/schema";

export const sklearnReferences: Reference[] = [
  {
    id: "sklearn-train-test-split",
    library: "sklearn",
    slug: "train-test-split",
    symbol: "train_test_split",
    signature: "train_test_split(*arrays, test_size=None, random_state=None, stratify=None)",
    summary: "Split arrays into training and test subsets.",
    description:
      "train_test_split shuffles rows and returns two subsets for each input array. A fixed random_state makes the split reproducible. Pass stratify to preserve class proportions in classification problems.",
    parameters: [
      {
        name: "arrays",
        type: "sequence of arrays",
        description: "Features and targets to split together.",
      },
      {
        name: "test_size",
        type: "float or int, optional",
        description: "Fraction or count reserved for testing.",
        optional: true,
      },
      {
        name: "random_state",
        type: "int, optional",
        description: "Seed for a reproducible shuffle.",
        optional: true,
      },
      {
        name: "stratify",
        type: "array_like, optional",
        description: "Labels whose proportions should be preserved.",
        optional: true,
      },
    ],
    returns: "list of arrays",
    example: {
      code: `from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)`,
    },
    pitfalls: [
      "Split before fitting any preprocessing so the test set stays unseen.",
      "Pass the same random_state when you need to compare models on identical rows.",
    ],
    related: ["sklearn-standard-scaler", "sklearn-linear-regression"],
  },
  {
    id: "sklearn-standard-scaler",
    library: "sklearn",
    slug: "standard-scaler",
    symbol: "StandardScaler",
    signature: "StandardScaler(*, with_mean=True, with_std=True)",
    summary: "Center features and scale them to unit variance.",
    description:
      "StandardScaler learns the mean and standard deviation of each feature during fit, then transforms values to z-scores. Fit it on training data and reuse the same scaler on test or new data.",
    parameters: [
      {
        name: "with_mean",
        type: "bool, optional",
        description: "Whether to center features by subtracting the mean.",
        optional: true,
      },
      {
        name: "with_std",
        type: "bool, optional",
        description: "Whether to divide by the standard deviation.",
        optional: true,
      },
    ],
    returns: "StandardScaler",
    example: {
      code: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)`,
    },
    pitfalls: [
      "Calling fit_transform on the test set leaks information; use transform there.",
      "Scaling sparse data with centering enabled can require dense memory; set with_mean=False when needed.",
    ],
    related: ["sklearn-train-test-split", "sklearn-pipeline"],
  },
  {
    id: "sklearn-linear-regression",
    library: "sklearn",
    slug: "linear-regression",
    symbol: "LinearRegression",
    signature: "LinearRegression(*, fit_intercept=True)",
    summary: "Fit an ordinary least-squares regression model.",
    description:
      "LinearRegression finds coefficients that minimize squared error between predictions and targets. Call fit on training data, then predict on new rows. The learned coefficients are available after fitting.",
    parameters: [
      {
        name: "fit_intercept",
        type: "bool, optional",
        description: "Whether to estimate an intercept term.",
        optional: true,
      },
    ],
    returns: "LinearRegression",
    example: {
      code: `from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
print(model.coef_)`,
    },
    pitfalls: [
      "Scaling features can make coefficients easier to compare but changes their units.",
      "A high training score does not prove the model generalizes; evaluate on held-out data.",
    ],
    related: ["sklearn-standard-scaler", "sklearn-train-test-split"],
  },
  {
    id: "sklearn-accuracy-score",
    library: "sklearn",
    slug: "accuracy-score",
    symbol: "accuracy_score",
    signature: "accuracy_score(y_true, y_pred, normalize=True)",
    summary: "Measure the fraction of correctly classified rows.",
    description:
      "accuracy_score compares predicted labels with true labels. It is easy to interpret but can hide poor performance on imbalanced classes, where a majority-class baseline may already score highly.",
    parameters: [
      {
        name: "y_true",
        type: "array_like",
        description: "Ground-truth labels.",
      },
      {
        name: "y_pred",
        type: "array_like",
        description: "Predicted labels in the same order.",
      },
      {
        name: "normalize",
        type: "bool, optional",
        description: "Return a fraction when True, a count when False.",
        optional: true,
      },
    ],
    returns: "float",
    example: {
      code: `from sklearn.metrics import accuracy_score

score = accuracy_score(y_test, predictions)
print(f"accuracy: {score:.3f}")`,
    },
    pitfalls: [
      "Accuracy alone is misleading for rare classes; also inspect precision, recall, and a confusion matrix.",
      "y_true and y_pred must be aligned row by row.",
    ],
    related: ["sklearn-linear-regression", "sklearn-train-test-split"],
  },
  {
    id: "sklearn-pipeline",
    library: "sklearn",
    slug: "pipeline",
    symbol: "Pipeline",
    signature: "Pipeline(steps)",
    summary: "Chain preprocessing and a model into one estimator.",
    description:
      "A Pipeline applies each step in order, ending with a final estimator. Fitting the pipeline fits every transformer and the model on the same training rows, which keeps preprocessing inside cross-validation and prevents leakage.",
    parameters: [
      {
        name: "steps",
        type: "list of (name, estimator) tuples",
        description: "Ordered transforms followed by a final estimator.",
      },
    ],
    returns: "Pipeline",
    example: {
      code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression

model = Pipeline([
    ("scale", StandardScaler()),
    ("regress", LinearRegression()),
])
model.fit(X_train, y_train)`,
    },
    pitfalls: [
      "Intermediate steps must implement fit and transform; only the final step needs predict.",
      "Step names must be unique and cannot contain a double underscore.",
    ],
    related: ["sklearn-standard-scaler", "sklearn-linear-regression"],
  },
];
