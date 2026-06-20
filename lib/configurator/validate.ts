import { allBuildFields, optionLabel, BUILD_STEP_COUNT } from "./options";
import { emptyBuildPayload, type BuildConfigPayload } from "./types";

// Hand-written validator/normaliser (no external deps). Takes an UNTRUSTED payload from
// the client and returns a clean, contract-shaped BuildConfigPayload:
//   - single-choice fields keep only valid option codes; the label is re-derived from the
//     registry (never trusted from the client);
//   - multi fields keep only valid codes, de-duplicated;
//   - free-text is trimmed and length-capped per the field's maxLength;
//   - unknown keys are dropped.
// This is the single chokepoint that stops arbitrary JSON reaching the jsonb column.

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function codeOf(entry: unknown): string | null {
  if (!isRecord(entry)) return null;
  return typeof entry.option_code === "string" ? entry.option_code : null;
}

export function validatePayload(input: unknown): BuildConfigPayload {
  const out = emptyBuildPayload();
  if (!isRecord(input)) return out;

  const selections = isRecord(input.selections) ? input.selections : {};
  const multi = isRecord(input.multi) ? input.multi : {};
  const freeText = isRecord(input.freeText) ? input.freeText : {};

  for (const field of allBuildFields()) {
    const validCodes = new Set((field.options ?? []).map((o) => o.code));

    if (field.control === "radio" || field.control === "select") {
      const code = codeOf(selections[field.key]);
      if (code && validCodes.has(code)) {
        out.selections[field.key] = { option_code: code, value: optionLabel(field, code) };
      }
    } else if (field.control === "multi") {
      const raw = multi[field.key];
      if (Array.isArray(raw)) {
        const seen = new Set<string>();
        const picked = [];
        for (const entry of raw) {
          const code = codeOf(entry);
          if (code && validCodes.has(code) && !seen.has(code)) {
            seen.add(code);
            picked.push({ option_code: code, value: optionLabel(field, code) });
          }
        }
        if (picked.length) out.multi[field.key] = picked;
      }
    } else if (field.control === "text" || field.control === "textarea") {
      const raw = freeText[field.key];
      if (typeof raw === "string") {
        const trimmed = raw.trim().slice(0, field.maxLength ?? 1000);
        if (trimmed) out.freeText[field.key] = trimmed;
      }
    }
    // "info" fields hold no value.
  }

  // Progress metadata (clamped to the real step range).
  const meta = isRecord(input.meta) ? input.meta : {};
  if (Array.isArray(meta.completed_steps)) {
    out.meta.completed_steps = Array.from(
      new Set(
        meta.completed_steps.filter(
          (n): n is number => typeof n === "number" && n >= 0 && n < BUILD_STEP_COUNT
        )
      )
    );
  }
  if (typeof meta.last_step === "number") {
    out.meta.last_step = Math.min(Math.max(0, Math.trunc(meta.last_step)), BUILD_STEP_COUNT - 1);
  }

  return out;
}
