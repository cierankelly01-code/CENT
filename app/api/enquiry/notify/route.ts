import { sendEnquiryEmails } from "@/lib/configurator/email";
import { jsonResponse, errorResponse, readJsonObject } from "@/lib/configurator/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/enquiry/notify — fire-and-forget transactional email after a /configure submit
// (the lead itself is saved client-side via the anon insert). Sends a customer acknowledgement
// + a staff alert. Best-effort: always returns ok so it never disrupts the user's success state.
// NOTE: public, like the anon insert. Content is benign and one-email-per-call; add rate limiting
// (e.g. Upstash) as a hardening step before high-traffic launch.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max = 2000): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t.slice(0, max) : null;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await readJsonObject(req);
    const email = str(body.email, 200);
    const name = str(body.name, 200);
    if (!name || !email || !EMAIL_RE.test(email)) {
      return errorResponse("A valid name and email are required.", 400);
    }
    await sendEnquiryEmails({
      name,
      email,
      phone: str(body.phone, 60),
      enquiryType: str(body.enquiry_type, 40) ?? "personal",
      message: str(body.message, 4000),
    });
    return jsonResponse({ ok: true });
  } catch {
    // Never surface — the enquiry is already captured.
    return jsonResponse({ ok: true });
  }
}
