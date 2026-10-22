"use client";

/**
 * LIVE / DEMO segmented control.
 * DEMO = hardcoded mock data + simulated telemetry (the Phase 1 default).
 * LIVE = real WebSocket feed (Phase 2). Today it reports "no backend".
 */
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useShellUI, type DataMode } from "./shell-context";

const OPTIONS: { value: DataMode; label: string }[] = [
  { value: "live", label: "LIVE" },
  { value: "demo", label: "DEMO" },
];

export function ModeToggle() {
  const { mode, setMode } = useShellUI();

  return (
    <div
      role="radiogroup"
      aria-label="Data source"
      className="relative flex h-8 items-center rounded-md border border-line bg-canvas/60 p-0.5"
    >
      {OPTIONS.map((opt) => {
        const selected = mode === opt.value;
        const isLive = opt.value === "live";
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setMode(opt.value)}
            className={cn(
              "relative flex h-full items-center gap-1.5 rounded-[5px] px-2.5 font-heading text-[11px] font-semibold tracking-[0.16em]",
              "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-cyan/60",
              selected ? (isLive ? "text-alert" : "text-cyan") : "text-ink-dim hover:text-ink",
            )}
          >
            {selected && (
              <motion.span
                layoutId="mode-pill"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                className={cn(
                  "absolute inset-0 rounded-[5px] border",
                  isLive ? "border-alert/40 bg-alert/10" : "border-cyan/40 bg-cyan/10",
                )}
              />
            )}
            <span
              className={cn(
                "relative size-1.5 rounded-full",
                isLive ? "bg-alert" : "bg-cyan",
                selected && isLive && "animate-pulse-dot shadow-glow-alert",
                !selected && "opacity-40",
              )}
            />
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
