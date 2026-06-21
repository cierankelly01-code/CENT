import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { DEMO_MODE } from "@/lib/admin/demo";
import { demoSuppliers } from "@/lib/admin/demo-ops";
import StatusBadge from "@/components/staff/StatusBadge";

export const dynamic = "force-dynamic";

export default async function StaffSuppliers() {
  await requireStaff();
  if (!DEMO_MODE) notFound();

  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">Suppliers</h1>
      <p className="mt-2 font-sans text-sm text-ink/70">
        The suppliers you&apos;ve chosen — the AI orders against these.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-mist text-ink/70">
              <th scope="col" className="py-3 pr-4 font-medium">Supplier</th>
              <th scope="col" className="py-3 pr-4 font-medium">Supplies</th>
              <th scope="col" className="py-3 pr-4 font-medium">Lead time</th>
              <th scope="col" className="py-3 pr-4 font-medium">On-time</th>
              <th scope="col" className="py-3 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoSuppliers.map((s) => (
              <tr key={s.name} className="border-b border-mist/60">
                <td className="py-3 pr-4 font-medium text-ink">{s.name}</td>
                <td className="py-3 pr-4 text-ink/80">{s.supplies}</td>
                <td className="py-3 pr-4 text-ink/60">{s.lead}</td>
                <td className="py-3 pr-4 text-ink/80">{s.onTime}</td>
                <td className="py-3 pr-4"><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
