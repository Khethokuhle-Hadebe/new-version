import { relativeDayLabel } from "@/lib/progress";
import type { HistoryEntry } from "@/lib/progress";

interface DailyHistoryProps {
  entries: HistoryEntry[];
}

export default function DailyHistory({ entries }: DailyHistoryProps) {
  if (entries.length === 0) {
    return (
      <section className="nv-card">
        <p className="nv-eyebrow">Daily history</p>

        <p className="mt-3 text-sm leading-relaxed text-fog">
          Your daily totals will appear here from the moment you record your
          first affirmation.
        </p>
      </section>
    );
  }

  return (
    <section className="nv-card">
      <div className="flex items-baseline justify-between">
        <p className="nv-eyebrow">Daily history</p>
        <p className="text-[11px] text-fog">{entries.length} days recorded</p>
      </div>

      <ul className="mt-3 max-h-[340px] divide-y divide-ink/6 overflow-y-auto pr-1">
        {entries.map((entry) => {
          const relative = relativeDayLabel(entry.key);

          return (
            <li
              key={entry.key}
              className="flex items-center justify-between py-2.5"
            >
              <span className="text-sm text-ink/75">
                {relative ||
                  entry.date.toLocaleDateString("en-GB", {
                    weekday: "long",
                  })}

                <span className="ml-2 text-[11px] text-fog">
                  {entry.date.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </span>

              <span className="text-sm font-medium text-plum">
                {entry.count}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
