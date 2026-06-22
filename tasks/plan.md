# Implementation Plan: Fleet Portal + Configure Enhancements

## Overview
Three additions to the Centaur demo:
1. `/fleet` — bulk buyer portal (NHS, stadium, care home) showing all chairs per org: battery %, charge status, location, next service, alerts. Demo mode, same pattern as `/staff`.
2. VAT relief checkbox on `/configure` — 0% VAT flag for disabled buyers.
3. OT referral option on `/configure` — "Are you working with an occupational therapist?"

## Architecture Decisions
- Fleet demo data lives in `lib/fleet/demo.ts` (mirrors `lib/admin/demo.ts` pattern)
- Fleet portal has its own layout at `app/fleet/layout.tsx` — separate from staff, separate nav
- No new auth required — demo mode only; same `NEXT_PUBLIC_STAFF_DEMO=1` gate
- Configure changes are purely client-side additions to `components/ConfigureClient.tsx`
- No DB schema changes needed (configure additions captured in `config_payload` jsonb)

## Dependency Graph
```
lib/fleet/demo.ts (types + data)
    │
    ├── app/fleet/layout.tsx (nav + demo banner)
    │       │
    │       ├── app/fleet/page.tsx (org selector / dashboard)
    │       └── app/fleet/[org]/page.tsx (fleet list for one org)
    │               │
    │               └── app/fleet/[org]/[serial]/page.tsx (individual chair)
    │
    └── components/fleet/ChairCard.tsx (reusable status card)

components/ConfigureClient.tsx (add VAT + OT fields — self-contained)
```

---

## Phase 1: Configure form enhancements

### Task 1: VAT relief + OT referral fields on /configure
**Description:** Add two fields to `ConfigureClient.tsx`: (1) a VAT relief checkbox — "I am purchasing for a disabled person (0% VAT may apply under HMRC regulations)"; (2) an OT referral radio — "Are you working with an occupational therapist? Yes / No / Not yet". Both captured in the existing `config_payload` submission object.

**Acceptance criteria:**
- [ ] VAT relief checkbox appears on the form before the submit button
- [ ] OT referral radio appears above the VAT checkbox
- [ ] Both values are included in the Supabase submission payload
- [ ] Form still submits and validates correctly without either field filled

**Verification:**
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Manual: fill form, check Supabase `config_payload` includes `vat_relief` and `ot_referral`

**Dependencies:** None

**Files touched:**
- `components/ConfigureClient.tsx`

**Estimated scope:** S

---

## Checkpoint: Phase 1
- [ ] Lint + build clean
- [ ] Configure form works end-to-end

---

## Phase 2: Fleet demo data

### Task 2: Fleet types + demo data
**Description:** Create `lib/fleet/demo.ts` with three demo organisations (NHS Trust, Premier League stadium, care home) each with 6–12 chairs. Each chair has: serial, location/zone, battery %, charge status (charging/active/idle/maintenance), next service date, last active timestamp, alert flag.

**Acceptance criteria:**
- [ ] Three orgs defined: `nhs-trust`, `city-stadium`, `riverside-care`
- [ ] Each org has 6–12 chairs with realistic varied data (some low battery, some in maintenance)
- [ ] At least 2 chairs per org have an alert (battery < 20% or service overdue)
- [ ] Types exported cleanly, no `any`

**Dependencies:** None

**Files touched:**
- `lib/fleet/demo.ts` (new)

**Estimated scope:** S

---

## Phase 3: Fleet portal pages

### Task 3: Fleet layout + org selector
**Description:** Create `app/fleet/layout.tsx` (Centaur logo, "Fleet" label, demo banner matching staff pattern) and `app/fleet/page.tsx` (three org cards: name, chair count, alert count, "View fleet" link).

**Acceptance criteria:**
- [ ] `/fleet` renders three org cards
- [ ] Each card shows org name, total chairs, chairs needing attention count
- [ ] Demo banner visible (same style as staff)
- [ ] Accessible: heading hierarchy correct, links have descriptive labels

**Dependencies:** Task 2

**Files touched:**
- `app/fleet/layout.tsx` (new)
- `app/fleet/page.tsx` (new)
- `components/fleet/DemoBanner.tsx` (reuse or alias staff one)

**Estimated scope:** M

### Task 4: Fleet org dashboard (chair grid)
**Description:** `app/fleet/[org]/page.tsx` — grid of ChairCard components for the selected org. Each card: serial number, location/zone, battery bar (colour-coded: green >50%, amber 20–50%, red <20%), charge status badge, next service date, alert highlight if attention needed.

**Acceptance criteria:**
- [ ] Grid renders all chairs for the org
- [ ] Battery bar is colour-coded correctly
- [ ] Alert cards visually distinct (amber border or red indicator)
- [ ] "View details" link per card goes to `/fleet/[org]/[serial]`
- [ ] 404 for unknown org slug

**Dependencies:** Task 3

**Files touched:**
- `app/fleet/[org]/page.tsx` (new)
- `components/fleet/ChairCard.tsx` (new)

**Estimated scope:** M

### Task 5: Individual chair detail page
**Description:** `app/fleet/[org]/[serial]/page.tsx` — full chair detail: header (serial, org, status badge), battery gauge, location, last active, next service, service history log (3–4 demo entries), alert banner if attention needed.

**Acceptance criteria:**
- [ ] All chair fields render correctly
- [ ] Service history shown as timeline (date + action)
- [ ] Back link to org fleet dashboard
- [ ] 404 for unknown serial

**Dependencies:** Task 4

**Files touched:**
- `app/fleet/[org]/[serial]/page.tsx` (new)

**Estimated scope:** M

---

## Checkpoint: Phase 3
- [ ] `npm run lint` clean
- [ ] `npm run build` clean
- [ ] `/fleet` → org → chair → back navigation works
- [ ] All three orgs render correct data

---

## Phase 4: PR + merge

### Task 6: PR, CI, merge
- Open PR from feature branch to `main`
- CI (lint + build) green
- Merge → Vercel deploys

---

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| `[org]` dynamic route conflicts | Low | Use string slug matching in demo data lookup |
| Configure form submission breaks with new fields | Low | Both fields optional; payload is jsonb |
| Demo banner import duplication | Low | Re-export or alias from staff component |

## Open Questions
- None — all demo data, no backend required
