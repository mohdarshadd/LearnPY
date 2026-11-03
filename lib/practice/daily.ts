import type { Challenge } from "@/content/practice/schema";

export function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dailyIndex(dateKey: string, count: number) {
  if (count <= 0) {
    return -1;
  }

  let hash = 2166136261;

  for (let index = 0; index < dateKey.length; index += 1) {
    hash ^= dateKey.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash) % count;
}

export function getDailyChallenge(
  challenges: Challenge[],
  date = new Date(),
): Challenge | null {
  const index = dailyIndex(localDateKey(date), challenges.length);
  return index === -1 ? null : challenges[index];
}
