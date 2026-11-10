import Link from "next/link";
import { Heart, Shuffle, ArrowUpRight } from "lucide-react";

import type { Affirmation } from "@/lib/affirmations";

interface DailyAffirmationProps {
  affirmation: Affirmation | null;
  isFavourite: boolean;
  onFavourite: (id: string) => void;
  onShuffle: () => void;
}

export default function DailyAffirmation({
  affirmation,
  isFavourite,
  onFavourite,
  onShuffle,
}: DailyAffirmationProps) {
  if (!affirmation) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-lilac p-6 sm:p-8">
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border border-white/50"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-white/30 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="nv-eyebrow text-plum/55">Today&apos;s affirmation</p>
            <p className="mt-1 text-xs text-plum/45">{affirmation.category}</p>
          </div>

          <button
            type="button"
            onClick={() => onFavourite(affirmation.id)}
            aria-pressed={isFavourite}
            aria-label={
              isFavourite ? "Remove from favourites" : "Save to favourites"
            }
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
              isFavourite
                ? "border-plum/20 bg-plum text-lavender"
                : "border-plum/15 bg-white/60 text-plum/60 hover:border-plum/30 hover:text-plum"
            }`}
          >
            <Heart
              className={`h-[18px] w-[18px] ${
                isFavourite ? "fill-lavender" : ""
              }`}
              strokeWidth={1.8}
            />
          </button>
        </div>

        <p className="mt-6 max-w-2xl font-heading text-[26px] leading-[1.28] text-plum sm:text-[32px]">
          &ldquo;{affirmation.text}&rdquo;
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onShuffle}
            className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2.5 text-sm font-medium text-cream transition-all duration-200 hover:bg-plum-soft active:scale-[0.98]"
          >
            <Shuffle className="h-4 w-4" strokeWidth={1.8} />
            Shuffle
          </button>

          <Link
            href="/affirmations"
            className="inline-flex items-center gap-2 rounded-full border border-plum/20 px-5 py-2.5 text-sm font-medium text-plum/80 transition-all duration-200 hover:border-plum/40 hover:text-plum"
          >
            Browse library
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </section>
  );
}
