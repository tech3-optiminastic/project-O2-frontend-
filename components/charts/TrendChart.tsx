"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface TrendPoint {
  label: string;
  value: number;
}

/** Monochrome area chart used in the marketing preview and the portal dashboard. */
export function TrendChart({
  data,
  height = 220,
  showAxis = false,
}: {
  data: TrendPoint[];
  height?: number;
  showAxis?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111111" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#111111" stopOpacity={0} />
          </linearGradient>
        </defs>
        {showAxis && (
          <>
            <XAxis
              dataKey="label"
              tick={{ fill: "#666666", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis hide />
          </>
        )}
        <Tooltip
          cursor={{ stroke: "#dadada", strokeWidth: 1 }}
          contentStyle={{
            borderRadius: 14,
            border: "1px solid #e7e7e3",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            fontSize: 12,
            boxShadow: "0 20px 40px -24px rgba(17,17,17,0.25)",
          }}
          labelStyle={{ color: "#666666" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#111111"
          strokeWidth={1.6}
          fill="url(#trendFill)"
          dot={false}
          activeDot={{ r: 4, fill: "#111111" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
