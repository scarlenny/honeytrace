/**
 * Display config for each event kind, shared by the session timeline and the
 * attack feed. Every kind has a text label and an icon, so meaning never
 * depends on color alone.
 */
import {
  CircleDot,
  CircleX,
  Download,
  Fingerprint,
  KeyRound,
  Plug,
  ShieldAlert,
  SquareTerminal,
  Unplug,
  type LucideIcon,
} from "lucide-react";
import type { EventKind } from "@/lib/session-view";

export const EVENT_KINDS: Record<EventKind, { label: string; icon: LucideIcon; text: string; dot: string }> = {
  connect: { label: "Connected", icon: Plug, text: "text-ink-dim", dot: "bg-ink-dim" },
  closed: { label: "Disconnected", icon: Unplug, text: "text-ink-dim", dot: "bg-ink-dim" },
  fingerprint: { label: "Client fingerprint", icon: Fingerprint, text: "text-cyan", dot: "bg-cyan/70" },
  "login-failed": { label: "Login failed", icon: KeyRound, text: "text-warn", dot: "bg-warn" },
  "login-success": {
    label: "Login succeeded",
    icon: ShieldAlert,
    text: "text-alert",
    dot: "bg-alert shadow-glow-alert",
  },
  command: { label: "Command entered", icon: SquareTerminal, text: "text-cyan", dot: "bg-cyan shadow-glow-cyan" },
  "command-failed": { label: "Command failed", icon: CircleX, text: "text-warn", dot: "bg-warn" },
  download: { label: "File download", icon: Download, text: "text-alert", dot: "bg-alert shadow-glow-alert" },
  other: { label: "Event", icon: CircleDot, text: "text-ink-dim", dot: "bg-ink-dim" },
};
