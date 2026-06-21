import Link from "next/link";
import GenerateLink from "@/components/staff/GenerateLink";
import {
  IS_LEADERSHIP,
  demoKpisOps,
  demoKpisFinance,
  demoMonthly,
  demoPipeline,
  demoActivity,
  demoStock,
  demoIntegrations,
  type Kpi,
} from "@/lib/admin/demo";

// Rich, enterprise-style staff dashboard from sample data (DEMO_MODE). Operational metrics
// show for everyone; financials are gated to the Leadership role. Purely presentational.
export default function DemoDashboard() {
  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">Dashboard</h1>
      <p className="mt-2 font-sans text-sm text-ink/70">Your business at a glance.</p>

      {/* Operational KPIs — everyone */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {demoKpisOps.map((k) => (
          <KpiCard key={k.label} k={k} />
        ))}
      </div>

      {/* Finance — leadership only */}
      {IS_LEADERSHIP && (
        <section className="mt-6 rounded-xl border border-bronze-deep/20 bg-bronze-deep/[0.04] p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-bronze-deep">
            Leadership · finance
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {demoKpisFinance.map((k) => (
              <KpiCard key={k.label} k={k} />
            ))}
          </div>
          <div className="mt-5">
            <h2 className="font-display text-lg font-semibold text-ink">Revenue — last 6 months</h2>
            <RevenueChart />
          </div>
        </section>
      )}

      {/* Generate link + integrations */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GenerateLink />
        <section className="rounded-xl border border-mist/70 bg-bone p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Integrations</h2>
          <ul className="mt-4 space-y-3">
            {demoIntegrations.map((i) => (
              <li key={i.name} className="flex items-center justify-between gap-3">
                <span>
                  <span className="font-sans text-sm font-medium text-ink">{i.name}</span>
                  <span className="ml-2 font-sans text-xs text-ink/55">{i.detail}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-bronze-deep/30 bg-bronze-deep/10 px-2.5 py-0.5 font-sans text-xs font-medium text-bronze-deep">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-bronze-deep" />
                  {i.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Pipeline */}
      <section className="mt-6 rounded-xl border border-mist/70 bg-bone p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Sales pipeline</h2>
          <Link
            href="/staff/pipeline"
            className="font-sans text-sm text-bronze-deep underline underline-offset-2 hover:text-ink"
          >
            Open board
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {demoPipeline.map((s) => (
            <div key={s.label} className="rounded-lg border border-mist/60 p-3">
              <div className="font-display text-2xl font-semibold text-ink">{s.count}</div>
              <div className="mt-1 font-sans text-xs font-medium text-ink/70">{s.label}</div>
              <div className="font-sans text-xs text-ink/45">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-mist/70 bg-bone p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Recent activity</h2>
          <ul className="mt-4 space-y-3">
            {demoActivity.map((a, i) => (
              <li key={i} className="flex gap-3 font-sans text-sm">
                <span className="w-20 shrink-0 text-ink/45">{a.when}</span>
                <span className="text-ink/80">{a.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-mist/70 bg-bone p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Stock alerts</h2>
          <ul className="mt-4 divide-y divide-mist/60">
            {demoStock.map((s) => (
              <li key={s.part} className="flex items-center justify-between gap-3 py-2.5 font-sans text-sm">
                <span className="text-ink">{s.part}</span>
                <span className="flex items-center gap-3 text-ink/60">
                  <span>
                    {s.inStock} left · {s.lead}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-mist bg-mist/50 px-2 py-0.5 text-xs font-medium text-ink/70">
                    Reorder
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function KpiCard({ k }: { k: Kpi }) {
  return (
    <div className="rounded-xl border border-mist/70 bg-bone p-4 shadow-[0_1px_2px_rgba(26,23,20,0.04)]">
      <div className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{k.value}</div>
      <div className="mt-1 font-sans text-xs font-medium uppercase tracking-[0.12em] text-ink/55">
        {k.label}
      </div>
      <div className="mt-0.5 font-sans text-xs text-ink/45">{k.sub}</div>
    </div>
  );
}

function RevenueChart() {
  const max = Math.max(...demoMonthly.map((m) => m.revenue));
  const W = 600;
  const H = 200;
  const pad = 24;
  const barW = (W - pad * 2) / demoMonthly.length;
  const summary = demoMonthly.map((m) => `${m.month}: £${(m.revenue / 1000).toFixed(0)}k`).join(", ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mt-4 h-48 w-full"
      role="img"
      aria-label={`Revenue by month — ${summary}`}
    >
      {demoMonthly.map((m, i) => {
        const h = ((H - pad * 2) * m.revenue) / max;
        const x = pad + i * barW + barW * 0.18;
        const w = barW * 0.64;
        const y = H - pad - h;
        return (
          <g key={m.month}>
            <rect x={x} y={y} width={w} height={h} rx={4} fill="rgb(var(--color-bronze-deep))" />
            <text x={x + w / 2} y={H - pad + 14} textAnchor="middle" fontSize="11" fill="rgb(var(--color-ink) / 0.6)">
              {m.month}
            </text>
            <text x={x + w / 2} y={y - 6} textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink) / 0.55)">
              £{(m.revenue / 1000).toFixed(0)}k
            </text>
          </g>
        );
      })}
    </svg>
  );
}
