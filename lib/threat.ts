/**
 * Threat-level bands for the 0-100 gauge.
 * Class names are full static strings so Tailwind can see them at build time.
 */
export type ThreatBand = {
  label: "LOW" | "GUARDED" | "ELEVATED" | "HIGH" | "CRITICAL";
  /** Tailwind text color class */
  text: string;
  /** Raw color for SVG strokes */
  hex: string;
};

export function threatBand(value: number): ThreatBand {
  if (value >= 85) return { label: "CRITICAL", text: "text-alert", hex: "#FF2E63" };
  if (value >= 70) return { label: "HIGH", text: "text-alert", hex: "#FF2E63" };
  if (value >= 50) return { label: "ELEVATED", text: "text-warn", hex: "#FFB800" };
  if (value >= 25) return { label: "GUARDED", text: "text-cyan", hex: "#00F0FF" };
  return { label: "LOW", text: "text-ok", hex: "#39FF14" };
}
