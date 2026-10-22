/**
 * HoneyTrace wordmark: a hexagon (honeycomb cell) with a trace line through it,
 * plus the name with a neon glow on "Trace".
 */
export function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg
        viewBox="0 0 32 32"
        className="size-7 shrink-0 drop-shadow-[0_0_8px_rgb(0_240_255/0.6)]"
        aria-hidden
      >
        <path
          d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25Z"
          fill="rgb(0 240 255 / 0.08)"
          stroke="#00F0FF"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Trace: a small signal path crossing the cell */}
        <path
          d="M7.5 18h5l2-5 3 8 2-4h5"
          fill="none"
          stroke="#00F0FF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-heading text-lg leading-none font-bold tracking-tight max-sm:sr-only">
        <span className="text-ink">Honey</span>
        <span className="text-cyan text-glow-cyan">Trace</span>
      </span>
    </div>
  );
}
