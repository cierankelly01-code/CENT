import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { DEMO_MODE } from "@/lib/admin/demo";
import { demoQuotes } from "@/lib/admin/demo-ops";
import StatusBadge from "@/components/staff/StatusBadge";

export const dynamic = "force-dynamic";

export default async function StaffQuotes() {
  await requireStaff();
  if (!DEMO_MODE) notFound();

  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">Quotes</h1>
      <p className="mt-2 font-sans text-sm text-ink/70">
        Personalised quotes generated from each customer&apos;s build.
      </p>

      <div className="mt-8 space-y-4">
        {demoQuotes.map((q) => (
          <section key={q.ref} className="rounded-xl border border-mist/70 bg-bone p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-display text-lg font-semibold text-ink">{q.ref}</span>
                <span className="ml-3 font-sans text-sm text-ink/70">{q.customer}</span>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={q.status} />
                <span className="font-display text-lg font-semibold text-ink">{q.total}</span>
              </div>
            </div>
            <dl className="mt-4 divide-y divide-mist/60">
              {q.lines.map((l) => (
                <div key={l.item} className="flex justify-between gap-4 py-2 font-sans text-sm">
                  <dt className="text-ink/70">
                    {l.item}
                    {l.qty > 1 && <span className="text-ink/45"> ×{l.qty}</span>}
                  </dt>
                  <dd className="font-medium text-ink">{l.price}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 font-sans text-xs text-ink/50">
              Sent {q.sentAt} · valid until {q.validUntil}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
