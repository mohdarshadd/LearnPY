import { libraries } from "./libraries";
import { allLessons } from "./lessons";
import { allReferences } from "./references";
import {
  isLibraryId,
  lessonSchema,
  referenceSchema,
  type Lesson,
  type LessonTrack,
  type LibraryId,
  type Reference,
} from "./schema";

function describeIssues(error: {
  issues: Array<{ path: PropertyKey[]; message: string }>;
}) {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

function parseLessons(items: unknown[]): Lesson[] {
  const lessons = items.map((item, index) => {
    const result = lessonSchema.safeParse(item);

    if (!result.success) {
      throw new Error(
        `Invalid lesson at index ${index}: ${describeIssues(result.error)}`,
      );
    }

    return result.data;
  });

  const ids = new Set<string>();
  const routes = new Set<string>();

  for (const lesson of lessons) {
    if (ids.has(lesson.id)) {
      throw new Error(`Duplicate lesson id "${lesson.id}".`);
    }

    const route = `${lesson.library}/${lesson.slug}`;

    if (routes.has(route)) {
      throw new Error(`Duplicate lesson route "${route}".`);
    }

    const sectionIds = new Set<string>();

    for (const section of lesson.sections) {
      if (sectionIds.has(section.id)) {
        throw new Error(
          `Duplicate section id "${section.id}" in lesson "${lesson.id}".`,
        );
      }

      sectionIds.add(section.id);
    }

    const exerciseIds = new Set<string>();

    for (const exercise of lesson.exercises) {
      if (exerciseIds.has(exercise.id)) {
        throw new Error(
          `Duplicate exercise id "${exercise.id}" in lesson "${lesson.id}".`,
        );
      }

      exerciseIds.add(exercise.id);
    }

    for (const section of lesson.sections) {
      for (const block of section.blocks) {
        if (block.type !== "lab" && block.type !== "predict") {
          continue;
        }

        if (exerciseIds.has(block.id)) {
          throw new Error(
            `Duplicate practice id "${block.id}" in lesson "${lesson.id}".`,
          );
        }

        exerciseIds.add(block.id);
      }
    }

    ids.add(lesson.id);
    routes.add(route);
  }

  return lessons;
}

function parseReferences(items: unknown[]): Reference[] {
  const references = items.map((item, index) => {
    const result = referenceSchema.safeParse(item);

    if (!result.success) {
      throw new Error(
        `Invalid reference at index ${index}: ${describeIssues(result.error)}`,
      );
    }

    return result.data;
  });

  const ids = new Set<string>();
  const routes = new Set<string>();

  for (const reference of references) {
    if (ids.has(reference.id)) {
      throw new Error(`Duplicate reference id "${reference.id}".`);
    }

    const route = `${reference.library}/${reference.slug}`;

    if (routes.has(route)) {
      throw new Error(`Duplicate reference route "${route}".`);
    }

    ids.add(reference.id);
    routes.add(route);
  }

  for (const reference of references) {
    for (const relatedId of reference.related) {
      if (!ids.has(relatedId)) {
        throw new Error(
          `Reference "${reference.id}" points to missing related id "${relatedId}".`,
        );
      }
    }
  }

  return references;
}

export const lessons: Lesson[] = parseLessons(allLessons);
export const references: Reference[] = parseReferences(allReferences);

export function getLessons(track?: LessonTrack): Lesson[] {
  return track ? lessons.filter((lesson) => lesson.library === track) : lessons;
}

export function getLibraryLessons(library: LibraryId): Lesson[] {
  return lessons.filter((lesson) => lesson.library === library);
}

export function getLesson(track: string, slug: string): Lesson | undefined {
  return lessons.find(
    (lesson) => lesson.library === track && lesson.slug === slug,
  );
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function getLessonHref(lesson: Lesson): string {
  return isLibraryId(lesson.library)
    ? `/learn/${lesson.library}/${lesson.slug}`
    : "/learn/start-here";
}

export function getStartHereLesson(): Lesson | undefined {
  return getLessonById("start-here");
}

export function getLessonNavigation(lesson: Lesson): {
  previous?: Lesson;
  next?: Lesson;
} {
  const siblings = isLibraryId(lesson.library)
    ? getLibraryLessons(lesson.library)
    : getLessons(lesson.library);

  const index = siblings.findIndex((candidate) => candidate.id === lesson.id);

  if (index === -1) {
    return {};
  }

  return {
    previous: index > 0 ? siblings[index - 1] : undefined,
    next: index < siblings.length - 1 ? siblings[index + 1] : undefined,
  };
}

export function getReferences(library?: LibraryId): Reference[] {
  return library
    ? references.filter((reference) => reference.library === library)
    : references;
}

export function getReference(
  library: string,
  slug: string,
): Reference | undefined {
  return references.find(
    (reference) =>
      reference.library === library && reference.slug === slug,
  );
}

export function getReferenceById(id: string): Reference | undefined {
  return references.find((reference) => reference.id === id);
}

export function getLibraryCounts(): Array<{
  library: LibraryId;
  count: number;
}> {
  return libraries.map((library) => ({
    library: library.id,
    count: getLibraryLessons(library.id).length,
  }));
}
