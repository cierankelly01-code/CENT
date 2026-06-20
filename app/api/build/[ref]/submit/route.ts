import { BuildSubmitError, submitBuild } from "@/lib/configurator/repository";
import {
  errorResponse,
  getBuildToken,
  jsonResponse,
  readJsonObject,
} from "@/lib/configurator/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: { ref: string } };

// POST /api/build/:ref/submit — record consent, snapshot a version, mark submitted.
// Body: { consent_given, consent_text, config_payload?, customer_name?, customer_email?, customer_phone? }.
export async function POST(req: Request, { params }: Ctx): Promise<Response> {
  const token = getBuildToken(req);
  if (!token) return errorResponse("Missing access token.", 401);
  try {
    const body = await readJsonObject(req);
    const config = await submitBuild(params.ref, token, {
      consent_given: body.consent_given,
      consent_text: body.consent_text,
      config_payload: body.config_payload,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
    });
    if (!config) return errorResponse("Build not found.", 404);
    return jsonResponse({ config });
  } catch (err) {
    if (err instanceof BuildSubmitError) return errorResponse(err.message, 400);
    // eslint-disable-next-line no-console
    console.error("submit build failed:", err);
    return errorResponse("Could not submit your build. Please try again.", 500);
  }
}
