import "server-only";
import { getServiceClient } from "@/lib/configurator/server";

// Admin reads for the marketing enquiries (`/configure` → quote_requests). Service-role only;
// every caller must already be authenticated staff (pages call requireStaff() first).

export type EnquiryRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  enquiry_type: "personal" | "business";
  message: string | null;
  status: string;
  config_payload: unknown;
};

export type EnquirySummary = Pick<
  EnquiryRow,
  "id" | "created_at" | "name" | "email" | "phone" | "enquiry_type" | "status"
>;

/** All enquiries, newest first. */
export async function staffListEnquiries(): Promise<EnquirySummary[]> {
  const { data, error } = await getServiceClient()
    .from("quote_requests")
    .select("id,created_at,name,email,phone,enquiry_type,status")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as EnquirySummary[];
}

/** A single enquiry by id. */
export async function staffGetEnquiry(id: string): Promise<EnquiryRow | null> {
  const { data, error } = await getServiceClient()
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as EnquiryRow | null;
}

export type DashboardCounts = {
  enquiriesNew: number;
  enquiriesTotal: number;
  buildsSubmitted: number;
};

/** Headline counts for the staff dashboard. */
export async function staffDashboardCounts(): Promise<DashboardCounts> {
  const supabase = getServiceClient();
  const [eqTotal, eqNew, builds] = await Promise.all([
    supabase.from("quote_requests").select("id", { count: "exact", head: true }),
    supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("build_configs").select("id", { count: "exact", head: true }).neq("status", "draft"),
  ]);
  if (eqTotal.error) throw eqTotal.error;
  if (eqNew.error) throw eqNew.error;
  if (builds.error) throw builds.error;
  return {
    enquiriesTotal: eqTotal.count ?? 0,
    enquiriesNew: eqNew.count ?? 0,
    buildsSubmitted: builds.count ?? 0,
  };
}
