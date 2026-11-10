"use client";

import { Check, Flame, Pencil, Trash2 } from "lucide-react";

import { WEEKDAYS, toKey } from "@/lib/dates";
import { completedOn, streakFor } from "@/lib/habits";
import type { Habit, HabitLog } from "@/lib/habits";

interface HabitRowProps {
  habit: Habit;
  log: HabitLog;
  weekDates: Date[];
  todayKeyValue: string;
  onToggle: (habitId: string, dateKey: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export default function HabitRow({
  habit,
  log,
  weekDates,
  todayKeyValue,
  onToggle,
  onEdit,
  onDelete,
}: HabitRowProps) {
  const streak = streakFor(log, habit.id);
  const isDoneToday = completedOn(log, habit.id, todayKeyValue);

  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-5 transition-all hover:shadow-[0_22px_44px_-34px_rgba(36,27,45,0.45)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => onToggle(habit.id, todayKeyValue)}
            aria-pressed={isDoneToday}
            aria-label={`Mark ${habit.name} ${
              isDoneToday ? "incomplete" : "complete"
            } for today`}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
              isDoneToday
                ? "border-lavender bg-lavender text-plum"
                : "border-ink/20 bg-white text-transparent hover:border-lavender"
            }`}
          >
            <Check className="h-4 w-4" strokeWidth={2.6} />
          </button>

          <div className="min-w-0">
            <p
              className={`truncate text-sm font-medium ${
                isDoneToday ? "text-ink/60" : "text-ink"
              }`}
            >
              {habit.name}
            </p>

            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-fog">
              <Flame
                className={`h-3 w-3 ${
                  streak > 0 ? "text-lavender-deep" : "text-fog/60"
                }`}
                strokeWidth={2}
              />
              {streak > 0 ? `${streak} day streak` : "No streak yet"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-end gap-1.5">
            {weekDates.map((date, index) => {
              const key = toKey(date);
              const done = completedOn(log, habit.id, key);
              const isToday = key === todayKeyValue;

              return (
                <div key={key} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] uppercase tracking-wide text-fog/70">
                    {WEEKDAYS[index].charAt(0)}
                  </span>

                  <span
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      done
                        ? "bg-lavender"
                        : isToday
                          ? "bg-ink/15 ring-2 ring-lavender/40"
                          : "bg-ink/10"
                    }`}
                    title={`${WEEKDAYS[index]}: ${
                      done ? "completed" : "not completed"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onEdit(habit)}
              aria-label={`Edit ${habit.name}`}
              className="rounded-full p-2 text-plum/50 transition hover:bg-lilac hover:text-plum"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.9} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(habit)}
              aria-label={`Delete ${habit.name}`}
              className="rounded-full p-2 text-plum/50 transition hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
