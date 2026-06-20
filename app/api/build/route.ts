import { createDraft } from "@/lib/configurator/repository";
import { errorResponse, jsonResponse, readJsonObject } from "@/lib/configurator/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/build — create a new draft build.
// Optional body: { customer_name, customer_email, customer_phone, quote_request_id }.
// Returns { ref, token, config }. The raw token is returned ONCE so staff can build the
// link to send the customer (manual handoff for now — see spec §3 / decisions).
export async function POST(req: Request): Promise<Response> {
  try {
    const body = await readJsonObject(req);
    const created = await createDraft({
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      quote_request_id: body.quote_request_id,
    });
    return jsonResponse(created, 201);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("create build draft failed:", err);
    return errorResponse("Could not create the build. Please try again.", 500);
  }
}
