# Phase 2 — Deep Build Configurator (System #2)

**Status: SPEC for sign-off. No code until Cieran approves.**

The customer-facing "Build Studio" — the proper, deep spec tool we send to a serious
customer once they're engaged. They fully configure the actual Centaur they want built:
every dimension, finish, control, accessory. Distinct from the lightweight `/configure`
inquiry tool on the marketing site.

It is **System #2** of the three in `docs/PHASE-2-OPS.md`:
1. Marketing inquiry configurator (`/configure`, Phase 1 — done)
2. **Deep build configurator (this spec)**
3. Company ERP (reads the build, explodes the BOM, computes price + ETA)

The job here is to capture a complete, **BOM-ready, versioned** specification with a unique
quote reference, and hand it cleanly to the ERP. **No pricing in this build** — pricing is
the ERP's job — but every field is structured so the ERP can price it.

---

## 1. Architecture

**Recommendation: a dedicated route group *inside this repo*, not a separate app or repo.**

Build it as `app/(build)/build/[ref]/…` with its **own layout** (`(build)/layout.tsx`) that
drops the marketing nav/footer and presents a focused "Centaur Build Studio" chrome (Logo +
save indicator + reference number only). The customer reaches it via a unique link, so it
reads as its own bespoke experience even though it shares the codebase.

| Option | Feels bespoke | Reuses design system | ERP integration | Cost / risk |
|---|---|---|---|---|
| **Route group in this repo (recommended)** | ✅ own layout + unique link | ✅ tokens/fonts/components directly | ✅ same Supabase project, no cross-service auth | One deploy, one CI, no token drift |
| Separate Next.js app (monorepo or standalone) | ✅ | ⚠️ must duplicate or package the design system → drift | ✅ if same Supabase project | Two builds/deploys, shared-token maintenance |
| Separate repo | ✅ | ❌ worst — design system copied, diverges fast | ⚠️ extra config to share Supabase creds | Highest overhead, weakest brand consistency |

Why colocating doesn't hurt the "send a customer" feel: the ERP seam is at the **data
layer** (Supabase), not the app layer. A route group already gives full visual/navigational
separation. We can always lift it to its own deploy later (e.g. `build.centaurrobotics.com`
via a Vercel rewrite) without touching the data model — so we keep optionality cheaply.

