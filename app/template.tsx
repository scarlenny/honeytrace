"use client";

/**
 * Page transition. A template (unlike a layout) re-mounts when the route's
 * first segment changes, so this enter animation replays on each navigation
 * between top-level views while the shell stays put.
 *
 * Enter-only by design: App Router swaps pages immediately, and exit animations
 * would need private Next.js internals that break between versions.
 *
 * transitionEnd clears transform/filter once the animation finishes. Leaving
 * them set would make this wrapper the containing block for any
 * `position: fixed` element inside a page (modals, toasts).
 *
 * Reduced motion: the markup is identical (so server and client HTML match and
 * hydration stays intact); only the timings change. Movement, blur, and the
 * scan line resolve instantly and just a short opacity fade remains.
 */
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const INSTANT = { duration: 0 };

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transitionEnd: { filter: "none", transform: "none" },
      }}
      transition={
        reduce
          ? { opacity: { duration: 0.15 }, y: INSTANT, filter: INSTANT }
          : { duration: 0.4, ease: EASE_OUT }
      }
    >
      {/* A cyan scan line sweeps across the top as the new view "locks on" */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-3 h-px origin-left bg-gradient-to-r from-cyan/0 via-cyan to-cyan/0"
        initial={{ scaleX: 0, opacity: 1 }} // same on server and client; scaleX 0 is invisible anyway
        animate={{ scaleX: 1, opacity: 0 }}
        transition={reduce ? INSTANT : { duration: 0.7, ease: EASE_OUT }}
      />
      {children}
    </motion.div>
  );
}
