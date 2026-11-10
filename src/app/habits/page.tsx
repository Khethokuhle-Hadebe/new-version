"use client";

import { Suspense, useMemo, useState } from "react";
import { ListChecks, Plus, Sparkles } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import HabitRow from "@/components/habits/HabitRow";
import HabitFormDialog from "@/components/habits/HabitFormDialog";

import { useCollection, useHabitLog } from "@/hooks/useAppData";
import { KEYS } from "@/lib/storage";
import { todayKey, toKey, weekDays } from "@/lib/dates";
import { HABIT_SUGGESTIONS, dailyCompletion } from "@/lib/habits";
import type { Habit, HabitLog } from "@/lib/habits";

function HabitsContent() {
  const dateKey = todayKey();

  const {
    items: habits,
    setItems: setHabits,
    loaded,
  } = useCollection<Habit[]>(KEYS.habits, []);

  const { log, toggle, removeHabit } = useHabitLog();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Habit | null>(null);
  const [notice, setNotice] = useState("");

  const weekDates = useMemo(() => weekDays(new Date()), []);

  const completion = dailyCompletion(habits, log, dateKey);

  const weeklyDone = habits.reduce((total, habit) => {
    const completedDates = log[habit.id] || [];

    return (
      total +
      weekDates.filter((date) => completedDates.includes(toKey(date))).length
    );
  }, 0);

  const addHabit = (name: string) => {
    if (editing) {
      setHabits((current) =>
        current.map((habit) =>
          habit.id === editing.id ? { ...habit, name } : habit,
        ),
      );

      setNotice("Your habit has been updated.");
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name,
        createdDate: new Date().toISOString(),
      };

      setHabits((current) => [...current, newHabit]);
      setNotice("Your new habit has been added.");
    }

    setEditing(null);
  };

  const openNewHabit = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEditHabit = (habit: Habit) => {
    setEditing(habit);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;

    setHabits((current) =>
      current.filter((habit) => habit.id !== pendingDelete.id),
    );

    removeHabit(pendingDelete.id);
    setNotice("Your habit has been deleted.");
    setPendingDelete(null);
  };

  if (!loaded) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-3xl bg-white/50" />
        <div className="h-40 animate-pulse rounded-3xl bg-white/50" />
        <div className="h-24 animate-pulse rounded-3xl bg-white/50" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Daily Habits"
        title="The small things, repeated"
        description="Tick off today, keep the streak alive, and let the week show you the truth."
        action={
          <button
            type="button"
            onClick={openNewHabit}
            className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-3 text-sm font-medium text-cream shadow-sm transition hover:bg-plum-soft"
          >
            <Plus className="h-4 w-4" />
            Add habit
          </button>
        }
      />

      {notice && (
        <div
          role="status"
          className="rounded-2xl border border-lavender/30 bg-lilac/40 px-4 py-3 text-sm text-plum"
        >
          {notice}
        </div>
      )}

      <section className="nv-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="nv-eyebrow text-plum/55">Today's progress</p>

          <h2 className="mt-2 font-heading text-3xl text-ink">
            One step at a time.
          </h2>

          <p className="mt-2 text-sm text-fog">
            {completion.done} of {completion.total} habits completed today
          </p>

          <p className="mt-4 flex items-center gap-2 text-xs text-fog">
            <Sparkles className="h-4 w-4 text-lavender-deep" />
            {weeklyDone} check-ins this week
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="relative flex h-24 w-24 shrink-0 items-center justify-center"
            role="progressbar"
            aria-label="Today's habit completion"
            aria-valuenow={completion.percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <svg
              viewBox="0 0 40 40"
              className="h-24 w-24 -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx="20"
                cy="20"
                r="15.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-ink/10"
              />

              <circle
                cx="20"
                cy="20"
                r="15.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(completion.percent / 100) * 97.4} 97.4`}
                className="text-lavender"
              />
            </svg>

            <span className="absolute font-heading text-2xl text-ink">
              {completion.percent}%
            </span>
          </div>

          <div className="text-sm">
            <p className="font-medium text-ink">
              {completion.total - completion.done} left today
            </p>
            <p className="mt-1 text-xs text-fog">
              Keep showing up for yourself.
            </p>
          </div>
        </div>
      </section>

      {habits.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Start with one small habit"
          description="Consistency beats intensity. Pick something you can do today."
          action={
            <button
              type="button"
              onClick={openNewHabit}
              className="rounded-full bg-plum px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-plum-soft"
            >
              Create your first habit
            </button>
          }
        />
      ) : (
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl text-ink">This week</h2>
              <p className="mt-1 text-xs text-fog">Monday – Sunday</p>
            </div>

            <span className="rounded-full bg-lilac/60 px-3 py-1.5 text-xs font-medium text-plum">
              {completion.total - completion.done} left today
            </span>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                log={log as HabitLog}
                weekDates={weekDates}
                todayKeyValue={dateKey}
                onToggle={toggle}
                onEdit={openEditHabit}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        </section>
      )}

      {habits.length === 0 && (
        <section className="nv-card p-6">
          <p className="nv-eyebrow text-plum/55">Need a little inspiration?</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {HABIT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addHabit(suggestion)}
                className="rounded-full border border-lavender/40 bg-white/70 px-4 py-2 text-sm text-plum transition hover:border-lavender hover:bg-lilac/50"
              >
                <Plus className="mr-1 inline h-3 w-3" />
                {suggestion}
              </button>
            ))}
          </div>
        </section>
      )}

      <HabitFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialHabit={editing}
        onSave={addHabit}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete this habit?"
        description={`Are you sure you want to delete "${pendingDelete?.name ?? "this habit"}"? Its check-in history will also be removed.`}
        confirmLabel="Delete habit"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default function HabitsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-28 animate-pulse rounded-3xl bg-white/50" />
          <div className="h-40 animate-pulse rounded-3xl bg-white/50" />
          <div className="h-24 animate-pulse rounded-3xl bg-white/50" />
        </div>
      }
    >
      <HabitsContent />
    </Suspense>
  );
}
