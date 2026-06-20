import { loadByRef, saveDraft } from "@/lib/configurator/repository";
import {
  errorResponse,
  getBuildToken,
  jsonResponse,
  readJsonObject,
} from "@/lib/configurator/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: { ref: string } };

// GET /api/build/:ref?t=<token> — load a build (client-safe projection).
export async function GET(req: Request, { params }: Ctx): Promise<Response> {
  const token = getBuildToken(req);
  if (!token) return errorResponse("Missing access token.", 401);
  try {
    const config = await loadByRef(params.ref, token);
    if (!config) return errorResponse("Build not found.", 404);
    return jsonResponse({ config });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("load build failed:", err);
    return errorResponse("Could not load the build.", 500);
  }
}

// PATCH /api/build/:ref — autosave the draft.
// Body: { config_payload?, customer_name?, customer_email?, customer_phone? }.
export async function PATCH(req: Request, { params }: Ctx): Promise<Response> {
  const token = getBuildToken(req);
  if (!token) return errorResponse("Missing access token.", 401);
  try {
    const body = await readJsonObject(req);
    const config = await saveDraft(params.ref, token, {
      config_payload: body.config_payload,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
    });
    if (!config) return errorResponse("Build not found.", 404);
    return jsonResponse({ config });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("save build failed:", err);
    return errorResponse("Could not save your changes.", 500);
  }
}
