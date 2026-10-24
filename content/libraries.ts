import type { LessonTrack, LibraryId } from "@/content/schema";

export type Library = {
  id: LibraryId;
  name: string;
  shortName: string;
  kicker: string;
  tagline: string;
  description: string;
  topics: string[];
};

export const libraries: Library[] = [
  {
    id: "numpy",
    name: "NumPy",
    shortName: "np",
    kicker: "01",
    tagline: "Fast arrays and the math that runs underneath everything.",
    description:
      "Learn to build, reshape, and slice arrays, then use broadcasting and vectorized operations to replace slow Python loops with clear, fast code.",
    topics: ["Arrays", "Broadcasting", "Indexing", "Random", "Linear algebra"],
  },
  {
    id: "pandas",
    name: "pandas",
    shortName: "pd",
    kicker: "02",
    tagline: "Messy tables in. Clear answers out.",
    description:
      "Load real data into DataFrames, select and reshape it, clean missing values, group rows, and join datasets without losing track of what changed.",
    topics: ["DataFrames", "Selection", "Grouping", "Joins", "Cleaning"],
  },
  {
    id: "matplotlib",
    name: "Matplotlib",
    shortName: "plt",
    kicker: "03",
    tagline: "Turn numbers into charts people can read.",
    description:
      "Build plots from the ground up, control axes and labels, compose multi-panel figures, and make styling choices that clarify the data instead of decorating it.",
    topics: ["Figures", "Axes", "Layouts", "Styling", "Subplots"],
  },
  {
    id: "sklearn",
    name: "scikit-learn",
    shortName: "sk",
    kicker: "04",
    tagline: "From a clean table to a model you can trust.",
    description:
      "Follow the same fit, predict, and evaluate loop used across scikit-learn. Cover preprocessing, regression, classification, clustering, and model selection.",
    topics: ["Estimators", "Preprocessing", "Regression", "Classification", "Metrics"],
  },
];

export const libraryStyles: Record<
  LibraryId,
  {
    text: string;
    bar: string;
    soft: string;
    border: string;
    hover: string;
  }
> = {
  numpy: {
    text: "text-numpy",
    bar: "bg-numpy",
    soft: "bg-numpy/10",
    border: "border-numpy/25",
    hover: "group-hover:border-numpy/40",
  },
  pandas: {
    text: "text-pandas",
    bar: "bg-pandas",
    soft: "bg-pandas/10",
    border: "border-pandas/25",
    hover: "group-hover:border-pandas/40",
  },
  matplotlib: {
    text: "text-matplotlib",
    bar: "bg-matplotlib",
    soft: "bg-matplotlib/10",
    border: "border-matplotlib/25",
    hover: "group-hover:border-matplotlib/40",
  },
  sklearn: {
    text: "text-sklearn",
    bar: "bg-sklearn",
    soft: "bg-sklearn/10",
    border: "border-sklearn/25",
    hover: "group-hover:border-sklearn/40",
  },
};

export const startHereStyle = {
  text: "text-ink",
  bar: "bg-ink",
  soft: "bg-ink/5",
  border: "border-ink/15",
  hover: "group-hover:border-ink/30",
} as const;

export function getTrackStyle(track: LessonTrack) {
  return track === "start-here" ? startHereStyle : libraryStyles[track];
}

export function getLibrary(id: string): Library | undefined {
  return libraries.find((library) => library.id === id);
}
