// ───────────────────────────────────────────────────────────────────────────
// DEMO / SAMPLE DATA — for showing the staff panel before real data exists.
//
// Default is OFF (real data) so it can never ship to real customers by accident.
// TO SHOW THE DEMO: set env var NEXT_PUBLIC_STAFF_DEMO=1 in Vercel and redeploy.
// TO GO LIVE: remove that env var (or set it to 0); optionally delete this file and
//   the `DEMO_MODE ? demo… : …` branches in app/staff/** (search for `DEMO_MODE`).
// Nothing here is written to the database — it's purely presentational. A clear
// "Sample data" banner shows on every staff page while this is on.
// ───────────────────────────────────────────────────────────────────────────

import type { EnquirySummary, EnquiryRow } from "./orders";
import type { StaffBuildSummary } from "@/lib/configurator/repository";
import type {
  BuildConfigRow,
  BuildConfigVersionRow,
  BuildConfigEventRow,
} from "@/lib/configurator/types";

/** Master switch — OFF unless NEXT_PUBLIC_STAFF_DEMO=1 (safe default for production). */
export const DEMO_MODE: boolean = process.env.NEXT_PUBLIC_STAFF_DEMO === "1";

// ── Dashboard ───────────────────────────────────────────────────────────────

export type Kpi = { label: string; value: string; sub: string };
export const demoKpis: Kpi[] = [
  { label: "Pipeline value", value: "£284,500", sub: "weighted, open" },
  { label: "Order book", value: "£128,000", sub: "confirmed builds" },
  { label: "Quote → order", value: "62%", sub: "last 90 days" },
  { label: "Lead → quote", value: "1.4 days", sub: "average" },
  { label: "Cash runway", value: "7.2 mo", sub: "at current burn" },
  { label: "NPS", value: "72", sub: "post-delivery" },
];

export type MonthPoint = { month: string; orders: number; revenue: number };
export const demoMonthly: MonthPoint[] = [
  { month: "Jan", orders: 3, revenue: 42000 },
  { month: "Feb", orders: 4, revenue: 58000 },
  { month: "Mar", orders: 5, revenue: 71000 },
  { month: "Apr", orders: 6, revenue: 83000 },
  { month: "May", orders: 7, revenue: 96000 },
  { month: "Jun", orders: 9, revenue: 121000 },
];

export type PipeStage = { label: string; count: number; value: string };
export const demoPipeline: PipeStage[] = [
  { label: "New", count: 12, value: "£—" },
  { label: "Contacted", count: 8, value: "£—" },
  { label: "Quoted", count: 6, value: "£96,000" },
  { label: "Test drive", count: 4, value: "£64,000" },
  { label: "Confirmed", count: 5, value: "£128,000" },
];

export type Activity = { when: string; text: string };
export const demoActivity: Activity[] = [
  { when: "9:42am", text: "New enquiry — Margaret Hughes (personal)" },
  { when: "9:15am", text: "Build CEN-7K2Q4 moved to Confirmed" },
  { when: "Yesterday", text: "Quote sent — Riverside Care Home (3 units)" },
  { when: "Yesterday", text: "Test drive booked — James Okafor, Leeds" },
  { when: "2 days ago", text: "Deposit received — CEN-4M8P2 (£3,600)" },
  { when: "2 days ago", text: "New enquiry — Aisling Byrne (organisation)" },
  { when: "3 days ago", text: "Build CEN-9QR3T submitted" },
  { when: "3 days ago", text: "PO raised — control modules ×10 (Hensley Motors)" },
];

export type StockAlert = { part: string; inStock: number; reorderAt: number; lead: string };
export const demoStock: StockAlert[] = [
  { part: "Control module (joystick)", inStock: 2, reorderAt: 5, lead: "8 wks" },
  { part: "Battery pack (Li-ion)", inStock: 4, reorderAt: 6, lead: "5 wks" },
  { part: "Seat frame — standard", inStock: 3, reorderAt: 4, lead: "3 wks" },
  { part: "Leather — tan", inStock: 1, reorderAt: 3, lead: "6 wks" },
];

export type Integration = { name: string; detail: string; status: "Connected" | "Action needed" };
export const demoIntegrations: Integration[] = [
  { name: "Stripe", detail: "Deposits & payments", status: "Connected" },
  { name: "Xero", detail: "Invoicing & accounts", status: "Connected" },
  { name: "Resend", detail: "Transactional email", status: "Connected" },
  { name: "Supabase", detail: "Database & auth", status: "Connected" },
  { name: "DPD", detail: "Courier & delivery", status: "Connected" },
];

// ── Enquiries ─────────────────────────────────────────────────────────────

