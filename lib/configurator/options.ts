// Centaur Robotics — Phase 2 deep build configurator: the option-code registry.
// Spec: docs/PHASE-2-BUILD-CONFIGURATOR.md (§4 the full option set).
//
// THIS IS A PLACEHOLDER REGISTRY (confirmed approach, 2026-06-20). Fields/options marked
// `tbc: true` await the client's real product matrix (seat-depth steps, cushions, colour
// palettes, accessory catalogue, tilt/recline availability). When the client confirms, swap
// the labels/options in — but KEEP `code` values STABLE wherever possible, because the ERP
// maps `option_code -> BOM line(s)`. Changing a code is a breaking change for the ERP.
//
// Guardrails honoured here: only real product facts from CLAUDE.md are stated as fact
// (470mm doorway width, 480-820mm seat/eye height, ≤4mph, 10+ mile range, ~75kg, 3-part
// dismantle, joystick/app, leather/composite). Postural items are framed as comfort & fit,
// NOT clinical/therapeutic. No off-road/medical claims. No pricing.

export const BUILD_REGISTRY_VERSION = 1;

export type BuildControl =
  | "radio"
  | "select"
  | "multi"
  | "text"
  | "textarea"
  | "info";

export type BuildOption = {
  /** Stable option_code the ERP maps to BOM line(s). Do not change once live. */
  code: string;
  label: string;
  hint?: string;
  /** Placeholder option pending client confirmation. */
  tbc?: boolean;
};

export type BuildField = {
  /** Dotted key used in the payload, e.g. "seat.width". Stable. */
  key: string;
  label: string;
  control: BuildControl;
  required?: boolean;
  hint?: string;
  /** For radio/select/multi. */
  options?: BuildOption[];
  /** For text/textarea. */
  maxLength?: number;
  placeholder?: string;
  /** How the ERP turns this field into a bill-of-materials line (documentation only). */
  bom?: string;
  /** Whole field / option-set pending client confirmation. */
  tbc?: boolean;
  /** Conditionally show this field only when another field's code is in the list. */
  showIf?: { key: string; codeIn: string[] };
};

export type BuildStep = {
  /** Group id (A..J in the spec). Stable. */
  id: string;
  title: string;
  intro?: string;
  fields: BuildField[];
};

// ---------------------------------------------------------------------------
// The steps. Order here is the customer flow order.
// ---------------------------------------------------------------------------

