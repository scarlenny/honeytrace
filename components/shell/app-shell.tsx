"use client";

/**
 * Persistent application frame:
 *
 *   ┌──────────────── TopBar ────────────────┐
 *   │ NavRail │          <main>              │
 *   │         │       (page content)         │
 *   └─────────────── StatusBar ──────────────┘
 *   + GridBackground behind, Scanlines on top.
 *
 * The frame is exactly one viewport tall; only <main> scrolls.
 */
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { GridBackground } from "./grid-background";
import { NavRail } from "./nav-rail";
import { Scanlines } from "./scanlines";
import { ShellProvider } from "./shell-context";
import { StatusBar } from "./status-bar";
import { TopBar } from "./top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user": Framer animations follow the OS reduced-motion setting
    <MotionConfig reducedMotion="user">
      <ShellProvider>
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-cyan px-3 py-2 font-heading text-sm text-canvas focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <GridBackground />
        <div className="relative flex h-dvh flex-col overflow-hidden">
          <TopBar />
          <div className="flex min-h-0 flex-1">
            <NavRail />
            <main id="main" className="relative min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
              {children}
            </main>
          </div>
          <StatusBar />
        </div>
        <Scanlines />
      </ShellProvider>
    </MotionConfig>
  );
}
