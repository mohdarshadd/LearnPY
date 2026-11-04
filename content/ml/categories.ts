import type { MlCategory } from "./schema";

export type MlCategoryMeta = {
  id: MlCategory;
  label: string;
  description: string;
};

export const mlCategories: MlCategoryMeta[] = [
  {
    id: "foundations",
    label: "Foundations",
    description:
      "Splitting, validation, and the small helpers every workflow touches.",
  },
  {
    id: "preprocessing",
    label: "Preprocessing",
    description:
      "Scaling, encoding, imputing, and turning raw columns into model input.",
  },
  {
    id: "feature-selection",
    label: "Feature selection",
    description:
      "Keep the signal and drop the noise before a model learns from it.",
  },
  {
    id: "linear-models",
    label: "Linear models",
    description:
      "Regression and classification where predictions are linear in the inputs.",
  },
  {
    id: "tree-models",
    label: "Tree models",
    description: "Single decision trees for rules, splits, and feature insight.",
  },
  {
    id: "ensembles",
    label: "Ensembles",
    description:
      "Random forests, gradient boosting, and voting across many estimators.",
  },
  {
    id: "neighbors-and-svm",
    label: "Neighbors and SVMs",
    description:
      "Instance-based learning and margin-based classifiers for small datasets.",
  },
  {
    id: "naive-bayes",
    label: "Naive Bayes",
    description: "Fast probabilistic baselines for text and tabular counts.",
  },
  {
    id: "clustering",
    label: "Clustering",
    description: "Group unlabeled rows, find density, and score the result.",
  },
  {
    id: "decomposition",
    label: "Decomposition",
    description:
      "Compress features, denoise, and inspect structure with matrix methods.",
  },
  {
    id: "neural-networks",
    label: "Neural networks",
    description:
      "Small multilayer perceptrons and the knobs that keep them stable.",
  },
  {
    id: "model-selection",
    label: "Model selection",
    description:
      "Search parameters and compare candidates without leaking test data.",
  },
  {
    id: "metrics",
    label: "Metrics",
    description:
      "Score regression, classification, ranking, and clustering honestly.",
  },
  {
    id: "calibration",
    label: "Calibration",
    description:
      "Turn scores into probabilities and choose a decision threshold.",
  },
  {
    id: "outliers-and-time-series",
    label: "Outliers and time series",
    description:
      "Detect unusual rows and validate models without looking into the future.",
  },
  {
    id: "pipelines-and-persistence",
    label: "Pipelines and persistence",
    description:
      "Bundle preprocessing with a model and save the fitted result safely.",
  },
];
