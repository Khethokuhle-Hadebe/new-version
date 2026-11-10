import AffirmationBarChart from "@/components/progress/AffirmationBarChart";
import { formatShort, todayKey } from "@/lib/dates";
import type { WeekSummary } from "@/lib/progress";

interface WeekPanelProps {
  summary: WeekSummary;
  weekOffset: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function WeekPanel({
  summary,
  weekOffset,
  onPrev,
  onNext,
}: WeekPanelProps) {
  const today = todayKey();

  const chartData = summary.days.map((day) => ({
    label: day.label,
    count: day.count,
    highlight: day.key === today,
  }));

  const label = `${formatShort(summary.start)} – ${formatShort(summary.end)}${
    weekOffset === 0 ? " · This week" : ""
  }`;

  return (
    <section className="nv-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="nv-eyebrow">Weekly progress</p>
          <h2 className="mt-1 font-heading text-2xl text-ink">{label}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous week"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 text-plum/60 transition hover:border-lavender hover:text-plum"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={weekOffset >= 0}
            aria-label="Next week"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 text-plum/60 transition hover:border-lavender hover:text-plum disabled:opacity-25"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-end gap-3">
        <span className="font-heading text-5xl leading-none text-plum">
          {summary.total}
        </span>
        <span className="pb-1 text-xs text-fog">affirmations this week</span>
      </div>

      <div className="mt-4">
        <AffirmationBarChart data={chartData} />
      </div>

      <ul className="mt-2 divide-y divide-ink/6">
        {summary.days.map((day) => (
          <li
            key={day.key}
            className="flex items-center justify-between py-2 text-sm"
          >
            <span
              className={
                day.key === today ? "font-medium text-ink" : "text-ink/70"
              }
            >
              {day.label}
              <span className="ml-2 text-[11px] text-fog">
                {formatShort(day.date)}
              </span>
            </span>

            <span className={day.count ? "text-plum" : "text-fog/60"}>
              {day.count}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-ink/8 pt-3 text-xs leading-relaxed text-fog">
        {summary.total === 0
          ? "No affirmations recorded this week yet — one tap starts the record."
          : `${summary.total} repetitions across the week, averaging ${summary.average} on the days you practised. Strongest day: ${summary.best.label} with ${summary.best.count}.`}
      </p>
    </section>
  );
}
