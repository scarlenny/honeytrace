/**
 * Flattens sessions into one row per event for the Attack Feed.
 * Runs on the server; the rows are plain serializable objects so they can be
 * handed to the client-side filter table. Strings are display-only text.
 */
import { eventKind, rawString, type EventKind } from "@/lib/session-view";
import type { HoneypotSession } from "@/types/honeypot";

export type FeedRow = {
  eventId: string;
  timestamp: string;
  sessionId: string;
  srcIp: string;
  eventType: string;
  kind: EventKind;
  username: string | null;
  password: string | null;
  command: string | null;
  fileHash: string | null;
  /** Download URL from the raw line (text only, never linked or fetched) */
  url: string | null;
  /** Cowrie's own message, used for connection and fingerprint events */
  message: string | null;
};

/** Newest first. Ties keep the original event order. */
export function buildFeedRows(sessions: HoneypotSession[]): FeedRow[] {
  const rows = sessions.flatMap((s) =>
    s.events.map((e): FeedRow => ({
      eventId: e.eventId,
      timestamp: e.timestamp,
      sessionId: s.sessionId,
      srcIp: s.srcIp,
      eventType: e.eventType,
      kind: eventKind(e.eventType),
      username: e.username,
      password: e.password,
      command: e.command,
      fileHash: e.fileHash,
      url: rawString(e, "url"),
      message: rawString(e, "message"),
    })),
  );
  return rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp) || b.eventId.localeCompare(a.eventId));
}

/** Kind groups offered as filter chips. */
export const KIND_FILTERS: { id: string; label: string; kinds: EventKind[] | null }[] = [
  { id: "all", label: "All", kinds: null },
  { id: "logins", label: "Logins", kinds: ["login-failed", "login-success"] },
  { id: "commands", label: "Commands", kinds: ["command", "command-failed"] },
  { id: "downloads", label: "Downloads", kinds: ["download"] },
  { id: "connections", label: "Connections", kinds: ["connect", "closed", "fingerprint"] },
];
