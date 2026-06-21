"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BUILD_STEPS,
  optionLabel,
  type BuildField,
  type BuildStep,
} from "@/lib/configurator/options";
import { useStudioStatus } from "@/components/studio/StudioStatus";
import { fromPayload, toPayload, type ClientAnswers } from "@/lib/configurator/payload";

// Registry-driven multi-step builder. Client-side with localStorage persistence (keyed by
// the build reference) so the customer can leave and return on this device. Server autosave +
// resume and submission are wired in later PRs; this PR is the accessible form engine.

type Selections = Record<string, string>; // field.key -> option_code (single choice)
type MultiSel = Record<string, string[]>; // field.key -> option_code[]
type FreeText = Record<string, string>; // field.key -> text

type PersistedState = {
  step?: number;
  selections?: Record<string, string>;
  multi?: Record<string, string[]>;
  freeText?: Record<string, string>;
};

const REVIEW_STEP = BUILD_STEPS.length;
const TOTAL_STEPS = BUILD_STEPS.length + 1; // + review

function isStringRecord(v: unknown): v is Record<string, string> {
  return (
    typeof v === "object" &&
    v !== null &&
    !Array.isArray(v) &&
    Object.values(v).every((x) => typeof x === "string")
  );
}

function isStringArrayRecord(v: unknown): v is Record<string, string[]> {
  return (
    typeof v === "object" &&
    v !== null &&
    !Array.isArray(v) &&
    Object.values(v).every((x) => Array.isArray(x) && x.every((i) => typeof i === "string"))
  );
}

/** A field is shown only when its showIf condition (if any) is satisfied. */
function isVisible(field: BuildField, selections: Selections): boolean {
  if (!field.showIf) return true;
  const chosen = selections[field.showIf.key];
  return chosen ? field.showIf.codeIn.includes(chosen) : false;
}

