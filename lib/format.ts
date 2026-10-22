/**
 * Number formatting for metrics. Declarative (a string key, not a function)
 * so server pages can pass it to client components like <Sparkline>.
 * Locale is pinned to en-US so server and client output match exactly.
 */
export type MetricFormat = "number" | "compact" | "percent" | "currency" | "duration";

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Seconds -> "38s", "4m 12s", "2h 05m", "3d 4h" */
function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, "0")}s`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${String(m % 60).padStart(2, "0")}m`;
  return `${Math.floor(h / 24)}d ${h % 24}h`;
}

/**
 * @param value  raw number. For "percent" pass 0-100 (e.g. 91.6), not 0-1.
 *               For "duration" pass seconds. For "currency" pass USD.
 */
export function formatMetric(value: number, format: MetricFormat = "number"): string {
  switch (format) {
    case "compact":
      return compact.format(value);
    case "percent":
      return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
    case "currency":
      // API costs are often fractions of a cent, so show 4 decimals below $1
      return `$${value.toFixed(Math.abs(value) < 1 ? 4 : 2)}`;
    case "duration":
      return formatDuration(value);
    default:
      return integer.format(value);
  }
}
