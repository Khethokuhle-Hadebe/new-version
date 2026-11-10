"use client";

import { useEffect, useState } from "react";
import type { Habit } from "@/lib/habits";

interface HabitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialHabit: Habit | null;
  onSave: (name: string) => void;
}

export default function HabitFormDialog({
  open,
  onOpenChange,
  initialHabit,
  onSave,
}: HabitFormDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setName(initialHabit?.name || "");
    setError("");
  }, [open, initialHabit]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Give your habit a name.");
      return;
    }

    onSave(name.trim());
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-plum/30 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-dialog-title"
        className="w-full max-w-md rounded-3xl border-none bg-cream p-0 shadow-2xl"
      >
        <form onSubmit={submit} className="p-6">
          <div className="text-left">
            <h2
              id="habit-dialog-title"
              className="font-heading text-2xl text-ink"
            >
              {initialHabit ? "Edit habit" : "New daily habit"}
            </h2>
          </div>

          <div className="mt-5">
            <label htmlFor="habit-name" className="nv-eyebrow mb-1.5 block">
              Habit
            </label>

            <input
              id="habit-name"
              className="nv-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Morning meditation"
              autoFocus
            />

            {error && (
              <p className="mt-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full px-4 py-2 text-sm text-ink/70 transition hover:bg-white/60"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-full bg-plum px-5 py-2 text-sm font-medium text-cream transition hover:bg-plum-soft"
            >
              {initialHabit ? "Save changes" : "Add habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
