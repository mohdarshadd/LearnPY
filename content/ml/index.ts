import { z } from "zod";
import { mlCategories } from "./categories";
import { advancedApis } from "./entries/advanced";
import { evaluationApis } from "./entries/evaluation";
import { linearApis } from "./entries/linear";
import { treeApis } from "./entries/trees";
import { unsupervisedApis } from "./entries/unsupervised";
import { workflowApis } from "./entries/workflow";
import { mlApiSchema, type MlApi, type MlCategory } from "./schema";

const catalog = z.array(mlApiSchema).parse([
  ...workflowApis,
  ...linearApis,
  ...evaluationApis,
  ...treeApis,
  ...unsupervisedApis,
  ...advancedApis,
]);

const ids = new Set(catalog.map((api) => api.id));

if (ids.size !== catalog.length) {
  throw new Error("ML API catalog contains duplicate ids.");
}

const categoryIds = new Set(mlCategories.map((category) => category.id));

for (const api of catalog) {
  if (!categoryIds.has(api.category)) {
    throw new Error(`Unknown ML category "${api.category}" on ${api.id}.`);
  }
}

export const mlApis: MlApi[] = catalog;

export function apisForCategory(category: MlCategory): MlApi[] {
  return mlApis.filter((api) => api.category === category);
}

export const mlLibraryLabels: Record<MlApi["library"], string> = {
  "scikit-learn": "scikit-learn",
  numpy: "NumPy",
  pandas: "pandas",
  matplotlib: "Matplotlib",
  joblib: "joblib",
};

export { mlCategories };
export type { MlApi, MlCategory };
