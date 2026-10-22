/**
 * CRT texture laid over the entire app.
 * - Horizontal scanlines at ~2.5% opacity (1px line every 3px).
 * - A very faint cyan band that sweeps top to bottom every few seconds.
 * pointer-events-none so it never blocks clicks; aria-hidden for screen readers.
 */
export function Scanlines() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgb(230 241 255 / 0.025) 0px, rgb(230 241 255 / 0.025) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 animate-scan bg-gradient-to-b from-transparent via-cyan/[0.025] to-transparent" />
    </div>
  );
}
