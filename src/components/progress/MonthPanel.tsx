import AffirmationBarChart from "@/components/progress/AffirmationBarChart";
import { formatMonthYear, todayKey } from "@/lib/dates";
import type { MonthSummary } from "@/lib/progress";

interface MonthPanelProps {
  summary: MonthSummary;
  monthOffset: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthPanel({
  summary,
  monthOffset,
  onPrev,
  onNext,
}: MonthPanelProps) {
  const today = todayKey();

  const chartData = summary.days.map((day) => ({
    label: String(day.day),
    count: day.count,
    highlight: day.key === today,
  }));

  const ordinalSuffix =
    summary.best.day === 1
      ? "st"
      : summary.best.day === 2
        ? "nd"
        : summary.best.day === 3
          ? "rd"
          : "th";

  return (
    <section className="nv-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="nv-eyebrow">Monthly progress</p>
          <h2 className="mt-1 font-heading text-2xl text-ink">
            {formatMonthYear(summary.days[0].date)}
            {monthOffset === 0 ? " · This month" : ""}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 text-plum/60 transition hover:border-lavender hover:text-plum"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={monthOffset >= 0}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 text-plum/60 transition hover:border-lavender hover:text-plum disabled:opacity-25"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-6">
        <div>
          <p className="font-heading text-5xl leading-none text-plum">
            {summary.total}
          </p>
          <p className="mt-1 text-xs text-fog">affirmations this month</p>
        </div>

        <div className="flex gap-6 pb-1">
          <div>
            <p className="text-sm font-medium text-ink">{summary.average}</p>
            <p className="text-[11px] text-fog">daily average</p>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">{summary.activeDays}</p>
            <p className="text-[11px] text-fog">days practised</p>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">{summary.best.count}</p>
            <p className="text-[11px] text-fog">best day</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <AffirmationBarChart
          data={chartData}
          tickInterval={4}
          height={180}
          compact
        />
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fog">
        {summary.total === 0
          ? "No records for this month yet."
          : `Calculated from ${summary.activeDays} recorded day${summary.activeDays === 1 ? "" : "s"}. Highest day: the ${summary.best.day}${ordinalSuffix} with ${summary.best.count}.`}
      </p>
    </section>
  );
}
