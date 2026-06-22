"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

const STORAGE_KEY = "centaur-config-v1";

type ForWhom = "myself" | "someone" | "organisation";

const USE_CASES = [
  { id: "home", label: "At home" },
  { id: "outdoors", label: "Outdoors & pedestrian areas" },
  { id: "work", label: "Workplace" },
  { id: "venue", label: "A venue or facility" },
];

const USAGE = ["Occasionally", "A few hours a day", "Most of the day"];

const HEIGHTS = [
  "Under 5′0″ (152cm)",
  "5′0″–5′5″ (152–165cm)",
  "5′6″–5′11″ (166–180cm)",
  "6′0″ and over (181cm+)",
  "Prefer not to say",
];

const WEIGHTS = [
  "Under 60kg",
  "60–75kg",
  "75–90kg",
  "90–110kg",
  "Over 110kg",
  "Prefer not to say",
];

const TRANSFER = [
  ["independent", "On my own"],
  ["some-help", "With a little help"],
  ["hoist", "Using a hoist"],
] as const;

const HOME_NOTES = [
  { id: "narrow", label: "Some narrow doorways" },
  { id: "thresholds", label: "Steps or thresholds" },
  { id: "tight", label: "Tight turning spaces" },
  { id: "upstairs", label: "Living space upstairs" },
];

// Honest framing: this captures what a customer would VALUE — it shapes the
// roadmap. Nothing here is promised as a current feature.
const WISHES = [
  { id: "fall-alert", label: "Let a loved one know if I ever tip or fall" },
  { id: "companion-app", label: "A companion app for range & charge" },
  { id: "auto-lower", label: "Recognise home and lower as I arrive" },
  { id: "voice", label: "Voice control" },
  { id: "safe-zones", label: "Safe-zone reminders for peace of mind" },
  { id: "simple", label: "Just brilliant mobility — keep it simple" },
];

const UPHOLSTERY = ["Leather", "Performance fabric", "Vegan leather"];
const TONES = ["Light", "Tan", "Dark", "No preference"];
const FINISHES = ["Graphite", "Bronze", "Bone", "Surprise me"];
const PACE = [
  ["gentle", "Gentle"],
  ["balanced", "Balanced"],
  ["brisk", "Brisk"],
] as const;
const HAND = [
  ["left", "Left"],
  ["right", "Right"],
  ["either", "Either"],
] as const;
const CONTROL = [
  ["joystick", "Joystick"],
  ["app", "Mobile app"],
  ["both", "Both"],
] as const;
const TIMEFRAMES = [
  "As soon as possible",
  "Within 3 months",
  "Within 6 months",
  "Just exploring",
];

