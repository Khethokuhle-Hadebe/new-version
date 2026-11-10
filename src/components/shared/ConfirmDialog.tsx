"use client";

import { useEffect, useState } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      setBusy(false);
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, busy, onOpenChange]);

  if (!open) return null;

  const handleConfirm = () => {
    setBusy(true);

    try {
      onConfirm();
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-plum/35 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) {
          onOpenChange(false);
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md rounded-3xl border-none bg-cream p-6 shadow-2xl"
      >
        <div>
          <h2
            id="confirm-dialog-title"
            className="font-heading text-2xl text-ink"
          >
            {title}
          </h2>

          <p
            id="confirm-dialog-description"
            className="mt-2 text-sm leading-relaxed text-fog"
          >
            {description}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-ink/15 bg-transparent px-4 py-2 text-sm text-ink transition hover:bg-white/60 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={handleConfirm}
            className="rounded-full bg-plum px-5 py-2 text-sm font-medium text-cream transition hover:bg-plum-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
