import { addDays, toKey, weekDays } from "@/lib/dates";

import {
  historyEntries,
  monthSummary,
  previousMonth,
  relativeDayLabel,
  shiftMonth,
  sumFor,
  weekSummary,
} from "@/lib/progress";

describe("sumFor", () => {
  it("calculates the total affirmation count for selected dates", () => {
    const dates = [
      new Date(2026, 10, 2),
      new Date(2026, 10, 3),
      new Date(2026, 10, 4),
    ];

    const counts = {
      [toKey(dates[0])]: 2,
      [toKey(dates[1])]: 3,
      [toKey(dates[2])]: 1,
    };

    expect(sumFor(counts, dates)).toBe(6);
  });

  it("treats missing dates as zero", () => {
    const dates = [new Date(2026, 10, 2), new Date(2026, 10, 3)];

    const counts = {
      [toKey(dates[0])]: 4,
    };

    expect(sumFor(counts, dates)).toBe(4);
  });
});

describe("weekSummary", () => {
  it("calculates weekly totals, best day and average", () => {
    const date = new Date(2026, 10, 4);

    const days = weekDays(date);

    const counts = {
      [toKey(days[0])]: 2,
      [toKey(days[2])]: 4,
      [toKey(days[4])]: 1,
    };

    const result = weekSummary(counts, date);

    expect(result.days).toHaveLength(7);
    expect(result.total).toBe(7);
    expect(result.best.count).toBe(4);
    expect(result.average).toBe(2);
    expect(result.start).toEqual(new Date(2026, 10, 2));
    expect(result.end).toEqual(new Date(2026, 10, 8));
  });

  it("returns zero totals when no affirmations were recorded", () => {
    const result = weekSummary({}, new Date(2026, 10, 4));

    expect(result.total).toBe(0);
    expect(result.average).toBe(0);
    expect(result.best.count).toBe(0);
  });
});

describe("monthSummary", () => {
  it("calculates monthly totals and activity", () => {
    const counts = {
      "2026-11-02": 2,
      "2026-11-04": 4,
      "2026-11-13": 1,
    };

    const result = monthSummary(counts, new Date(2026, 10, 15));

    expect(result.month).toBe(10);
    expect(result.year).toBe(2026);
    expect(result.days).toHaveLength(30);
    expect(result.total).toBe(7);
    expect(result.activeDays).toBe(3);
    expect(result.average).toBe(2);
    expect(result.best.count).toBe(4);
  });

  it("groups monthly records into weeks", () => {
    const counts = {
      "2026-11-02": 2,
      "2026-11-04": 4,
      "2026-11-13": 1,
    };

    const result = monthSummary(counts, new Date(2026, 10, 15));

    expect(result.weeks.length).toBeGreaterThan(0);

    const weeklyTotal = result.weeks.reduce(
      (total, week) => total + week.total,
      0,
    );

    expect(weeklyTotal).toBe(result.total);
  });
});

describe("historyEntries", () => {
  it("returns recorded entries in newest-first order", () => {
    const counts = {
      "2026-11-01": 2,
      "2026-11-03": 5,
      "2026-11-02": 0,
    };

    const result = historyEntries(counts);

    expect(result).toHaveLength(2);
    expect(result[0].key).toBe("2026-11-03");
    expect(result[1].key).toBe("2026-11-01");
    expect(result[0].count).toBe(5);
  });

  it("returns an empty array when there are no recorded entries", () => {
    expect(historyEntries({})).toEqual([]);
  });
});

describe("relativeDayLabel", () => {
  it("identifies today's date", () => {
    const today = toKey(new Date());

    expect(relativeDayLabel(today)).toBe("Today");
  });

  it("identifies yesterday's date", () => {
    const yesterday = toKey(addDays(new Date(), -1));

    expect(relativeDayLabel(yesterday)).toBe("Yesterday");
  });

  it("returns null for older dates", () => {
    expect(relativeDayLabel("2020-01-01")).toBeNull();
  });
});

describe("previousMonth", () => {
  it("returns the previous month", () => {
    const result = previousMonth(new Date(2026, 10, 15));

    expect(result).toEqual(new Date(2026, 9, 1));
  });

  it("handles the previous year correctly", () => {
    const result = previousMonth(new Date(2026, 0, 15));

    expect(result).toEqual(new Date(2025, 11, 1));
  });
});

describe("shiftMonth", () => {
  it("moves forward by the requested number of months", () => {
    const result = shiftMonth(new Date(2026, 10, 15), 2);

    expect(result).toEqual(new Date(2027, 0, 1));
  });

  it("moves backwards by the requested number of months", () => {
    const result = shiftMonth(new Date(2026, 10, 15), -2);

    expect(result).toEqual(new Date(2026, 8, 1));
  });
});
