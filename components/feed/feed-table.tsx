"use client";

/**
 * Attack Feed table with client-side filters: event kind, session, free-text
 * search, and sort order. The dataset is small (mock), so filtering is done
 * in memory on every keystroke.
 *
 * SAFETY: commands, credentials, URLs, and hashes are attacker-supplied text.
 * They are rendered only as React text nodes (escaped). No HTML injection, no
 * links for URLs, nothing executed or fetched. Search is plain substring
 * matching (no regex built from user input).
 */
import Link from "next/link";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search, SearchX } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { EVENT_KINDS } from "@/components/session/event-kinds";
import { Panel } from "@/components/ui/panel";
import { KIND_FILTERS, type FeedRow } from "@/lib/feed";
import { formatUtc } from "@/lib/session-view";
import { cn } from "@/lib/utils";

type SessionOption = { sessionId: string; srcIp: string };

/** All the text a row can be found by. */
function haystack(r: FeedRow) {
  return [r.srcIp, r.sessionId, r.eventType, r.username, r.password, r.command, r.fileHash, r.url, r.message]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
}

function Detail({ row }: { row: FeedRow }) {
  if (row.username !== null) {
    return (
      <span className="[overflow-wrap:anywhere]">
        <span className="text-ink-dim">user</span> <span className="text-ink">{row.username}</span>
        <span className="mx-2 text-ink-muted">·</span>
        <span className="text-ink-dim">pass</span> <span className="text-ink">{row.password ?? ""}</span>
      </span>
    );
  }
  if (row.command !== null) {
    return (
      <code className="rounded border border-line bg-canvas/70 px-1.5 py-0.5 text-ink [overflow-wrap:anywhere]">
        <span aria-hidden className="mr-1.5 text-ink-muted select-none">
          $
        </span>
        {row.command}
      </code>
    );
  }
  if (row.kind === "download") {
    return (
      <span className="block space-y-0.5">
        {/* Plain text on purpose: not a link, never fetched */}
        {row.url && <span className="block text-ink [overflow-wrap:anywhere]">{row.url}</span>}
        {row.fileHash && <span className="block break-all text-alert">sha256 {row.fileHash}</span>}
      </span>
    );
  }
  return <span className="text-ink-dim [overflow-wrap:anywhere]">{row.message ?? ""}</span>;
}

