import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { staffGetBuild, STAFF_BUILD_STATUSES } from "@/lib/configurator/repository";
import { DEMO_MODE, demoBuildDetail } from "@/lib/admin/demo";
import { setBuildStatus } from "@/app/staff/actions";
import StatusSelect from "@/components/staff/StatusSelect";
import StatusBadge from "@/components/staff/StatusBadge";
import { buildFieldByKey } from "@/lib/configurator/options";
import type { BuildConfigPayload } from "@/lib/configurator/types";

export const dynamic = "force-dynamic";

function specRows(payload: BuildConfigPayload) {
  const rows: { key: string; label: string; value: string }[] = [];
  const labelFor = (key: string) => buildFieldByKey(key)?.label ?? key;
  for (const [key, sel] of Object.entries(payload.selections ?? {})) {
    rows.push({ key: `sel:${key}`, label: labelFor(key), value: sel.value });
  }
  for (const [key, arr] of Object.entries(payload.multi ?? {})) {
    rows.push({ key: `multi:${key}`, label: labelFor(key), value: arr.map((s) => s.value).join(", ") });
  }
  for (const [key, text] of Object.entries(payload.freeText ?? {})) {
    rows.push({ key: `text:${key}`, label: labelFor(key), value: text });
  }
  return rows;
}

export default async function StaffBuildDetail({ params }: { params: { ref: string } }) {
  await requireStaff();
  const data = DEMO_MODE ? demoBuildDetail(params.ref) : await staffGetBuild(params.ref);
  if (!data) notFound();
  const { build, versions, events } = data;
  const rows = specRows(build.config_payload);

  return (
    <div className="container-edge py-12">
      <Link
        href="/staff/builds"
        className="font-sans text-sm text-bronze-deep underline underline-offset-2 hover:text-ink"
      >
        ← All builds
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
        {build.ref}
      </h1>

      <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 font-sans text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-4 border-b border-mist/60 py-2">
          <dt className="text-ink/70">Status</dt>
          <dd>
            {DEMO_MODE ? (
              <StatusBadge status={build.status} />
            ) : (
              <StatusSelect
                value={build.status}
                options={STAFF_BUILD_STATUSES}
                action={setBuildStatus.bind(null, build.ref)}
              />
            )}
          </dd>
        </div>
        <Row label="Name" value={build.customer_name ?? "—"} />
        <Row label="Email" value={build.customer_email ?? "—"} />
        <Row label="Phone" value={build.customer_phone ?? "—"} />
        <Row
          label="Submitted"
          value={build.submitted_at ? new Date(build.submitted_at).toLocaleString("en-GB") : "—"}
        />
        <Row label="Version" value={String(build.config_version)} />
      </dl>

      <Section title="Specification">
        {rows.length === 0 ? (
          <p className="font-sans text-sm text-ink/70">No selections recorded.</p>
        ) : (
          <dl className="divide-y divide-mist">
            {rows.map((r) => (
              <div key={r.key} className="flex justify-between gap-4 py-2.5">
                <dt className="font-sans text-sm text-ink/70">{r.label}</dt>
                <dd className="text-right font-sans text-sm font-medium text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Section>

      {build.consent_text && (
        <Section title="Consent">
          <p className="font-sans text-sm text-ink/70">
            {build.consent_given ? "Given" : "Not given"}
            {build.consent_at ? ` · ${new Date(build.consent_at).toLocaleString("en-GB")}` : ""}
          </p>
          <p className="mt-2 font-sans text-sm text-ink/80">“{build.consent_text}”</p>
        </Section>
      )}

      <Section title={`Version history (${versions.length})`}>
        <ul className="space-y-1 font-sans text-sm text-ink/80">
          {versions.map((v) => (
            <li key={v.id}>
              v{v.version} · {v.created_by} · {new Date(v.created_at).toLocaleString("en-GB")}
              {v.note ? ` · ${v.note}` : ""}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`Activity (${events.length})`}>
        <ul className="space-y-1 font-sans text-sm text-ink/80">
          {events.map((ev) => (
            <li key={ev.id}>
              {new Date(ev.created_at).toLocaleString("en-GB")} · {ev.actor} · {ev.event}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-mist/60 py-2">
      <dt className="text-ink/70">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
