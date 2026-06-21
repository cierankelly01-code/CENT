import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { DEMO_MODE } from "@/lib/admin/demo";
import { demoParts } from "@/lib/admin/demo-ops";
import StatusBadge from "@/components/staff/StatusBadge";

export const dynamic = "force-dynamic";

export default async function StaffInventory() {
  await requireStaff();
  if (!DEMO_MODE) notFound();

  const needs = demoParts.filter((p) => p.status !== "In stock").length;

  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
        Inventory &amp; parts
      </h1>
      <p className="mt-2 font-sans text-sm text-ink/70">
        {demoParts.length} components · {needs} need ordering.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-mist text-ink/70">
              <th scope="col" className="py-3 pr-4 font-medium">Part</th>
              <th scope="col" className="py-3 pr-4 font-medium">Supplier</th>
              <th scope="col" className="py-3 pr-4 font-medium">In stock</th>
              <th scope="col" className="py-3 pr-4 font-medium">Reorder at</th>
              <th scope="col" className="py-3 pr-4 font-medium">On order</th>
              <th scope="col" className="py-3 pr-4 font-medium">Lead</th>
              <th scope="col" className="py-3 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoParts.map((p) => (
              <tr key={p.sku} className="border-b border-mist/60">
                <td className="py-3 pr-4">
                  <span className="font-medium text-ink">{p.name}</span>
                  <span className="ml-2 font-sans text-xs text-ink/45">{p.sku}</span>
                </td>
                <td className="py-3 pr-4 text-ink/80">{p.supplier}</td>
                <td className="py-3 pr-4 text-ink/80">{p.inStock}</td>
                <td className="py-3 pr-4 text-ink/60">{p.reorderAt}</td>
                <td className="py-3 pr-4 text-ink/60">{p.onOrder}</td>
                <td className="py-3 pr-4 text-ink/60">{p.lead}</td>
                <td className="py-3 pr-4"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
