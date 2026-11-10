"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartEntry {
  label: string;
  count: number;
  highlight?: boolean;
}

interface AffirmationBarChartProps {
  data: ChartEntry[];
  height?: number;
  tickInterval?: number;
  compact?: boolean;
}

export default function AffirmationBarChart({
  data,
  height = 190,
  tickInterval = 0,
  compact = false,
}: AffirmationBarChartProps) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 4, bottom: 0, left: -18 }}
          barCategoryGap={compact ? "18%" : "32%"}
        >
          <XAxis
            dataKey="label"
            interval={tickInterval}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#8A7D95" }}
          />

          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={38}
            tick={{ fontSize: 10, fill: "#8A7D95" }}
          />

          <Tooltip
            cursor={{ fill: "rgba(185,162,232,0.12)" }}
            contentStyle={{
              borderRadius: 14,
              border: "none",
              background: "#241B2D",
              color: "#F6F0E6",
              fontSize: 12,
              padding: "8px 12px",
              boxShadow: "0 18px 40px -24px rgba(36,27,45,0.9)",
            }}
            labelStyle={{
              color: "#CDBCEF",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
            formatter={(value) => [`${value} affirmations`, ""]}
          />

          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.label + entry.count}
                fill={
                  entry.highlight
                    ? "#241B2D"
                    : entry.count > 0
                      ? "#B9A2E8"
                      : "#EDE4F6"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
