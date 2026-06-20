// Small shared helpers for the build configurator Route Handlers.

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status);
}

/**
 * Capability token from the request: prefer the `x-build-token` header, fall back to the
 * `?t=` query param (so a plain GET of the link works). Empty string if absent.
 */
export function getBuildToken(req: Request): string {
  const header = req.headers.get("x-build-token");
  if (header) return header;
  return new URL(req.url).searchParams.get("t") ?? "";
}

/** Parse a JSON body, always returning a plain object (never throws). */
export async function readJsonObject(req: Request): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await req.json();
    return typeof body === "object" && body !== null && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
