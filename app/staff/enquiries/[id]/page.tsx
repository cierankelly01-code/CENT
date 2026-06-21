import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { staffGetEnquiry, ENQUIRY_STATUSES } from "@/lib/admin/orders";
import { DEMO_MODE, demoEnquiryById } from "@/lib/admin/demo";
import { setEnquiryStatus } from "@/app/staff/actions";
import StatusSelect from "@/components/staff/StatusSelect";

export const dynamic = "force-dynamic";

// The enquiry config_payload shape is flexible (the marketing form may evolve), so render
// any scalar entries generically rather than assuming fixed keys.
function payloadRows(payload: unknown): { key: string; value: string }[] {
  if (!payload || typeof payload !== "object") return [];
  return Object.entries(payload as Record<string, unknown>).map(([key, val]) => ({
    key,
    value:
      val === null || val === undefined
        ? "—"
        : typeof val === "object"
          ? JSON.stringify(val)
          : String(val),
  }));
}

export default async function StaffEnquiryDetail({ params }: { params: { id: string } }) {
  await requireStaff();
  const enquiry = DEMO_MODE ? demoEnquiryById(params.id) : await staffGetEnquiry(params.id);
  if (!enquiry) notFound();
  const spec = payloadRows(enquiry.config_payload);

  return (
    <div className="container-edge py-12">
      <Link
        href="/staff/enquiries"
        className="font-sans text-sm text-bronze-deep underline underline-offset-2 hover:text-ink"
      >
        ← All enquiries
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
        {enquiry.name}
      </h1>

      <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 font-sans text-sm sm:grid-cols-2">
        <Row label="Email" value={enquiry.email} />
        <Row label="Phone" value={enquiry.phone ?? "—"} />
        <Row label="Type" value={enquiry.enquiry_type} />
        <div className="flex items-center justify-between gap-4 border-b border-mist/60 py-2">
          <dt className="text-ink/70">Status</dt>
          <dd>
            <StatusSelect
              value={enquiry.status}
              options={ENQUIRY_STATUSES}
              action={setEnquiryStatus.bind(null, enquiry.id)}
            />
          </dd>
        </div>
        <Row label="Received" value={new Date(enquiry.created_at).toLocaleString("en-GB")} />
      </dl>

      {enquiry.message && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">Message</h2>
          <p className="mt-3 whitespace-pre-line font-sans text-sm text-ink/80">{enquiry.message}</p>
        </section>
      )}

      {spec.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">Captured details</h2>
          <dl className="mt-4 divide-y divide-mist">
            {spec.map((r) => (
              <div key={r.key} className="flex justify-between gap-4 py-2.5">
                <dt className="font-sans text-sm text-ink/70">{r.key}</dt>
                <dd className="text-right font-sans text-sm font-medium text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
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
