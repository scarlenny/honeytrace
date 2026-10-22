"use client";

/**
 * Animated backdrop behind the whole app.
 *
 * Two grid layers (fine + coarse) drift diagonally at different speeds, and
 * also shift a few pixels with the pointer, at different strengths. Both cues
 * give a subtle sense of depth. A radial mask fades the grid out toward the
 * edges so it never competes with content.
 *
 * Reduced motion: pointer parallax is skipped, and the CSS drift is frozen by
 * the global prefers-reduced-motion rule in globals.css.
 */
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const gridLines = (size: number, color: string) => ({
  backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px),
                    linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
  backgroundSize: `${size}px ${size}px`,
});

const fadeMask = {
  maskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black 35%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black 35%, transparent 100%)",
};

export function GridBackground() {
  const reduce = useReducedMotion();

  // Pointer position normalised to -0.5..0.5, smoothed with a soft spring.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 20 });
  const sy = useSpring(py, { stiffness: 40, damping: 20 });

  const fineX = useTransform(sx, (v) => v * -10);
  const fineY = useTransform(sy, (v) => v * -10);
  const coarseX = useTransform(sx, (v) => v * -24);
  const coarseY = useTransform(sy, (v) => v * -24);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
      {/* Ambient color: cyan from the top left, a hint of alert red bottom right */}
      <div className="absolute -top-40 -left-40 size-[42rem] rounded-full bg-cyan/[0.07] blur-[120px]" />
      <div className="absolute -right-40 -bottom-56 size-[38rem] rounded-full bg-alert/[0.05] blur-[120px]" />

      <div className="absolute inset-0" style={fadeMask}>
        {/* Fine grid: far layer, slow, small pointer response */}
        <motion.div className="absolute -inset-32" style={{ x: fineX, y: fineY }}>
          <div
            className="absolute inset-0 animate-drift-fine will-change-transform"
            style={gridLines(32, "rgb(0 240 255 / 0.035)")}
          />
        </motion.div>

        {/* Coarse grid: near layer, faster, stronger pointer response */}
        <motion.div className="absolute -inset-32" style={{ x: coarseX, y: coarseY }}>
          <div
            className="absolute -inset-32 animate-drift-coarse will-change-transform"
            style={gridLines(128, "rgb(0 240 255 / 0.075)")}
          />
        </motion.div>
      </div>

      {/* Darken the edges slightly so panels near the frame stay readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgb(7_11_20/0.7)_100%)]" />
    </div>
  );
}
