import "server-only";
import { getServiceClient } from "./server";
import { generateRefCandidate, generateToken, hashToken, tokenMatches } from "./refs";
import { validatePayload } from "./validate";
import {
  emptyBuildPayload,
  toClientBuildConfig,
  type BuildConfigRow,
  type ClientBuildConfig,
} from "./types";

// Data-access layer for the build configurator. Every read/write goes through here, and
// every customer-scoped operation is gated by a capability-token check (getVerifiedRow).
// Versioning policy: frequent autosaves update the LIVE row only (no version spam). A
// version snapshot is written at meaningful checkpoints — submission here, and later staff
// edits — so history captures "the customer changed their mind", not every keystroke.

/** Thrown for submit-time validation problems → mapped to HTTP 400 by the route. */
export class BuildSubmitError extends Error {}

function clean(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

/** Best-effort activity log; never fails the parent operation. */
async function logEvent(
  buildId: string,
  actor: string,
  event: string,
  detail: Record<string, unknown> | null = null
): Promise<void> {
  try {
    await getServiceClient()
      .from("build_config_events")
      .insert({ build_config_id: buildId, actor, event, detail });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("build event log failed:", event, err);
  }
}

/** Load a row by ref and verify the capability token. Returns null on miss/mismatch. */
async function getVerifiedRow(ref: string, token: string): Promise<BuildConfigRow | null> {
  const { data, error } = await getServiceClient()
    .from("build_configs")
    .select("*")
    .eq("ref", ref)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as unknown as BuildConfigRow;
  if (!tokenMatches(token, row.access_token_hash)) return null;
  return row;
}

export type CreateDraftInput = {
  customer_name?: unknown;
  customer_email?: unknown;
  customer_phone?: unknown;
  quote_request_id?: unknown;
};

export type CreatedBuild = {
  ref: string;
  /** Raw capability token — returned ONCE at creation so staff can build the link. */
  token: string;
  config: ClientBuildConfig;
};

/** Create a new draft build. Retries on the (astronomically unlikely) ref collision. */
export async function createDraft(input: CreateDraftInput): Promise<CreatedBuild> {
  const supabase = getServiceClient();
  const token = generateToken();
  const base = {
    access_token_hash: hashToken(token),
    config_payload: emptyBuildPayload(),
    customer_name: clean(input.customer_name),
    customer_email: clean(input.customer_email),
    customer_phone: clean(input.customer_phone),
    quote_request_id: clean(input.quote_request_id),
  };

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 6; attempt++) {
    const ref = generateRefCandidate();
    const { data, error } = await supabase
      .from("build_configs")
      .insert({ ref, ...base })
      .select("*")
      .single();
    if (!error && data) {
      const row = data as unknown as BuildConfigRow;
      await logEvent(row.id, "customer", "created");
      return { ref: row.ref, token, config: toClientBuildConfig(row) };
    }
    lastError = error;
    // 23505 = unique_violation (ref clash) → retry with a fresh ref; anything else → stop.
    if ((error as { code?: string } | null)?.code !== "23505") break;
  }
  throw lastError ?? new Error("Could not create build draft.");
}

/** Load a build for the customer (client-safe projection). Logs an "opened" event. */
export async function loadByRef(ref: string, token: string): Promise<ClientBuildConfig | null> {
  const row = await getVerifiedRow(ref, token);
  if (!row) return null;
  await logEvent(row.id, "customer", "opened");
  return toClientBuildConfig(row);
}

export type SaveDraftInput = {
  config_payload?: unknown;
  customer_name?: unknown;
  customer_email?: unknown;
  customer_phone?: unknown;
};

/** Autosave the live draft. Updates the current row only — no version snapshot. */
export async function saveDraft(
  ref: string,
  token: string,
  patch: SaveDraftInput
): Promise<ClientBuildConfig | null> {
  const row = await getVerifiedRow(ref, token);
  if (!row) return null;
  if (row.status === "archived" || row.status === "abandoned") return null;

  const update: Record<string, unknown> = {};
  if (patch.config_payload !== undefined) update.config_payload = validatePayload(patch.config_payload);
  const name = clean(patch.customer_name);
  const email = clean(patch.customer_email);
  const phone = clean(patch.customer_phone);
  if (name) update.customer_name = name;
  if (email) update.customer_email = email;
  if (phone) update.customer_phone = phone;

  if (Object.keys(update).length === 0) return toClientBuildConfig(row);

  const { data, error } = await getServiceClient()
    .from("build_configs")
    .update(update)
    .eq("id", row.id)
    .select("*")
    .single();
  if (error) throw error;
  const updated = data as unknown as BuildConfigRow;
  await logEvent(updated.id, "customer", "autosaved");
  return toClientBuildConfig(updated);
}

export type SubmitBuildInput = {
  consent_given?: unknown;
  consent_text?: unknown;
  config_payload?: unknown;
  customer_name?: unknown;
  customer_email?: unknown;
  customer_phone?: unknown;
};

/**
 * Submit a build: records consent, writes an immutable version snapshot, flips status to
 * "submitted". Throws BuildSubmitError (→ 400) on consent/email problems; returns null if
 * the build/token is invalid (→ 404).
 */
export async function submitBuild(
  ref: string,
  token: string,
  input: SubmitBuildInput
): Promise<ClientBuildConfig | null> {
  const row = await getVerifiedRow(ref, token);
  if (!row) return null;
  if (row.status === "archived" || row.status === "abandoned") {
    throw new BuildSubmitError("This build can no longer be submitted.");
  }

  if (input.consent_given !== true) {
    throw new BuildSubmitError("Consent is required to submit.");
  }
  const consentText = clean(input.consent_text);
  if (!consentText) {
    throw new BuildSubmitError("The consent wording shown must be recorded.");
  }
  const customerEmail = clean(input.customer_email) ?? row.customer_email;
  if (!customerEmail) {
    throw new BuildSubmitError("An email address is required to submit.");
  }
  const customerName = clean(input.customer_name) ?? row.customer_name;
  const customerPhone = clean(input.customer_phone) ?? row.customer_phone;

  const payload =
    input.config_payload !== undefined ? validatePayload(input.config_payload) : row.config_payload;

  const supabase = getServiceClient();

  // Next snapshot version = max existing + 1 (so config_version always equals the latest snapshot).
  const { data: maxRow, error: maxErr } = await supabase
    .from("build_config_versions")
    .select("version")
    .eq("build_config_id", row.id)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (maxErr) throw maxErr;
  const nextVersion = ((maxRow as { version?: number } | null)?.version ?? 0) + 1;

  const { error: vErr } = await supabase.from("build_config_versions").insert({
    build_config_id: row.id,
    version: nextVersion,
    config_payload: payload,
    created_by: "customer",
    note: "Customer submission",
  });
  if (vErr) throw vErr;

  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("build_configs")
    .update({
      status: "submitted",
      submitted_at: nowIso,
      consent_given: true,
      consent_at: nowIso,
      consent_text: consentText,
      config_payload: payload,
      config_version: nextVersion,
      customer_email: customerEmail,
      customer_name: customerName,
      customer_phone: customerPhone,
    })
    .eq("id", row.id)
    .select("*")
    .single();
  if (error) throw error;
  const updated = data as unknown as BuildConfigRow;
  await logEvent(updated.id, "customer", "submitted", { version: nextVersion });
  return toClientBuildConfig(updated);
}
