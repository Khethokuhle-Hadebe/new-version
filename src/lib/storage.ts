const PREFIX = "newversion.";

export const KEYS = {
  goals: "goals",
  entries: "entries",
  favourites: "favourites",
  customAffirmations: "custom-affirmations",
  counts: "affirmation-counts",
  habits: "habits",
  habitLog: "habit-log",
  settings: "settings",
} as const;

export type StorageKey = (typeof KEYS)[keyof typeof KEYS];

const isBrowser = typeof window !== "undefined";

export function readStore<T>(key: StorageKey, fallback: T): T {
  if (!isBrowser) return fallback;

  try {
    const raw = window.localStorage.getItem(PREFIX + key);

    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);

    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: StorageKey, value: T): void {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable or full.
  }
}

export function clearAllData(): void {
  if (!isBrowser) return;

  Object.values(KEYS).forEach((key) => {
    window.localStorage.removeItem(PREFIX + key);
  });
}
