/**
 * Chronological event timeline for one session.
 *
 * SAFETY: attacker-supplied strings (commands, credentials, URLs, raw JSON)
 * are rendered only as React text nodes, which React escapes. There is no
 * dangerouslySetInnerHTML, no linkification, and nothing is executed or fetched.
 * URLs are deliberately plain text so a click can't reach a payload host.
 */
import { ListTree, Scissors } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { eventKind, offsetLabel, prettyRaw, rawString, timeOfDayUtc } from "@/lib/session-view";
import type { HoneypotEvent, HoneypotSession } from "@/types/honeypot";
import { EVENT_KINDS } from "./event-kinds";

/** Captured command, shown as inert text with a shell-style prompt. */
function CommandText({ command }: { command: string }) {
  return (
    <pre className="data mt-1.5 rounded-md border border-line bg-canvas/70 px-3 py-2 text-[13px] whitespace-pre-wrap text-ink [overflow-wrap:anywhere]">
      <span aria-hidden className="mr-2 text-ink-muted select-none">
        $
      </span>
      {command}
    </pre>
  );
}

function EventDetail({ event }: { event: HoneypotEvent }) {
  const kind = eventKind(event.eventType);

  if ((kind === "login-failed" || kind === "login-success") && event.username !== null) {
    return (
      <p className="data mt-1 text-[13px] [overflow-wrap:anywhere]">
        <span className="text-ink-dim">user</span> <span className="text-ink">{event.username}</span>
        <span className="mx-2 text-ink-muted">·</span>
        <span className="text-ink-dim">pass</span> <span className="text-ink">{event.password ?? ""}</span>
      </p>
    );
  }

  if ((kind === "command" || kind === "command-failed") && event.command !== null) {
    return (
      <>
        <CommandText command={event.command} />
        {kind === "command-failed" && (
          <p className="mt-1 text-xs text-ink-dim">The honeypot did not recognise this command.</p>
        )}
      </>
    );
  }

  if (kind === "download") {
    const url = rawString(event, "url");
    return (
      <dl className="data mt-1.5 space-y-1 text-[13px]">
        {url && (
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-ink-dim">url</dt>
            {/* Plain text on purpose: not a link, never fetched */}
            <dd className="text-ink [overflow-wrap:anywhere]">{url}</dd>
          </div>
        )}
        {event.fileHash && (
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-ink-dim">sha256</dt>
            <dd className="break-all text-alert">{event.fileHash}</dd>
          </div>
        )}
      </dl>
    );
  }

  // Connection and fingerprint events: Cowrie's own message says it best.
  const message = rawString(event, "message");
  return message ? <p className="data mt-1 text-[13px] text-ink-dim [overflow-wrap:anywhere]">{message}</p> : null;
}

export function EventTimeline({ session }: { session: HoneypotSession }) {
  const hidden = session.eventCount - session.events.length;

  return (
    <Panel title="Event timeline" icon={ListTree} meta={`${session.events.length} events · UTC`} padding="none">
      {session.truncated && (
        <div role="note" className="flex gap-2.5 border-b border-warn/25 bg-warn/[0.06] px-4 py-3 text-sm text-ink">
          <Scissors aria-hidden className="mt-0.5 size-4 shrink-0 text-warn" />
          <p>
            <span className="font-medium text-warn">Partial timeline.</span> Showing the first{" "}
            <span className="data">{session.events.length}</span> of{" "}
            <span className="data">{session.eventCount.toLocaleString("en-US")}</span> recorded events;{" "}
            <span className="data">{hidden.toLocaleString("en-US")}</span> are not included. Counts on this page cover
            only the events shown.
          </p>
        </div>
      )}

      <ol className="relative px-4 py-4">
        {session.events.map((event, i) => {
          const k = EVENT_KINDS[eventKind(event.eventType)];
          const Icon = k.icon;
          const last = i === session.events.length - 1;
          return (
            <li
              key={event.eventId}
              // Phones: rail + content, time shown inline. sm+: dedicated time column.
              className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[7rem_1.25rem_minmax(0,1fr)]"
            >
              {/* Time column (sm and up) */}
              <div className="data hidden pt-0.5 text-right leading-tight sm:block">
                <time dateTime={event.timestamp} className="block text-[12px] text-ink">
                  {timeOfDayUtc(event.timestamp)}
                </time>
                <span className="text-[11px] text-ink-dim">{offsetLabel(session, event)}</span>
              </div>

              {/* Rail: dot + connecting line */}
              <div aria-hidden className="relative flex justify-center">
                {!last && <span className="absolute top-3 bottom-0 w-px bg-line" />}
                <span className={cn("relative mt-1.5 size-2.5 rounded-full ring-4 ring-surface-solid", k.dot)} />
              </div>

              {/* Content */}
              <div className={cn("min-w-0", last ? "pb-1" : "pb-5")}>
                {/* Inline time on phones */}
                <p className="data mb-0.5 text-[11px] text-ink-dim sm:hidden">
                  <time dateTime={event.timestamp} className="text-ink">
                    {timeOfDayUtc(event.timestamp)}
                  </time>{" "}
                  · {offsetLabel(session, event)}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <Icon aria-hidden className={cn("size-3.5 shrink-0", k.text)} />
                  <span className={cn("font-heading text-sm font-medium", k.text)}>{k.label}</span>
                  <code className="data min-w-0 text-[11px] text-ink-dim [overflow-wrap:anywhere]">
                    {event.eventType}
                  </code>
                </div>
                <EventDetail event={event} />
                <details className="group mt-1.5">
                  <summary className="w-fit cursor-pointer list-none rounded font-heading text-[11px] tracking-wide text-ink-dim outline-none select-none hover:text-ink focus-visible:ring-2 focus-visible:ring-cyan/60 [&::-webkit-details-marker]:hidden">
                    <span aria-hidden className="mr-1 inline-block transition-transform group-open:rotate-90">
                      ›
                    </span>
                    Raw event
                  </summary>
                  <pre className="data mt-1.5 max-h-72 overflow-auto rounded-md border border-line bg-canvas/80 p-3 text-[11px] leading-relaxed whitespace-pre-wrap text-ink-dim [overflow-wrap:anywhere]">
                    {prettyRaw(event.raw)}
                  </pre>
                </details>
              </div>
            </li>
          );
        })}
      </ol>

      {session.truncated && (
        <p className="border-t border-line px-4 py-3 text-xs text-ink-dim">
          … {hidden.toLocaleString("en-US")} more events not included in this extract.
        </p>
      )}
    </Panel>
  );
}
