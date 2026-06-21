import { requireStaff } from "@/lib/configurator/staff-auth";
import { staffListEnquiries } from "@/lib/admin/orders";
import { DEMO_MODE, demoEnquiries } from "@/lib/admin/demo";
import EnquiriesTable from "@/components/staff/EnquiriesTable";

export const dynamic = "force-dynamic";

export default async function StaffEnquiries() {
  await requireStaff();
  const enquiries = DEMO_MODE ? demoEnquiries : await staffListEnquiries();

  return (
    <div className="container-edge py-12">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">Enquiries</h1>
      <p className="mt-2 font-sans text-sm text-ink/70">
        {enquiries.length} {enquiries.length === 1 ? "enquiry" : "enquiries"} from the website form.
      </p>

      <div className="mt-8">
        <EnquiriesTable rows={enquiries} />
      </div>
    </div>
  );
}
