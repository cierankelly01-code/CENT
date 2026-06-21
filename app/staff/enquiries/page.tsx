import Link from "next/link";
import { requireStaff } from "@/lib/configurator/staff-auth";
import { staffListEnquiries } from "@/lib/admin/orders";

export const dynamic = "force-dynamic";

export default async function StaffEnquiries() {
  await requireStaff();
  const enquiries = await staffListEnquiries();

  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">Enquiries</h1>
      <p className="mt-2 font-sans text-sm text-ink/70">
        {enquiries.length} enquiry(ies) from the website form.
      </p>

      {enquiries.length === 0 ? (
        <p className="mt-8 font-sans text-base text-ink/70">No enquiries yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-mist text-ink/70">
                <th scope="col" className="py-3 pr-4 font-medium">Name</th>
                <th scope="col" className="py-3 pr-4 font-medium">Email</th>
                <th scope="col" className="py-3 pr-4 font-medium">Type</th>
                <th scope="col" className="py-3 pr-4 font-medium">Status</th>
                <th scope="col" className="py-3 pr-4 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id} className="border-b border-mist/60">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/staff/enquiries/${e.id}`}
                      className="font-medium text-bronze-deep underline underline-offset-2 hover:text-ink"
                    >
                      {e.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-ink/80">{e.email}</td>
                  <td className="py-3 pr-4 text-ink/80">{e.enquiry_type}</td>
                  <td className="py-3 pr-4 text-ink/80">{e.status}</td>
                  <td className="py-3 pr-4 text-ink/70">
                    {new Date(e.created_at).toLocaleString("en-GB")}
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
