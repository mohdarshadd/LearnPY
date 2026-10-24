import type { Lesson } from "@/content/schema";
import { matplotlibLessons } from "./matplotlib";
import { numpyLessons } from "./numpy";
import { pandasLessons } from "./pandas";
import { sklearnLessons } from "./sklearn";

export const allLessons: Lesson[] = [
  ...numpyLessons,
  ...pandasLessons,
  ...matplotlibLessons,
  ...sklearnLessons,
];
