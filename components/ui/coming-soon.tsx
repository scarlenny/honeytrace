/**
 * Placeholder for Phase 1 route stubs: what this view will contain, plus a
 * shimmering skeleton so the page reads as "intentionally pending", not broken.
 */
import { Construction } from "lucide-react";
import { Panel } from "./panel";

type ComingSoonProps = {
  /** What the finished view will show, one short line each. */
  planned: string[];
};

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div className={`relative overflow-hidden rounded-md border border-line/70 bg-canvas/40 ${className}`}>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-cyan/[0.06] to-transparent" />
    </div>
  );
}

export function ComingSoon({ planned }: ComingSoonProps) {
  return (
    <Panel title="Coming soon" icon={Construction} tone="warn" meta="Phase 1 stub" padding="lg">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <p className="text-sm text-ink-dim">
            This view is wired into navigation and the app shell. Its content arrives in a later build step.
          </p>
          <div>
            <h3 className="micro-label mb-2.5 text-[10px]">Planned for this view</h3>
            <ul className="space-y-2">
              {planned.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-ink">
                  <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-cyan shadow-glow-cyan" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skeleton hint of the eventual layout */}
        <div aria-hidden className="grid grid-cols-3 gap-3 max-lg:hidden">
          <SkeletonBlock className="col-span-3 h-16" />
          <SkeletonBlock className="col-span-2 h-32" />
          <SkeletonBlock className="h-32" />
          <SkeletonBlock className="h-10" />
          <SkeletonBlock className="col-span-2 h-10" />
        </div>
      </div>
    </Panel>
  );
}
