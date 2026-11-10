import { formatMonthYear } from "@/lib/dates";
import type { MonthSummary } from "@/lib/progress";

interface MonthlyReportProps {
  summary: MonthSummary;
  onPrev: () => void;
  onNext: () => void;
  nextDisabled: boolean;
}

export default function MonthlyReport({
  summary,
  onPrev,
  onNext,
  nextDisabled,
}: MonthlyReportProps) {
  const maxWeek = Math.max(...summary.weeks.map((week) => week.total), 1);

  const monthName = formatMonthYear(summary.days[0].date).split(" ")[0];

  const stats = [
    { label: "Total", value: summary.total },
    { label: "Daily average", value: summary.average },
    { label: "Highest day", value: summary.best.count },
    { label: "Days practised", value: summary.activeDays },
  ];

  return (
    <section className="overflow-hidden rounded-3xl bg-plum p-6 text-cream sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-cream/45">
            Monthly reflection
          </p>

          <h2 className="mt-2 font-heading text-[26px] leading-tight text-cream sm:text-3xl">
            Your {monthName} Affirmation Report
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Earlier report"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-cream/70 transition hover:border-lavender hover:text-cream"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            aria-label="Later report"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-cream/70 transition hover:border-lavender hover:text-cream disabled:opacity-25"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-heading text-3xl leading-none text-lavender">
              {stat.value}
            </p>

            <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-cream/45">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7">
        <p className="text-[10px] uppercase tracking-[0.18em] text-cream/40">
          Week by week
        </p>

        <ul className="mt-3 space-y-2.5">
          {summary.weeks.map((week) => (
            <li key={week.label} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-[11px] text-cream/55">
                {week.label}
              </span>

              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-1.5 rounded-full bg-lavender/90"
                  style={{
                    width: `${Math.round((week.total / maxWeek) * 100)}%`,
                  }}
                />
              </span>

              <span className="w-8 shrink-0 text-right text-[11px] text-cream/70">
                {week.total}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-cream/45">
        {summary.total === 0
          ? "No affirmations were recorded this month. Your next chapter starts whenever you do."
          : `You practised on ${summary.activeDays} day${summary.activeDays === 1 ? "" : "s"}, with your strongest day on the ${summary.best.day} at ${summary.best.count} affirmations. Every record is saved separately, so this report stays available.`}
      </p>
    </section>
  );
}
