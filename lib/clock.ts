"use client";

/**
 * One shared 1-second ticker for every clock-like widget (uptime, "12s ago").
 *
 * Built on useSyncExternalStore so that:
 *  - the server render and the first client render both see `null`
 *    (no hydration mismatch from Date.now()), and
 *  - ten widgets on screen still share a single setInterval.
 */
import { useSyncExternalStore } from "react";

let now = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot() {
  if (!now) now = Date.now();
  return now;
}

function getServerSnapshot() {
  return null;
}

/** Current epoch ms, refreshed every second. `null` during SSR and hydration. */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