export const BUILD_STEPS: BuildStep[] = [
  // A — About you & the user (carries intent from /configure) -----------------
  {
    id: "about",
    title: "About you & the user",
    intro: "So we understand how this Centaur fits into your life.",
    fields: [
      {
        key: "about.for_whom",
        label: "Who is this Centaur for?",
        control: "radio",
        required: true,
        bom: "Routing only — not a BOM line.",
        options: [
          { code: "WHO_SELF", label: "For myself" },
          { code: "WHO_CARED", label: "For someone I care for" },
          { code: "WHO_ORG", label: "For an organisation" },
        ],
      },
      {
        key: "about.environments",
        label: "Where will it mostly be used?",
        control: "multi",
        hint: "Select any that apply. The Centaur is designed for smooth surfaces.",
        bom: "Informs defaults; no direct BOM line.",
        options: [
          { code: "ENV_HOME", label: "At home" },
          { code: "ENV_OUTDOOR", label: "Outdoors & pedestrian areas" },
          { code: "ENV_WORK", label: "Workplace" },
          { code: "ENV_VENUE", label: "A venue or facility" },
        ],
      },
      {
        key: "about.usage",
        label: "How much will it be used day-to-day?",
        control: "radio",
        bom: "Charging guidance; no SKU.",
        options: [
          { code: "USE_OCCASIONAL", label: "Occasionally" },
          { code: "USE_HOURS", label: "A few hours a day" },
          { code: "USE_MOST", label: "Most of the day" },
        ],
      },
    ],
  },

  // B — Seat & fit ------------------------------------------------------------
  {
    id: "fit",
    title: "Seat & fit",
    intro: "The Centaur self-balances to the user, so a few details get the fit exactly right.",
    fields: [
      {
        key: "fit.height",
        label: "Approximate height of the user",
        control: "select",
        hint: "Helps us set the seat within its 480–820mm (eye-level) range.",
        bom: "Calibration profile; no SKU.",
        options: [
          { code: "HT_U152", label: "Under 5′0″ (152cm)" },
          { code: "HT_152_165", label: "5′0″–5′5″ (152–165cm)" },
          { code: "HT_166_180", label: "5′6″–5′11″ (166–180cm)" },
          { code: "HT_181_PLUS", label: "6′0″ and over (181cm+)" },
          { code: "HT_NA", label: "Prefer not to say" },
        ],
      },
      {
        key: "fit.weight",
        label: "Approximate weight",
        control: "select",
        hint: "Helps calibrate the self-balancing system precisely. Always optional.",
        bom: "Calibration profile; no SKU.",
        options: [
          { code: "WT_U60", label: "Under 60kg" },
          { code: "WT_60_75", label: "60–75kg" },
          { code: "WT_75_90", label: "75–90kg" },
          { code: "WT_90_110", label: "90–110kg" },
          { code: "WT_O110", label: "Over 110kg" },
          { code: "WT_NA", label: "Prefer not to say" },
        ],
      },
      {
        key: "fit.seat_width",
        label: "Seat width",
        control: "select",
        hint: "470mm keeps you doorway-friendly.",
        bom: "Seat frame SKU.",
        tbc: true,
        options: [
          { code: "SEAT_W_NARROW", label: "Narrower", tbc: true },
          { code: "SEAT_W_470", label: "Standard — 470mm (doorway-friendly)" },
          { code: "SEAT_W_WIDE", label: "Wider", tbc: true },
        ],
      },
      {
        key: "fit.seat_depth",
        label: "Seat depth",
        control: "select",
        bom: "Seat pan SKU.",
        tbc: true,
        options: [
          { code: "SEAT_D_SHORT", label: "Shorter", tbc: true },
          { code: "SEAT_D_STD", label: "Standard", tbc: true },
          { code: "SEAT_D_LONG", label: "Longer", tbc: true },
        ],
      },
      {
        key: "fit.cushion",
        label: "Cushion (comfort & support)",
        control: "select",
        bom: "Cushion SKU.",
        tbc: true,
        options: [
          { code: "CUSH_STD", label: "Standard", tbc: true },
          { code: "CUSH_SOFT", label: "Softer", tbc: true },
          { code: "CUSH_FIRM", label: "Firmer", tbc: true },
        ],
      },
      {
        key: "fit.backrest",
        label: "Backrest height",
        control: "select",
        bom: "Backrest SKU.",
        tbc: true,
        options: [
          { code: "BACK_LOW", label: "Lower", tbc: true },
          { code: "BACK_STD", label: "Standard", tbc: true },
          { code: "BACK_HIGH", label: "Higher", tbc: true },
        ],
      },
      {
        key: "fit.headrest",
        label: "Headrest",
        control: "radio",
        bom: "Headrest SKU (optional).",
        tbc: true,
        options: [
          { code: "HEAD_NONE", label: "None", tbc: true },
          { code: "HEAD_STD", label: "Standard headrest", tbc: true },
        ],
      },
      {
        key: "fit.armrest",
        label: "Armrest style",
        control: "select",
        bom: "Armrest SKU.",
        tbc: true,
        options: [
          { code: "ARM_STD", label: "Standard", tbc: true },
          { code: "ARM_ADJ", label: "Adjustable", tbc: true },
        ],
      },
      {
        key: "fit.transfer",
        label: "How do you prefer to get in and out?",
        control: "radio",
        bom: "Armrest / clearance configuration.",
        options: [
          { code: "TRANSFER_INDEP", label: "On my own" },
          { code: "TRANSFER_HELP", label: "With a little help" },
          { code: "TRANSFER_HOIST", label: "Using a hoist" },
        ],
      },
    ],
  },

  // C — Postural support & comfort (NON-clinical wording) ---------------------
  {
    id: "comfort",
    title: "Postural support & comfort",
    intro: "Optional extras for a more supported, comfortable seating position.",
    fields: [
      {
        key: "comfort.lateral",
        label: "Lateral supports",
        control: "select",
        bom: "Support SKU (optional).",
        tbc: true,
        options: [
          { code: "LAT_NONE", label: "None", tbc: true },
          { code: "LAT_LIGHT", label: "Light", tbc: true },
          { code: "LAT_CONTOUR", label: "Contoured", tbc: true },
        ],
      },
      {
        key: "comfort.belt",
        label: "Positioning belt (comfort & security)",
        control: "radio",
        bom: "Belt SKU (optional).",
        tbc: true,
        options: [
          { code: "BELT_NONE", label: "None", tbc: true },
          { code: "BELT_YES", label: "Include a positioning belt", tbc: true },
        ],
      },
      {
        key: "comfort.tilt",
        label: "Tilt / recline preference",
        control: "select",
        hint: "Availability to be confirmed.",
        bom: "Mechanism SKU.",
        tbc: true,
        options: [
          { code: "TILT_NONE", label: "Not needed", tbc: true },
          { code: "TILT_YES", label: "Interested if available", tbc: true },
        ],
      },
      {
        key: "comfort.notes",
        label: "Posture or comfort notes",
        control: "textarea",
        maxLength: 600,
        placeholder: "Tell us anything that helps us get the seating right…",
        hint: "Optional — free text. Flagged to our team, not auto-specced.",
        bom: "Staff review; not auto-BOM.",
      },
    ],
  },

  // D — Controls --------------------------------------------------------------
  {
    id: "controls",
    title: "Controls",
    intro: "We set the chair up around you — down to which hand leads.",
    fields: [
      {
        key: "controls.type",
        label: "Preferred way to drive",
        control: "radio",
        bom: "Controller SKU.",
        options: [
          { code: "CTRL_JOYSTICK", label: "Joystick" },
          { code: "CTRL_APP", label: "Mobile app" },
          { code: "CTRL_BOTH", label: "Both" },
        ],
      },
      {
        key: "controls.mount_side",
        label: "Which side should the control be on?",
        control: "radio",
        hint: "So we mount your control on your preferred side for you.",
        bom: "Mount-side assembly.",
        showIf: { key: "controls.type", codeIn: ["CTRL_JOYSTICK", "CTRL_BOTH"] },
        options: [
          { code: "MOUNT_LEFT", label: "Left" },
          { code: "MOUNT_RIGHT", label: "Right" },
          { code: "MOUNT_EITHER", label: "Either" },
        ],
      },
      {
        key: "controls.grip",
        label: "Joystick grip",
        control: "select",
        bom: "Grip SKU.",
        tbc: true,
        showIf: { key: "controls.type", codeIn: ["CTRL_JOYSTICK", "CTRL_BOTH"] },
        options: [
          { code: "GRIP_STD", label: "Standard", tbc: true },
          { code: "GRIP_SOFT", label: "Soft-touch", tbc: true },
        ],
      },
      {
        key: "controls.attendant",
        label: "Attendant / secondary control",
        control: "radio",
        bom: "Attendant module SKU (optional).",
        tbc: true,
        options: [
          { code: "ATTEND_NONE", label: "Not needed", tbc: true },
          { code: "ATTEND_YES", label: "Include attendant control", tbc: true },
        ],
      },
    ],
  },

  // E — Drive & pace ----------------------------------------------------------
  {
    id: "drive",
    title: "Drive & pace",
    intro: "The Centaur travels at up to 4mph with a 10+ mile range.",
    fields: [
      {
        key: "drive.pace",
        label: "Comfortable pace profile",
        control: "radio",
        hint: "All profiles stay within the 4mph limit.",
        bom: "Firmware drive profile; no SKU.",
        options: [
          { code: "PACE_GENTLE", label: "Gentle" },
          { code: "PACE_BALANCED", label: "Balanced" },
          { code: "PACE_BRISK", label: "Brisk" },
        ],
      },
      {
        key: "drive.range",
        label: "Range needs",
        control: "radio",
        hint: "Baseline is 10+ miles on a charge.",
        bom: "Battery option (extended range TBC).",
        tbc: true,
        options: [
          { code: "RANGE_STD", label: "Standard (10+ miles) is plenty" },
          { code: "RANGE_EXT", label: "I'd like extended range if available", tbc: true },
        ],
      },
    ],
  },

  // F — Upholstery & finish ---------------------------------------------------
  {
    id: "finish",
    title: "Upholstery & finish",
    intro: "A chair that brings envy, not pity. Tell us your taste.",
    fields: [
      {
        key: "finish.upholstery",
        label: "Upholstery material",
        control: "radio",
        bom: "Material SKU.",
        options: [
          { code: "UPH_LEATHER", label: "Leather" },
          { code: "UPH_COMPOSITE", label: "Performance composite" },
          { code: "UPH_VEGAN", label: "Vegan leather", tbc: true },
        ],
      },
      {
        key: "finish.upholstery_colour",
        label: "Upholstery colour",
        control: "select",
        bom: "Colourway SKU.",
        tbc: true,
        options: [
          { code: "UPHC_LIGHT", label: "Light", tbc: true },
          { code: "UPHC_TAN", label: "Tan", tbc: true },
          { code: "UPHC_DARK", label: "Dark", tbc: true },
          { code: "UPHC_NA", label: "No preference", tbc: true },
        ],
      },
      {
        key: "finish.frame",
        label: "Frame finish",
        control: "select",
        bom: "Finish SKU.",
        tbc: true,
        options: [
          { code: "FRAME_GRAPHITE", label: "Graphite", tbc: true },
          { code: "FRAME_BRONZE", label: "Bronze", tbc: true },
          { code: "FRAME_BONE", label: "Bone", tbc: true },
          { code: "FRAME_NA", label: "Surprise me", tbc: true },
        ],
      },
      {
        key: "finish.stitching",
        label: "Stitching / accent",
        control: "select",
        bom: "Trim SKU.",
        tbc: true,
        options: [
          { code: "STITCH_TONAL", label: "Tonal", tbc: true },
          { code: "STITCH_CONTRAST", label: "Contrast", tbc: true },
        ],
      },
    ],
  },

  // G — Footplate & transport -------------------------------------------------
  {
    id: "transport",
    title: "Footplate & transport",
    intro: "The Centaur (~75kg) dismantles into three parts for transport.",
    fields: [
      {
        key: "transport.footplate",
        label: "Footplate style",
        control: "select",
        bom: "Footplate SKU.",
        tbc: true,
        options: [
          { code: "FOOT_STD", label: "Standard", tbc: true },
          { code: "FOOT_ADJ", label: "Adjustable", tbc: true },
        ],
      },
      {
        key: "transport.dismantle",
        label: "Will you need to dismantle it for transport?",
        control: "radio",
        bom: "Travel-case SKU (optional).",
        tbc: true,
        options: [
          { code: "DISM_NO", label: "No, it stays put mostly" },
          { code: "DISM_YES", label: "Yes — regularly into a vehicle" },
        ],
      },
      {
        key: "transport.vehicle_notes",
        label: "Vehicle / boot constraints",
        control: "textarea",
        maxLength: 400,
        placeholder: "e.g. fits in an estate boot, roof height…",
        hint: "Optional — helps us advise on transport.",
        bom: "Logistics note; not auto-BOM.",
      },
    ],
  },

  // H — Accessories -----------------------------------------------------------
  {
    id: "accessories",
    title: "Accessories",
    intro: "Optional add-ons. Pick anything that's useful — the full catalogue is to be confirmed.",
    fields: [
      {
        key: "accessories.items",
        label: "Accessories",
        control: "multi",
        hint: "Select any that apply.",
        bom: "Each selection is its own accessory SKU.",
        tbc: true,
        options: [
          { code: "ACC_BAG", label: "Travel / storage bag", tbc: true },
          { code: "ACC_CUP", label: "Cup holder", tbc: true },
          { code: "ACC_PHONE", label: "Phone mount", tbc: true },
          { code: "ACC_CANE", label: "Cane / crutch holder", tbc: true },
          { code: "ACC_COVER", label: "Weather cover", tbc: true },
          { code: "ACC_LIGHT", label: "Lighting", tbc: true },
          { code: "ACC_CHARGER", label: "Spare charger", tbc: true },
        ],
      },
    ],
  },

  // I — Personalisation -------------------------------------------------------
  {
    id: "personalisation",
    title: "Personalisation",
    intro: "Because it's yours.",
    fields: [
      {
        key: "personalisation.engraving",
        label: "Engraving",
        control: "text",
        maxLength: 40,
        placeholder: "e.g. “For Alfie”",
        hint: "Optional — a name or a few words, quietly added.",
        bom: "Engraving line item.",
      },
    ],
  },

  // J — Delivery & preferences ------------------------------------------------
  {
    id: "delivery",
    title: "Delivery & preferences",
    intro: "A few last details so we can plan your test drive and delivery.",
    fields: [
      {
        key: "delivery.region",
        label: "Delivery area (postcode district)",
        control: "text",
        maxLength: 8,
        placeholder: "e.g. SW1 or M14",
        hint: "Just the first part — helps us plan delivery and an ETA.",
        bom: "ETA + logistics (ERP).",
      },
      {
        key: "delivery.test_drive",
        label: "Would you like a home visit / test drive?",
        control: "radio",
        bom: "Scheduling (ERP).",
        options: [
          { code: "TD_YES", label: "Yes, please" },
          { code: "TD_MAYBE", label: "Maybe later" },
          { code: "TD_NO", label: "Not needed" },
        ],
      },
      {
        key: "delivery.timeframe",
        label: "When are you hoping to receive your Centaur?",
        control: "select",
        bom: "Prioritisation (ERP).",
        options: [
          { code: "TF_ASAP", label: "As soon as possible" },
          { code: "TF_3M", label: "Within 3 months" },
          { code: "TF_6M", label: "Within 6 months" },
          { code: "TF_EXPLORING", label: "Just exploring" },
        ],
      },
      {
        key: "delivery.access_notes",
        label: "Access / parking notes for delivery",
        control: "textarea",
        maxLength: 400,
        placeholder: "e.g. step-free access, parking restrictions…",
        hint: "Optional.",
        bom: "Logistics note (ERP).",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** All fields across all steps, in flow order. */
export function allBuildFields(): BuildField[] {
  return BUILD_STEPS.flatMap((s) => s.fields);
}

/** Look up a field by its dotted key. */
export function buildFieldByKey(key: string): BuildField | undefined {
  return allBuildFields().find((f) => f.key === key);
}

/** Human label for an option code within a field (falls back to the code). */
export function optionLabel(field: BuildField, code: string): string {
  return field.options?.find((o) => o.code === code)?.label ?? code;
}

/** Total number of steps in the flow (excludes welcome/review/submitted screens). */
export const BUILD_STEP_COUNT = BUILD_STEPS.length;
