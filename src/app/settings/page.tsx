"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

import {
  useCollection,
  useSettings,
  useAffirmationCounts,
} from "@/hooks/useAppData";

import { KEYS, clearAllData } from "@/lib/storage";

function SettingsContent() {
  const { settings, update } = useSettings();

  const { items: goals } = useCollection(KEYS.goals, []);
  const { items: entries } = useCollection(KEYS.entries, []);
  const { items: habits } = useCollection(KEYS.habits, []);

  const { counts } = useAffirmationCounts();

  const [name, setName] = useState("");
  const [goal, setGoal] = useState("10");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setName(settings.displayName || "");
    setGoal(String(settings.dailyGoal ?? 10));
  }, [settings.displayName, settings.dailyGoal]);

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const dailyGoal = Math.min(500, Math.max(0, Number(goal) || 0));

    update({
      displayName: name.trim(),
      dailyGoal,
    });

    setGoal(String(dailyGoal));
    setNotice("Your settings have been saved successfully.");
  };

  const wipe = () => {
    clearAllData();
    window.location.reload();
  };

  const recordedDays = Object.values(counts).filter(
    (count) => count > 0,
  ).length;

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Make it yours"
        description="Everything lives in this browser only — no account, no cloud, no audience."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={save} className="nv-card lg:col-span-3">
          <p className="nv-eyebrow">Personalisation</p>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="display-name" className="nv-eyebrow mb-1.5 block">
                Preferred display name
              </label>

              <input
                id="display-name"
                className="nv-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="How should we greet you?"
                maxLength={40}
              />

              <p className="mt-1.5 text-[11px] text-fog">
                Used in your daily greeting.
              </p>
            </div>

            <div>
              <label htmlFor="daily-goal" className="nv-eyebrow mb-1.5 block">
                Daily affirmation aim
              </label>

              <input
                id="daily-goal"
                type="number"
                min="0"
                max="500"
                className="nv-input"
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
              />

              <p className="mt-1.5 text-[11px] text-fog">
                A gentle target for the progress bar. Set 0 to hide it.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-end gap-3">
            {notice && (
              <p role="status" className="text-xs text-plum">
                {notice}
              </p>
            )}

            <button
              type="submit"
              className="rounded-full bg-plum px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-plum-soft"
            >
              Save changes
            </button>
          </div>
        </form>

        <div className="space-y-6 lg:col-span-2">
          <section className="nv-card">
            <p className="nv-eyebrow">Your data</p>

            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex justify-between text-ink/75">
                <span>Goals</span>
                <span className="text-plum">{goals.length}</span>
              </li>

              <li className="flex justify-between text-ink/75">
                <span>Journal entries</span>
                <span className="text-plum">{entries.length}</span>
              </li>

              <li className="flex justify-between text-ink/75">
                <span>Daily habits</span>
                <span className="text-plum">{habits.length}</span>
              </li>

              <li className="flex justify-between text-ink/75">
                <span>Days with affirmations</span>
                <span className="text-plum">{recordedDays}</span>
              </li>
            </ul>

            <p className="mt-4 border-t border-ink/8 pt-3 text-[11px] leading-relaxed text-fog">
              Stored privately in this browser. Clearing your browser data will
              remove it.
            </p>
          </section>

          <section className="rounded-3xl border border-destructive/20 bg-white/70 p-6">
            <p className="nv-eyebrow text-destructive/70">Danger zone</p>

            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Clearing removes your goals, entries, habits, favourites and every
              affirmation record.
            </p>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-destructive/30 px-4 py-2 text-xs font-medium text-destructive transition hover:bg-destructive hover:text-white"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
              Clear application data
            </button>
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Clear all data?"
        description="This permanently deletes everything saved in this browser, including your affirmation history. It cannot be undone."
        confirmLabel="Yes, clear everything"
        onConfirm={wipe}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-3xl bg-white/50" />
          <div className="h-80 animate-pulse rounded-3xl bg-white/50" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
