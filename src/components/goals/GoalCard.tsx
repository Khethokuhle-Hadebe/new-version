import { CalendarDays, Check, Pencil, RotateCcw, Trash2 } from "lucide-react";

import ProgressBar from "@/components/shared/ProgressBar";
import { formatShort } from "@/lib/dates";
import type { Goal } from "@/lib/goals";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onProgress: (id: string, progress: number) => void;
  onToggleComplete: (id: string) => void;
}

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onProgress,
  onToggleComplete,
}: GoalCardProps) {
  const completed = goal.status === "completed";

  return (
    <article
      className={`group relative flex h-full flex-col rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_50px_-32px_rgba(36,27,45,0.5)] ${
        completed
          ? "border-lavender/40 bg-lilac/50"
          : "border-white/70 bg-white/85"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-lilac px-3 py-1 text-[11px] font-medium text-plum">
          {goal.category || "Personal growth"}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            completed ? "bg-plum text-lavender" : "bg-cream text-fog"
          }`}
        >
          {completed ? "Completed" : `${goal.progress || 0}%`}
        </span>
      </div>

      <h3
        className={`mt-4 font-heading text-[22px] leading-snug text-ink ${
          completed ? "text-ink/70" : ""
        }`}
      >
        {goal.title}
      </h3>

      {goal.description && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fog">
          {goal.description}
        </p>
      )}

      <div className="mt-auto pt-5">
        {goal.targetDate && (
          <p className="mb-3 flex items-center gap-1.5 text-[11px] text-fog">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
            Target {formatShort(new Date(`${goal.targetDate}T00:00:00`))}
          </p>
        )}

        <ProgressBar
          value={goal.progress || 0}
          tone={completed ? "plum" : "lavender"}
        />

        {!completed && (
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={goal.progress || 0}
            onChange={(event) =>
              onProgress(goal.id, Number(event.target.value))
            }
            aria-label={`Progress for ${goal.title}`}
            className="mt-3 w-full accent-[#B9A2E8]"
          />
        )}

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleComplete(goal.id)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-plum/70 transition hover:text-plum"
          >
            {completed ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.9} />
                Reopen goal
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                Mark complete
              </>
            )}
          </button>

          <div className="flex items-center gap-1 opacity-70 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              aria-label={`Edit ${goal.title}`}
              className="rounded-full p-2 text-plum/60 transition hover:bg-lilac hover:text-plum"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.9} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(goal)}
              aria-label={`Delete ${goal.title}`}
              className="rounded-full p-2 text-plum/60 transition hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
