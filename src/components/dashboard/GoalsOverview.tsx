import Link from "next/link";
import { ArrowUpRight, Check, Target } from "lucide-react";

import ProgressBar from "@/components/shared/ProgressBar";
import { formatShort } from "@/lib/dates";

interface Goal {
  id: string;
  title: string;
  status: string;
  progress?: number;
  category?: string;
  targetDate?: string;
}

interface GoalsOverviewProps {
  goals: Goal[];
}

export default function GoalsOverview({ goals }: GoalsOverviewProps) {
  const active = goals.filter((goal) => goal.status !== "completed");
  const completed = goals.filter((goal) => goal.status === "completed");
  const shown = active.slice(0, 4);

  return (
    <section className="nv-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="nv-eyebrow">Goals</p>
          <h2 className="mt-1 font-heading text-2xl text-ink">In motion</h2>
        </div>

        <Link
          href="/goals"
          className="inline-flex items-center gap-1 text-xs font-medium text-plum/60 transition hover:text-plum"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-ink/12 px-5 py-8 text-center">
          <Target className="mx-auto h-6 w-6 text-lavender" strokeWidth={1.6} />

          <p className="mt-3 text-sm text-ink/70">
            No goals yet — name one thing you are moving toward.
          </p>

          <Link
            href="/goals"
            className="mt-4 inline-flex rounded-full bg-plum px-4 py-2 text-xs font-medium text-cream transition hover:bg-plum-soft"
          >
            Create your first goal
          </Link>
        </div>
      ) : (
        <ul className="mt-5 space-y-5">
          {shown.map((goal) => (
            <li key={goal.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-medium text-ink">
                  {goal.title}
                </p>

                <span className="shrink-0 text-xs text-fog">
                  {goal.progress || 0}%
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-[11px] text-fog">
                <span>{goal.category || "Personal"}</span>

                {goal.targetDate && (
                  <span>· by {formatShort(new Date(goal.targetDate))}</span>
                )}
              </div>

              <ProgressBar value={goal.progress || 0} className="mt-2.5" />
            </li>
          ))}
        </ul>
      )}

      {completed.length > 0 && (
        <div className="mt-5 border-t border-ink/8 pt-4">
          <p className="nv-eyebrow mb-2.5">Completed · {completed.length}</p>

          <ul className="space-y-2">
            {completed.slice(0, 3).map((goal) => (
              <li
                key={goal.id}
                className="flex items-center gap-2 text-xs text-fog"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lavender text-plum">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>

                <span className="truncate line-through">{goal.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
