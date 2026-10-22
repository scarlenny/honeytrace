import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Intel Report" };

export default function IntelReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Intelligence / Intel Report"
        title="Intel Report"
        description="AI-written threat-intelligence summary of recent honeypot activity."
      />
      <ComingSoon
        planned={[
          "Executive summary of activity for the selected period",
          "Notable campaigns and attacker techniques",
          "IOC list with copy and export",
          "Print-friendly layout",
        ]}
      />
    </div>
  );
}
