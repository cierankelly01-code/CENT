import Link from "next/link";
import type { FleetChair } from "@/lib/fleet/demo";

const STATUS_STYLES: Record<string, { label: string; dot: string; badge: string }> = {
  active:      { label: "Active",      dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
  charging:    { label: "Charging",    dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700" },
  idle:        { label: "Idle",        dot: "bg-ink/30",      badge: "bg-mist/60 text-ink/60" },
  maintenance: { label: "Maintenance", dot: "bg-red-400",     badge: "bg-red-50 text-red-700" },
};

function BatteryBar({ pct, status }: { pct: number; status: string }) {
  if (status === "maintenance") return <span className="font-sans text-xs text-ink/40">—</span>;
  const colour = pct < 20 ? "bg-red-500" : pct < 50 ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-mist">
        <div className={`h-full rounded-full transition-[width] ${colour}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`font-sans text-xs font-medium ${pct < 20 ? "text-red-600" : pct < 50 ? "text-amber-600" : "text-emerald-600"}`}>
        {pct}%
      </span>
    </div>
  );
}

export default function ChairCard({ chair, orgSlug }: { chair: FleetChair; orgSlug: string }) {
  const s = STATUS_STYLES[chair.status] ?? STATUS_STYLES.idle;
  const serviceDate = new Date(chair.nextServiceDate);
  const isServiceSoon = (serviceDate.getTime() - Date.now()) < 1000 * 60 * 60 * 24 * 30;

  return (
    <Link
      href={`/fleet/${orgSlug}/${encodeURIComponent(chair.serial)}`}
      className={`group block rounded-xl border bg-bone p-5 shadow-[0_1px_2px_rgba(26,23,20,0.04)] transition-all hover:shadow-md motion-reduce:transition-none ${
        chair.alert ? "border-amber-200 hover:border-amber-300" : "border-mist hover:border-bronze-deep/30"
      }`}
    >
      {/* Alert banner */}
      {chair.alert && (
        <div className="mb-3 flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2">
          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <p className="font-sans text-xs text-amber-700">{chair.alertMessage}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="font-sans text-xs font-semibold tracking-[0.06em] text-ink/50">{chair.serial}</span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-sans text-[11px] font-semibold ${s.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
          {s.label}
        </span>
      </div>

      <p className="mt-2 font-sans text-sm font-semibold text-ink">{chair.location}</p>
      <p className="font-sans text-xs text-ink/50">{chair.zone}</p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-sans text-xs text-ink/50">Battery</span>
          <BatteryBar pct={chair.batteryPct} status={chair.status} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-sans text-xs text-ink/50">Next service</span>
          <span className={`font-sans text-xs font-medium ${isServiceSoon ? "text-amber-600" : "text-ink/70"}`}>
            {serviceDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      <span className="mt-4 inline-flex items-center gap-1 font-sans text-xs font-medium text-bronze-deep transition-transform group-hover:translate-x-0.5">
        View details <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
