import Link from "next/link";
import { FLEET_ORGS, alertCount } from "@/lib/fleet/demo";

export const dynamic = "force-dynamic";

const ORG_ICONS: Record<string, string> = {
  "nhs-trust": "🏥",
  "city-stadium": "🏟️",
  "riverside-care": "🏡",
};

export default function FleetDashboard() {
  const totalChairs = FLEET_ORGS.reduce((n, o) => n + o.chairs.length, 0);
  const totalAlerts = FLEET_ORGS.reduce((n, o) => n + alertCount(o), 0);

  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">Fleet Dashboard</h1>
      <p className="mt-2 font-sans text-sm text-ink/70">All organisations and their Centaur fleets.</p>

      {/* Summary strip */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-mist bg-bone p-5 shadow-[0_1px_2px_rgba(26,23,20,0.04)]">
          <div className="font-display text-4xl font-semibold tracking-[-0.02em] text-ink">{FLEET_ORGS.length}</div>
          <div className="mt-2 font-sans text-xs font-medium uppercase tracking-[0.14em] text-ink/55">Organisations</div>
        </div>
        <div className="rounded-xl border border-mist bg-bone p-5 shadow-[0_1px_2px_rgba(26,23,20,0.04)]">
          <div className="font-display text-4xl font-semibold tracking-[-0.02em] text-ink">{totalChairs}</div>
          <div className="mt-2 font-sans text-xs font-medium uppercase tracking-[0.14em] text-ink/55">Chairs deployed</div>
        </div>
        <div className={`rounded-xl border p-5 shadow-[0_1px_2px_rgba(26,23,20,0.04)] ${totalAlerts > 0 ? "border-amber-200 bg-amber-50" : "border-mist bg-bone"}`}>
          <div className={`font-display text-4xl font-semibold tracking-[-0.02em] ${totalAlerts > 0 ? "text-amber-700" : "text-ink"}`}>{totalAlerts}</div>
          <div className={`mt-2 font-sans text-xs font-medium uppercase tracking-[0.14em] ${totalAlerts > 0 ? "text-amber-600" : "text-ink/55"}`}>Alerts</div>
        </div>
      </div>

      {/* Org cards */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FLEET_ORGS.map((org) => {
          const alerts = alertCount(org);
          const active = org.chairs.filter((c) => c.status === "active").length;
          const avgBattery = Math.round(
            org.chairs.filter((c) => c.status !== "maintenance").reduce((s, c) => s + c.batteryPct, 0) /
            Math.max(1, org.chairs.filter((c) => c.status !== "maintenance").length)
          );
          return (
            <Link
              key={org.slug}
              href={`/fleet/${org.slug}`}
              className="group rounded-xl border border-mist bg-bone p-6 shadow-[0_1px_2px_rgba(26,23,20,0.04)] transition-all hover:border-bronze-deep/40 hover:shadow-md motion-reduce:transition-none"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl" role="img" aria-label={org.type}>{ORG_ICONS[org.slug] ?? "🏢"}</span>
                {alerts > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 font-sans text-xs font-semibold text-amber-700">
                    {alerts} alert{alerts > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-ink group-hover:text-bronze-deep transition-colors">
                {org.name}
              </h2>
              <p className="mt-0.5 font-sans text-xs text-ink/50">{org.type}</p>
              <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-mist pt-4">
                <div>
                  <dt className="font-sans text-xs text-ink/50">Chairs</dt>
                  <dd className="mt-0.5 font-sans text-base font-semibold text-ink">{org.chairs.length}</dd>
                </div>
                <div>
                  <dt className="font-sans text-xs text-ink/50">Active</dt>
                  <dd className="mt-0.5 font-sans text-base font-semibold text-ink">{active}</dd>
                </div>
                <div>
                  <dt className="font-sans text-xs text-ink/50">Avg battery</dt>
                  <dd className={`mt-0.5 font-sans text-base font-semibold ${avgBattery < 20 ? "text-red-600" : avgBattery < 50 ? "text-amber-600" : "text-emerald-600"}`}>
                    {avgBattery}%
                  </dd>
                </div>
              </dl>
              <span className="mt-4 inline-flex items-center gap-1 font-sans text-sm font-medium text-bronze-deep transition-transform group-hover:translate-x-0.5">
                View fleet <span aria-hidden>→</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
