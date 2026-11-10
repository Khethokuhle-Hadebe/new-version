"use client";

import { useState, useEffect, useCallback } from "react";

import { KEYS, readStore, writeStore, type StorageKey } from "@/lib/storage";
import { todayKey } from "@/lib/dates";

interface Settings {
  displayName: string;
  dailyGoal: number;
}

type AffirmationCounts = Record<string, number>;

type HabitLog = Record<string, string[]>;

const DEFAULT_SETTINGS: Settings = {
  displayName: "",
  dailyGoal: 10,
};

export function useCollection<T>(key: StorageKey, initial: T) {
  const [items, setItems] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(readStore<T>(key, initial));
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const persist = useCallback(
    (next: T | ((current: T) => T)) => {
      setItems((current) => {
        const resolved =
          typeof next === "function"
            ? (next as (current: T) => T)(current)
            : next;

        writeStore(key, resolved);

        return resolved;
      });
    },
    [key],
  );

  return {
    items,
    setItems: persist,
    loaded,
  };
}

export function useAffirmationCounts() {
  const { items, setItems, loaded } = useCollection<AffirmationCounts>(
    KEYS.counts,
    {},
  );

  const [today, setToday] = useState(todayKey());

  useEffect(() => {
    const sync = () => setToday(todayKey());

    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);

    return () => {
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const todayCount = items[today] || 0;

  const increment = useCallback(() => {
    const key = todayKey();
    const stored = readStore<AffirmationCounts>(KEYS.counts, {});

    setToday(key);

    setItems({
      ...stored,
      [key]: (stored[key] || 0) + 1,
    });
  }, [setItems]);

  return {
    counts: items,
    loaded,
    today,
    todayCount,
    increment,
  };
}

export function useHabitLog() {
  const { items, setItems, loaded } = useCollection<HabitLog>(
    KEYS.habitLog,
    {},
  );

  const toggle = useCallback(
    (habitId: string, dateKey: string) => {
      const stored = readStore<HabitLog>(KEYS.habitLog, {});
      const dates = stored[habitId] || [];

      const has = dates.includes(dateKey);

      const nextDates = has
        ? dates.filter((date) => date !== dateKey)
        : [...dates, dateKey];

      setItems({
        ...stored,
        [habitId]: nextDates,
      });
    },
    [setItems],
  );

  const removeHabit = useCallback(
    (habitId: string) => {
      const stored = readStore<HabitLog>(KEYS.habitLog, {});
      const next = { ...stored };

      delete next[habitId];

      setItems(next);
    },
    [setItems],
  );

  return {
    log: items,
    loaded,
    toggle,
    removeHabit,
  };
}

export function useSettings() {
  const { items, setItems, loaded } = useCollection<Settings>(
    KEYS.settings,
    DEFAULT_SETTINGS,
  );

  const update = useCallback(
    (patch: Partial<Settings>) => {
      const stored = readStore<Settings>(KEYS.settings, DEFAULT_SETTINGS);

      setItems({
        ...DEFAULT_SETTINGS,
        ...stored,
        ...patch,
      });
    },
    [setItems],
  );

  return {
    settings: {
      ...DEFAULT_SETTINGS,
      ...items,
    },
    loaded,
    update,
  };
}