export function FeedTable({ rows, sessions }: { rows: FeedRow[]; sessions: SessionOption[] }) {
  const ids = useId();
  const [kindFilter, setKindFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [newestFirst, setNewestFirst] = useState(true);

  // Precompute search text once per dataset, not per keystroke.
  const indexed = useMemo(() => rows.map((r) => ({ row: r, text: haystack(r) })), [rows]);

  const visible = useMemo(() => {
    const kinds = KIND_FILTERS.find((f) => f.id === kindFilter)?.kinds ?? null;
    const q = query.trim().toLowerCase();
    const out = indexed
      .filter(({ row, text }) => {
        if (kinds && !kinds.includes(row.kind)) return false;
        if (sessionFilter !== "all" && row.sessionId !== sessionFilter) return false;
        if (q && !text.includes(q)) return false;
        return true;
      })
      .map(({ row }) => row);
    return newestFirst ? out : out.reverse();
  }, [indexed, kindFilter, sessionFilter, query, newestFirst]);

  const filtersActive = kindFilter !== "all" || sessionFilter !== "all" || query.trim() !== "";
  const reset = () => {
    setKindFilter("all");
    setSessionFilter("all");
    setQuery("");
  };

  return (
    <Panel title="Event stream" meta="Mock dataset · UTC" padding="none">
      {/* ---- Filter bar ---- */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
        <div role="group" aria-label="Event type" className="flex flex-wrap gap-1.5">
          {KIND_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={kindFilter === f.id}
              onClick={() => setKindFilter(f.id)}
              className={cn(
                "h-7 rounded-md border px-2.5 font-heading text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-cyan/60",
                kindFilter === f.id
                  ? "border-cyan/40 bg-cyan/10 text-cyan"
                  : "border-line text-ink-dim hover:border-ink-muted hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <label htmlFor={`${ids}-session`} className="sr-only">
          Session
        </label>
        <select
          id={`${ids}-session`}
          value={sessionFilter}
          onChange={(e) => setSessionFilter(e.target.value)}
          className="data h-7 rounded-md border border-line bg-canvas/60 px-2 text-xs text-ink outline-none focus-visible:border-cyan/50 focus-visible:ring-2 focus-visible:ring-cyan/40"
        >
          <option value="all">All sessions</option>
          {sessions.map((s) => (
            <option key={s.sessionId} value={s.sessionId}>
              {s.sessionId} · {s.srcIp}
            </option>
          ))}
        </select>

        <div className="relative min-w-48 flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-dim"
          />
          <label htmlFor={`${ids}-q`} className="sr-only">
            Filter events by IP, credential, command, or hash
          </label>
          <input
            id={`${ids}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="IP, credential, command, hash…"
            autoComplete="off"
            spellCheck={false}
            className="data h-7 w-full rounded-md border border-line bg-canvas/60 pr-2 pl-8 text-xs text-ink outline-none placeholder:text-ink-dim focus-visible:border-cyan/50 focus-visible:ring-2 focus-visible:ring-cyan/40"
          />
        </div>

        <button
          type="button"
          onClick={() => setNewestFirst((v) => !v)}
          className="flex h-7 items-center gap-1.5 rounded-md border border-line px-2.5 font-heading text-xs text-ink-dim outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-cyan/60"
        >
          {newestFirst ? (
            <ArrowDownWideNarrow aria-hidden className="size-3.5" />
          ) : (
            <ArrowUpNarrowWide aria-hidden className="size-3.5" />
          )}
          {newestFirst ? "Newest first" : "Oldest first"}
        </button>
      </div>

      {/* Result count, announced politely to screen readers as filters change */}
      <p aria-live="polite" className="data border-b border-line/70 px-4 py-2 text-[11px] text-ink-dim">
        Showing {visible.length} of {rows.length} events
        {filtersActive && (
          <button
            type="button"
            onClick={reset}
            className="ml-3 font-heading text-cyan underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-cyan/60"
          >
            Clear filters
          </button>
        )}
      </p>

      {/* ---- Table ---- */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
          <SearchX aria-hidden className="size-6 text-ink-muted" />
          <p className="text-sm text-ink">No events match these filters.</p>
          <button type="button" onClick={reset} className="font-heading text-xs text-cyan hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Phones: stacked cards, so event and detail are visible without sideways scrolling */}
          <ul className="divide-y divide-line/60 md:hidden">
            {visible.map((r) => {
              const k = EVENT_KINDS[r.kind];
              const Icon = k.icon;
              return (
                <li key={r.eventId} className="data space-y-1.5 px-4 py-3 text-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <time dateTime={r.timestamp} className="text-ink">
                      {formatUtc(r.timestamp).replace(" UTC", "")}
                    </time>
                    <Link href={`/sessions/${r.sessionId}`} className="text-cyan underline-offset-2 hover:underline">
                      {r.sessionId}
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    <span className={cn("flex items-center gap-1.5 font-sans text-[13px]", k.text)}>
                      <Icon aria-hidden className="size-3.5 shrink-0" />
                      {k.label}
                    </span>
                    <span className="text-ink-dim">{r.srcIp}</span>
                  </div>
                  <div>
                    <Detail row={r} />
                  </div>
                </li>
              );
            })}
          </ul>

          {/* md and up: full table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <caption className="sr-only">
                Honeypot events from the mock dataset, filtered by the controls above
              </caption>
              <thead>
                <tr className="micro-label text-[10px]">
                  <th scope="col" className="px-4 py-2.5 font-semibold">
                    Time (UTC)
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Session
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Source IP
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Event
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-semibold">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody className="data text-xs">
                {visible.map((r) => {
                  const k = EVENT_KINDS[r.kind];
                  const Icon = k.icon;
                  return (
                    <tr
                      key={r.eventId}
                      className="border-t border-line/60 align-top transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-2.5 whitespace-nowrap text-ink">
                        <time dateTime={r.timestamp}>{formatUtc(r.timestamp).replace(" UTC", "")}</time>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <Link
                          href={`/sessions/${r.sessionId}`}
                          className="text-cyan underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-cyan/60"
                        >
                          {r.sessionId}
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-ink">{r.srcIp}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={cn("flex items-center gap-1.5 font-sans text-[13px]", k.text)}>
                          <Icon aria-hidden className="size-3.5 shrink-0" />
                          {k.label}
                        </span>
                      </td>
                      <td className="max-w-[28rem] px-4 py-2.5">
                        <Detail row={r} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Panel>
  );
}
