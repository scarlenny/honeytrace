import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Panel } from "@/components/ui/panel";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg pt-10">
      <Panel title="Signal lost" icon={WifiOff} tone="alert" meta="HTTP 404" padding="lg">
        <p className="text-sm text-ink">Nothing is listening at this address.</p>
        <p className="mt-1 text-sm text-ink-dim">The page may have moved, or the session ID may not exist.</p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex h-9 items-center rounded-md border border-cyan/40 bg-cyan/10 px-3 font-heading text-sm text-cyan outline-none transition-shadow hover:shadow-glow-cyan focus-visible:ring-2 focus-visible:ring-cyan/60"
        >
          Back to Command Deck
        </Link>
      </Panel>
    </div>
  );
}
