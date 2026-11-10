"use client";

import { Suspense, useMemo, useState } from "react";
import { BookOpen, Plus } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EntryEditor from "@/components/journal/EntryEditor";
import EntryCard from "@/components/journal/EntryCard";

import { useCollection } from "@/hooks/useAppData";
import { KEYS } from "@/lib/storage";
import { promptOfTheDay } from "@/lib/affirmations";
import { todayKey } from "@/lib/dates";
import type { JournalEntry } from "@/components/journal/EntryEditor";

function JournalContent() {
  const {
    items: entries,
    setItems: setEntries,
    loaded,
  } = useCollection<JournalEntry[]>(KEYS.entries, []);

  const [composing, setComposing] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JournalEntry | null>(null);
  const [notice, setNotice] = useState("");

  const prompt = useMemo(() => promptOfTheDay(todayKey()), []);

  const sorted = useMemo(
    () => [...entries].sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1)),
    [entries],
  );

  const save = (data: { title: string; body: string; gratitude: string }) => {
    if (editing) {
      setEntries(
        entries.map((entry) =>
          entry.id === editing.id
            ? {
                ...entry,
                ...data,
                updatedDate: new Date().toISOString(),
              }
            : entry,
        ),
      );

      setNotice("Entry updated successfully.");
    } else {
      setEntries([
        {
          ...data,
          id: crypto.randomUUID(),
          createdDate: new Date().toISOString(),
        },
        ...entries,
      ]);

      setNotice("Entry saved successfully.");
    }

    setComposing(false);
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;

    setEntries(entries.filter((entry) => entry.id !== pendingDelete.id));

    setNotice("Entry deleted successfully.");
    setPendingDelete(null);
  };

  const startNewEntry = () => {
    setNotice("");
    setEditing(null);
    setComposing(true);
  };

  const startEditing = (entry: JournalEntry) => {
    setNotice("");
    setEditing(entry);
    setComposing(false);
  };

  const cancelEditing = () => {
    setComposing(false);
    setEditing(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Journal"
        title="A private place to reflect"
        description="No audience, no pressure. Just you and the page."
        action={
          !composing &&
          !editing && (
            <button
              type="button"
              onClick={startNewEntry}
              className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-3 text-sm font-medium text-cream transition-all hover:bg-plum-soft active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              New entry
            </button>
          )
        }
      />

      {notice && (
        <p
          className="mb-5 rounded-2xl bg-lilac/60 px-4 py-3 text-sm text-plum"
          role="status"
        >
          {notice}
        </p>
      )}

      {(composing || editing) && (
        <div className="mb-8">
          <EntryEditor
            initialEntry={editing}
            prompt={prompt}
            onSave={save}
            onCancel={cancelEditing}
          />
        </div>
      )}

      {!loaded ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-3xl bg-white/50"
            />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Your journal is waiting"
          description={`A gentle place to start: “${prompt}”`}
          action={
            <button
              type="button"
              onClick={startNewEntry}
              className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-plum-soft"
            >
              <Plus className="h-4 w-4" />
              Write your first entry
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-fog">
            {sorted.length} {sorted.length === 1 ? "entry" : "entries"} saved on
            this device
          </p>

          {sorted.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={startEditing}
              onDelete={(entry) => {
                setNotice("");
                setPendingDelete(entry);
              }}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
        title="Delete this entry?"
        description="This reflection will be removed from your journal permanently."
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-white/50" />
          <div className="h-40 animate-pulse rounded-3xl bg-white/50" />
        </div>
      }
    >
      <JournalContent />
    </Suspense>
  );
}
