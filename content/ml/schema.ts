import { z } from "zod";

export const mlCategorySchema = z.enum([
  "foundations",
  "preprocessing",
  "feature-selection",
  "linear-models",
  "tree-models",
  "ensembles",
  "neighbors-and-svm",
  "naive-bayes",
  "clustering",
  "decomposition",
  "neural-networks",
  "model-selection",
  "metrics",
  "calibration",
  "outliers-and-time-series",
  "pipelines-and-persistence",
]);

export const mlLibrarySchema = z.enum([
  "scikit-learn",
  "numpy",
  "pandas",
  "matplotlib",
]);

export const mlApiSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: mlCategorySchema,
  library: mlLibrarySchema,
  kind: z.enum(["estimator", "function", "utility"]),
  signature: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  referenceId: z.string().min(1).optional(),
});

export type MlApi = z.infer<typeof mlApiSchema>;
export type MlCategory = z.infer<typeof mlCategorySchema>;
export type MlLibrary = z.infer<typeof mlLibrarySchema>;
