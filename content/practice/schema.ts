import { z } from "zod";
import { exerciseSchema } from "../schema";

export const challengeSchema = exerciseSchema.extend({
  title: z.string().min(1),
  summary: z.string().min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  topics: z.array(z.string().min(1)).min(1),
  lessonHref: z.string().startsWith("/learn/"),
});

export type Challenge = z.infer<typeof challengeSchema>;
