export const WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function toKey(date: Date = new Date()): string {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${d.getFullYear()}-${month}-${day}`;
}

export function fromKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function todayKey(): string {
  return toKey(new Date());
}

export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);

  d.setHours(0, 0, 0, 0);

  const offset = (d.getDay() + 6) % 7;

  d.setDate(d.getDate() - offset);

  return d;
}

export function weekDays(date: Date = new Date()): Date[] {
  const start = startOfWeek(date);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);

    d.setDate(start.getDate() + i);

    return d;
  });
}

export function monthDays(date: Date = new Date()): Date[] {
  const base = new Date(date);
  const year = base.getFullYear();
  const month = base.getMonth();

  const total = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: total }, (_, i) => new Date(year, month, i + 1));
}

export function addDays(date: Date, amount: number): Date {
  const d = new Date(date);

  d.setDate(d.getDate() + amount);

  return d;
}

export function formatLong(date: Date = new Date()): string {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShort(date: Date): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function formatMonthYear(date: Date): string {
  return new Date(date).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}
