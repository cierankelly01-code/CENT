import Link from "next/link";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { staffDashboardCounts, staffListEnquiries } from "@/lib/admin/orders";
import GenerateLink from "@/components/staff/GenerateLink";
import StatusBadge from "@/components/staff/StatusBadge";

export const dynamic = "force-dynamic";

export default async function StaffDashboard() {
  await requireStaff();
  const [counts, recent] = await Promise.all([
    staffDashboardCounts(),
    staffListEnquiries(6),
  ]);

  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">Dashboard</h1>
      <p className="mt-2 font-sans text-sm text-ink/70">What&apos;s come in, at a glance.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="New enquiries" value={counts.enquiriesNew} href="/staff/enquiries" />
        <Stat label="Total enquiries" value={counts.enquiriesTotal} href="/staff/enquiries" />
        <Stat label="Submitted builds" value={counts.buildsSubmitted} href="/staff/builds" />
      </div>

      <div className="mt-8">
        <GenerateLink />
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Recent enquiries</h2>
          <Link
            href="/staff/enquiries"
            className="font-sans text-sm text-bronze-deep underline underline-offset-2 hover:text-ink"
          >
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 font-sans text-sm text-ink/70">No enquiries yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-mist/70">
            {recent.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/staff/enquiries/${e.id}`}
                  className="flex items-center justify-between gap-4 py-3 font-sans text-sm transition-colors hover:bg-mist/20 motion-reduce:transition-none"
                >
                  <span className="min-w-0 flex-1 truncate font-medium text-ink">{e.name}</span>
                  <span className="hidden text-ink/55 capitalize sm:inline">{e.enquiry_type}</span>
                  <StatusBadge status={e.status} />
                  <span className="shrink-0 text-ink/50">
                    {new Date(e.created_at).toLocaleDateString("en-GB")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-mist/70 bg-bone p-5 shadow-[0_1px_2px_rgba(26,23,20,0.04)] transition-colors hover:border-bronze-deep/40 motion-reduce:transition-none"
    >
      <div className="font-display text-4xl font-semibold tracking-[-0.02em] text-ink">{value}</div>
      <div className="mt-2 font-sans text-xs font-medium uppercase tracking-[0.14em] text-ink/55">
        {label}
      </div>
    </Link>
  );
}