export default function StudioBuilder({ reference }: { reference: string }) {
  const { setState } = useStudioStatus();
  const storageKey = `centaur-build-${reference}`;

  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({});
  const [multi, setMulti] = useState<MultiSel>({});
  const [freeText, setFreeText] = useState<FreeText>({});
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);

  // Restore on mount — validate the persisted shape before trusting it.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const s: PersistedState = JSON.parse(raw);
        if (isStringRecord(s.selections)) setSelections(s.selections);
        if (isStringArrayRecord(s.multi)) setMulti(s.multi);
        if (isStringRecord(s.freeText)) setFreeText(s.freeText);
        if (typeof s.step === "number") setStep(Math.min(Math.max(0, s.step), REVIEW_STEP));
      }
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, [storageKey]);

  // Persist locally on change (instant, offline-safe). Server sync owns the save indicator
  // when a token is present; in local-only mode the indicator stays on its idle label.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ step, selections, multi, freeText }));
    } catch {
      /* ignore quota/availability errors — server sync is the durable store */
    }
  }, [hydrated, step, selections, multi, freeText, storageKey]);

  // Apply a server-loaded config to local state (used on resume).
  const applyServer = useCallback((a: ClientAnswers) => {
    setSelections(a.selections);
    setMulti(a.multi);
    setFreeText(a.freeText);
  }, []);

  // Server load (resume) + debounced autosave, when opened via a capability link (?t=).
  useBuildSync({ reference, hydrated, selections, multi, freeText, step, applyServer });

  const setSingle = (key: string, code: string) =>
    setSelections((prev) => ({ ...prev, [key]: code }));
  const toggleMulti = (key: string, code: string) =>
    setMulti((prev) => {
      const cur = prev[key] ?? [];
      return {
        ...prev,
        [key]: cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code],
      };
    });
  const setText = (key: string, value: string) =>
    setFreeText((prev) => ({ ...prev, [key]: value }));

  // Required + visible fields on a step must be answered before continuing.
  function canProceed(stepIndex: number): boolean {
    const def = BUILD_STEPS[stepIndex];
    if (!def) return true;
    return def.fields.every((f) => {
      if (!f.required || !isVisible(f, selections)) return true;
      if (f.control === "multi") return (multi[f.key]?.length ?? 0) > 0;
      if (f.control === "text" || f.control === "textarea") return Boolean(freeText[f.key]?.trim());
      return Boolean(selections[f.key]);
    });
  }

  function goNext() {
    if (step < REVIEW_STEP && canProceed(step)) setStep((s) => s + 1);
  }
  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  // Build review rows from every visible, answered field, each linking back to its step.
  const reviewRows: { id: string; label: string; value: string; step: number }[] = [];
  BUILD_STEPS.forEach((def, i) => {
    def.fields.forEach((f) => {
      if (!isVisible(f, selections)) return;
      if (f.control === "multi") {
        const codes = multi[f.key] ?? [];
        if (codes.length) {
          reviewRows.push({
            id: f.key,
            label: f.label,
            value: codes.map((c) => optionLabel(f, c)).join(", "),
            step: i,
          });
        }
      } else if (f.control === "text" || f.control === "textarea") {
        const t = freeText[f.key]?.trim();
        if (t) reviewRows.push({ id: f.key, label: f.label, value: t, step: i });
      } else {
        const code = selections[f.key];
        if (code) reviewRows.push({ id: f.key, label: f.label, value: optionLabel(f, code), step: i });
      }
    });
  });

  const current: BuildStep | undefined = BUILD_STEPS[step];
  const progressPct = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  return (
    <div className="container-edge py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between font-sans text-sm text-ink/70">
            <span>
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span>
              Reference <span className="font-medium text-ink">{reference}</span>
            </span>
          </div>
          <div
            className="mt-3 h-1 w-full overflow-hidden rounded-full bg-mist"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPct}
            aria-label="Build progress"
          >
            <div
              className="h-full rounded-full bg-bronze-deep transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div aria-live="polite">
          {current && (
            <Step title={current.title} sub={current.intro}>
              {current.fields
                .filter((f) => isVisible(f, selections))
                .map((f) => (
                  <FieldRenderer
                    key={f.key}
                    field={f}
                    singleValue={selections[f.key] ?? ""}
                    multiValue={multi[f.key] ?? []}
                    textValue={freeText[f.key] ?? ""}
                    onSingle={(code) => setSingle(f.key, code)}
                    onToggle={(code) => toggleMulti(f.key, code)}
                    onText={(v) => setText(f.key, v)}
                  />
                ))}
            </Step>
          )}

          {step === REVIEW_STEP && (
            <Step title="Review your build." sub="Here’s your Centaur so far — edit anything before you finish.">
              {reviewRows.length > 0 ? (
                <div className="rounded-md border border-mist bg-mist/20 p-5 sm:p-6">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
                    Your Centaur so far
                  </p>
                  <dl className="mt-4 divide-y divide-mist">
                    {reviewRows.map((r) => (
                      <div
                        key={`${r.step}:${r.id}`}
                        className="flex items-baseline justify-between gap-4 py-2.5"
                      >
                        <dt className="shrink-0 font-sans text-sm text-ink/70">{r.label}</dt>
                        <dd className="flex items-baseline gap-3 text-right">
                          <span className="font-sans text-sm font-medium text-ink">{r.value}</span>
                          <button
                            type="button"
                            onClick={() => setStep(r.step)}
                            className="shrink-0 font-sans text-xs text-bronze-deep underline underline-offset-2 hover:text-ink"
                          >
                            Edit<span className="sr-only"> {r.label}</span>
                          </button>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : (
                <p className="font-sans text-base text-ink/70">
                  You haven’t made any selections yet. Use “Back” to start building.
                </p>
              )}

              <div className="rounded-md border border-mist bg-mist/20 p-5 sm:p-6">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
                  What happens next
                </p>
                <ol className="mt-3 space-y-2 font-sans text-sm text-ink/70">
                  <li>1. You finish your build — it’s saved against your reference.</li>
                  <li>2. We review it and prepare a tailored quote with a delivery estimate.</li>
                  <li>3. We arrange a test drive in a space that suits you.</li>
                </ol>
              </div>

              {saved && (
                <p
                  role="status"
                  className="rounded-md border border-bronze-deep/30 bg-bronze/10 px-4 py-3 font-sans text-sm text-bronze-deep"
                >
                  Saved. You can close this and return any time using your link.
                </p>
              )}
            </Step>
          )}
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="font-sans text-sm font-medium text-ink/70 transition-colors motion-reduce:transition-none hover:text-ink disabled:invisible"
          >
            ← Back
          </button>
          {step < REVIEW_STEP ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed(step)}
              className="inline-flex items-center rounded-full bg-bronze-deep px-7 py-3 font-sans text-base font-semibold text-bone transition-colors motion-reduce:transition-none hover:bg-bronze-deeper disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="inline-flex items-center rounded-full bg-bronze-deep px-7 py-3 font-sans text-base font-semibold text-bone transition-colors motion-reduce:transition-none hover:bg-bronze-deeper"
            >
              Save my progress
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Server sync (capability-link load + debounced autosave) ---------------

/**
 * When the studio is opened via a capability link (`?t=<token>`), load the saved build from
 * the server (cross-device resume) and autosave changes back (debounced). Degrades cleanly:
 * with no token (or if the request fails) the builder stays in local-only mode and the rest
 * of the UI is unaffected.
 */
function useBuildSync({
  reference,
  hydrated,
  selections,
  multi,
  freeText,
  step,
  applyServer,
}: {
  reference: string;
  hydrated: boolean;
  selections: Record<string, string>;
  multi: Record<string, string[]>;
  freeText: Record<string, string>;
  step: number;
  applyServer: (answers: ClientAnswers) => void;
}) {
  const { setState } = useStudioStatus();
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Read the capability token from the URL (avoids a Suspense boundary).
  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("t"));
  }, []);

  // Load the server copy once local hydration has happened.
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      if (token) {
        try {
          const res = await fetch(
            `/api/build/${encodeURIComponent(reference)}?t=${encodeURIComponent(token)}`
          );
          if (res.ok) {
            const { config } = await res.json();
            if (!cancelled && config?.config_payload) applyServer(fromPayload(config.config_payload));
          }
        } catch {
          /* offline / unavailable — keep local state */
        }
      }
      if (!cancelled) setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, token, reference, applyServer]);

  // Debounced autosave to the server (only when opened with a token).
  useEffect(() => {
    if (!loaded || !token) return;
    setState("saving");
    const payload = toPayload({ selections, multi, freeText, lastStep: step });
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/build/${encodeURIComponent(reference)}`, {
          method: "PATCH",
          headers: { "content-type": "application/json", "x-build-token": token },
          body: JSON.stringify({ config_payload: payload }),
        });
        setState(res.ok ? "saved" : "error");
      } catch {
        setState("error");
      }
    }, 800);
    return () => clearTimeout(id);
  }, [loaded, token, selections, multi, freeText, step, reference, setState]);
}

// --- Field rendering -------------------------------------------------------

function FieldRenderer({
  field,
  singleValue,
  multiValue,
  textValue,
  onSingle,
  onToggle,
  onText,
}: {
  field: BuildField;
  singleValue: string;
  multiValue: string[];
  textValue: string;
  onSingle: (code: string) => void;
  onToggle: (code: string) => void;
  onText: (value: string) => void;
}) {
  const options = field.options ?? [];

  return (
    <Field label={field.label} hint={field.hint} required={field.required}>
      {field.control === "radio" && (
        <Radio
          name={field.key}
          legend={field.label}
          value={singleValue}
          onChange={onSingle}
          options={options.map((o) => [o.code, o.label] as [string, string])}
        />
      )}
      {field.control === "select" && (
        <Select
          id={field.key}
          label={field.label}
          value={singleValue}
          onChange={onSingle}
          options={options.map((o) => [o.code, o.label] as [string, string])}
        />
      )}
      {field.control === "multi" && (
        <Chips
          options={options.map((o) => [o.code, o.label] as [string, string])}
          selected={multiValue}
          onToggle={onToggle}
        />
      )}
      {field.control === "text" && (
        <input
          value={textValue}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          onChange={(e) => onText(e.target.value)}
          aria-label={field.label}
          className="w-full rounded-md border border-mist bg-bone px-4 py-3 font-sans text-base text-ink placeholder:text-ink/40"
        />
      )}
      {field.control === "textarea" && (
        <textarea
          value={textValue}
          rows={3}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          onChange={(e) => onText(e.target.value)}
          aria-label={field.label}
          className="w-full rounded-md border border-mist bg-bone px-4 py-3 font-sans text-base text-ink placeholder:text-ink/40"
        />
      )}
    </Field>
  );
}

// --- Accessible primitives -------------------------------------------------

function Step({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-3xl">
          {title}
        </h1>
        {sub && <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-ink/70">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3">
        <p className="font-sans text-base font-medium text-ink">
          {label}
          {required && <span className="text-bronze-deep"> *</span>}
        </p>
        {hint && <p className="mt-0.5 font-sans text-sm text-ink/70">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Chips({
  options,
  selected,
  onToggle,
}: {
  options: [string, string][];
  selected: string[];
  onToggle: (code: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([code, label]) => {
        const on = selected.includes(code);
        return (
          <button
            key={code}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(code)}
            className={`rounded-full border px-4 py-2 font-sans text-sm transition-colors motion-reduce:transition-none ${
              on
                ? "border-bronze-deep bg-bronze-deep text-bone"
                : "border-mist text-ink/80 hover:border-bronze-deep/60"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Native radio group — real <input type="radio"> elements give correct radiogroup
 * semantics and arrow-key navigation for free. The input is visually hidden; the styled
 * card shows selection + a focus ring (via peer-focus-visible) so keyboard users see focus.
 */
function Radio({
  name,
  legend,
  value,
  onChange,
  options,
}: {
  name: string;
  legend: string;
  value: string;
  onChange: (code: string) => void;
  options: [string, string][];
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map(([code, label]) => {
          const on = value === code;
          return (
            <label key={code} className="block cursor-pointer">
              <input
                type="radio"
                name={name}
                value={code}
                checked={on}
                onChange={() => onChange(code)}
                className="peer sr-only"
              />
              <span
                className={`flex items-center gap-2 rounded-lg border px-4 py-4 font-sans text-base transition-colors motion-reduce:transition-none peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-bronze ${
                  on
                    ? "border-bronze-deep bg-bronze/10 text-ink"
                    : "border-mist text-ink/80 hover:border-bronze-deep/50"
                }`}
              >
                <span
                  aria-hidden
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                    on ? "border-bronze-deep" : "border-ink/40"
                  }`}
                >
                  {on && <span className="h-2 w-2 rounded-full bg-bronze-deep" />}
                </span>
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Select({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (code: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="w-full rounded-md border border-mist bg-bone px-4 py-3 font-sans text-base text-ink"
    >
      <option value="" disabled>
        Select an option
      </option>
      {options.map(([code, optionText]) => (
        <option key={code} value={code}>
          {optionText}
        </option>
      ))}
    </select>
  );
}
