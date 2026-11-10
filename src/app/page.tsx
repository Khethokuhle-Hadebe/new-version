"use client";

import { Suspense, useMemo, useState } from "react";

import { KEYS } from "@/lib/storage";
import {
  useAffirmationCounts,
  useCollection,
  useHabitLog,
  useSettings,
} from "@/hooks/useAppData";

import {
  AFFIRMATIONS,
  affirmationOfTheDay,
  motivationOfTheDay,
  promptOfTheDay,
  type Affirmation,
} from "@/lib/affirmations";

import { todayKey } from "@/lib/dates";
import type { Habit } from "@/lib/habits";

import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import DailyAffirmation from "@/components/dashboard/DailyAffirmation";
import AffirmationCounter from "@/components/dashboard/AffirmationCounter";
import GoalsOverview from "@/components/dashboard/GoalsOverview";
import TodayHabits from "@/components/dashboard/TodayHabits";
import JournalPrompt from "@/components/dashboard/JournalPrompt";

interface Goal {
  id: string;
  title: string;
  status: string;
  progress?: number;
  category?: string;
  targetDate?: string;
}

function DashboardContent() {
  const dateKey = todayKey();

  const { settings, loaded: settingsLoaded } = useSettings();

  const { items: goals, loaded: goalsLoaded } = useCollection<Goal[]>(
    KEYS.goals,
    [],
  );

  const { items: habits, loaded: habitsLoaded } = useCollection<Habit[]>(
    KEYS.habits,
    [],
  );

  const { items: favourites, setItems: setFavourites } = useCollection<
    string[]
  >(KEYS.favourites, []);

  const { log, toggle, loaded: logLoaded } = useHabitLog();

  const {
    todayCount,
    increment,
    loaded: countsLoaded,
  } = useAffirmationCounts();

  const [featured, setFeatured] = useState<Affirmation>(() =>
    affirmationOfTheDay(todayKey()),
  );

  const loaded =
    settingsLoaded && goalsLoaded && habitsLoaded && logLoaded && countsLoaded;

  const motivation = useMemo(() => motivationOfTheDay(dateKey), [dateKey]);

  const prompt = useMemo(() => promptOfTheDay(dateKey), [dateKey]);

  const shuffle = () => {
    const pool = AFFIRMATIONS.filter(
      (affirmation) => affirmation.id !== featured.id,
    );

    setFeatured(pool[Math.floor(Math.random() * pool.length)]);
  };

  const toggleFavourite = (id: string) => {
    setFavourites(
      favourites.includes(id)
        ? favourites.filter((favourite) => favourite !== id)
        : [...favourites, id],
    );
  };

  if (!loaded) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="h-24 w-2/3 animate-pulse rounded-3xl bg-white/50" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-3xl bg-lilac/40 lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-3xl bg-white/50" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <WelcomeHeader name={settings.displayName} motivation={motivation} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DailyAffirmation
            affirmation={featured}
            isFavourite={favourites.includes(featured.id)}
            onFavourite={toggleFavourite}
            onShuffle={shuffle}
          />

          <AffirmationCounter
            count={todayCount}
            goal={Number(settings.dailyGoal) || 0}
            onIncrement={increment}
          />
        </div>

        <div className="space-y-6">
          <TodayHabits
            habits={habits}
            log={log}
            dateKey={dateKey}
            onToggle={toggle}
          />

          <JournalPrompt prompt={prompt} />
        </div>
      </div>

      <div className="mt-6">
        <GoalsOverview goals={goals} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6" aria-busy="true">
          <div className="h-24 w-2/3 animate-pulse rounded-3xl bg-white/50" />
          <div className="h-64 animate-pulse rounded-3xl bg-lilac/40" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
