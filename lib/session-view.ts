/**
 * Pure, deterministic helpers that turn a HoneypotSession into display values.
 * No AI here: these only count and label what Cowrie recorded.
 * All times are shown in UTC so server and browser render identical text.
 */
import type { HoneypotEvent, HoneypotSession } from "@/types/honeypot";

/** "2026-10-19T06:12:03.118Z" -> "2026-10-19 06:12:03.118 UTC" */
export const formatUtc = (iso: string) => iso.replace("T", " ").replace("Z", " UTC");

/** "2026-10-19T06:12:03.118Z" -> "06:12:03.118" */
export const timeOfDayUtc = (iso: string) => iso.slice(11, 23);

/** Seconds since session start, e.g. "+2.65s" */
export function offsetLabel(session: HoneypotSession, event: HoneypotEvent) {
  const s = (Date.parse(event.timestamp) - Date.parse(session.startTime)) / 1000;
  return `+${s.toFixed(2)}s`;
}

/** Precise duration: "1.6s", "47.3s", "4m 12s" */
export function formatSessionDuration(seconds: number) {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const m = Math.floor(seconds / 60);
  return `${m}m ${String(Math.round(seconds % 60)).padStart(2, "0")}s`;
}

/** Parse Cowrie's raw JSON line. Returns null if it isn't valid JSON. */
export function parseRaw(raw: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** A string field from the raw line, or null. Never evaluated, only displayed. */
export function rawString(event: HoneypotEvent, key: string): string | null {
  const v = parseRaw(event.raw)?.[key];
  return typeof v === "string" ? v : null;
}

/** Raw line pretty-printed for the "Raw event" disclosure. */
export function prettyRaw(raw: string) {
  const parsed = parseRaw(raw);
  return parsed ? JSON.stringify(parsed, null, 2) : raw;
}

export type SessionCounts = {
  loginAttempts: number;
  loginSuccesses: number;
  commands: number;
  downloads: number;
};

/** Counts over the events present. For truncated sessions this is a partial view. */
export function countActivity(session: HoneypotSession): SessionCounts {
  const c: SessionCounts = { loginAttempts: 0, loginSuccesses: 0, commands: 0, downloads: 0 };
  for (const e of session.events) {
    if (e.eventType === "cowrie.login.failed") c.loginAttempts++;
    if (e.eventType === "cowrie.login.success") {
      c.loginAttempts++;
      c.loginSuccesses++;
    }
    if (e.eventType === "cowrie.command.input") c.commands++;
    if (e.eventType === "cowrie.session.file_download") c.downloads++;
  }
  return c;
}

export type EventKind =
  | "connect"
  | "closed"
  | "fingerprint"
  | "login-failed"
  | "login-success"
  | "command"
  | "command-failed"
  | "download"
  | "other";

export function eventKind(eventType: string): EventKind {
  switch (eventType) {
    case "cowrie.session.connect":
      return "connect";
    case "cowrie.session.closed":
      return "closed";
    case "cowrie.client.version":
    case "cowrie.client.kex":
      return "fingerprint";
    case "cowrie.login.failed":
      return "login-failed";
    case "cowrie.login.success":
      return "login-success";
    case "cowrie.command.input":
      return "command";
    case "cowrie.command.failed":
      return "command-failed";
    case "cowrie.session.file_download":
      return "download";
    default:
      return "other";
  }
}
