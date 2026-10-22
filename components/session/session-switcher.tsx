/**
 * Quick links between the mock sessions (handy while there is no list view).
 */
import Link from "next/link";
import { Rows3 } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { formatUtc } from "@/lib/session-view";
import type { HoneypotSession } from "@/types/honeypot";

export function SessionSwitcher({ sessions, currentId }: { sessions: HoneypotSession[]; currentId: string }) {
  return (
    <Panel title="Mock sessions" icon={Rows3} meta={`${sessions.length} available`} padding="none">
      <ul className="divide-y divide-line/70">
        {sessions.map((s) => {
          const current = s.sessionId === currentId;
          return (
            <li key={s.sessionId}>
              <Link
                href={`/sessions/${s.sessionId}`}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "block px-4 py-2.5 outline-none transition-colors focus-visible:bg-cyan/[0.06]",
                  current ? "bg-cyan/[0.06]" : "hover:bg-white/[0.03]",
                )}
              >
                <span className={cn("data block text-sm", current ? "text-cyan" : "text-ink")}>{s.sessionId}</span>
                <span className="data block text-[11px] text-ink-dim">
                  {s.srcIp} · {formatUtc(s.startTime).slice(0, 16)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
