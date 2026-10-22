/**
 * Attack Feed: every event from the mock sessions, newest first, with
 * filters. Phase 2 replaces buildFeedRows(mockSessions) with the live stream.
 */
import type { Metadata } from "next";
import { Scissors } from "lucide-react";
import Link from "next/link";
import { FeedTable } from "@/components/feed/feed-table";
import { SimulatedNotice } from "@/components/session/simulated-notice";
import { PageHeader } from "@/components/ui/page-header";
import { buildFeedRows } from "@/lib/feed";
import { mockSessions } from "@/mock/sessions";

export const metadata: Metadata = { title: "Attack Feed" };

export default function AttackFeedPage() {
  const rows = buildFeedRows(mockSessions);
  const sessions = mockSessions.map((s) => ({ sessionId: s.sessionId, srcIp: s.srcIp }));
  const truncated = mockSessions.filter((s) => s.truncated);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations / Attack Feed"
        title="Attack Feed"
        description="Every Cowrie event in the dataset, newest first. Select a session ID to open its full timeline."
      />

      <SimulatedNotice />

      {truncated.length > 0 && (
        <div
          role="note"
          className="flex gap-2.5 rounded-xl border border-warn/25 bg-warn/[0.06] px-4 py-3 text-sm text-ink"
        >
          <Scissors aria-hidden className="mt-0.5 size-4 shrink-0 text-warn" />
          <p>
            <span className="font-medium text-warn">Partial data.</span>{" "}
            {truncated.map((s, i) => (
              <span key={s.sessionId}>
                {i > 0 && "; "}
                Session{" "}
                <Link href={`/sessions/${s.sessionId}`} className="data text-cyan hover:underline">
                  {s.sessionId}
                </Link>{" "}
                recorded <span className="data">{s.eventCount.toLocaleString("en-US")}</span> events, but only the first{" "}
                <span className="data">{s.events.length}</span> are in this feed
              </span>
            ))}
            .
          </p>
        </div>
      )}

      <FeedTable rows={rows} sessions={sessions} />
    </div>
  );
}
