import { describe, expect, it } from "vitest";
import { libraries } from "../content/libraries";
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

describe("reference registry", () => {
  it("covers all four libraries with unique routes", () => {
    expect(references).toHaveLength(26);
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
