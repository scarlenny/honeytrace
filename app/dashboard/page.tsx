import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Command Deck" };

export default function CommandDeckPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations / Command Deck"
        title="Command Deck"
        description="Situational overview of honeypot activity, threat level, and the sessions that need an analyst's eyes."
      />
      <ComingSoon
        planned={[
          "KPI row: sessions, unique attacker IPs, critical classifications, classifier confidence",
          "Attack volume timeline with event-type breakdown",
          "Top source IPs and countries",
          "Most recent critical sessions, one click from session detail",
        ]}
      />
    </div>
  );
}
