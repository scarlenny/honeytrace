"use client";

/**
 * A boolean UI preference stored in localStorage (e.g. "nav rail collapsed").
 *
 * localStorage can be missing or throw (private windows, blocked storage),
 * so every access is wrapped and the hook falls back to `fallback`.
 * The server snapshot is always `fallback`, which keeps hydration stable.
 */
import { useCallback, useSyncExternalStore } from "react";

const localListeners = new Set<() => void>();

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function usePersistedBoolean(key: string, fallback: boolean) {
  const subscribe = useCallback((listener: () => void) => {
    localListeners.add(listener);
    window.addEventListener("storage", listener); // sync across tabs
    return () => {
      localListeners.delete(listener);
      window.removeEventListener("storage", listener);
    };
  }, []);

  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const value = raw === null ? fallback : raw === "1";

  const setValue = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const current = read(key);
      const prev = current === null ? fallback : current === "1";
      const resolved = typeof next === "function" ? next(prev) : next;
      try {
        window.localStorage.setItem(key, resolved ? "1" : "0");
      } catch {
        /* storage unavailable: preference just won't persist */
      }
      localListeners.forEach((l) => l());
    },
    [key, fallback],
  );

  return [value, setValue] as const;
}
