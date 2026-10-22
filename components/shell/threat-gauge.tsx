"use client";

/**
 * Compact semicircular threat gauge for the top bar.
 * The arc uses pathLength=100 so the dash offset maps 1:1 to the score.
 */
import { cn } from "@/lib/utils";
import { threatBand } from "@/lib/threat";
import { useTelemetry } from "./shell-context";

const ARC = "M4 22 A18 18 0 0 1 40 22"; // semicircle, radius 18, inside a 44x26 box

export function ThreatGauge() {
  const { threatLevel } = useTelemetry();
  const band = threatBand(threatLevel);

  return (
    <div
      role="meter"
      aria-label="Threat level"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={threatLevel}
      aria-valuetext={`${threatLevel}, ${band.label}`}
      className="flex items-center gap-2.5"
    >
      <svg viewBox="0 0 44 26" className="h-7 w-11 overflow-visible" aria-hidden>
        <path d={ARC} fill="none" stroke="#1A2436" strokeWidth="4" strokeLinecap="round" />
        {/* Tick marks at the band boundaries: 25 / 50 / 70 / 85 */}
        {[25, 50, 70, 85].map((t) => {
          const a = Math.PI * (1 - t / 100);
          const x1 = 22 + Math.cos(a) * 13.5;
          const y1 = 22 - Math.sin(a) * 13.5;
          const x2 = 22 + Math.cos(a) * 11.5;
          const y2 = 22 - Math.sin(a) * 11.5;
          return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3D4A5C" strokeWidth="1" />;
        })}
        <path
          d={ARC}
          fill="none"
          stroke={band.hex}
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={100 - threatLevel}
          style={{
            transition: "stroke-dashoffset 700ms ease-out, stroke 400ms",
            filter: `drop-shadow(0 0 4px ${band.hex})`,
          }}
        />
      </svg>
      <div className="leading-none">
        <div className="micro-label text-[9px]">Threat</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className={cn("data text-base font-semibold", band.text)}>{threatLevel}</span>
          <span
            className={cn(
              "font-heading text-[10px] font-semibold tracking-[0.14em]",
              band.text,
              band.label === "CRITICAL" && "animate-pulse-dot",
            )}
          >
            {band.label}
          </span>
        </div>
      </div>
    </div>
  );
}
