import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { DEMO_MODE } from "@/lib/admin/demo";
import { demoReorderSuggestions, demoPurchaseOrders } from "@/lib/admin/demo-ops";
import StatusBadge from "@/components/staff/StatusBadge";

export const dynamic = "force-dynamic";

export default async function StaffProcurement() {
  await requireStaff();
  if (!DEMO_MODE) notFound();

  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">Procurement</h1>
      <p className="mt-2 font-sans text-sm text-ink/70">
        AI keeps stock above its reorder points; you approve the supplier and the order.
      </p>

      {/* AI reorder suggestions */}
      <section className="mt-8 rounded-xl border border-bronze-deep/20 bg-bronze-deep/[0.04] p-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-bronze-deep px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wide text-bone">
            AI
          </span>
          <h2 className="font-display text-lg font-semibold text-ink">Reorder suggestions</h2>
        </div>
        <ul className="mt-4 space-y-3">
          {demoReorderSuggestions.map((s, i) => (
            <li
              key={i}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-mist/60 bg-bone p-3"
            >
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium text-ink">
                  {s.part} <span className="font-normal text-ink/55">×{s.qty}</span>
                </p>
                <p className="font-sans text-xs text-ink/55">
                  {s.supplier} · {s.reason}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={s.status} />
                {s.status === "Awaiting approval" && (
                  <span className="inline-flex items-center rounded-full bg-bronze-deep px-3 py-1 font-sans text-xs font-semibold text-bone">
                    Approve
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-sans text-xs text-ink/50">
          Demonstration — in production, approving raises the purchase order automatically.
        </p>
      </section>

      {/* Purchase orders */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">Purchase orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-mist text-ink/70">
                <th scope="col" className="py-3 pr-4 font-medium">PO</th>
                <th scope="col" className="py-3 pr-4 font-medium">Supplier</th>
                <th scope="col" className="py-3 pr-4 font-medium">Items</th>
                <th scope="col" className="py-3 pr-4 font-medium">Total</th>
                <th scope="col" className="py-3 pr-4 font-medium">Status</th>
                <th scope="col" className="py-3 pr-4 font-medium">ETA</th>
              </tr>
            </thead>
            <tbody>
              {demoPurchaseOrders.map((po) => (
                <tr key={po.ref} className="border-b border-mist/60">
                  <td className="py-3 pr-4 font-medium text-ink">{po.ref}</td>
                  <td className="py-3 pr-4 text-ink/80">{po.supplier}</td>
                  <td className="py-3 pr-4 text-ink/80">{po.items}</td>
                  <td className="py-3 pr-4 text-ink/80">{po.total}</td>
                  <td className="py-3 pr-4"><StatusBadge status={po.status} /></td>
                  <td className="py-3 pr-4 text-ink/60">{po.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
