import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { DEMO_MODE } from "@/lib/admin/demo";
import { demoProduction, type DemoProductionItem } from "@/lib/admin/demo-ops";

export const dynamic = "force-dynamic";

const STAGES: DemoProductionItem["stage"][] = [
  "Awaiting parts",
  "Ready to build",
  "In build",
  "QA",
  "Ready to ship",
];

export default async function StaffProduction() {
  await requireStaff();
  if (!DEMO_MODE) notFound();

  const ready = demoProduction.filter((p) => p.stage === "Ready to build").length;
  const blocked = demoProduction.filter((p) => p.stage === "Awaiting parts").length;

  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">Production</h1>
      <p className="mt-2 font-sans text-sm text-ink/70">
        {ready} ready to build · {blocked} waiting on parts.
      </p>

      <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const items = demoProduction.filter((p) => p.stage === stage);
          return (
            <section key={stage} className="w-64 shrink-0">
              <h2 className="flex items-center justify-between font-sans text-sm font-semibold text-ink">
                <span>{stage}</span>
                <span className="rounded-full bg-mist/60 px-2 py-0.5 text-xs font-medium text-ink/70">
                  {items.length}
                </span>
              </h2>
              <ul className="mt-3 space-y-2">
                {items.map((p) => (
                  <li
                    key={p.ref}
                    className="rounded-lg border border-mist/70 bg-bone p-3"
                  >
                    <p className="font-sans text-sm font-medium text-bronze-deep">{p.ref}</p>
                    <p className="mt-1 font-sans text-sm text-ink">{p.customer}</p>
                    <p className="mt-1 font-sans text-xs text-ink/60">Due {p.due}</p>
                    <p className="mt-2 font-sans text-xs">
                      {p.partsReady ? (
                        <span className="text-bronze-deep">● Parts ready</span>
                      ) : (
                        <span className="text-ink/50">○ Parts on order</span>
                      )}
                    </p>
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="rounded-lg border border-dashed border-mist/70 px-3 py-4 text-center font-sans text-xs text-ink/40">
                    Nothing here
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
