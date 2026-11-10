import {
  completedOn,
  dailyCompletion,
  streakFor,
  type Habit,
  type HabitLog,
} from "@/lib/habits";

describe("completedOn", () => {
  it("returns true when a habit was completed on the selected date", () => {
    const log: HabitLog = {
      meditation: ["2026-11-09"],
    };

    expect(completedOn(log, "meditation", "2026-11-09")).toBe(true);
  });

  it("returns false when a habit was not completed on the selected date", () => {
    const log: HabitLog = {
      meditation: ["2026-11-08"],
    };

    expect(completedOn(log, "meditation", "2026-11-09")).toBe(false);
  });
});

describe("streakFor", () => {
  const date = new Date(2026, 10, 9);

  it("counts consecutive completed days including today", () => {
    const log: HabitLog = {
      meditation: ["2026-11-09", "2026-11-08", "2026-11-07"],
    };

    expect(streakFor(log, "meditation", date)).toBe(3);
  });

  it("keeps the streak alive when today is incomplete but yesterday was completed", () => {
    const log: HabitLog = {
      meditation: ["2026-11-08", "2026-11-07"],
    };

    expect(streakFor(log, "meditation", date)).toBe(2);
  });

  it("returns zero when yesterday was not completed", () => {
    const log: HabitLog = {
      meditation: ["2026-11-06", "2026-11-05"],
    };

    expect(streakFor(log, "meditation", date)).toBe(0);
  });

  it("returns zero when the habit has no completion history", () => {
    expect(streakFor({}, "meditation", date)).toBe(0);
  });
});

describe("dailyCompletion", () => {
  const habits: Habit[] = [
    { id: "meditation", name: "Morning meditation" },
    { id: "reading", name: "Reading 10 pages" },
    { id: "journaling", name: "Journaling" },
  ];

  it("calculates completed habits and the completion percentage", () => {
    const log: HabitLog = {
      meditation: ["2026-11-09"],
      reading: ["2026-11-09"],
    };

    expect(dailyCompletion(habits, log, "2026-11-09")).toEqual({
      done: 2,
      total: 3,
      percent: 67,
    });
  });

  it("returns zero completion when no habits are completed", () => {
    expect(dailyCompletion(habits, {}, "2026-11-09")).toEqual({
      done: 0,
      total: 3,
      percent: 0,
    });
  });

  it("returns 100 percent when all habits are completed", () => {
    const log: HabitLog = {
      meditation: ["2026-11-09"],
      reading: ["2026-11-09"],
      journaling: ["2026-11-09"],
    };

    expect(dailyCompletion(habits, log, "2026-11-09")).toEqual({
      done: 3,
      total: 3,
      percent: 100,
    });
  });

  it("returns zero values when there are no habits", () => {
    expect(dailyCompletion([], {}, "2026-11-09")).toEqual({
      done: 0,
      total: 0,
      percent: 0,
    });
  });
});
