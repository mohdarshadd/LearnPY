import { z } from "zod";
import { challengeSchema, type Challenge } from "./schema";
import { practiceChallenges } from "./challenges";

export const challenges: Challenge[] = (() => {
  const parsed = z.array(challengeSchema).parse(practiceChallenges);
  const ids = new Set<string>();

  for (const challenge of parsed) {
    if (ids.has(challenge.id)) {
      throw new Error(`Duplicate practice challenge id "${challenge.id}".`);
    }

    ids.add(challenge.id);
  }

  return parsed;
})();

export const challengeTopics = [
  ...new Set(challenges.flatMap((challenge) => challenge.topics)),
].sort();

export const challengeDifficulties = ["beginner", "intermediate", "advanced"] as const;
