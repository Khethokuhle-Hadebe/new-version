"use client";

import { useEffect, useState } from "react";

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  gratitude: string;
  createdDate: string;
  updatedDate?: string;
}

interface EntryEditorProps {
  initialEntry: JournalEntry | null;
  prompt: string;
  onSave: (data: { title: string; body: string; gratitude: string }) => void;
  onCancel: () => void;
}

export default function EntryEditor({
  initialEntry,
  prompt,
  onSave,
  onCancel,
}: EntryEditorProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setTitle(initialEntry?.title || "");
    setBody(initialEntry?.body || "");
    setGratitude(initialEntry?.gratitude || "");
  }, [initialEntry]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!body.trim() && !gratitude.trim()) {
      setError("Write a reflection or a gratitude note before saving.");
      return;
    }

    onSave({
      title: title.trim() || "Untitled entry",
      body: body.trim(),
      gratitude: gratitude.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="nv-card">
      <p className="nv-eyebrow">
        {initialEntry ? "Editing entry" : "New entry"}
      </p>

      {prompt && !initialEntry && (
        <p className="mt-2 font-heading text-lg italic leading-snug text-plum/80">
          {prompt}
        </p>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="entry-title" className="nv-eyebrow mb-1.5 block">
            Title
          </label>

          <input
            id="entry-title"
            className="nv-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A quiet morning"
          />
        </div>

        <div>
          <label htmlFor="entry-body" className="nv-eyebrow mb-1.5 block">
            Reflection
          </label>

          <textarea
            id="entry-body"
            rows={7}
            className="nv-input resize-y leading-relaxed"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="What is on your mind today?"
          />
        </div>

        <div>
          <label htmlFor="entry-gratitude" className="nv-eyebrow mb-1.5 block">
            Gratitude
          </label>

          <textarea
            id="entry-gratitude"
            rows={3}
            className="nv-input resize-y leading-relaxed"
            value={gratitude}
            onChange={(event) => setGratitude(event.target.value)}
            placeholder="Three things I'm grateful for…"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-4 py-2 text-sm text-ink/70 transition hover:bg-white/60"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-full bg-plum px-5 py-2 text-sm font-medium text-cream transition hover:bg-plum-soft"
        >
          Save entry
        </button>
      </div>
    </form>
  );
}
