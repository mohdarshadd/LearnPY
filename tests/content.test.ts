import { describe, expect, it } from "vitest";
import { libraries } from "../content/libraries";
import { mlApis, mlCategories } from "../content/ml";
import { challenges } from "../content/practice";
import {
  getLibraryCounts,
  getLibraryLessons,
  getLesson,
  getLessonHref,
  getReference,
  getStartHereLesson,
  lessons,
  references,
} from "../content/registry";

describe("lesson registry", () => {
  it("ships the full curriculum with unique routes", () => {
    expect(lessons).toHaveLength(25);
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(
      lessons.length,
    );
    expect(
      new Set(lessons.map((lesson) => `${lesson.library}/${lesson.slug}`)).size,
    ).toBe(lessons.length);
  });

  it("covers every learning track", () => {
    expect(getLibraryCounts()).toEqual([
      { library: "numpy", count: 3 },
      { library: "pandas", count: 7 },
      { library: "matplotlib", count: 5 },
      { library: "sklearn", count: 9 },
    ]);

    for (const library of libraries) {
      expect(getLibraryLessons(library.id).length).toBeGreaterThan(0);
    }
  });

  it("keeps the start-here orientation out of library routes", () => {
    const startHere = getStartHereLesson();

    expect(startHere).toBeDefined();
    expect(getLessonHref(startHere!)).toBe("/learn/start-here");

    const numpyLesson = getLesson("numpy", "arrays");

    expect(numpyLesson).toBeDefined();
    expect(getLessonHref(numpyLesson!)).toBe("/learn/numpy/arrays");
  });

  it("gives every lesson sections, a summary, and exercises", () => {
    for (const lesson of lessons) {
      expect(lesson.summary.length).toBeGreaterThan(0);
      expect(lesson.sections.length).toBeGreaterThan(0);
      expect(lesson.exercises.length).toBeGreaterThan(0);
      expect(lesson.minutes).toBeGreaterThan(0);
    }
  });
});

describe("practice registry", () => {
  it("ships a varied starter deck", () => {
    expect(challenges).toHaveLength(24);
    expect(new Set(challenges.map((challenge) => challenge.id)).size).toBe(
      challenges.length,
    );
    expect(new Set(challenges.map((challenge) => challenge.difficulty))).toEqual(
      new Set(["beginner", "intermediate", "advanced"]),
    );

    for (const challenge of challenges) {
      expect(challenge.tests.length).toBeGreaterThan(0);
      expect(challenge.lessonHref.startsWith("/learn/")).toBe(true);
    }
  });
});

describe("reference registry", () => {
  it("covers all four libraries with unique routes", () => {
    expect(references).toHaveLength(40);
    expect(new Set(references.map((entry) => entry.id)).size).toBe(
      references.length,
    );
    expect(
      new Set(
        references.map((entry) => `${entry.library}/${entry.slug}`),
      ).size,
    ).toBe(references.length);
  });

  it("resolves every reference by library and slug", () => {
    for (const entry of references) {
      expect(getReference(entry.library, entry.slug)).toBe(entry);
    }
  });
});

describe("ML API catalog", () => {
  it("covers every category with a broad, uniquely keyed atlas", () => {
    expect(mlApis.length).toBeGreaterThanOrEqual(180);
    expect(new Set(mlApis.map((api) => api.id)).size).toBe(mlApis.length);
    expect(new Set(mlApis.map((api) => api.category))).toEqual(
      new Set(mlCategories.map((category) => category.id)),
    );

    for (const api of mlApis) {
      expect(api.signature.length).toBeGreaterThan(0);
      expect(api.summary.length).toBeGreaterThan(0);
    }
  });
});
