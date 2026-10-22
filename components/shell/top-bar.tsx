"use client";

import { GlobalSearch } from "./global-search";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { ThreatGauge } from "./threat-gauge";
import { UptimeClock } from "./uptime-clock";

export function TopBar() {
  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-4 border-b border-line bg-sidebar px-4 backdrop-blur-xl">
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

      {/* Hairline of cyan light along the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
    </header>
  );
}
