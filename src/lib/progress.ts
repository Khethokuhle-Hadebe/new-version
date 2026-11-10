import { addDays, monthDays, startOfWeek, toKey, weekDays } from "@/lib/dates";

export type AffirmationCounts = Record<string, number>;

export interface WeekDay {
  date: Date;
  key: string;
  label: string;
  count: number;
}

export interface WeekSummary {
  start: Date;
  end: Date;
  days: WeekDay[];
  total: number;
  best: WeekDay;
  average: number;
}

export interface MonthDay {
  date: Date;
  key: string;
  day: number;
  count: number;
}

export interface MonthWeek {
  label: string;
  range: string;
  total: number;
}

export interface MonthSummary {
  month: number;
  year: number;
  days: MonthDay[];
  total: number;
  best: MonthDay;
  average: number;
  activeDays: number;
  weeks: MonthWeek[];
}

export interface HistoryEntry {
  key: string;
  count: number;
  date: Date;
}

export function sumFor(counts: AffirmationCounts, dates: Date[]): number {
  return dates.reduce((total, date) => total + (counts[toKey(date)] || 0), 0);
}

export function weekSummary(
  counts: AffirmationCounts,
  date: Date,
): WeekSummary {
  const start = startOfWeek(date);

  const days = weekDays(date).map((d) => ({
    date: d,
    key: toKey(d),
    label: d.toLocaleDateString("en-GB", {
      weekday: "short",
    }),
    count: counts[toKey(d)] || 0,
  }));

  const total = days.reduce((t, d) => t + d.count, 0);

  const best = days.reduce((a, b) => (b.count > a.count ? b : a), days[0]);

  const recorded = days.filter((d) => d.count > 0).length;

  return {
    start,
    end: addDays(start, 6),
    days,
    total,
    best,
    average: recorded ? Math.round(total / recorded) : 0,
  };
}

export function monthSummary(
  counts: AffirmationCounts,
  date: Date,
): MonthSummary {
  const base = new Date(date);

  const days = monthDays(base).map((d) => ({
    date: d,
    key: toKey(d),
    day: d.getDate(),
    count: counts[toKey(d)] || 0,
  }));

  const total = days.reduce((t, d) => t + d.count, 0);

  const best = days.reduce((a, b) => (b.count > a.count ? b : a), days[0]);

  const recorded = days.filter((d) => d.count > 0).length;

  const weeks: MonthDay[][] = [];
  let bucket: MonthDay[] = [];

  days.forEach((day) => {
    if (day.date.getDay() === 1 && bucket.length) {
      weeks.push(bucket);
      bucket = [];
    }

    bucket.push(day);
  });

  if (bucket.length) {
    weeks.push(bucket);
  }

  return {
    month: base.getMonth(),
    year: base.getFullYear(),
    days,
    total,
    best,
    average: recorded ? Math.round(total / recorded) : 0,
    activeDays: recorded,
    weeks: weeks.map((week, index) => ({
      label: `Week ${index + 1}`,
      range: `${week[0].day}–${week[week.length - 1].day}`,
      total: week.reduce((t, d) => t + d.count, 0),
    })),
  };
}

export function historyEntries(counts: AffirmationCounts): HistoryEntry[] {
  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({
      key,
      count,
      date: new Date(`${key}T00:00:00`),
    }))
    .sort((a, b) => (a.key < b.key ? 1 : -1));
}

export function relativeDayLabel(key: string): string | null {
  const today = toKey(new Date());
  const yesterday = toKey(addDays(new Date(), -1));

  if (key === today) return "Today";
  if (key === yesterday) return "Yesterday";

  return null;
}

export function previousMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

export function shiftMonth(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}
