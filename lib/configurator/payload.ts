import { BUILD_PAYLOAD_SCHEMA_VERSION, type BuildConfigPayload } from "./types";
import { buildFieldByKey, optionLabel } from "./options";

// Pure mapping between the builder's client state and the BOM-ready BuildConfigPayload.
// Kept dependency-free so it can be reused (and unit-tested) on client and server.

export type ClientAnswers = {
  selections: Record<string, string>; // field.key -> option_code
  multi: Record<string, string[]>; // field.key -> option_code[]
  freeText: Record<string, string>; // field.key -> text
  completedSteps?: number[];
  lastStep?: number;
};

/** Client state → BuildConfigPayload (stable option_codes + re-derived labels). */
export function toPayload(answers: ClientAnswers): BuildConfigPayload {
  const payload: BuildConfigPayload = {
    schema_version: BUILD_PAYLOAD_SCHEMA_VERSION,
    selections: {},
    multi: {},
    freeText: {},
    meta: {
      completed_steps: answers.completedSteps ?? [],
      last_step: answers.lastStep ?? 0,
    },
  };

  for (const [key, code] of Object.entries(answers.selections)) {
    const field = buildFieldByKey(key);
    if (field && code) payload.selections[key] = { option_code: code, value: optionLabel(field, code) };
  }
  for (const [key, codes] of Object.entries(answers.multi)) {
    const field = buildFieldByKey(key);
    if (field && codes.length) {
      payload.multi[key] = codes.map((c) => ({ option_code: c, value: optionLabel(field, c) }));
    }
  }
  for (const [key, text] of Object.entries(answers.freeText)) {
    const trimmed = text?.trim();
    if (trimmed) payload.freeText[key] = trimmed;
  }

  return payload;
}

/** BuildConfigPayload (from the server) → client state. */
export function fromPayload(payload: Partial<BuildConfigPayload> | null | undefined): ClientAnswers {
  const selections: Record<string, string> = {};
  const multi: Record<string, string[]> = {};
  const freeText: Record<string, string> = {};

  if (payload?.selections) {
    for (const [key, sel] of Object.entries(payload.selections)) {
      if (sel?.option_code) selections[key] = sel.option_code;
    }
  }
  if (payload?.multi) {
    for (const [key, arr] of Object.entries(payload.multi)) {
      if (Array.isArray(arr)) {
        const codes = arr.map((s) => s?.option_code).filter((c): c is string => Boolean(c));
        if (codes.length) multi[key] = codes;
      }
    }
  }
  if (payload?.freeText) {
    for (const [key, text] of Object.entries(payload.freeText)) {
      if (typeof text === "string") freeText[key] = text;
    }
  }

  return {
    selections,
    multi,
    freeText,
    completedSteps: payload?.meta?.completed_steps,
    lastStep: payload?.meta?.last_step,
  };
}
