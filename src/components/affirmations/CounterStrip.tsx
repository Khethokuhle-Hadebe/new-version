"use client";

import { Sparkles } from "lucide-react";

interface CounterStripProps {
  count: number;
  onIncrement: () => void;
}

export default function CounterStrip({
  count,
  onIncrement,
}: CounterStripProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-plum px-6 py-5 text-cream">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/45">
            Today
          </p>

          <p className="font-heading text-4xl leading-none">{count}</p>
        </div>

        <p className="max-w-[180px] text-xs leading-relaxed text-cream/50">
          Repeat an affirmation and tap to record it.
        </p>
      </div>

      <button
        type="button"
        onClick={onIncrement}
        className="inline-flex items-center gap-2 rounded-full bg-lavender px-5 py-3 text-sm font-medium text-plum transition-all hover:bg-lavender-soft active:scale-[0.97]"
      >
        <Sparkles className="h-4 w-4" strokeWidth={1.9} />I affirmed again
      </button>
    </div>
  );
}
