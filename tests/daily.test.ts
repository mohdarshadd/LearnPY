import { describe, expect, it } from "vitest";
import { challenges } from "../content/practice";
import {
  dailyIndex,
  getDailyChallenge,
  localDateKey,
} from "../lib/practice/daily";

describe("daily practice drill", () => {
  it("is stable for a calendar day", () => {
    const date = new Date(2026, 10, 3, 9, 0, 0);

    expect(localDateKey(date)).toBe("2026-11-03");
    expect(getDailyChallenge(challenges, date)?.id).toBe(
      getDailyChallenge(challenges, date)?.id,
    );
  });

  it("stays inside the deck", () => {
    for (let day = 1; day <= 28; day += 1) {
      const date = new Date(2026, 10, day);
      const challenge = getDailyChallenge(challenges, date);

      expect(challenge).not.toBeNull();
      expect(challenges).toContain(challenge);
    }
  });

  it("handles an empty deck", () => {
    expect(dailyIndex("2026-11-03", 0)).toBe(-1);
    expect(getDailyChallenge([])).toBeNull();
  });
});
