import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrg, getChair, FLEET_ORGS } from "@/lib/fleet/demo";

export function generateStaticParams() {
  return FLEET_ORGS.flatMap((o) =>
    o.chairs.map((c) => ({ org: o.slug, serial: c.serial }))
  );
}

const STATUS_STYLES: Record<string, { label: string; badge: string; dot: string }> = {
  active:      { label: "Active",      badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  charging:    { label: "Charging",    badge: "bg-blue-50 text-blue-700 border-blue-200",          dot: "bg-blue-400" },
  idle:        { label: "Idle",        badge: "bg-mist/60 text-ink/60 border-mist",               dot: "bg-ink/30" },
  maintenance: { label: "Maintenance", badge: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-500" },
};

export default async function ChairDetailPage({ params }: { params: Promise<{ org: string; serial: string }> }) {
  const { org: slug, serial: serialParam } = await params;
  const serial = decodeURIComponent(serialParam);
  const org = getOrg(slug);
  const chair = getChair(slug, serial);
  if (!org || !chair) notFound();

  const s = STATUS_STYLES[chair.status] ?? STATUS_STYLES.idle;
  const serviceDate = new Date(chair.nextServiceDate);
  const isServiceSoon = (serviceDate.getTime() - Date.now()) < 1000 * 60 * 60 * 24 * 30;
  const lastActiveDate = new Date(chair.lastActive);

  return (
    <div className="container-edge py-12">
      <Link href={`/fleet/${slug}`} className="inline-flex items-center gap-1.5 font-sans text-sm text-ink/60 hover:text-ink">
        <span aria-hidden>←</span> {org.name} fleet
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">{chair.serial}</h1>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-sm font-semibold ${s.badge}`}>
              <span className={`h-2 w-2 rounded-full ${s.dot}`} aria-hidden="true" />
              {s.label}
            </span>
          </div>
          <p className="mt-1 font-sans text-sm text-ink/60">{chair.location} · {chair.zone} · {org.name}</p>
        </div>
      </div>

      {/* Alert */}
      {chair.alert && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-sans text-sm font-semibold text-amber-800">Action required</p>
            <p className="mt-0.5 font-sans text-sm text-amber-700">{chair.alertMessage}</p>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Battery */}
        <div className="rounded-xl border border-mist bg-bone p-6 shadow-[0_1px_2px_rgba(26,23,20,0.04)]">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">Battery</p>
          {chair.status === "maintenance" ? (
            <p className="mt-4 font-sans text-sm text-ink/40">Not available during maintenance</p>
          ) : (
            <>
              <div className={`mt-4 font-display text-5xl font-semibold tracking-[-0.02em] ${chair.batteryPct < 20 ? "text-red-600" : chair.batteryPct < 50 ? "text-amber-500" : "text-emerald-600"}`}>
                {chair.batteryPct}%
              </div>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-mist">
                <div
                  className={`h-full rounded-full transition-[width] ${chair.batteryPct < 20 ? "bg-red-500" : chair.batteryPct < 50 ? "bg-amber-400" : "bg-emerald-500"}`}
                  style={{ width: `${chair.batteryPct}%` }}
                  role="progressbar"
                  aria-valuenow={chair.batteryPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Battery level"
                />
              </div>
              <p className="mt-3 font-sans text-xs text-ink/50">
                {chair.status === "charging" ? "Currently charging" : `Last active ${lastActiveDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} at ${lastActiveDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`}
              </p>
            </>
          )}
        </div>

        {/* Location */}
        <div className="rounded-xl border border-mist bg-bone p-6 shadow-[0_1px_2px_rgba(26,23,20,0.04)]">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">Location</p>
          <p className="mt-4 font-display text-2xl font-semibold text-ink">{chair.location}</p>
          <p className="mt-1 font-sans text-sm text-ink/60">{chair.zone}</p>
          <p className="mt-4 font-sans text-xs text-ink/50">
            Last active{" "}
            {lastActiveDate.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
            {" "}at{" "}
            {lastActiveDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        {/* Service */}
        <div className={`rounded-xl border p-6 shadow-[0_1px_2px_rgba(26,23,20,0.04)] ${isServiceSoon ? "border-amber-200 bg-amber-50" : "border-mist bg-bone"}`}>
          <p className={`font-sans text-xs font-semibold uppercase tracking-[0.14em] ${isServiceSoon ? "text-amber-600" : "text-ink/50"}`}>Next service</p>
          <p className={`mt-4 font-display text-2xl font-semibold ${isServiceSoon ? "text-amber-700" : "text-ink"}`}>
            {serviceDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          {isServiceSoon && (
            <p className="mt-2 font-sans text-xs font-medium text-amber-600">Due within 30 days</p>
          )}
          <p className="mt-4 font-sans text-xs text-ink/50">Centaur 6-month service programme</p>
        </div>
      </div>

      {/* Service history */}
      <div className="mt-8 rounded-xl border border-mist bg-bone p-6 shadow-[0_1px_2px_rgba(26,23,20,0.04)]">
        <h2 className="font-display text-lg font-semibold text-ink">Service history</h2>
        <ol className="mt-5 space-y-0">
          {chair.serviceHistory.map((entry, i) => (
            <li key={i} className="flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bronze-deep/10">
                  <svg className="h-3.5 w-3.5 text-bronze-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                </span>
                {i < chair.serviceHistory.length - 1 && (
                  <div className="mt-1 w-px flex-1 bg-mist" aria-hidden="true" />
                )}
              </div>
              <div className="pb-1">
                <p className="font-sans text-sm font-semibold text-ink">{entry.action}</p>
                <p className="mt-0.5 font-sans text-xs text-ink/50">
                  {new Date(entry.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  {" · "}
                  {entry.tech}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
