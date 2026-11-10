import { Sparkles } from "lucide-react";

interface AffirmationCounterProps {
  count: number;
  goal: number;
  onIncrement: () => void;
}

export default function AffirmationCounter({
  count,
  goal,
  onIncrement,
}: AffirmationCounterProps) {
  const pct = goal > 0 ? Math.min(100, Math.round((count / goal) * 100)) : 0;

  return (
    <section className="rounded-3xl bg-plum p-6 text-cream sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cream/45">
            Affirmations today
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="font-heading text-[64px] leading-none text-cream sm:text-[76px]">
              {count}
            </span>

            <span className="pb-2 text-sm text-cream/50">times</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onIncrement}
          className="inline-flex items-center gap-2 rounded-full bg-lavender px-6 py-3.5 text-sm font-medium text-plum shadow-[0_16px_30px_-18px_rgba(185,162,232,0.9)] transition-all duration-200 hover:bg-lavender-soft active:scale-[0.97]"
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.9} />I affirmed again
        </button>
      </div>

      <div className="mt-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-1.5 rounded-full bg-lavender transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-cream/45">
          {goal > 0
            ? `${count} of ${goal} toward today's intention`
            : "Every repetition rewires a little more."}
        </p>
      </div>
    </section>
  );
}
