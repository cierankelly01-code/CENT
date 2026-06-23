import { sendEnquiryEmails } from "@/lib/configurator/email";
import { jsonResponse, errorResponse, readJsonObject } from "@/lib/configurator/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max = 2000): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t.slice(0, max) : null;
}

export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok, retryAfter } = rateLimit(`enquiry:${ip}`, 5, 15 * 60 * 1000);
  if (!ok) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Retry-After": String(retryAfter), "Content-Type": "application/json" },
    });
  }

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
