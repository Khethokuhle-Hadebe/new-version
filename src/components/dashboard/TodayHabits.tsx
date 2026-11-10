import Link from "next/link";
import { Check, ListChecks } from "lucide-react";

import {
  completedOn,
  dailyCompletion,
  type Habit,
  type HabitLog,
} from "@/lib/habits";

interface TodayHabitsProps {
  habits: Habit[];
  log: HabitLog;
  dateKey: string;
  onToggle: (habitId: string, dateKey: string) => void;
}

export default function TodayHabits({
  habits,
  log,
  dateKey,
  onToggle,
}: TodayHabitsProps) {
  const { done, total, percent } = dailyCompletion(habits, log, dateKey);

  return (
    <section className="nv-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="nv-eyebrow">Daily habits</p>
          <h2 className="mt-1 font-heading text-2xl text-ink">Today</h2>
        </div>

        <span className="rounded-full bg-lilac px-3 py-1 text-xs font-medium text-plum">
          {total ? `${done}/${total}` : "—"}
        </span>
      </div>

      {total === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-ink/12 px-5 py-8 text-center">
          <ListChecks
            className="mx-auto h-6 w-6 text-lavender"
            strokeWidth={1.6}
          />

          <p className="mt-3 text-sm text-ink/70">
            Build your first daily habit.
          </p>

          <Link
            href="/habits"
            className="mt-4 inline-flex rounded-full bg-plum px-4 py-2 text-xs font-medium text-cream transition hover:bg-plum-soft"
          >
            Add a habit
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-1">
          {habits.map((habit) => {
            const isDone = completedOn(log, habit.id, dateKey);

            return (
              <li key={habit.id}>
                <button
                  type="button"
                  onClick={() => onToggle(habit.id, dateKey)}
                  aria-pressed={isDone}
                  className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition-colors hover:bg-cream/70"
                >
                  <span
                    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                      isDone
                        ? "border-lavender bg-lavender text-plum"
                        : "border-ink/20 bg-white text-transparent"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                  </span>

                  <span
                    className={`text-sm transition-colors ${
                      isDone ? "text-fog line-through" : "text-ink"
                    }`}
                  >
                    {habit.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {total > 0 && (
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/8">
            <div
              className="h-1.5 rounded-full bg-lavender transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <span className="text-[11px] text-fog">{percent}%</span>
        </div>
      )}
    </section>
  );
}