const ORG_SIZES = ["1–2 chairs", "3–5 chairs", "6–10 chairs", "11–25 chairs", "25+ chairs"];
const VENUE_TYPES = ["NHS Trust / Hospital", "Care home", "Stadium or venue", "Workplace", "Education", "Other"];
const OT_REFERRAL = [
  ["yes", "Yes — we have an OT involved"],
  ["no", "No — self-referring"],
  ["not-yet", "Not yet — can you help?"],
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_STEPS = 6;
const STEP_LABELS = ["About you", "Fit", "Controls", "Wishes", "Style", "Review"];

export default function ConfigureClient() {
  const [step, setStep] = useState(0);

  // Step 1 — you & your world
  const [forWhom, setForWhom] = useState<ForWhom | "">("");
  const [useCases, setUseCases] = useState<string[]>([]);
  const [usage, setUsage] = useState("");
  // Step 2 — fit
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [transfer, setTransfer] = useState("");
  const [homeNotes, setHomeNotes] = useState<string[]>([]);
  const [needs, setNeeds] = useState("");
  // Step 3 — controls
  const [control, setControl] = useState("");
  const [hand, setHand] = useState("");
  const [pace, setPace] = useState("");
  // Step 4 — looking ahead
  const [wishes, setWishes] = useState<string[]>([]);
  // Step 5 — make it yours
  const [upholstery, setUpholstery] = useState("");
  const [tone, setTone] = useState("");
  const [finish, setFinish] = useState("");
  const [engraving, setEngraving] = useState("");
  // Org-specific (step 0 branch)
  const [orgName, setOrgName] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [venueType, setVenueType] = useState("");
  const [otReferral, setOtReferral] = useState("");
  // Step 6 — details
  const [timeframe, setTimeframe] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vatRelief, setVatRelief] = useState(false);
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Persist progress so a high-consideration buyer can leave and return.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.forWhom !== undefined) setForWhom(s.forWhom);
        if (Array.isArray(s.useCases)) setUseCases(s.useCases);
        if (s.usage) setUsage(s.usage);
        if (s.height) setHeight(s.height);
        if (s.weight) setWeight(s.weight);
        if (s.transfer) setTransfer(s.transfer);
        if (Array.isArray(s.homeNotes)) setHomeNotes(s.homeNotes);
        if (s.needs) setNeeds(s.needs);
        if (s.control) setControl(s.control);
        if (s.hand) setHand(s.hand);
        if (s.pace) setPace(s.pace);
        if (Array.isArray(s.wishes)) setWishes(s.wishes);
        if (s.upholstery) setUpholstery(s.upholstery);
        if (s.tone) setTone(s.tone);
        if (s.finish) setFinish(s.finish);
        if (s.engraving) setEngraving(s.engraving);
        if (s.orgName) setOrgName(s.orgName);
        if (s.orgSize) setOrgSize(s.orgSize);
        if (s.venueType) setVenueType(s.venueType);
        if (s.otReferral) setOtReferral(s.otReferral);
        if (s.timeframe) setTimeframe(s.timeframe);
        if (s.name) setName(s.name);
        if (s.email) setEmail(s.email);
        if (s.phone) setPhone(s.phone);
        if (typeof s.vatRelief === "boolean") setVatRelief(s.vatRelief);
        if (typeof s.step === "number") setStep(s.step);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const snapshot = {
      step, forWhom, useCases, usage, height, weight, transfer, homeNotes, needs,
      control, hand, pace, wishes, upholstery, tone, finish, engraving,
      orgName, orgSize, venueType, otReferral, timeframe, name, email, phone, vatRelief,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      /* ignore */
    }
  }, [
    hydrated, step, forWhom, useCases, usage, height, weight, transfer, homeNotes,
    needs, control, hand, pace, wishes, upholstery, tone, finish, engraving,
    orgName, orgSize, venueType, otReferral, timeframe, name, email, phone, vatRelief,
  ]);

  const toggle = (setter: typeof setUseCases) => (id: string) =>
    setter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const canProceed = () => (step === 0 ? forWhom !== "" : true);

  function validateDetails(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!email.trim()) e.email = "Please enter your email.";
    else if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
    if (!consent) e.consent = "Please agree so we can contact you.";
    return e;
  }

  async function handleSubmit() {
    setSubmitError(null);
    const e = validateDetails();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`cf-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const config_payload = {
        for_whom: forWhom,
        // Org-specific
        org_name: orgName.trim() || null,
        org_size: orgSize || null,
        venue_type: venueType || null,
        ot_referral: otReferral || null,
        // Personal
        use_cases: useCases,
        usage_amount: usage || null,
        approx_height: height || null,
        approx_weight: weight || null,
        transfer: transfer || null,
        home_notes: homeNotes,
        seating_needs: needs.trim() || null,
        control: control || null,
        leading_hand: hand || null,
        preferred_pace: pace || null,
        roadmap_wishes: wishes,
        upholstery: upholstery || null,
        colour_tone: tone || null,
        frame_finish: finish || null,
        engraving: engraving.trim() || null,
        timeframe: timeframe || null,
        vat_relief: vatRelief,
      };
      const { error } = await getSupabaseClient()
        .from("quote_requests")
        .insert({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          enquiry_type: forWhom === "organisation" ? "business" : "personal",
          message: needs.trim() || null,
          config_payload,
        });
      if (error) throw error;
      // Fire-and-forget: instant acknowledgement to the enquirer + staff alert. Never blocks
      // the success state, and failures are swallowed (the lead is already saved).
      void fetch("/api/enquiry/notify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          enquiry_type: forWhom === "organisation" ? "business" : "personal",
          message: needs.trim() || null,
        }),
      }).catch(() => {});
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      setDone(true);
    } catch (err) {
      setSubmitError(
        "Something went wrong. Please try again, or email hello@centaurrobotics.com."
      );
      // eslint-disable-next-line no-console
      console.error("configurator insert failed:", err);
    } finally {
      setSubmitting(false);
    }
  }

  // Review summary rows (only what's been chosen), each linking back to its step.
  const FORWHOM_L: Record<string, string> = {
    myself: "For myself", someone: "For someone I care for", organisation: "For an organisation",
  };
  const pick = (pairs: readonly (readonly [string, string])[], v: string) =>
    (pairs.find((p) => p[0] === v) || ["", v])[1];
  const idLabels = (opts: { id: string; label: string }[], ids: string[]) =>
    ids.map((id) => opts.find((o) => o.id === id)?.label).filter(Boolean).join(", ");

  const reviewRows = [
    forWhom && { l: "For", v: FORWHOM_L[forWhom], s: 0 },
    useCases.length && { l: "Used at", v: idLabels(USE_CASES, useCases), s: 0 },
    usage && { l: "Daily use", v: usage, s: 0 },
    height && { l: "Height", v: height, s: 1 },
    weight && { l: "Weight", v: weight, s: 1 },
    transfer && { l: "Getting in/out", v: pick(TRANSFER, transfer), s: 1 },
    homeNotes.length && { l: "At home", v: idLabels(HOME_NOTES, homeNotes), s: 1 },
    control && { l: "Drive", v: pick(CONTROL, control), s: 2 },
    hand && { l: "Leading hand", v: pick(HAND, hand), s: 2 },
    pace && { l: "Pace", v: pick(PACE, pace), s: 2 },
    wishes.length && { l: "Values", v: idLabels(WISHES, wishes), s: 3 },
    upholstery && { l: "Upholstery", v: upholstery, s: 4 },
    tone && { l: "Tone", v: tone, s: 4 },
    finish && { l: "Finish", v: finish, s: 4 },
    engraving.trim() && { l: "Engraving", v: `“${engraving.trim()}”`, s: 4 },
  ].filter(Boolean) as { l: string; v: string; s: number }[];

  if (done) {
    const isOrg = forWhom === "organisation";
    return (
      <div className="container-edge py-24 md:py-32">
        <div className="mx-auto max-w-xl">
          <div className="rounded-xl border border-mist bg-bone p-10 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-bronze-deep/10">
              <svg className="h-7 w-7 text-bronze-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
              {isOrg ? "Enquiry received." : `Thank you, ${name.split(" ")[0] || "and welcome"}.`}
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              {isOrg
                ? "We’ve received your fleet enquiry. A dedicated account manager will be in touch within one working day."
                : "We’ve got your specification. A member of the Centaur team will be in touch within 48 hours to talk it through and arrange a test drive."}
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-mist bg-bone p-6">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">What happens next</p>
            <ol className="mt-4 space-y-4">
              {(isOrg ? [
                { n: "1", t: "We review your fleet requirements", d: "Your enquiry goes straight to our enterprise team who specialise in multi-unit deployments." },
                { n: "2", t: "Account manager call — within 1 working day", d: "We’ll discuss your venue, OT involvement, procurement process, and budget." },
                { n: "3", t: "Fleet demo & site visit", d: "We bring a Centaur to your site so your team can experience it first-hand." },
              ] : [
                { n: "1", t: "We review your specification", d: "Our team reads every detail you’ve shared to understand exactly what you need." },
                { n: "2", t: "We call within 48 hours", d: "A real person — no scripts, no pressure. Just a conversation about your Centaur." },
                { n: "3", t: "Test drive at your convenience", d: "We’ll arrange a demo in a space that suits you — at home, or at one of our showrooms." },
              ]).map((item) => (
                <li key={item.n} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bronze-deep/10 font-sans text-sm font-semibold text-bronze-deep">{item.n}</span>
                  <div>
                    <p className="font-sans text-sm font-semibold text-ink">{item.t}</p>
                    <p className="mt-0.5 font-sans text-sm text-ink/60">{item.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="font-sans text-sm text-ink/60 underline underline-offset-2 hover:text-ink">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-edge py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between font-sans text-sm text-ink/70">
            <span className="font-medium text-ink">{STEP_LABELS[step]}</span>
            <span>Step {step + 1} of {TOTAL_STEPS}</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-mist">
            <div
              className="h-full rounded-full bg-bronze-deep transition-[width] duration-500 ease-out"
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <div className="mt-2 hidden gap-0 sm:flex" aria-hidden="true">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex-1 text-center">
                <span className={`font-sans text-[10px] uppercase tracking-[0.12em] ${i === step ? "text-bronze-deep" : "text-ink/40"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div aria-live="polite">
          {step === 0 && (
            <Step title="You & your world." sub="So we understand how the Centaur fits into your life.">
              <Field label="Who is the Centaur for?" required>
                <Radio name="forWhom" value={forWhom} onChange={(v) => setForWhom(v as ForWhom)}
                  options={[["myself", "For myself"], ["someone", "For someone I care for"], ["organisation", "For an organisation"]]} />
              </Field>

              {forWhom === "organisation" ? (
                <>
                  <Field label="Organisation name">
                    <input value={orgName} onChange={(e) => setOrgName(e.target.value)}
                      className="w-full rounded-md border border-mist bg-bone px-4 py-3 font-sans text-base text-ink placeholder:text-ink/40"
                      placeholder="e.g. Northgate NHS Trust" />
                  </Field>
                  <Field label="Type of venue or organisation">
                    <Radio name="venueType" value={venueType} onChange={setVenueType}
                      options={VENUE_TYPES.map((v) => [v, v] as [string, string])} />
                  </Field>
                  <Field label="How many Centaur chairs are you considering?">
                    <Radio name="orgSize" value={orgSize} onChange={setOrgSize}
                      options={ORG_SIZES.map((s) => [s, s] as [string, string])} />
                  </Field>
                  <Field label="Do you have an occupational therapist or procurement lead involved?">
                    <Radio name="otReferral" value={otReferral} onChange={setOtReferral}
                      options={OT_REFERRAL.map(([v, l]) => [v, l] as [string, string])} />
                  </Field>
                  <Field label="Where will the chairs be used?" hint="Select any that apply">
                    <Chips options={USE_CASES} selected={useCases} onToggle={toggle(setUseCases)} />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="Where will it mostly be used?" hint="Select any that apply">
                    <Chips options={USE_CASES} selected={useCases} onToggle={toggle(setUseCases)} />
                  </Field>
                  <Field label="How much will you use it day-to-day?">
                    <Radio name="usage" value={usage} onChange={setUsage}
                      options={USAGE.map((u) => [u, u] as [string, string])} />
                  </Field>
                </>
              )}
            </Step>
          )}

          {step === 1 && (
            <Step title="A perfect fit." sub="The Centaur self-balances to you, so a few details help us get it exactly right.">
              <Field label="Approximate height of the user">
                <Select value={height} onChange={setHeight} options={HEIGHTS} placeholder="Select height" />
              </Field>
              <Field label="Approximate weight" hint="This helps us calibrate the self-balancing system precisely to you. Always optional.">
                <Select value={weight} onChange={setWeight} options={WEIGHTS} placeholder="Select weight" />
              </Field>
              <Field label="How do you prefer to get in and out?">
                <Radio name="transfer" value={transfer} onChange={setTransfer}
                  options={TRANSFER.map(([v, l]) => [v, l] as [string, string])} />
              </Field>
              <Field label="Anything tight about your home we should plan for?" hint="Select any that apply">
                <Chips options={HOME_NOTES} selected={homeNotes} onToggle={toggle(setHomeNotes)} />
              </Field>
              <Field label="Any seating, posture or comfort needs?" hint="Optional — free text">
                <textarea value={needs} onChange={(e) => setNeeds(e.target.value)} rows={3}
                  className="w-full rounded-md border border-mist bg-bone px-4 py-3 font-sans text-base text-ink placeholder:text-ink/40"
                  placeholder="Tell us anything that helps us spec the right chair…" />
              </Field>
            </Step>
          )}

          {step === 2 && (
            <Step title="How you'll drive it." sub="Down to which hand leads — we'll set the chair up around you, not the other way round.">
              <Field label="Preferred way to drive">
                <Radio name="control" value={control} onChange={setControl}
                  options={CONTROL.map(([v, l]) => [v, l] as [string, string])} />
              </Field>
              {control !== "app" && (
                <Field label="Which hand leads?" hint="So we mount your control on the right side for you.">
                  <Radio name="hand" value={hand} onChange={setHand}
                    options={HAND.map(([v, l]) => [v, l] as [string, string])} />
                </Field>
              )}
              <Field label="Comfortable pace">
                <Radio name="pace" value={pace} onChange={setPace}
                  options={PACE.map(([v, l]) => [v, l] as [string, string])} />
              </Field>
            </Step>
          )}

          {step === 3 && (
            <Step title="Looking ahead." sub="The Centaur keeps evolving. Tell us what you'd value most — it shapes where we take it next. Nothing here is promised; we're listening.">
              <Field label="Beyond getting around, what would you love your Centaur to do?" hint="Select any that speak to you">
                <Chips options={WISHES} selected={wishes} onToggle={toggle(setWishes)} />
              </Field>
            </Step>
          )}

          {step === 4 && (
            <Step title="Make it yours." sub="A chair that brings envy, not pity. Tell us your taste — we'll walk through the options when we call.">
              <Field label="Upholstery">
                <Radio name="upholstery" value={upholstery} onChange={setUpholstery}
                  options={UPHOLSTERY.map((u) => [u, u] as [string, string])} />
              </Field>
              <Field label="Colour tone">
                <Radio name="tone" value={tone} onChange={setTone}
                  options={TONES.map((t) => [t, t] as [string, string])} />
              </Field>
              <Field label="Frame finish">
                <Radio name="finish" value={finish} onChange={setFinish}
                  options={FINISHES.map((f) => [f, f] as [string, string])} />
              </Field>
              <Field label="A personal touch?" hint="Optional — a name or a few words, quietly added. Because it's yours.">
                <input value={engraving} onChange={(e) => setEngraving(e.target.value)} maxLength={40}
                  className="w-full rounded-md border border-mist bg-bone px-4 py-3 font-sans text-base text-ink placeholder:text-ink/40"
                  placeholder="e.g. “For Alfie”" />
              </Field>
            </Step>
          )}

          {step === 5 && (
            <Step title="Review & send your spec." sub="Here's your Centaur so far — edit anything, then tell us where to send it.">
              {reviewRows.length > 0 && (
                <div className="rounded-md border border-mist bg-mist/20 p-5 sm:p-6">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
                    Your Centaur so far
                  </p>
                  <dl className="mt-4 divide-y divide-mist">
                    {reviewRows.map((r) => (
                      <div key={r.l} className="flex items-baseline justify-between gap-4 py-2.5">
                        <dt className="shrink-0 font-sans text-sm text-ink/70">{r.l}</dt>
                        <dd className="flex items-baseline gap-3 text-right">
                          <span className="font-sans text-sm font-medium text-ink">{r.v}</span>
                          <button
                            type="button"
                            onClick={() => setStep(r.s)}
                            className="shrink-0 font-sans text-xs text-bronze-deep underline underline-offset-2 hover:text-ink"
                          >
                            Edit
                          </button>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {submitError && (
                <p role="alert" className="rounded-md border border-bronze-deep/40 bg-bronze/10 px-4 py-3 font-sans text-sm text-bronze-deep">
                  {submitError}
                </p>
              )}
              <Input id="cf-name" label="Name" value={name} onChange={setName} error={errors.name} required autoComplete="name" />
              <Input id="cf-email" label="Email" type="email" value={email} onChange={setEmail} error={errors.email} required autoComplete="email" />
              <Input id="cf-phone" label="Phone (optional)" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
              <Field label="When are you looking to get your Centaur?">
                <Select value={timeframe} onChange={setTimeframe} options={TIMEFRAMES} placeholder="Select timeframe" />
              </Field>

              {forWhom !== "organisation" && (
                <Field label="Are you working with an occupational therapist?">
                  <Radio name="otReferral" value={otReferral} onChange={setOtReferral}
                    options={OT_REFERRAL.map(([v, l]) => [v, l] as [string, string])} />
                </Field>
              )}

              <div className="rounded-md border border-mist/70 bg-mist/10 p-4">
                <label className="flex items-start gap-3 font-sans text-sm text-ink/70">
                  <input type="checkbox" checked={vatRelief} onChange={(e) => setVatRelief(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-bronze-deep" />
                  <span>
                    <span className="font-medium text-ink">VAT relief — </span>
                    I am purchasing for a disabled person. Zero-rate VAT may apply under HMRC regulations.
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-start gap-3 font-sans text-sm text-ink/70">
                  <input id="cf-consent" type="checkbox" checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-describedby={errors.consent ? "cf-consent-error" : undefined}
                    className="mt-1 h-4 w-4 accent-bronze-deep" />
                  <span>
                    I agree that Centaur can use these details to contact me about my
                    Centaur. We never share your data. See our{" "}
                    <Link href="/privacy" className="underline hover:text-ink">privacy policy</Link>.
                  </span>
                </label>
                {errors.consent && (
                  <p id="cf-consent-error" role="alert" className="mt-2 font-sans text-sm text-bronze-deep">
                    {errors.consent}
                  </p>
                )}
              </div>

              <div className="rounded-md border border-mist bg-mist/20 p-5 sm:p-6">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
                  What happens next
                </p>
                <ol className="mt-3 space-y-2 font-sans text-sm text-ink/70">
                  <li>1. We review your specification.</li>
                  <li>2. We call to talk it through — no pressure, no commitment.</li>
                  <li>3. We arrange a test drive in a space that suits you.</li>
                </ol>
              </div>
            </Step>
          )}
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
            className="font-sans text-sm font-medium text-ink/70 transition-colors hover:text-ink disabled:invisible">
            ← Back
          </button>
          {step < TOTAL_STEPS - 1 ? (
            <button type="button" onClick={() => canProceed() && setStep((s) => s + 1)} disabled={!canProceed()}
              className="inline-flex items-center rounded-full bg-bronze-deep px-7 py-3 font-sans text-base font-semibold text-bone transition-colors hover:bg-[#6f4d29] disabled:cursor-not-allowed disabled:opacity-50">
              Continue
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting}
              className="inline-flex items-center rounded-full bg-bronze-deep px-7 py-3 font-sans text-base font-semibold text-bone transition-colors hover:bg-[#6f4d29] disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Sending…" : "Send my specification"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-3xl">
          {title}
        </h2>
        {sub && <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-ink/70">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
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

function Chips({ options, selected, onToggle }: { options: { id: string; label: string }[]; selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o.id);
        return (
          <button key={o.id} type="button" aria-pressed={on} onClick={() => onToggle(o.id)}
            className={`rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
              on ? "border-bronze-deep bg-bronze-deep text-bone" : "border-mist text-ink/80 hover:border-bronze-deep/60"
            }`}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Radio({ name, value, onChange, options }: { name: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <fieldset>
      <legend className="sr-only">{name}</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map(([val, label]) => {
          const on = value === val;
          return (
            <button key={val} type="button" role="radio" aria-checked={on} onClick={() => onChange(val)}
              className={`rounded-lg border px-4 py-4 text-left font-sans text-base transition-colors ${
                on ? "border-bronze-deep bg-bronze/10 text-ink" : "border-mist text-ink/80 hover:border-bronze-deep/50"
              }`}>
              <span className="flex items-center gap-2">
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${on ? "border-bronze-deep" : "border-ink/40"}`}>
                  {on && <span className="h-2 w-2 rounded-full bg-bronze-deep" />}
                </span>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={placeholder}
      className="w-full rounded-md border border-mist bg-bone px-4 py-3 font-sans text-base text-ink">
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Input({ id, label, value, onChange, error, type = "text", required, autoComplete }: {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; required?: boolean; autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-sans text-base font-medium text-ink">
        {label}{required && <span className="text-bronze-deep"> *</span>}
      </label>
      <input id={id} type={type} value={value} required={required} autoComplete={autoComplete}
        aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border bg-bone px-4 py-3 font-sans text-base text-ink placeholder:text-ink/40 ${error ? "border-bronze-deep" : "border-mist"}`} />
      {error && <p id={`${id}-error`} role="alert" className="mt-2 font-sans text-sm text-bronze-deep">{error}</p>}
    </div>
  );
}
