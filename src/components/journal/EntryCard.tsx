import { Heart, Pencil, Trash2 } from "lucide-react";
import type { JournalEntry } from "@/components/journal/EntryEditor";

interface EntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entry: JournalEntry) => void;
}

export default function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const date = new Date(entry.createdDate);

  const label = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="group rounded-3xl border border-white/70 bg-white/80 p-6 transition-all duration-300 hover:shadow-[0_22px_44px_-32px_rgba(36,27,45,0.45)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="nv-eyebrow">{label}</p>

          <h3 className="mt-2 font-heading text-[22px] leading-snug text-ink">
            {entry.title}
          </h3>
        </div>

        <div className="flex shrink-0 gap-1 opacity-70 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(entry)}
            aria-label={`Edit ${entry.title}`}
            className="rounded-full p-2 text-plum/60 transition hover:bg-lilac hover:text-plum"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={1.9} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(entry)}
            aria-label={`Delete ${entry.title}`}
            className="rounded-full p-2 text-plum/60 transition hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
          </button>
        </div>
      </div>

      {entry.body && (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">
          {entry.body}
        </p>
      )}

      {entry.gratitude && (
        <div className="mt-4 rounded-2xl bg-lilac/60 px-4 py-3">
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-plum/60">
            <Heart className="h-3 w-3" strokeWidth={2} />
            Gratitude
          </p>

          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-plum/85">
            {entry.gratitude}
          </p>
        </div>
      )}
    </article>
  );
}
