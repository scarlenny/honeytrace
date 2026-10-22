"use client";

import { GlobalSearch } from "./global-search";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { ThreatGauge } from "./threat-gauge";
import { UptimeClock } from "./uptime-clock";
import { useShellUI } from "./shell-context";

export function TopBar() {
  const { mode } = useShellUI();

  return (
    <header className="relative z-30 shrink-0 border-b border-line bg-sidebar backdrop-blur-xl">
      <div className="flex h-14 items-center gap-4 px-4">
        <Logo />
        <ModeToggle />

        <div className="flex min-w-0 flex-1 justify-center max-md:hidden">
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-5 max-md:ml-auto">
          <ThreatGauge />
          <div className="h-7 w-px bg-line max-lg:hidden" />
          <div className="max-lg:hidden">
            <UptimeClock />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line px-4 py-2 text-xs text-ink-dim">
        <span className="shrink-0 rounded-sm border border-warn/40 px-1.5 py-0.5 font-heading text-[10px] font-semibold tracking-wider text-warn">
          {mode === "demo" ? "DEMO DATA" : "LIVE UNAVAILABLE"}
        </span>
        <span>
          {mode === "demo"
            ? "Simulated metrics only. No actual AI calls or charges."
            : "No backend or live analysis. Feed and sessions still use mock data."}
        </span>
      </div>

      {/* Hairline of cyan light along the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
    </header>
  );
}
