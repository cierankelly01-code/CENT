import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrg, alertCount, FLEET_ORGS } from "@/lib/fleet/demo";
import ChairCard from "@/components/fleet/ChairCard";

export function generateStaticParams() {
  return FLEET_ORGS.map((o) => ({ org: o.slug }));
}

export default async function OrgFleetPage({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  if (!org) notFound();

  const alerts = alertCount(org);
  const byStatus = {
    active: org.chairs.filter((c) => c.status === "active").length,
    charging: org.chairs.filter((c) => c.status === "charging").length,
    idle: org.chairs.filter((c) => c.status === "idle").length,
    maintenance: org.chairs.filter((c) => c.status === "maintenance").length,
  };
  const avgBattery = Math.round(
    org.chairs.filter((c) => c.status !== "maintenance").reduce((s, c) => s + c.batteryPct, 0) /
    Math.max(1, org.chairs.filter((c) => c.status !== "maintenance").length)
  );

  return (
    <div className="container-edge py-12">
      <Link href="/fleet" className="inline-flex items-center gap-1.5 font-sans text-sm text-ink/60 hover:text-ink">
        <span aria-hidden>←</span> All organisations
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">{org.name}</h1>
          <p className="mt-1 font-sans text-sm text-ink/60">{org.type} · {org.chairs.length} chairs</p>
        </div>
        {alerts > 0 && (
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 font-sans text-sm font-semibold text-amber-700">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {alerts} chair{alerts > 1 ? "s" : ""} need attention
          </span>
        )}
      </div>

      {/* Fleet stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Active", value: byStatus.active, colour: "text-emerald-600" },
          { label: "Charging", value: byStatus.charging, colour: "text-blue-600" },
          { label: "Idle", value: byStatus.idle, colour: "text-ink/60" },
          { label: "Maintenance", value: byStatus.maintenance, colour: "text-red-600" },
          { label: "Avg battery", value: `${avgBattery}%`, colour: avgBattery < 20 ? "text-red-600" : avgBattery < 50 ? "text-amber-600" : "text-emerald-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-mist bg-bone p-4 shadow-[0_1px_2px_rgba(26,23,20,0.04)]">
            <div className={`font-display text-2xl font-semibold tracking-[-0.02em] ${stat.colour}`}>{stat.value}</div>
            <div className="mt-1 font-sans text-xs text-ink/50">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chair grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {org.chairs.map((chair) => (
          <ChairCard key={chair.serial} chair={chair} orgSlug={slug} />
        ))}
      </div>
    </div>
  );
}
