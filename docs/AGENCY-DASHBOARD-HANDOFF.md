# Agency Control Panel — Handoff Brief
*Written 2026-06-23. Start a fresh chat and paste this entire file as your first message.*

---

## Who you're working with

**Cieran** — solo agency owner, first major client is Centaur Robotics (see below). Not a deep engineer, drives creative/product decisions. Wants you to execute autonomously — only surface if genuinely blocked. Terse responses, short commits, Grep over full reads, subagents for multi-file searches.

## What we're building in this session

A **new repo** — Cieran's private agency operations dashboard. Think mission control: one place to see every client, every system, live status, errors, last deploy. Built for him, not for clients to see.

**Repo name suggestion:** `ctrl` (as in control panel)

**Stack:** Next.js App Router + TypeScript + Tailwind. Same patterns as the Centaur site. Vercel deploy. No Supabase needed yet — data comes from APIs (Vercel, uptime checks).

---

## The Centaur project (first client to add)

### What's live (as of 2026-06-23)

| System | URL path | Status |
|--------|----------|--------|
| Marketing website | `/` | Live, WCAG 2.1 AA |
| Customer configurator | `/configure` | Live — org branch, OT referral, VAT relief |
| Staff ERP | `/staff` | Live — demo mode (`NEXT_PUBLIC_STAFF_DEMO=1`) |
| Fleet portal | `/fleet` | Live — 3 orgs (NHS, stadium, care home) |

**Repo:** `github.com/cierankelly01-code/CENT`
**Stack:** Next.js 14 App Router, TypeScript, Tailwind, Supabase, Vercel
**Deploy:** Vercel, auto-deploys from `main`
**CI:** GitHub Actions — lint + build + axe WCAG 2.1 AA on every PR

### What's blocked (waiting on Julian's data)
- Real parts/supplier list → live inventory
- Real pricing → quote engine
- Staff email accounts → real Supabase Auth (currently bypassed in demo mode)
- Deep build configurator → needs full option registry

### Next Centaur session trigger
Julian (chairman) replies with real data. New chat, reference `CLAUDE.md` + `docs/PHASE-2-OPS.md`. Wire real data into staff + fleet, harden auth, start deep configurator.

---

## The agency dashboard — what to build

### Core concept

One dashboard app Cieran logs into. Each client is a card. Click a client → see all their systems as status nodes. Each node shows: live/broken/warning, last deploy timestamp, error count.

### Session 1 goals (this chat)

1. **New repo `ctrl`** — scaffold Next.js + Tailwind, deploy to Vercel
2. **Auth** — simple password gate (single user, no Supabase needed — env var secret or NextAuth with credentials)
3. **Home page** — client grid. One card per client. Start with Centaur.
4. **Centaur client page** — 4 system nodes (website, configurator, staff, fleet), each showing:
   - Live status (green/amber/red) via uptime ping
   - Last Vercel deploy (via Vercel API — read-only token)
   - Link to the live URL
   - Link to the GitHub repo
5. **Vercel API integration** — fetch latest deployment per project, show status + timestamp

### Design direction

- Dark theme (this is an internal ops tool, not client-facing)
- Monospace accents for data (deploy timestamps, error counts)
- Brand: "CTRL" — clean, technical, confident
- Status colours: `emerald-400` = healthy, `amber-400` = warning, `red-400` = error
- Think Vercel dashboard meets Linear — dense information, no fluff

### What NOT to build yet
- The visual node/string diagram (save for Phase 2 — clean cards first)
- Self-healing agent loop (Phase 3 — needs monitoring layer first)
- Multi-user auth (just Cieran for now)

---

## Handoff triggers — when to start a new chat

| Trigger | New chat focus |
|---------|---------------|
| Julian sends real data | New chat → Centaur Phase 2: wire real data, harden auth, start deep configurator |
| `ctrl` dashboard v1 is live | New chat → add Vercel API integration + error monitoring |
| Second client onboarded | New chat → generalise client card schema, add client 2 |
| Self-healing loop ready to spec | New chat → agent loop: monitor → detect → fix → deploy |

---

## Working style (non-negotiable)

- **Branch → PR → CI green → self-merge.** Never commit to main directly.
- **WCAG 2.1 AA** on every UI change. Axe is in CI — keep it green.
- **Subagents** for any multi-file search or parallel research. Fan out, synthesise concisely.
- **Terse.** Short commits, short PR bodies, short narration.
- `gh` full path on Windows: `C:\Program Files\GitHub CLI\gh.exe`
- Self-merge once CI (lint + build + axe) + CodeRabbit are green.

---

## What Cieran eventually wants

A **managed service product** — every client pays monthly for:
1. Live visibility into their systems (this dashboard)
2. Proactive maintenance (agent detects issues before client notices)
3. Fast fixes (Cieran describes to Claude, fix pushed in minutes)

The dashboard is the infrastructure that makes that product possible. Build it like a product, not a script.
