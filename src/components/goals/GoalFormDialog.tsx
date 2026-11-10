"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { GOAL_CATEGORIES } from "@/lib/goals";

interface Goal {
  id: string;
  title: string;
  description?: string;
  category?: string;
  targetDate?: string;
  progress?: number;
  status: "active" | "completed";
}

interface GoalFormData {
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number;
}

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialGoal: Goal | null;
  onSave: (data: GoalFormData) => void;
}

const EMPTY: GoalFormData = {
  title: "",
  description: "",
  category: "Personal growth",
  targetDate: "",
  progress: 0,
};

export default function GoalFormDialog({
  open,
  onOpenChange,
  initialGoal,
  onSave,
}: GoalFormDialogProps) {
  const [form, setForm] = useState<GoalFormData>(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setError("");

    setForm(
      initialGoal
        ? {
            title: initialGoal.title || "",
            description: initialGoal.description || "",
            category: initialGoal.category || "Personal growth",
            targetDate: initialGoal.targetDate || "",
            progress: initialGoal.progress || 0,
          }
        : { ...EMPTY },
    );
  }, [open, initialGoal]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Give your goal a title.");
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      progress: Number(form.progress) || 0,
    });

    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-plum/35 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-dialog-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border-none bg-cream p-0 shadow-2xl"
      >
        <form onSubmit={submit} className="p-6 sm:p-7">
          <div className="flex items-start justify-between">
            <h2
              id="goal-dialog-title"
              className="font-heading text-2xl text-ink"
            >
              {initialGoal ? "Edit goal" : "New goal"}
            </h2>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close dialog"
              className="rounded-full p-2 text-plum/50 transition hover:bg-white/70 hover:text-plum"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="goal-title" className="nv-eyebrow mb-1.5 block">
                Title
              </label>

              <input
                id="goal-title"
                className="nv-input"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Publish my portfolio"
              />
            </div>

            <div>
              <label
                htmlFor="goal-description"
                className="nv-eyebrow mb-1.5 block"
              >
                Description
              </label>

              <textarea
                id="goal-description"
                rows={3}
                className="nv-input resize-none"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Why this matters and what it looks like when it's done."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="goal-category"
                  className="nv-eyebrow mb-1.5 block"
                >
                  Category
                </label>

                <select
                  id="goal-category"
                  className="nv-input"
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                >
                  {GOAL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="goal-date" className="nv-eyebrow mb-1.5 block">
                  Target date{" "}
                  <span className="normal-case tracking-normal text-fog/70">
                    (optional)
                  </span>
                </label>

                <input
                  id="goal-date"
                  type="date"
                  className="nv-input"
                  value={form.targetDate}
                  onChange={(event) =>
                    setForm({ ...form, targetDate: event.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="goal-progress" className="nv-eyebrow">
                  Progress
                </label>

                <span className="text-sm font-medium text-plum">
                  {form.progress}%
                </span>
              </div>

              <input
                id="goal-progress"
                type="range"
                min="0"
                max="100"
                step="5"
                value={form.progress}
                onChange={(event) =>
                  setForm({
                    ...form,
                    progress: Number(event.target.value),
                  })
                }
                className="w-full accent-[#B9A2E8]"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="mt-7 flex justify-end gap-3">
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
              {initialGoal ? "Save changes" : "Create goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