**Key architectural shift from `/configure`:** the marketing form writes directly with the
**anon** key (insert-only, no read-back — that's why RLS forbids anon `select`). The deep
configurator must **read state back** for resumable links, so anon-direct won't work. Instead:

- All reads/writes go through **server-side Route Handlers** (`app/api/build/…`) using the
  **Supabase service-role key** (server-only env var, never shipped to the browser).
- Every request is scoped by a **capability token** in the URL (see §3). The server validates
  the token → resolves the `ref` → reads/writes only that row. The table stays locked to the
  browser; the service role is gated behind our token check.
- This also gives us a clean place to send emails, generate the reference, and snapshot
  versions atomically.

Stack stays identical: Next.js App Router + TypeScript + Tailwind tokens + Supabase + Vercel.

---

## 2. Data model (Supabase — proposed, do not run yet)

Three tables. `build_configs` is the live record; `build_config_versions` is append-only
history; `build_config_events` is a light audit/activity log the ERP and staff view can read.

```sql
-- Live build record (one per customer build).
create table build_configs (
  id              uuid primary key default gen_random_uuid(),
  ref             text unique not null,          -- human code, e.g. "CEN-7K2Q4" (server-generated)
  access_token_hash text not null,               -- sha-256 of the capability token; raw token only in the link
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  -- Optional link back to the marketing inquiry that started it.
  quote_request_id uuid references quote_requests(id),

  -- Customer identity (captured/confirmed in the studio).
  customer_name   text,
  customer_email  text,
  customer_phone  text,

  -- Lifecycle (customer-facing portion; ERP extends downstream).
  status          text not null default 'draft'
                  check (status in ('draft','submitted','under_review','quoted','confirmed','archived','abandoned')),

  -- The current specification. Structured, BOM-ready (see shape below).
  config_payload  jsonb not null default '{}'::jsonb,
  config_version  int not null default 1,        -- mirrors latest row in build_config_versions

  submitted_at    timestamptz,

  -- UK GDPR consent record.
  consent_given   boolean not null default false,
  consent_at      timestamptz,
  consent_text    text                           -- exact wording shown, for audit
);

-- Append-only version history: a snapshot every time the spec is saved/submitted/edited.
create table build_config_versions (
  id              uuid primary key default gen_random_uuid(),
  build_config_id uuid not null references build_configs(id) on delete cascade,
  version         int not null,
  config_payload  jsonb not null,
  created_at      timestamptz default now(),
  created_by      text not null default 'customer'
                  check (created_by in ('customer','staff','erp')),
  note            text,
  unique (build_config_id, version)
);

-- Light activity log (opened, saved, submitted, staff edited, status changed…).
create table build_config_events (
  id              uuid primary key default gen_random_uuid(),
  build_config_id uuid not null references build_configs(id) on delete cascade,
  created_at      timestamptz default now(),
  actor           text not null default 'customer',  -- 'customer' | 'staff:<email>' | 'system'
  event           text not null,                     -- 'created','opened','autosaved','submitted','status_changed','staff_edited'
  detail          jsonb
);

-- RLS: lock all three to the browser entirely. No anon/auth policies →
-- only the service-role key (server-side route handlers) can touch them.
alter table build_configs          enable row level security;
alter table build_config_versions  enable row level security;
alter table build_config_events    enable row level security;
-- Staff read/write later: add policies scoped to authenticated staff (Supabase Auth), per PHASE-2-OPS.
```

**Reference number (`ref`):** server-generated, human-readable, collision-checked —
`CEN-` + 5 chars from an unambiguous alphabet (no `0/O/1/I`). Used in the URL, emails,
the quote, and as the customer's spoken reference on a call.

**Versioning:** every meaningful save writes a new `build_config_versions` row and bumps
`build_configs.config_version`. "Customer changed their mind" = a new version, full history
kept. Staff edits are versions with `created_by='staff'`. The ERP reads the latest version
(or pins a specific one for a quote).

**`config_payload` shape (BOM-ready).** Each chosen option carries a **stable
`option_code`** so the ERP maps `option_code → BOM line(s)` deterministically — labels can
change without breaking the mapping:

```jsonc
{
  "schema_version": 1,
  "selections": {
    "seat.width":        { "option_code": "SEAT_W_470", "value": "470mm" },
    "control.type":      { "option_code": "CTRL_JOYSTICK", "value": "Joystick" },
    "control.mount_side":{ "option_code": "MOUNT_RIGHT", "value": "Right" },
    "upholstery.material":{ "option_code": "UPH_LEATHER", "value": "Leather" }
    // …one entry per field in §4
  },
  "freeText": {
    "engraving": "For Alfie",
    "posture_notes": "…"
  },
  "meta": { "completed_steps": [0,1,2], "last_step": 3 }
}
```

The ERP's pricing/BOM table becomes simply `option_code → { components[], price_delta,
lead_time }`. This file deliberately defines **no prices** — only codes.

---

## 3. Access & resumability

**Capability-link model (recommended):** each customer gets a unique link:

```
/build/CEN-7K2Q4?t=<high-entropy-token>
```

- The **token is the secret** (a bearer "capability URL"). Server stores only its SHA-256
  hash; the raw token lives only in the link/email. Validates token → `ref` → row.
- **Server-side save** on every step (debounced autosave → `PATCH /api/build/:ref`),
  **plus a localStorage mirror** keyed by `ref` for instant paint on return and resilience if
  they're briefly offline. Server is the source of truth; local is a cache.
- **Resume = just reopen the link.** No password, minimal friction (right for a
  high-consideration purchase).

**Email gate — recommend LIGHT, not full auth:**
- On first open, confirm/enter email, and **email the same link back** so the customer always
  has it (and we have a verified contact). This is a soft confirmation, not a login wall.
- Optionally support "email me my link" recovery from the landing screen (enter email →
  if it matches a build, we re-send the link). Avoids building full magic-link auth now.
- Full Supabase Auth is reserved for **staff** (next bullet), consistent with PHASE-2-OPS.

**Staff-facing view (in scope to plan, build incrementally):**
- `app/(staff)/staff/builds/[ref]` behind **Supabase Auth + RLS** (the Phase-2 auth seam).
- Staff can **view** the full submitted spec, **version history**, and **event log**; **edit**
  the spec (writes a `created_by='staff'` version); change `status`; add notes.
- This is the bridge into System #3 — the ERP later reads the same tables.

---

## 4. The full option set (mapped to the BOM)

Grouped by configurator step. **Every field → an `option_code` the ERP turns into BOM
line(s).** ⚠️ = uses only real product facts; anything beyond CLAUDE.md's confirmed specs is
flagged **TBC (client to confirm option list)**. No medical/clinical framing — postural items
are described as **comfort & fit**, not therapeutic.

### A. About you & the user (carries from `/configure`)
| Field | Type | → BOM relevance |
|---|---|---|
| For whom (self / cared-for / org) | radio | routing, not BOM |
| Primary environments (home/outdoor-smooth/work/venue) | multi | informs defaults; ⚠️ smooth-surface only, no off-road |
| Daily usage intensity | radio | battery/charge guidance (no extra SKU) |

### B. Seat & fit ⚠️
| Field | Type | → BOM |
|---|---|---|
| User height band | select | calibration profile (real: seat 480–820mm eye-level) |
| User weight band | select | self-balancing calibration (real fact); no SKU |
| Seat width | select (incl. 470mm doorway-friendly ⚠️) | seat frame SKU |
| Seat depth | select | seat pan SKU **TBC range** |
| Cushion type/firmness (comfort) | select | cushion SKU **TBC** |
| Backrest height | select | backrest SKU **TBC** |
| Headrest (none / standard) | radio | headrest SKU **TBC** |
| Armrest style/height | select | armrest SKU **TBC** |
| Transfer method (independent/assisted/hoist) | radio | armrest/clearance config |

### C. Postural support & comfort (NON-clinical wording) **TBC**
| Field | Type | → BOM |
|---|---|---|
| Lateral supports (none/light/contoured) | select | support SKU **TBC** |
| Pelvic/positioning belt (comfort/security) | radio | belt SKU **TBC** |
| Tilt/recline preference | select | mechanism SKU **TBC — confirm availability** |
| Posture/comfort notes | free text | flag to staff, not auto-BOM |

### D. Controls ⚠️
| Field | Type | → BOM |
|---|---|---|
| Control type (joystick / app / both) | radio | controller SKU (real: joystick or app) |
| Mounting side (left/right/either) | radio | mount-side assembly |
| Joystick type/grip | select | grip SKU **TBC** |
| Secondary controls / attendant control | radio | attendant module SKU **TBC** |

### E. Drive & pace ⚠️
| Field | Type | → BOM / config |
|---|---|---|
| Pace profile (gentle/balanced/brisk, ≤4mph) | radio | firmware profile (real: 4mph) |
| Range expectation (10+ mile baseline) | info/select | battery option **TBC if >baseline** |

### F. Upholstery & finish ⚠️
| Field | Type | → BOM |
|---|---|---|
| Upholstery material (leather / composite / vegan ⚠️) | radio | material SKU (real: leather/composite) |
| Upholstery colour | select | colourway SKU **TBC palette** |
| Frame finish (graphite/bronze/bone…) | select | finish SKU **TBC palette** |
| Stitching/accent | select | trim SKU **TBC** |

### G. Footplate & transport ⚠️
| Field | Type | → BOM |
|---|---|---|
| Footplate style/height | select | footplate SKU **TBC** |
| Dismantle/transport need (real: 3 parts, ~75kg) | info + radio | travel-case SKU **TBC** |
| Vehicle/boot constraints | free text | logistics note |

### H. Accessories **TBC catalogue**
Multi-select, each its own SKU: travel/storage bag, cup holder, phone mount, cane/crutch
holder, weather cover, lighting, spare charger, etc.

### I. Personalisation
| Field | Type | → BOM |
|---|---|---|
| Engraving (≤40 chars) | free text | engraving line item |

### J. Delivery & next steps
| Field | Type | → ERP |
|---|---|---|
| Delivery region/postcode area | text/select | ETA + logistics (ERP) |
| Home install / test-drive wanted | radio | scheduling (ERP) |
| Target timeframe | select | prioritisation |
| Access/parking notes for delivery | free text | logistics |

> **Action for Cieran/client:** the **TBC** option lists (exact seat depth steps, cushion
> types, colour palettes, accessory catalogue, whether tilt/recline exists) need the client's
> real product matrix before we finalise the `option_code` registry. We'll build the engine
> against a placeholder registry and swap in real codes when supplied.

---

## 5. Flow

Multi-step, mobile-first, autosaving, with a progress indicator (reuse the `/configure`
pattern: "Step X of N" + bronze progress bar).

1. **Welcome / resume** — branded landing for the link: "Your Centaur build, `CEN-7K2Q4`."
   Confirm email (light gate, §3). Shows last-saved state if returning.
2. **About you & the user** (group A)
3. **Seat & fit** (B)
4. **Postural support & comfort** (C)
5. **Controls** (D)
6. **Drive & pace** (E)
7. **Upholstery & finish** (F)
8. **Footplate & transport** (G)
9. **Accessories** (H)
10. **Personalisation** (I)
11. **Delivery & preferences** (J)
12. **Review & confirm** — full summary, every line with an **Edit** link back to its step
    (reuse `/configure` review pattern); **UK GDPR consent** checkbox with exact wording
    recorded to `consent_text`; **"What happens next"** panel.
13. **Submitted** — show the reference, "we've emailed your spec", what happens next. Sets
    `status='submitted'`, `submitted_at`, writes a version + event, fires emails.

**Emails (Resend):** from `hello@centaurrobotics.com` — flagged **TBC until the sending
domain is verified**; use a Resend test sender until then.
- **Customer:** confirmation with their `ref`, a summary, and their resumable link.
- **Staff:** notification a build was submitted, link to the staff view.

**Explicitly NO hard pricing** anywhere in this build. The review/summary shows the *spec*,
not a price; copy sets expectation that a tailored quote follows (ERP). Data is structured
(`option_code`s) so the ERP can compute price + ETA the moment it reads the record.

**Accessibility (hard gate — WCAG 2.1 AA, 0 axe-core violations):**
- Reuse the `/configure` accessible primitives (`role="radio"`/`aria-checked`, `aria-pressed`
  chips, labelled inputs, `role="alert"` errors, `aria-live` step region, visible bronze
  focus ring, keyboard-complete).
- Per-step axe-core audit (wcag2a/2aa/21a/21aa) at each PR; honour `prefers-reduced-motion`;
  responsive 320–1440; bronze-deep for text/buttons on light (contrast).

---

## Environment & server boundary

The deep configurator reads state back, so (unlike `/configure`) it does **not** touch
Supabase from the browser. All access is server-side, via Route Handlers under
`app/api/build/…`, using a new **server-only** env var:

| Env var | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | already set | shared with Phase 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | **add in Vercel** (server-only) | bypasses RLS — never exposed to the client; gated behind the capability-token check. CI uses a dummy value. |
| `RESEND_API_KEY` | add in Vercel (server-only) | transactional email on submit. Without it, email is skipped (submit still works). |
| `RESEND_FROM` | optional | e.g. `Centaur Robotics <hello@centaurrobotics.com>` — TBC until domain verified; defaults to Resend's test sender. |
| `STAFF_NOTIFY_EMAIL` | optional | where staff submission alerts go; defaults to hello@centaurrobotics.com. |

Endpoints (all Node runtime, `force-dynamic`, capability-token gated):
`POST /api/build` (create draft → returns `ref` + one-time `token`) ·
`GET /api/build/:ref` (load) · `PATCH /api/build/:ref` (autosave) ·
`POST /api/build/:ref/submit` (consent + version snapshot + status → submitted).
Untrusted payloads pass through `validatePayload()` (registry-checked, label re-derived
server-side). Autosave updates the live row only; versions are snapshotted at submit (and
later staff edits) to avoid per-keystroke version spam.

## Incremental delivery plan (small PRs, each CI-green + axe-clean)

1. **Schema + types** — `supabase/build-schema.sql`, the `option_code` registry, TS types. ✅ (PR 1)
2. **Server access layer** — Route Handlers (create / read / autosave / submit), token
   hashing, `ref` generation, versioning, event log. RLS locked; service-role server-only.
3. **Studio shell** — `(build)` route group + layout (branded chrome, save indicator).
4. **Steps, incrementally** — groups A→J as separate PRs, each axe-audited.
5. **Review + consent + submit** — summary, GDPR record, status transition.
6. **Emails** — customer confirmation + staff notification (provider TBC).
7. **Staff view** — read/version/event + edit (Supabase Auth) — bridges to System #3.

## Decisions (confirmed 2026-06-20)
- **Option registry:** build against a **placeholder registry with stable `option_code`s,
  flagged TBC**; swap in real options/specs when the client confirms. ✅
- **Email:** **Resend**, from `hello@centaurrobotics.com` (**TBC until domain verified** —
  Resend test sender until then). ✅
- **Access gate:** **light email gate** — confirm the customer's email and re-send the link.
  Full Supabase Auth only for the **staff view**. ✅
- **Link delivery:** **staff sends the link manually for now** (deliberate handoff to serious
  customers). Architect so **auto-issue on `/configure` submit** can be added later — but don't
  build that yet. ✅

## Still to confirm with the client (non-blocking)
- **Real option matrix** for all **TBC** lists (seat depth steps, cushions, palettes,
  accessories, tilt/recline availability) — swap into the registry when supplied.
- Keep it at `/build/...` for now, or stand up `build.centaurrobotics.com` at launch?
  (Data model is unaffected either way.)
