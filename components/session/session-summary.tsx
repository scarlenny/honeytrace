/**
 * Session facts: source, location, time window, duration, event count.
 */
import { Server } from "lucide-react";
import type { ReactNode } from "react";
import { Panel } from "@/components/ui/panel";
import { formatSessionDuration, formatUtc, rawString } from "@/lib/session-view";
import type { HoneypotSession } from "@/types/honeypot";
import { SimulatedTag } from "./simulated-notice";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="micro-label text-[10px]">{label}</dt>
      <dd className="min-w-0 text-sm text-ink">{children}</dd>
    </div>
  );
}

export function SessionSummary({ session }: { session: HoneypotSession }) {
  const first = session.events[0];
  const sensor = first ? rawString(first, "sensor") : null;
  const version = session.events.find((e) => e.eventType === "cowrie.client.version");
  const clientVersion = version ? rawString(version, "version") : null;

  return (
    <Panel title="Session details" icon={Server} meta={sensor ?? undefined}>
      <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
        <Field label="Source IP">
          <span className="data text-cyan">{session.srcIp}</span>
        </Field>

        <Field label="Location">
          <span className="flex flex-wrap items-center gap-2">
            {session.srcGeo ? (
              <span>
                {session.srcGeo.city}, {session.srcGeo.country}
              </span>
            ) : (
              <span className="text-ink-dim">Unknown (no geo data)</span>
            )}
            <SimulatedTag />
          </span>
        </Field>

        <Field label="Client">
          <span className="data break-all">{clientVersion ?? <span className="text-ink-dim">Not recorded</span>}</span>
        </Field>

        <Field label="Start">
          <time dateTime={session.startTime} className="data">
            {formatUtc(session.startTime)}
          </time>
        </Field>

        <Field label="End">
          <time dateTime={session.endTime} className="data">
            {formatUtc(session.endTime)}
          </time>
        </Field>

        <Field label="Duration · Events">
          <span className="data">
            {formatSessionDuration(session.durationSeconds)}
            <span className="mx-2 text-ink-muted">/</span>
            {session.truncated ? (
              <>
                {session.events.length} <span className="text-ink-dim">of</span>{" "}
                {session.eventCount.toLocaleString("en-US")} <span className="text-warn">(truncated)</span>
              </>
            ) : (
              session.eventCount.toLocaleString("en-US")
            )}
          </span>
        </Field>
      </dl>
    </Panel>
  );
}
