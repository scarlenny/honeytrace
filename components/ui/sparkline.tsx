"use client";

/**
 * Tiny trend line for metric cards, built on Recharts.
 * - Line in a softened cyan (de-emphasised); the latest point is the bright accent.
 * - Hover shows a crosshair and a tooltip with the point's label and value.
 * - The chart itself is hidden from screen readers; <MetricCard> provides a
 *   text summary of the trend instead.
 */
import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { formatMetric, type MetricFormat } from "@/lib/format";

type SparklineProps = {
  data: number[];
  /** Optional x labels for the tooltip, same length as data (e.g. "14:00"). */
  labels?: string[];
  format?: MetricFormat;
  unit?: string;
  height?: number;
};

const CYAN = "#00F0FF";

export function Sparkline({ data, labels, format = "number", unit, height = 44 }: SparklineProps) {
  const gradientId = `spark-${useId().replace(/:/g, "")}`;
  const reduceMotion = useReducedMotion();

  const points = data.map((v, i) => ({ i, v, label: labels?.[i] ?? `t-${data.length - 1 - i}` }));
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pad = (max - min || 1) * 0.15; // keep the line off the top and bottom edges
  const last = data.length - 1;

  return (
    <div aria-hidden style={{ height }}>
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 240, height }}>
        <AreaChart data={points} margin={{ top: 6, right: 6, bottom: 2, left: 0 }} accessibilityLayer={false}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CYAN} stopOpacity={0.22} />
              <stop offset="100%" stopColor={CYAN} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[min - pad, max + pad]} />
          <Tooltip
            cursor={{ stroke: "#3D4A5C", strokeWidth: 1 }}
            isAnimationActive={false}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as (typeof points)[number];
              return (
                <div className="rounded-md border border-line bg-surface-solid/95 px-2 py-1 shadow-panel backdrop-blur">
                  <div className="data text-[10px] text-ink-dim">{p.label}</div>
                  <div className="data text-xs text-ink">
                    {formatMetric(p.v, format)}
                    {unit && <span className="ml-1 text-ink-dim">{unit}</span>}
                  </div>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={CYAN}
            strokeOpacity={0.7}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={!reduceMotion}
            animationDuration={700}
            // Only the most recent point gets a dot: the "now" accent.
            dot={(props) => {
              const { cx, cy, index } = props as { cx?: number; cy?: number; index?: number };
              if (index !== last || cx == null || cy == null) return <g key={`d-${index}`} />;
              return (
                <circle
                  key="last"
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={CYAN}
                  stroke="#0E1524"
                  strokeWidth={2}
                  style={{ filter: `drop-shadow(0 0 4px ${CYAN})` }}
                />
              );
            }}
            activeDot={{ r: 3.5, fill: CYAN, stroke: "#0E1524", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
