import type { Challenge } from "@/content/practice/schema";

const STORAGE_KEY = "learnpy-practice-handoff-v1";

export type PracticeHandoff = {
  challengeId: string;
  title: string;
  code: string;
  packages: string[];
};

export function savePracticeHandoff(challenge: Challenge) {
  const payload: PracticeHandoff = {
    challengeId: challenge.id,
    title: challenge.title,
    code: challenge.starterCode,
    packages: challenge.packages,
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    return false;
  }

  return true;
}

export function takePracticeHandoff(): PracticeHandoff | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("challengeId" in parsed) ||
      !("title" in parsed) ||
      !("code" in parsed) ||
      !("packages" in parsed) ||
      typeof parsed.challengeId !== "string" ||
      typeof parsed.title !== "string" ||
      typeof parsed.code !== "string" ||
      !Array.isArray(parsed.packages)
    ) {
      return null;
    }

    return {
      challengeId: parsed.challengeId,
      title: parsed.title,
      code: parsed.code,
      packages: parsed.packages.filter(
        (value): value is string => typeof value === "string",
      ),
    };
  } catch {
    return null;
  }
}
