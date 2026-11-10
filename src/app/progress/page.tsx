"use client";

import { Suspense, useMemo, useState } from "react";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/progress/StatCard";
import WeekPanel from "@/components/progress/WeekPanel";
import MonthPanel from "@/components/progress/MonthPanel";
import MonthlyReport from "@/components/progress/MonthlyReport";
import DailyHistory from "@/components/progress/DailyHistory";

import { useAffirmationCounts } from "@/hooks/useAppData";

import { addDays, startOfWeek } from "@/lib/dates";

import {
  historyEntries,
  monthSummary,
  previousMonth,
  shiftMonth,
  weekSummary,
} from "@/lib/progress";

function ProgressContent() {
  const { counts, todayCount, loaded } = useAffirmationCounts();

  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [reportOffset, setReportOffset] = useState(0);

  const now = new Date();

  const weekAnchor = addDays(startOfWeek(now), weekOffset * 7);

  const week = useMemo(
    () => weekSummary(counts, weekAnchor),
    [counts, weekOffset],
  );

  const month = useMemo(
    () =>
      monthSummary(
        counts,
        new Date(now.getFullYear(), now.getMonth() + monthOffset, 1),
      ),
    [counts, monthOffset],
  );

  const report = useMemo(
    () => monthSummary(counts, shiftMonth(previousMonth(now), reportOffset)),
    [counts, reportOffset],
  );

  const history = useMemo(() => historyEntries(counts), [counts]);

  const currentWeek = weekSummary(counts, now);
  const currentMonth = monthSummary(counts, now);

  return (
    <div>
      <PageHeader
        eyebrow="Progress"
        title="Your practice, over time"
        description="Every figure here is calculated from the daily records saved on this device."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Today"
          value={todayCount}
          hint="affirmations so far"
          tone="plum"
        />

        <StatCard
          label="This week"
          value={currentWeek.total}
          hint="Mon to Sun"
          tone="lilac"
        />

        <StatCard
          label="This month"
          value={currentMonth.total}
          hint={`${currentMonth.activeDays} days practised`}
        />
      </div>

      {!loaded ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-3xl bg-white/50"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <WeekPanel
              summary={week}
              weekOffset={weekOffset}
              onPrev={() => setWeekOffset((v) => v - 1)}
              onNext={() => setWeekOffset((v) => Math.min(0, v + 1))}
            />

            <MonthPanel
              summary={month}
              monthOffset={monthOffset}
              onPrev={() => setMonthOffset((v) => v - 1)}
              onNext={() => setMonthOffset((v) => Math.min(0, v + 1))}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <MonthlyReport
                summary={report}
                onPrev={() => setReportOffset((v) => v - 1)}
                onNext={() => setReportOffset((v) => Math.min(0, v + 1))}
                nextDisabled={reportOffset >= 0}
              />
            </div>

            <div className="lg:col-span-2">
              <DailyHistory entries={history} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense
      fallback={
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-3xl bg-white/50" />
          <div className="h-80 animate-pulse rounded-3xl bg-white/50" />
        </div>
      }
    >
      <ProgressContent />
    </Suspense>
  );
}
