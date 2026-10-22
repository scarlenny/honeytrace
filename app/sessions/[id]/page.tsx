/**
 * Session Detail, backed by mock data (Phase 1).
 *
 * 404 handling (no Proxy, no rewrite):
 *  - The three mock IDs are prerendered via generateStaticParams.
 *  - ensureStatic = "navigation" makes Next wait for the complete static result
 *    for any other ID instead of streaming the fallback shell first
 *    (docs: route-segment-config/ensureStatic, "Dynamic route parameters").
 *  - So notFound() below runs before anything is sent, and the response is a
 *    real HTTP 404 rather than a 200 carrying the 404 screen.
 *
 * History: an earlier proxy.ts rewrote unknown IDs to /sessions/not-found. A
 * rewrite built from request.url carries host "localhost", which differs from
 * the server's origin when started with --hostname 127.0.0.1, so Next proxied
 * it over HTTP back to itself; /sessions/not-found then matched the proxy again
 * and looped (hundreds of self-requests per hit, ending in a 500).
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventTimeline } from "@/components/session/event-timeline";
import { SessionSummary } from "@/components/session/session-summary";
import { SessionSwitcher } from "@/components/session/session-switcher";
import { SimulatedNotice } from "@/components/session/simulated-notice";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { countActivity, formatUtc } from "@/lib/session-view";
import { getMockSession, mockSessions } from "@/mock/sessions";

// Requires generateStaticParams and no request-time data (mock data qualifies).
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return mockSessions.map((s) => ({ id: s.sessionId }));
}

export async function generateMetadata({ params }: PageProps<"/sessions/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: getMockSession(id) ? `Session ${id}` : "Session not found" };
}

export default async function SessionDetailPage({ params }: PageProps<"/sessions/[id]">) {
  const { id } = await params;
  const session = getMockSession(id);
  if (!session) notFound();

  const counts = countActivity(session);
  // For truncated sessions, counts describe only the events we have.
  const scope = session.truncated ? `in first ${session.events.length} events` : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Investigation / Session Detail"
        title={
          <>
            Session <span className="data break-all text-cyan">{session.sessionId}</span>
          </>
        }
        description={
          <>
            SSH session from <span className="data text-ink">{session.srcIp}</span>, started{" "}
            <span className="data">{formatUtc(session.startTime)}</span>
          </>
        }
      />

      <SimulatedNotice />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Events recorded"
          value={session.eventCount}
          status={session.truncated ? "warn" : "idle"}
          statusLabel={session.truncated ? "Truncated" : "Complete"}
          unit={session.truncated ? `${session.events.length} shown` : undefined}
        />
        <MetricCard
          label="Login attempts"
          value={counts.loginAttempts}
          unit={scope}
          status={counts.loginSuccesses > 0 ? "alert" : counts.loginAttempts > 0 ? "warn" : "idle"}
          statusLabel={
            counts.loginSuccesses > 0
              ? `${counts.loginSuccesses} succeeded`
              : counts.loginAttempts > 0
                ? "All failed"
                : "None"
          }
        />
        <MetricCard
          label="Commands entered"
          value={counts.commands}
          unit={scope}
          status={counts.commands > 0 ? "info" : "idle"}
          statusLabel={counts.commands > 0 ? "Captured" : "None"}
        />
        <MetricCard
          label="Files downloaded"
          value={counts.downloads}
          unit={scope}
          status={counts.downloads > 0 ? "alert" : "idle"}
          statusLabel={counts.downloads > 0 ? "Payload" : "None"}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <SessionSummary session={session} />
        <SessionSwitcher sessions={mockSessions} currentId={session.sessionId} />
      </div>

      <EventTimeline session={session} />
    </div>
  );
}
