"use client";

/**
 * Global search box. Phase 1: UI only (no results yet).
 * Press "/" anywhere to focus it, Escape to leave.
 */
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

export function GlobalSearch() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-dim" />
      <input
        ref={inputRef}
        type="search"
        aria-label="Search IPs, hashes, sessions, commands"
        placeholder="Search IP, hash, session, command…"
        onKeyDown={(e) => e.key === "Escape" && e.currentTarget.blur()}
        className="h-9 w-full rounded-md border border-line bg-canvas/60 pr-10 pl-9 text-sm text-ink placeholder:text-ink-dim outline-none transition-[border-color,box-shadow] focus:border-cyan/50 focus:shadow-glow-cyan [&::-webkit-search-cancel-button]:hidden"
      />
      <kbd className="data pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-line px-1.5 text-[10px] text-ink-dim">
        /
      </kbd>
    </form>
  );
}
