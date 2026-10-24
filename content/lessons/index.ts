import type { Lesson } from "@/content/schema";
import { matplotlibLessons } from "./matplotlib";
import { numpyLessons } from "./numpy";
import { pandasLessons } from "./pandas";
import { sklearnLessons } from "./sklearn";
import { startHereLessons } from "./start-here";

export const allLessons: Lesson[] = [
  ...startHereLessons,
  ...numpyLessons,
  ...pandasLessons,
  ...matplotlibLessons,
  ...sklearnLessons,
];
