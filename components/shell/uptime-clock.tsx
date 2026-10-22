"use client";

/**
 * Simulated honeypot sensor uptime, e.g. "14d 06:22:41".
 * The sensor "booted" a fixed offset before page load. Phase 2 will read the
 * real boot time from the backend.
 */
import { useState } from "react";
import { useNow } from "@/lib/clock";

const SIMULATED_UPTIME_AT_LOAD_MS = (((14 * 24 + 6) * 60 + 22) * 60 + 41) * 1000;
const pad = (n: number) => String(n).padStart(2, "0");

function formatUptime(ms: number) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86_400);
  const h = Math.floor((s % 86_400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${pad(h)}:${pad(m)}:${pad(s % 60)}`;
}

export function UptimeClock() {
  const now = useNow();
  // Fix the boot time on the first client tick so the clock counts up steadily.
  const [bootAt, setBootAt] = useState<number | null>(null);
  if (now !== null && bootAt === null) setBootAt(now - SIMULATED_UPTIME_AT_LOAD_MS);

  return (
    <div className="leading-none">
      <div className="micro-label text-[9px]">Sensor uptime</div>
      <div className="data mt-1 text-sm text-ink">
        {now !== null && bootAt !== null ? formatUptime(now - bootAt) : "--d --:--:--"}
      </div>
    </div>
  );
}
