// Centaur Robotics — Phase 2 deep build configurator (System #2) shared types.
// Spec: docs/PHASE-2-BUILD-CONFIGURATOR.md
//
// These types mirror supabase/build-schema.sql and the BOM-ready config payload. The
// payload stores stable `option_code`s (see lib/configurator/options.ts) so the ERP can map
// option_code -> BOM line(s) without depending on display labels.

/** Lifecycle status of a build. Customer-facing portion; the ERP extends downstream. */
export type BuildStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "quoted"
  | "confirmed"
  | "archived"
  | "abandoned";

/** Who authored a version / event entry. */
export type BuildActor = "customer" | "staff" | "erp";

/** Current schema version of the config payload shape (bump on breaking changes). */
export const BUILD_PAYLOAD_SCHEMA_VERSION = 1;

/**
 * A single chosen option. `option_code` is the stable key the ERP maps to a BOM line;
 * `value` is the human-readable label captured at selection time (for display/audit).
 */
export type BuildSelection = {
  option_code: string;
  value: string;
};

/**
 * The full build specification. BOM-ready and label-independent.
 * - `selections`   — single-choice fields (radio/select), keyed by field key e.g. "seat.width".
 * - `multi`        — multi-choice fields (chips), keyed by field key e.g. "accessories".
 * - `freeText`     — free-text fields, keyed by field key e.g. "engraving".
 * - `meta`         — progress bookkeeping for resume.
 */
export type BuildConfigPayload = {
  schema_version: number;
  selections: Record<string, BuildSelection>;
  multi: Record<string, BuildSelection[]>;
  freeText: Record<string, string>;
  meta: {
    completed_steps: number[];
    last_step: number;
  };
};

/** An empty payload to seed a new draft. */
export function emptyBuildPayload(): BuildConfigPayload {
  return {
    schema_version: BUILD_PAYLOAD_SCHEMA_VERSION,
    selections: {},
    multi: {},
    freeText: {},
    meta: { completed_steps: [], last_step: 0 },
  };
}

// ---------------------------------------------------------------------------
// Database row shapes (mirror supabase/build-schema.sql).
// ---------------------------------------------------------------------------

/**
 * Full `build_configs` row as stored. Includes server-only fields — NEVER send the whole
 * row to the browser. Use `ClientBuildConfig` for anything that reaches the client.
 */
export type BuildConfigRow = {
  id: string;
  ref: string;
  access_token_hash: string;
  created_at: string;
  updated_at: string;
  quote_request_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  status: BuildStatus;
  config_payload: BuildConfigPayload;
  config_version: number;
  submitted_at: string | null;
  consent_given: boolean;
  consent_at: string | null;
  consent_text: string | null;
};

/** Client-safe projection of a build (no token hash, no internal id). */
export type ClientBuildConfig = {
  ref: string;
  status: BuildStatus;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  config_payload: BuildConfigPayload;
  config_version: number;
  updated_at: string;
  submitted_at: string | null;
};

export function toClientBuildConfig(row: BuildConfigRow): ClientBuildConfig {
  return {
    ref: row.ref,
    status: row.status,
    customer_name: row.customer_name,
    customer_email: row.customer_email,
    customer_phone: row.customer_phone,
    config_payload: row.config_payload,
    config_version: row.config_version,
    updated_at: row.updated_at,
    submitted_at: row.submitted_at,
  };
}

/** `build_config_versions` row. */
export type BuildConfigVersionRow = {
  id: string;
  build_config_id: string;
  version: number;
  config_payload: BuildConfigPayload;
  created_at: string;
  created_by: BuildActor;
  note: string | null;
};

/** `build_config_events` row. */
export type BuildConfigEventRow = {
  id: string;
  build_config_id: string;
  created_at: string;
  actor: string; // 'customer' | 'staff:<email>' | 'system'
  event: string;
  detail: Record<string, unknown> | null;
};
