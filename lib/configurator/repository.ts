import "server-only";
import { getServiceClient } from "./server";
import { generateRefCandidate, generateToken, hashToken, tokenMatches } from "./refs";
import { validatePayload } from "./validate";
import { sendSubmissionEmails } from "./email";
import {
  emptyBuildPayload,
  toClientBuildConfig,
  type BuildConfigRow,
  type BuildConfigEventRow,
  type BuildConfigVersionRow,
  type ClientBuildConfig,
} from "./types";

export type StaffBuildSummary = Pick<
  BuildConfigRow,
  "ref" | "customer_name" | "customer_email" | "status" | "submitted_at" | "created_at" | "config_version"
>;

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
  // Autosave applies only to drafts. Once submitted, the live row is frozen to the customer
  // (staff/ERP read it); a future "reopen to edit" flow will deliberately reset to draft.
  if (row.status !== "draft") return null;

  const update: Record<string, unknown> = {};
  if (patch.config_payload !== undefined) update.config_payload = validatePayload(patch.config_payload);
  const name = clean(patch.customer_name);
  const email = clean(patch.customer_email);
  const phone = clean(patch.customer_phone);
  if (name) update.customer_name = name;
  if (email) update.customer_email = email;
  if (phone) update.customer_phone = phone;

  if (Object.keys(update).length === 0) return toClientBuildConfig(row);

  // Re-assert status in the UPDATE so a concurrent submit can't be clobbered (atomic guard).
  const { data, error } = await getServiceClient()
    .from("build_configs")
    .update(update)
    .eq("id", row.id)
    .eq("status", "draft")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null; // status changed under us (e.g. submitted concurrently)
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
  resume_url?: unknown;
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
  if (row.status !== "draft") {
    throw new BuildSubmitError(
      row.status === "submitted"
        ? "This build has already been submitted."
        : "This build can no longer be submitted."
    );
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

  // Atomic: compute next version, insert the immutable snapshot, and flip status in ONE
  // DB transaction (see submit_build() in supabase/build-schema.sql) so a partial failure
  // can't leave an orphan snapshot or a stale live row.
  const { data, error } = await getServiceClient().rpc("submit_build", {
    p_build_id: row.id,
    p_payload: payload,
    p_consent_text: consentText,
    p_customer_name: customerName,
    p_customer_email: customerEmail,
    p_customer_phone: customerPhone,
  });
  if (error) throw error;
  const updated = data as unknown as BuildConfigRow;
  await logEvent(updated.id, "customer", "submitted", { version: updated.config_version });
  await sendSubmissionEmails({
    ref: updated.ref,
    customerName: customerName,
    customerEmail: customerEmail,
    resumeUrl: clean(input.resume_url),
  });
  return toClientBuildConfig(updated);
}

// --- Staff reads (service role; callers must be authenticated staff) --------

/** All non-draft builds, newest submission first. */
export async function staffListBuilds(): Promise<StaffBuildSummary[]> {
  const { data, error } = await getServiceClient()
    .from("build_configs")
    .select("ref,customer_name,customer_email,status,submitted_at,created_at,config_version")
    .neq("status", "draft")
    .order("submitted_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []) as unknown as StaffBuildSummary[];
}

/** A single build with its full version history and recent event log. */
export async function staffGetBuild(ref: string): Promise<{
  build: BuildConfigRow;
  versions: BuildConfigVersionRow[];
  events: BuildConfigEventRow[];
} | null> {
  const supabase = getServiceClient();
  const { data: row, error } = await supabase
    .from("build_configs")
    .select("*")
    .eq("ref", ref)
    .maybeSingle();
  if (error) throw error;
  if (!row) return null;
  const build = row as unknown as BuildConfigRow;

  const [versionsResult, eventsResult] = await Promise.all([
    supabase
      .from("build_config_versions")
      .select("*")
      .eq("build_config_id", build.id)
      .order("version", { ascending: false }),
    supabase
      .from("build_config_events")
      .select("*")
      .eq("build_config_id", build.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);
  if (versionsResult.error) throw versionsResult.error;
  if (eventsResult.error) throw eventsResult.error;

  return {
    build,
    versions: (versionsResult.data ?? []) as unknown as BuildConfigVersionRow[],
    events: (eventsResult.data ?? []) as unknown as BuildConfigEventRow[],
  };
}

/** Statuses staff may set on a build (never back to draft). */
export const STAFF_BUILD_STATUSES = [
  "submitted",
  "under_review",
  "quoted",
  "confirmed",
  "archived",
  "abandoned",
] as const;

/** Staff status change on a build. Returns false if the ref doesn't exist. */
export async function staffUpdateBuildStatus(ref: string, status: string): Promise<boolean> {
  if (!(STAFF_BUILD_STATUSES as readonly string[]).includes(status)) {
    throw new Error("Invalid build status.");
  }
  const { data, error } = await getServiceClient()
    .from("build_configs")
    .update({ status })
    .eq("ref", ref)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) return false;
  await logEvent((data as { id: string }).id, "staff", "status_changed", { status });
  return true;
}
