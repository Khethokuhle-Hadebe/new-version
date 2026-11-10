"use client";

import { Suspense, useMemo, useState } from "react";
import { Heart, Plus, Shuffle, Sparkles } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import AffirmationCard from "@/components/affirmations/AffirmationCard";
import AffirmationFormDialog from "@/components/affirmations/AffirmationFormDialog";
import CounterStrip from "@/components/affirmations/CounterStrip";

import {
  AFFIRMATIONS,
  AFFIRMATION_CATEGORIES,
  affirmationOfTheDay,
  type Affirmation,
  type AffirmationCategory,
} from "@/lib/affirmations";

import { todayKey } from "@/lib/dates";
import { KEYS } from "@/lib/storage";
import { useAffirmationCounts, useCollection } from "@/hooks/useAppData";

function AffirmationsContent() {
  const dateKey = todayKey();

  const { items: favourites, setItems: setFavourites } = useCollection<
    string[]
  >(KEYS.favourites, []);

  const { items: custom, setItems: setCustom } = useCollection<Affirmation[]>(
    KEYS.customAffirmations,
    [],
  );

  const { todayCount, increment } = useAffirmationCounts();

  const [featured, setFeatured] = useState<Affirmation>(() =>
    affirmationOfTheDay(dateKey),
  );

  const [category, setCategory] = useState<string>("All");
  const [onlyFavourites, setOnlyFavourites] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const all = useMemo(() => [...custom, ...AFFIRMATIONS], [custom]);

  const list = useMemo(() => {
    let items = all;

    if (onlyFavourites) {
      items = items.filter((affirmation) =>
        favourites.includes(affirmation.id),
      );
    } else if (category !== "All") {
      items = items.filter((affirmation) => affirmation.category === category);
    }

    return items;
  }, [all, category, onlyFavourites, favourites]);

  const addAffirmation = ({
    text,
    category: chosenCategory,
  }: {
    text: string;
    category: AffirmationCategory;
  }) => {
    const entry: Affirmation = {
      id: crypto.randomUUID(),
      text,
      category: chosenCategory,
      custom: true,
      createdDate: new Date().toISOString(),
    };

    setCustom([entry, ...custom]);
    setCategory("All");
    setOnlyFavourites(false);
    setNotice("Affirmation added. It is now part of your library.");
  };

  const removeAffirmation = (affirmation: Affirmation) => {
    setCustom(custom.filter((item) => item.id !== affirmation.id));

    setFavourites(favourites.filter((id) => id !== affirmation.id));

    if (featured.id === affirmation.id) {
      setFeatured(affirmationOfTheDay(dateKey));
    }

    setNotice("Affirmation removed from your library.");
  };

  const toggleFavourite = (id: string) => {
    const isSaved = favourites.includes(id);

    setFavourites(
      isSaved
        ? favourites.filter((favourite) => favourite !== id)
        : [...favourites, id],
    );

    setNotice(isSaved ? "Removed from favourites." : "Added to favourites.");
  };

  const shuffle = () => {
    const pool = all.filter((affirmation) => affirmation.id !== featured.id);

    if (pool.length === 0) return;

    const next = pool[Math.floor(Math.random() * pool.length)];

    setFeatured(next);
  };

  const showAll = () => {
    setCategory("All");
    setOnlyFavourites(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Affirmations"
        title="Words you return to"
        description="A small library of reminders, organised by the season you're in."
        action={
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-3 text-sm font-medium text-cream transition-all hover:bg-plum-soft active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add affirmation
          </button>
        }
      />

      <section className="relative overflow-hidden rounded-3xl bg-lilac p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <p className="nv-eyebrow text-plum/55">
              Featured today · {featured.category}
            </p>

            <p className="mt-4 font-heading text-[26px] leading-[1.28] text-plum sm:text-[32px]">
              &ldquo;{featured.text}&rdquo;
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggleFavourite(featured.id)}
              aria-pressed={favourites.includes(featured.id)}
              aria-label="Toggle favourite"
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                favourites.includes(featured.id)
                  ? "border-plum/20 bg-plum text-lavender"
                  : "border-plum/20 bg-white/60 text-plum/60 hover:text-plum"
              }`}
            >
              <Heart
                className={`h-[18px] w-[18px] ${
                  favourites.includes(featured.id) ? "fill-lavender" : ""
                }`}
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              onClick={shuffle}
              className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-3 text-sm font-medium text-cream transition hover:bg-plum-soft"
            >
              <Shuffle className="h-4 w-4" strokeWidth={1.8} />
              Discover another
            </button>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <CounterStrip count={todayCount} onIncrement={increment} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={showAll}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
            !onlyFavourites && category === "All"
              ? "bg-plum text-cream"
              : "bg-white/70 text-plum/60 hover:bg-white hover:text-plum"
          }`}
        >
          All
        </button>

        {AFFIRMATION_CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setCategory(item);
              setOnlyFavourites(false);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              !onlyFavourites && category === item
                ? "bg-plum text-cream"
                : "bg-white/70 text-plum/60 hover:bg-white hover:text-plum"
            }`}
          >
            {item}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setOnlyFavourites((value) => !value)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
            onlyFavourites
              ? "bg-lavender text-plum"
              : "bg-white/70 text-plum/60 hover:bg-white hover:text-plum"
          }`}
        >
          <Heart
            className={`h-3 w-3 ${onlyFavourites ? "fill-plum" : ""}`}
            strokeWidth={2}
          />
          Favourites ({favourites.length})
        </button>
      </div>

      {notice && (
        <p role="status" className="mt-4 text-sm text-plum/70">
          {notice}
        </p>
      )}

      {list.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-ink/12 bg-white/40 px-6 py-14 text-center">
          <Sparkles className="h-6 w-6 text-lavender" strokeWidth={1.6} />

          <p className="mt-3 font-heading text-xl text-ink">
            {onlyFavourites ? "No favourites yet" : "No affirmations found"}
          </p>

          <p className="mt-1 max-w-sm text-sm text-fog">
            {onlyFavourites
              ? "Tap the heart on any affirmation to keep it close."
              : "Try another category or add your own affirmation."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((affirmation) => (
            <AffirmationCard
              key={affirmation.id}
              affirmation={affirmation}
              isFavourite={favourites.includes(affirmation.id)}
              onFavourite={toggleFavourite}
              onDelete={affirmation.custom ? removeAffirmation : undefined}
            />
          ))}
        </div>
      )}

      <AffirmationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={addAffirmation}
      />
    </div>
  );
}

export default function AffirmationsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6" aria-busy="true">
          <div className="h-24 w-2/3 animate-pulse rounded-3xl bg-white/50" />
          <div className="h-48 animate-pulse rounded-3xl bg-lilac/40" />
          <div className="h-24 animate-pulse rounded-3xl bg-white/50" />
        </div>
      }
    >
      <AffirmationsContent />
    </Suspense>
  );
}