export const demoEnquiries: EnquirySummary[] = [
  { id: "demo-1", created_at: "2026-06-21T09:42:00Z", name: "Margaret Hughes", email: "m.hughes@example.com", phone: "+44 7700 900111", enquiry_type: "personal", status: "new" },
  { id: "demo-2", created_at: "2026-06-21T08:05:00Z", name: "Aisling Byrne", email: "aisling@riversidecare.example", phone: "+44 7700 900222", enquiry_type: "business", status: "contacted" },
  { id: "demo-3", created_at: "2026-06-20T16:20:00Z", name: "James Okafor", email: "j.okafor@example.com", phone: "+44 7700 900333", enquiry_type: "personal", status: "test_drive" },
  { id: "demo-4", created_at: "2026-06-20T11:48:00Z", name: "Riverside Care Home", email: "procurement@riverside.example", phone: "+44 7700 900444", enquiry_type: "business", status: "quoted" },
  { id: "demo-5", created_at: "2026-06-19T14:02:00Z", name: "David Rajan", email: "d.rajan@example.com", phone: "+44 7700 900555", enquiry_type: "personal", status: "ordered" },
  { id: "demo-6", created_at: "2026-06-18T10:30:00Z", name: "Sofia Marchetti", email: "sofia.m@example.com", phone: null, enquiry_type: "personal", status: "contacted" },
  { id: "demo-7", created_at: "2026-06-17T13:15:00Z", name: "Gatwick Assistance", email: "access@gatwick.example", phone: "+44 7700 900777", enquiry_type: "business", status: "new" },
  { id: "demo-8", created_at: "2026-06-16T09:00:00Z", name: "Tom Pryce", email: "tom.pryce@example.com", phone: "+44 7700 900888", enquiry_type: "personal", status: "closed" },
];

export function demoEnquiryById(id: string): EnquiryRow | null {
  const e = demoEnquiries.find((x) => x.id === id);
  if (!e) return null;
  return {
    ...e,
    message:
      "Looking for a chair that lets me sit at eye level at the dinner table and get through our narrow hallway. Keen to try a test drive.",
    config_payload: {
      for_whom: e.enquiry_type === "business" ? "organisation" : "myself",
      use_cases: ["home", "pedestrian areas"],
      approx_height: "5'6\"–5'11\"",
      control: "joystick",
      timeframe: "Within 3 months",
    },
  };
}

// ── Builds ────────────────────────────────────────────────────────────────

export const demoBuilds: StaffBuildSummary[] = [
  { ref: "CEN-7K2Q4", customer_name: "David Rajan", customer_email: "d.rajan@example.com", status: "confirmed", submitted_at: "2026-06-19T15:10:00Z", created_at: "2026-06-18T12:00:00Z", config_version: 3 },
  { ref: "CEN-4M8P2", customer_name: "James Okafor", customer_email: "j.okafor@example.com", status: "quoted", submitted_at: "2026-06-20T17:00:00Z", created_at: "2026-06-20T09:00:00Z", config_version: 2 },
  { ref: "CEN-9QR3T", customer_name: "Riverside Care Home", customer_email: "procurement@riverside.example", status: "under_review", submitted_at: "2026-06-18T11:30:00Z", created_at: "2026-06-17T10:00:00Z", config_version: 1 },
  { ref: "CEN-2H6N8", customer_name: "Sofia Marchetti", customer_email: "sofia.m@example.com", status: "submitted", submitted_at: "2026-06-21T08:40:00Z", created_at: "2026-06-21T08:00:00Z", config_version: 1 },
  { ref: "CEN-5T9W1", customer_name: "Tom Pryce", customer_email: "tom.pryce@example.com", status: "confirmed", submitted_at: "2026-06-15T10:00:00Z", created_at: "2026-06-14T09:00:00Z", config_version: 4 },
  { ref: "CEN-3X7L0", customer_name: "Margaret Hughes", customer_email: "m.hughes@example.com", status: "archived", submitted_at: "2026-06-10T09:00:00Z", created_at: "2026-06-09T09:00:00Z", config_version: 2 },
];

export function demoBuildDetail(ref: string): {
  build: BuildConfigRow;
  versions: BuildConfigVersionRow[];
  events: BuildConfigEventRow[];
} | null {
  const b = demoBuilds.find((x) => x.ref === ref);
  if (!b) return null;
  const build = {
    id: `demo-${b.ref}`,
    ref: b.ref,
    access_token_hash: "demo",
    created_at: b.created_at,
    updated_at: b.submitted_at ?? b.created_at,
    quote_request_id: null,
    customer_name: b.customer_name,
    customer_email: b.customer_email,
    customer_phone: "+44 7700 900555",
    status: b.status,
    config_version: b.config_version,
    submitted_at: b.submitted_at,
    consent_given: true,
    consent_at: b.submitted_at,
    consent_text: "I agree to Centaur Robotics storing these details to prepare my quote.",
    config_payload: {
      schema_version: 1,
      selections: {
        "seat.width": { option_code: "SEAT_W_470", value: "470mm" },
        "control.type": { option_code: "CTRL_JOYSTICK", value: "Joystick" },
        "upholstery.material": { option_code: "UPH_LEATHER", value: "Leather" },
        "finish.frame": { option_code: "FIN_BRONZE", value: "Bronze" },
      },
      multi: {},
      freeText: { engraving: "For Alfie" },
      meta: { completed_steps: [0, 1, 2, 3], last_step: 4 },
    },
  } as unknown as BuildConfigRow;
  const versions = [
    { id: "v1", build_config_id: build.id, version: 1, config_payload: build.config_payload, created_at: b.created_at, created_by: "customer", note: null },
  ] as unknown as BuildConfigVersionRow[];
  const events = [
    { id: "e1", build_config_id: build.id, created_at: b.created_at, actor: "customer", event: "created", detail: null },
    { id: "e2", build_config_id: build.id, created_at: b.submitted_at ?? b.created_at, actor: "customer", event: "submitted", detail: null },
  ] as unknown as BuildConfigEventRow[];
  return { build, versions, events };
}

export function demoDashboardCounts() {
  return { enquiriesNew: 2, enquiriesTotal: demoEnquiries.length, buildsSubmitted: demoBuilds.length };
}
