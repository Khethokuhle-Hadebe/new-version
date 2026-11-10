"use client";

import { useMemo, useState } from "react";
import { Plus, Target } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import GoalCard from "@/components/goals/GoalCard";
import GoalFormDialog from "@/components/goals/GoalFormDialog";

import { useCollection } from "@/hooks/useAppData";
import { KEYS } from "@/lib/storage";
import type { Goal } from "@/lib/goals";

const FILTERS = ["All", "Active", "Completed"] as const;

type GoalFilter = (typeof FILTERS)[number];

export default function GoalsPage() {
  const {
    items: goals,
    setItems: setGoals,
    loaded,
  } = useCollection<Goal[]>(KEYS.goals, []);

  const [filter, setFilter] = useState<GoalFilter>("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Goal | null>(null);
  const [notice, setNotice] = useState("");

  const visible = useMemo(() => {
    const list =
      filter === "Active"
        ? goals.filter((goal) => goal.status !== "completed")
        : filter === "Completed"
          ? goals.filter((goal) => goal.status === "completed")
          : goals;

    return [...list].sort((a, b) => {
      const aDone = a.status === "completed" ? 1 : 0;
      const bDone = b.status === "completed" ? 1 : 0;

      return aDone - bDone;
    });
  }, [goals, filter]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const saveGoal = (data: {
    title: string;
    description: string;
    category: string;
    targetDate: string;
    progress: number;
  }) => {
    if (editing) {
      setGoals(
        goals.map((goal) =>
          goal.id === editing.id
            ? {
                ...goal,
                ...data,
                category: data.category as Goal["category"],
                status: data.progress >= 100 ? "completed" : "active",
              }
            : goal,
        ),
      );

      setNotice("Goal updated successfully.");
    } else {
      const goal: Goal = {
        ...data,
        category: data.category as Goal["category"],
        id: crypto.randomUUID(),
        status: data.progress >= 100 ? "completed" : "active",
        createdDate: new Date().toISOString(),
      };

      setGoals([goal, ...goals]);
      setNotice("Goal created successfully.");
    }
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              progress,
              status: progress >= 100 ? "completed" : "active",
            }
          : goal,
      ),
    );
  };

  const toggleComplete = (id: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              status: goal.status === "completed" ? "active" : "completed",
              progress:
                goal.status === "completed"
                  ? Math.min(goal.progress || 0, 95)
                  : 100,
            }
          : goal,
      ),
    );
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;

    setGoals(goals.filter((goal) => goal.id !== pendingDelete.id));

    setNotice("Goal deleted successfully.");
    setPendingDelete(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Goals"
        title="What you're moving toward"
        description="Name your intentions, then let progress become visible."
        action={
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-3 text-sm font-medium text-cream transition-all hover:bg-plum-soft active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            New goal
          </button>
        }
      />

      {notice && (
        <p role="status" className="mb-4 text-sm text-plum/70">
          {notice}
        </p>
      )}

      {goals.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                filter === option
                  ? "bg-plum text-cream"
                  : "bg-white/70 text-plum/60 hover:bg-white hover:text-plum"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {!loaded ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-3xl bg-white/50"
            />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Target}
          title={goals.length === 0 ? "No goals yet" : "Nothing here yet"}
          description={
            goals.length === 0
              ? "The first version of you starts with one clear intention. Add it and watch it grow."
              : "Try another filter, or create a new goal."
          }
          action={
            <button
              type="button"
              onClick={openNew}
              className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-plum-soft"
            >
              <Plus className="h-4 w-4" />
              Create a goal
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {visible.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={(selectedGoal) => {
                setEditing(selectedGoal);
                setFormOpen(true);
              }}
              onDelete={setPendingDelete}
              onProgress={updateProgress}
              onToggleComplete={toggleComplete}
            />
          ))}
        </div>
      )}

      <GoalFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialGoal={editing}
        onSave={saveGoal}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
        title="Delete this goal?"
        description={`"${pendingDelete?.title || ""}" will be removed permanently. This cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
