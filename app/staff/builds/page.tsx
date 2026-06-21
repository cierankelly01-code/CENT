import Link from "next/link";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { staffListBuilds } from "@/lib/configurator/repository";
import { DEMO_MODE, demoBuilds } from "@/lib/admin/demo";
import StatusBadge from "@/components/staff/StatusBadge";

export const dynamic = "force-dynamic";

export default async function StaffBuildsPage() {
  await requireStaff();
  const builds = DEMO_MODE ? demoBuilds : await staffListBuilds();

  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">Builds</h1>
      <p className="mt-2 font-sans text-sm text-ink/70">{builds.length} submitted build(s).</p>

      {builds.length === 0 ? (
        <p className="mt-8 font-sans text-base text-ink/70">No submitted builds yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-mist text-ink/70">
                <th scope="col" className="py-3 pr-4 font-medium">Reference</th>
                <th scope="col" className="py-3 pr-4 font-medium">Name</th>
                <th scope="col" className="py-3 pr-4 font-medium">Email</th>
                <th scope="col" className="py-3 pr-4 font-medium">Status</th>
                <th scope="col" className="py-3 pr-4 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {builds.map((b) => (
                <tr key={b.ref} className="border-b border-mist/60">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/staff/builds/${b.ref}`}
                      className="font-medium text-bronze-deep underline underline-offset-2 hover:text-ink"
                    >
                      {b.ref}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-ink">{b.customer_name ?? "—"}</td>
                  <td className="py-3 pr-4 text-ink/80">{b.customer_email ?? "—"}</td>
                  <td className="py-3 pr-4"><StatusBadge status={b.status} /></td>
                  <td className="py-3 pr-4 text-ink/70">
                    {b.submitted_at ? new Date(b.submitted_at).toLocaleString("en-GB") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
