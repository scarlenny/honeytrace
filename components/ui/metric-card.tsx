/**
 * <MetricCard>: one headline number with context.
 *
 *   <MetricCard
 *     label="Sessions (24h)" value={1284}
 *     delta={{ value: 18.2, period: "vs prev 24h" }}
 *     trend={[...12 points]} status="warn"
 *   />
 *
 * Reading order: label + status, then value, then delta, then sparkline.
 * Built on <Panel>. No hooks here, so server pages can render it directly;
 * only the sparkline is a client component.
 */
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMetric, type MetricFormat } from "@/lib/format";
import { Panel } from "./panel";
import { Sparkline } from "./sparkline";

export type MetricStatus = "ok" | "info" | "warn" | "alert" | "idle";

const STATUS: Record<MetricStatus, { dot: string; text: string; label: string; pulse?: boolean }> = {
  ok: { dot: "bg-ok shadow-glow-ok", text: "text-ok", label: "Nominal" },
  info: { dot: "bg-cyan shadow-glow-cyan", text: "text-cyan", label: "Active" },
  warn: { dot: "bg-warn shadow-glow-warn", text: "text-warn", label: "Elevated" },
  alert: { dot: "bg-alert shadow-glow-alert", text: "text-alert", label: "Critical", pulse: true },
  idle: { dot: "bg-ink-muted", text: "text-ink-dim", label: "Idle" },
};

export type MetricCardProps = {
  /** Sentence case, no trailing colon, e.g. "Unique attacker IPs". */
  label: string;
  value: number;
  /** How to print the value (and sparkline tooltips). Default "number" -> 1,284. */
  format?: MetricFormat;
  /** Small suffix after the value, e.g. "events/min". */
  unit?: string;
  /** Percent change vs a named period. Sign gives direction. */
  delta?: { value: number; period: string };
  /**
   * Whether an increase is good news. Defaults to false because most SOC
   * metrics (attacks, critical alerts, cost) are better when they go down.
   */
  higherIsBetter?: boolean;
  /** About 12 points, oldest first. The last point is drawn as "now". */
  trend?: number[];
  /** Tooltip labels for the trend points, e.g. hours. */
  trendLabels?: string[];
  /** Status dot. Always shown with a text label, never color alone. */
  status?: MetricStatus;
  /** Override the default status wording ("Nominal", "Elevated", ...). */
  statusLabel?: string;
  className?: string;
};

export function MetricCard({
  label,
  value,
  format = "number",
  unit,
  delta,
  higherIsBetter = false,
  trend,
  trendLabels,
  status,
  statusLabel,
  className,
}: MetricCardProps) {
  const s = status ? STATUS[status] : null;
  const formatted = formatMetric(value, format);

  // Delta: arrow + sign show direction; color shows whether that direction is good.
  let deltaView = null;
  if (delta) {
    const dir = delta.value > 0 ? "up" : delta.value < 0 ? "down" : "flat";
    const good = dir === "flat" ? null : (dir === "up") === higherIsBetter;
    const Arrow = dir === "up" ? ArrowUpRight : dir === "down" ? ArrowDownRight : Minus;
    const color = good === null ? "text-ink-dim" : good ? "text-ok" : "text-alert";
    const sign = delta.value > 0 ? "+" : "";
    deltaView = (
      <div className="flex items-center gap-1.5 text-xs">
        <span className={cn("data flex items-center gap-0.5 font-medium", color)}>
          <Arrow aria-hidden className="size-3.5" />
          {sign}
          {delta.value.toFixed(1)}%
        </span>
        <span className="text-ink-dim">{delta.period}</span>
      </div>
    );
  }

  // Text version of the sparkline for screen readers.
  const trendSummary =
    trend && trend.length > 1
      ? `Trend over ${trend.length} points: from ${formatMetric(trend[0], format)} to ${formatMetric(
          trend[trend.length - 1],
          format,
        )}.`
      : null;

  return (
    <Panel
      as="article"
      aria-label={label}
      padding="none"
      // A critical metric tints its card so it stands out in a KPI row.
      tone={status === "alert" ? "alert" : "default"}
      className={cn("overflow-hidden", className)}
      bodyClassName="flex flex-col"
    >
      <div className="flex flex-1 flex-col gap-2 px-4 pt-3.5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="micro-label min-w-0 leading-snug">{label}</h3>
          {s && (
            <span className="flex shrink-0 items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full", s.dot, s.pulse && "animate-pulse-dot")} />
              <span className={cn("font-heading text-[10px] font-semibold tracking-[0.14em] uppercase", s.text)}>
                {statusLabel ?? s.label}
              </span>
            </span>
          )}
        </div>

        {/* mt-auto pins value + delta to the bottom, so values line up across a
            KPI row even when one label wraps to two lines */}
        <div className="mt-auto flex items-baseline gap-1.5">
          <span className="data text-3xl leading-none font-semibold tracking-tight text-ink">{formatted}</span>
          {unit && <span className="text-xs text-ink-dim">{unit}</span>}
        </div>

        {deltaView}
      </div>

      {trend && trend.length > 1 && (
        <>
          <p className="sr-only">{trendSummary}</p>
          <Sparkline data={trend} labels={trendLabels} format={format} unit={unit} />
        </>
      )}
    </Panel>
  );
}
