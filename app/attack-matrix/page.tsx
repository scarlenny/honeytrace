import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "ATT&CK Matrix" };

export default function AttackMatrixPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Intelligence / ATT&CK Matrix"
        title="ATT&CK Matrix"
        description="Observed attacker behavior mapped to MITRE ATT&CK tactics and techniques."
      />
      <ComingSoon
        planned={[
          "Tactic columns with technique cells, shaded by how often each was observed",
          "Click a technique to list the sessions that used it",
          "Time-range filter to compare periods",
        ]}
      />
    </div>
  );
}
