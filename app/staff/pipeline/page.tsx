import Link from "next/link";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { staffListBuilds, type StaffBuildSummary } from "@/lib/configurator/repository";

export const dynamic = "force-dynamic";

const COLUMNS: { key: string; label: string; match: (s: string) => boolean }[] = [
  { key: "submitted", label: "Submitted", match: (s) => s === "submitted" },
  { key: "under_review", label: "Under review", match: (s) => s === "under_review" },
  { key: "quoted", label: "Quoted", match: (s) => s === "quoted" },
  { key: "confirmed", label: "Confirmed", match: (s) => s === "confirmed" },
  { key: "closed", label: "Closed", match: (s) => s === "archived" || s === "abandoned" },
];

export default async function StaffPipeline() {
  await requireStaff();
  const builds = await staffListBuilds();

  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">Pipeline</h1>
      <p className="mt-2 font-sans text-sm text-ink/70">
        {builds.length} build(s) in the pipeline.
      </p>

      <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const items = builds.filter((b) => col.match(b.status));
          return (
            <section key={col.key} className="w-64 shrink-0">
              <h2 className="flex items-center justify-between font-sans text-sm font-semibold text-ink">
                <span>{col.label}</span>
                <span className="rounded-full bg-mist/60 px-2 py-0.5 text-xs font-medium text-ink/70">
                  {items.length}
                </span>
              </h2>
              <ul className="mt-3 space-y-2">
                {items.map((b) => (
                  <li key={b.ref}>
                    <Card build={b} />
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

function Card({ build }: { build: StaffBuildSummary }) {
  return (
    <Link
      href={`/staff/builds/${build.ref}`}
      className="block rounded-lg border border-mist/70 bg-bone p-3 transition-colors motion-reduce:transition-none hover:border-bronze-deep/50"
    >
      <p className="font-sans text-sm font-medium text-bronze-deep">{build.ref}</p>
      <p className="mt-1 font-sans text-sm text-ink">{build.customer_name ?? "—"}</p>
      <p className="mt-1 font-sans text-xs text-ink/60">
        {build.submitted_at
          ? new Date(build.submitted_at).toLocaleDateString("en-GB")
          : "—"}
      </p>
    </Link>
  );
}
