export interface Habit {
  id: string;
  name: string;
  [key: string]: unknown;
}

export const HABIT_SUGGESTIONS = [
  "Morning meditation",
  "Reading 10 pages",
  "Journaling",
  "Movement or exercise",
  "Learning something new",
  "Practising affirmations",
];

export type HabitLog = Record<string, string[]>;

export function completedOn(
  log: HabitLog,
  habitId: string,
  dateKey: string,
): boolean {
  return (log[habitId] || []).includes(dateKey);
}

export function streakFor(
  log: HabitLog,
  habitId: string,
  from: Date = new Date(),
): number {
  const dates = new Set(log[habitId] || []);
  let streak = 0;
  const cursor = new Date(from);

  cursor.setHours(0, 0, 0, 0);

  // A streak stays alive if today is not done yet but yesterday was.
  if (!dates.has(keyOf(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (dates.has(keyOf(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function keyOf(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

export function dailyCompletion(
  habits: Habit[],
  log: HabitLog,
  dateKey: string,
): { done: number; total: number; percent: number } {
  if (!habits.length) {
    return { done: 0, total: 0, percent: 0 };
  }

  const done = habits.filter((habit) =>
    completedOn(log, habit.id, dateKey),
  ).length;

  return {
    done,
    total: habits.length,
    percent: Math.round((done / habits.length) * 100),
  };
}
