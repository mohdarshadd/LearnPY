import { z } from "zod";

export const libraryIds = [
  "numpy",
  "pandas",
  "matplotlib",
  "sklearn",
] as const;

export const libraryIdSchema = z.enum(libraryIds);

export type LibraryId = z.infer<typeof libraryIdSchema>;

export const lessonTrackIds = ["start-here", ...libraryIds] as const;

export const lessonTrackSchema = z.enum(lessonTrackIds);

export type LessonTrack = z.infer<typeof lessonTrackSchema>;

export function isLibraryId(value: string): value is LibraryId {
  return (libraryIds as readonly string[]).includes(value);
}

const tableSchema = z
  .object({
    type: z.literal("table"),
    caption: z.string().optional(),
    headers: z.array(z.string().min(1)).min(1),
    rows: z.array(z.array(z.string())),
  })
  .superRefine((table, ctx) => {
    table.rows.forEach((row, index) => {
      if (row.length !== table.headers.length) {
        ctx.addIssue({
          code: "custom",
          message: `Row ${index + 1} has ${row.length} cells; expected ${table.headers.length}.`,
        });
      }
    });
  });

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("code"),
    code: z.string().min(1),
    language: z.string().min(1).default("python"),
    caption: z.string().optional(),
    output: z.string().optional(),
    runnable: z.boolean().default(false),
  }),
  z.object({
    type: z.literal("callout"),
    tone: z.enum(["note", "tip", "warning"]).default("note"),
    title: z.string().optional(),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("list"),
    ordered: z.boolean().default(false),
    items: z.array(z.string().min(1)).min(1),
  }),
  tableSchema,
]);

export type ContentBlock = z.infer<typeof contentBlockSchema>;

export const lessonSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  blocks: z.array(contentBlockSchema).min(1),
});

export type LessonSection = z.infer<typeof lessonSectionSchema>;

export const exerciseSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  starterCode: z.string().min(1),
  tests: z
    .array(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
      }),
    )
    .min(1),
  hints: z.array(z.string()).default([]),
  solution: z.string().min(1),
  packages: z.array(z.string()).default([]),
});

export type Exercise = z.infer<typeof exerciseSchema>;

export const quizQuestionSchema = z
  .object({
    id: z.string().min(1),
    question: z.string().min(1),
    options: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
        }),
      )
      .min(2),
    answerId: z.string().min(1),
    explanation: z.string().min(1),
  })
  .superRefine((question, ctx) => {
    if (!question.options.some((option) => option.id === question.answerId)) {
      ctx.addIssue({
        code: "custom",
        message: `answerId "${question.answerId}" does not match any option.`,
      });
    }
  });

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const lessonSchema = z.object({
  id: z.string().min(1),
  library: lessonTrackSchema,
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  minutes: z.number().int().positive(),
  level: z.enum(["beginner", "intermediate"]).default("beginner"),
  packages: z.array(z.string()).default([]),
  objectives: z.array(z.string().min(1)).min(1),
  sections: z.array(lessonSectionSchema).min(1),
  exercises: z.array(exerciseSchema).default([]),
  quiz: z.array(quizQuestionSchema).default([]),
  next: z
    .object({
      label: z.string().min(1),
      href: z.string().startsWith("/"),
    })
    .optional(),
});

export type Lesson = z.infer<typeof lessonSchema>;

export const referenceParameterSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1),
  optional: z.boolean().default(false),
});

export const referenceSchema = z.object({
  id: z.string().min(1),
  library: libraryIdSchema,
  slug: z.string().min(1),
  symbol: z.string().min(1),
  signature: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  parameters: z.array(referenceParameterSchema).default([]),
  returns: z.string().optional(),
  example: z
    .object({
      code: z.string().min(1),
      output: z.string().optional(),
    })
    .optional(),
  pitfalls: z.array(z.string().min(1)).default([]),
  related: z.array(z.string()).default([]),
});

export type Reference = z.infer<typeof referenceSchema>;
