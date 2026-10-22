/**
 * Core honeypot data model, shared by mock data (Phase 1) and the real
 * Cowrie ingestion pipeline (Phase 2). Kept separate from mock/ so production
 * code never has to import from the mock folder.
 */

export type HoneypotEvent = {
  /** Stable ID for this event. Cowrie has none, so ingestion derives one. */
  eventId: string;
  /** ISO-8601, UTC */
  timestamp: string;
  /** Cowrie event ID, e.g. "cowrie.login.failed" */
  eventType: string;
  username: string | null;
  password: string | null;
  command: string | null;
  /** SHA-256 of a downloaded or uploaded file, when the event has one */
  fileHash: string | null;
  /** The original Cowrie JSON log line, untouched */
  raw: string;
};

export type HoneypotSession = {
  /** Cowrie session ID (12 hex characters) */
  sessionId: string;
  srcIp: string;
  /** null when the geo lookup failed or hasn't run */
  srcGeo: { country: string; city: string } | null;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  /** Total events Cowrie recorded for the session */
  eventCount: number;
  /** true when `events` holds only the first part of the session (eventCount > events.length) */
  truncated: boolean;
  events: HoneypotEvent[];
};
