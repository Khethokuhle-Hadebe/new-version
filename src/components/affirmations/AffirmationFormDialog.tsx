"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  AFFIRMATION_CATEGORIES,
  type AffirmationCategory,
} from "@/lib/affirmations";

interface AffirmationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (affirmation: {
    text: string;
    category: AffirmationCategory;
  }) => void;
}

export default function AffirmationFormDialog({
  open,
  onOpenChange,
  onSave,
}: AffirmationFormDialogProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<AffirmationCategory>(
    AFFIRMATION_CATEGORIES[0],
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setText("");
    setCategory(AFFIRMATION_CATEGORIES[0]);
    setError("");
  }, [open]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!text.trim()) {
      setError("Write your affirmation first.");
      return;
    }

    onSave({
      text: text.trim(),
      category,
    });

    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-plum/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="affirmation-dialog-title"
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border-none bg-cream p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              id="affirmation-dialog-title"
              className="font-heading text-2xl text-ink"
            >
              Your own affirmation
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close dialog"
            className="rounded-full p-2 text-ink/50 transition hover:bg-white/60 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="affirmation-text"
                className="nv-eyebrow mb-1.5 block"
              >
                Affirmation
              </label>

              <textarea
                id="affirmation-text"
                rows={3}
                className="nv-input resize-none leading-relaxed"
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  setError("");
                }}
                placeholder="I am becoming someone I trust."
                maxLength={220}
              />
            </div>

            <div>
              <label
                htmlFor="affirmation-category"
                className="nv-eyebrow mb-1.5 block"
              >
                Category
              </label>

              <select
                id="affirmation-category"
                className="nv-input"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as AffirmationCategory)
                }
              >
                {AFFIRMATION_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink/70 transition hover:bg-white/60"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-full bg-plum px-5 py-2 text-sm font-medium text-cream transition hover:bg-plum-soft"
            >
              Save affirmation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
