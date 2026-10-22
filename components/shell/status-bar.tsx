"use client";

/**
 * Bottom status strip: WebSocket state, events ingested, last AI call, est. cost.
 * Deliberately NOT an aria-live region: it updates every ~1.5s, which would
 * flood screen readers. The values are still readable on demand.
 */
import { Bot, Coins, Database } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/clock";
import { useShellUI, useTelemetry, type WsState } from "./shell-context";

const WS_DISPLAY: Record<WsState, { label: string; dot: string; text: string; pulse?: boolean }> = {
  simulated: { label: "SIMULATED", dot: "bg-cyan shadow-glow-cyan", text: "text-cyan" },
  connecting: { label: "CONNECTING…", dot: "bg-warn shadow-glow-warn", text: "text-warn", pulse: true },
  open: { label: "OPEN", dot: "bg-ok shadow-glow-ok", text: "text-ok", pulse: true },
  offline: { label: "OFFLINE · NO BACKEND", dot: "bg-alert shadow-glow-alert", text: "text-alert" },
};

const utcTime = (ms: number) => new Date(ms).toISOString().slice(11, 19) + "Z";

function ago(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m}m ago` : `${Math.floor(m / 60)}h ago`;
}

function Item({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 border-r border-line px-3 last:border-r-0", className)}>
      {children}
    </div>
  );
}

const Label = ({ children }: { children: ReactNode }) => (
  <span className="font-heading text-[10px] font-semibold tracking-[0.14em] text-ink-dim">{children}</span>
);

export function StatusBar() {
  const t = useTelemetry();
  const { mode } = useShellUI();
  const now = useNow();
  const ws = WS_DISPLAY[t.wsState];

  return (
    <footer
      aria-label="System status"
      className="data relative z-20 flex h-7 shrink-0 items-center overflow-x-auto border-t border-line bg-sidebar text-[11px] whitespace-nowrap backdrop-blur-xl"
    >
      <Item>
        <span className={cn("size-1.5 rounded-full", ws.dot, ws.pulse && "animate-pulse-dot")} />
        <Label>WS</Label>
        <span className={ws.text}>{ws.label}</span>
      </Item>

      <Item>
        <Database className="size-3 text-ink-dim" aria-hidden />
        <Label>EVENTS</Label>
        <span className="text-ink">{t.eventsIngested.toLocaleString("en-US")}</span>
      </Item>

      <Item>
        <Bot className="size-3 text-ink-dim" aria-hidden />
        <Label>LAST AI CALL</Label>
        {t.lastAiCallAt !== null && now !== null ? (
          <span className="text-ink">
            {utcTime(t.lastAiCallAt)} <span className="text-ink-dim">· {ago(now - t.lastAiCallAt)}</span>
          </span>
        ) : (
          <span className="text-ink-dim">none yet</span>
        )}
      </Item>

      <Item>
        <Coins className="size-3 text-ink-dim" aria-hidden />
        <Label>EST. API COST</Label>
        <span className="text-ink">${t.apiCostUsd.toFixed(4)}</span>
      </Item>

      <div className="ml-auto flex items-center">
        {mode === "demo" && (
          <Item>
            <span className="rounded-sm border border-warn/40 px-1.5 font-heading text-[9px] font-semibold tracking-[0.16em] text-warn">
              MOCK DATA
            </span>
          </Item>
        )}
        <Item className="text-ink-dim">v0.1.0 · PHASE 1</Item>
      </div>
    </footer>
  );
}
