import { FlaskConical } from "lucide-react";
import { Panel } from "@/components/ui/panel";

/** Persistent banner: everything on the page is mock data. Used on Session Detail and Attack Feed. */
export function SimulatedNotice() {
  return (
    <Panel
      as="aside"
      title="Simulated data"
      icon={FlaskConical}
      tone="warn"
      glow="none"
      meta="Mock dataset · no live sensor"
      padding="sm"
      bodyClassName="px-4 pb-3.5"
    >
      <p className="text-sm text-ink-dim">
        This data comes from HoneyTrace&apos;s built-in mock dataset, not a live honeypot. IP addresses are from
        reserved documentation ranges and locations are invented. Commands and URLs are shown as captured text only:
        nothing is executed, fetched, or linked.
      </p>
    </Panel>
  );
}

/** Small inline tag for individual simulated values (e.g. location). */
export function SimulatedTag() {
  return (
    <span className="rounded-sm border border-warn/40 px-1 font-heading text-[9px] font-semibold tracking-[0.14em] text-warn uppercase">
      Simulated
    </span>
  );
}
