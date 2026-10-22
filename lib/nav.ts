import {
  Activity,
  FileText,
  Grid3x3,
  LayoutDashboard,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";

import { mockSessions } from "@/mock/sessions";

/**
 * Session the "Session Detail" nav item opens by default: the newest session.
 * Phase 2 swaps the mock list for the latest session from the backend.
 */
export const DEFAULT_SESSION_ID = mockSessions[0].sessionId;

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Decides whether the item is highlighted for the current path. */
  isActive: (pathname: string) => boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Command Deck",
    href: "/dashboard",
    icon: LayoutDashboard,
    isActive: (p) => p === "/dashboard",
  },
  {
    label: "Attack Feed",
    href: "/feed",
    icon: Activity,
    isActive: (p) => p.startsWith("/feed"),
  },
  {
    label: "Session Detail",
    href: `/sessions/${DEFAULT_SESSION_ID}`,
    icon: SquareTerminal,
    isActive: (p) => p.startsWith("/sessions"),
  },
  {
    label: "ATT&CK Matrix",
    href: "/attack-matrix",
    icon: Grid3x3,
    isActive: (p) => p.startsWith("/attack-matrix"),
  },
  {
    label: "Intel Report",
    href: "/report",
    icon: FileText,
    isActive: (p) => p.startsWith("/report"),
  },
];
