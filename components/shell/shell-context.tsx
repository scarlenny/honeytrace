"use client";

/**
 * Shell state, split into two contexts on purpose:
 *
 *  - ShellUIContext:  mode (LIVE/DEMO) + nav rail collapsed. Changes rarely.
 *  - TelemetryContext: threat level, event counter, AI call stats, WS state.
 *    Ticks every ~1.5s in DEMO mode, so only the widgets that read it re-render.
 *
 * Phase 1 has no backend. DEMO mode runs a small simulator so the shell feels
 * alive; LIVE mode honestly reports "no backend" (WS goes CONNECTING, then OFFLINE).
 * Phase 2 replaces the simulator with a real WebSocket feeding the same shape.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePersistedBoolean } from "@/lib/use-persisted-boolean";

export type DataMode = "live" | "demo";
export type WsState = "simulated" | "connecting" | "open" | "offline";

export type Telemetry = {
  wsState: WsState;
  eventsIngested: number;
  /** 0-100 composite threat score */
  threatLevel: number;
  /** epoch ms of the most recent LLM classification call, null until the first */
  lastAiCallAt: number | null;
  /** running estimate for this browser session, in USD */
  apiCostUsd: number;
};

type ShellUI = {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  navCollapsed: boolean;
  toggleNav: () => void;
};

const ShellUIContext = createContext<ShellUI | null>(null);
const TelemetryContext = createContext<Telemetry | null>(null);

// Deterministic starting values so server and client render the same markup.
const INITIAL_TELEMETRY: Telemetry = {
  wsState: "simulated",
  eventsIngested: 18_432,
  threatLevel: 72,
  lastAiCallAt: null,
  apiCostUsd: 0.0384,
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function ShellProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<DataMode>("demo");
  const [navCollapsed, setNavCollapsed] = usePersistedBoolean("honeytrace.nav.collapsed", false);
  const [telemetry, setTelemetry] = useState<Telemetry>(INITIAL_TELEMETRY);

  const setMode = useCallback((next: DataMode) => {
    setModeState(next);
    setTelemetry((t) => ({ ...t, wsState: next === "demo" ? "simulated" : "connecting" }));
  }, []);

  const toggleNav = useCallback(() => setNavCollapsed((c) => !c), [setNavCollapsed]);

  // --- Telemetry source -------------------------------------------------
  useEffect(() => {
    if (mode === "live") {
      // No backend in Phase 1: give the "connection" a moment, then fail honestly.
      const t = setTimeout(() => setTelemetry((s) => ({ ...s, wsState: "offline" })), 2500);
      return () => clearTimeout(t);
    }

    // DEMO simulator
    const aiCall = () =>
      setTelemetry((s) => ({
        ...s,
        lastAiCallAt: Date.now(),
        apiCostUsd: s.apiCostUsd + 0.0008 + Math.random() * 0.0024,
      }));

    const firstAi = setTimeout(aiCall, 1200);
    const ai = setInterval(aiCall, 15_000);

    const events = setInterval(() => {
      setTelemetry((s) => {
        const burst = Math.random() < 0.05 ? 20 + Math.floor(Math.random() * 25) : 0;
        const trickle = Math.random() < 0.3 ? 0 : 1 + Math.floor(Math.random() * 5);
        return { ...s, eventsIngested: s.eventsIngested + trickle + burst };
      });
    }, 1500);

    const threat = setInterval(() => {
      setTelemetry((s) => ({
        ...s,
        threatLevel: Math.round(clamp(s.threatLevel + (Math.random() - 0.5) * 8, 35, 94)),
      }));
    }, 4000);

    return () => {
      clearTimeout(firstAi);
      clearInterval(ai);
      clearInterval(events);
      clearInterval(threat);
    };
  }, [mode]);

  const ui = useMemo(
    () => ({ mode, setMode, navCollapsed, toggleNav }),
    [mode, setMode, navCollapsed, toggleNav],
  );

  return (
    <ShellUIContext.Provider value={ui}>
      <TelemetryContext.Provider value={telemetry}>{children}</TelemetryContext.Provider>
    </ShellUIContext.Provider>
  );
}

export function useShellUI() {
  const ctx = useContext(ShellUIContext);
  if (!ctx) throw new Error("useShellUI must be used inside <ShellProvider>");
  return ctx;
}

export function useTelemetry() {
  const ctx = useContext(TelemetryContext);
  if (!ctx) throw new Error("useTelemetry must be used inside <ShellProvider>");
  return ctx;
}
