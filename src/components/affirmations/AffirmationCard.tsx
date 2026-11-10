import { Heart, Trash2 } from "lucide-react";

import type { Affirmation } from "@/lib/affirmations";

interface AffirmationCardProps {
  affirmation: Affirmation;
  isFavourite: boolean;
  onFavourite: (id: string) => void;
  onDelete?: (affirmation: Affirmation) => void;
}

export default function AffirmationCard({
  affirmation,
  isFavourite,
  onFavourite,
  onDelete,
}: AffirmationCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-white/70 bg-white/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-32px_rgba(36,27,45,0.45)]">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-lilac px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-plum/70">
          {affirmation.category}

          {affirmation.custom && (
            <span className="ml-1 normal-case tracking-normal text-plum/45">
              · yours
            </span>
          )}
        </span>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onFavourite(affirmation.id)}
            aria-pressed={isFavourite}
            aria-label={
              isFavourite ? "Remove from favourites" : "Save to favourites"
            }
            className={`rounded-full p-1.5 transition ${
              isFavourite ? "text-plum" : "text-plum/35 hover:text-plum/70"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isFavourite ? "fill-lavender" : ""}`}
              strokeWidth={1.9}
            />
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(affirmation)}
              aria-label={`Delete ${affirmation.text}`}
              className="rounded-full p-1.5 text-plum/30 transition hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 font-heading text-[19px] leading-snug text-ink">
        {affirmation.text}
      </p>
    </article>
  );
}
