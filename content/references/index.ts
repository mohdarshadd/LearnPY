import type { Reference } from "@/content/schema";
import { matplotlibReferences } from "./matplotlib";
import { numpyReferences } from "./numpy";
import { pandasReferences } from "./pandas";
import { sklearnReferences } from "./sklearn";

export const allReferences: Reference[] = [
  ...numpyReferences,
  ...pandasReferences,
  ...matplotlibReferences,
  ...sklearnReferences,
];
