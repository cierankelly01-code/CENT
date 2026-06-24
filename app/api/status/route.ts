import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckResult = {
  name: string;
  ok: boolean;
  plain: string;
  detail?: string;
};

async function checkSupabaseAnon(): Promise<CheckResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return { name: "Database (public)", ok: false, plain: "Missing Supabase URL or anon key in environment variables." };
  }
  try {
    const sb = createClient(url, key);
    const { error } = await sb.from("quote_requests").select("id").limit(1);
    if (error) return { name: "Database (public)", ok: false, plain: "Can connect to Supabase but the quote_requests table query failed.", detail: error.message };
    return { name: "Database (public)", ok: true, plain: "Supabase is connected and the enquiries table is reachable." };
  } catch (e) {
    return { name: "Database (public)", ok: false, plain: "Could not connect to Supabase at all.", detail: String(e) };
  }
}

async function checkSupabaseServiceRole(): Promise<CheckResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return { name: "Database (staff/builds)", ok: false, plain: "SUPABASE_SERVICE_ROLE_KEY is not set — customer builds and the staff panel won't work." };
  }
  try {
    const sb = createClient(url, key);
    const { error } = await sb.from("build_configs").select("id").limit(1);
    if (error) return { name: "Database (staff/builds)", ok: false, plain: "Service-role key works but build_configs table is missing — run supabase/build-schema.sql.", detail: error.message };
    return { name: "Database (staff/builds)", ok: true, plain: "Staff database connection is working and build table exists." };
  } catch (e) {
    return { name: "Database (staff/builds)", ok: false, plain: "Service-role database connection failed.", detail: String(e) };
  }
}

async function checkResend(): Promise<CheckResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return { name: "Email (Resend)", ok: false, plain: "RESEND_API_KEY is not set — confirmation emails won't send to customers or staff." };
  }
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return { name: "Email (Resend)", ok: false, plain: "Resend API key is invalid or expired — emails will fail.", detail: `HTTP ${res.status}` };
    return { name: "Email (Resend)", ok: true, plain: "Resend email service is connected and the API key is valid." };
  } catch (e) {
    return { name: "Email (Resend)", ok: false, plain: "Could not reach Resend servers — check internet connectivity.", detail: String(e) };
  }
}

async function checkEnvVar(name: string, label: string, plainOk: string, plainFail: string): Promise<CheckResult> {
  const val = process.env[name];
  if (!val) return { name: label, ok: false, plain: plainFail };
  return { name: label, ok: true, plain: plainOk };
}

// Trusted callers (e.g. ctrl dashboard) supply this token to get full detail.
// Public callers get summary only — no config state revealed.
function isAuthorised(req: NextRequest): boolean {
  const token = process.env.STATUS_TOKEN;
  if (!token) return false;
  const header = req.headers.get("x-status-token");
  return header === token;
}

export async function GET(req: NextRequest) {
  const authorised = isAuthorised(req);

  const [
    supabaseAnon,
    supabaseService,
    resend,
    siteUrl,
    staffEmails,
  ] = await Promise.all([
    checkSupabaseAnon(),
    checkSupabaseServiceRole(),
    checkResend(),
    checkEnvVar("NEXT_PUBLIC_SITE_URL", "Site URL", "Site URL is set — customer links in emails will be correct.", "NEXT_PUBLIC_SITE_URL is not set — links in customer emails will be broken."),
    checkEnvVar("STAFF_ALLOWED_EMAILS", "Staff login allowlist", "Staff email allowlist is configured.", "STAFF_ALLOWED_EMAILS not set — anyone with a Supabase account can access the staff panel."),
  ]);

  const checks = [supabaseAnon, supabaseService, resend, siteUrl, staffEmails];
  const allOk = checks.every((c) => c.ok);

  // Public response: overall status only — no config details
  if (!authorised) {
    return NextResponse.json({
      ok: allOk,
      summary: allOk ? "All systems operational." : "Some systems need attention.",
      timestamp: new Date().toISOString(),
    });
  }

  // Authorised response: full detail for ctrl dashboard
  return NextResponse.json({
    ok: allOk,
    summary: allOk
      ? "Everything is working. The site is healthy."
      : `${checks.filter((c) => !c.ok).length} thing(s) need attention.`,
    checks,
    timestamp: new Date().toISOString(),
  });
}
