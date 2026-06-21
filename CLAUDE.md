# CLAUDE.md — Centaur Robotics

Project context for Claude Code. Read this first every session.

## What this is
A premium, accessible marketing website for **Centaur Robotics** and their self-balancing
wheelchair, the Centaur. Cieran's first agency client. Phase 1 (this repo) = the marketing
site + lead-capture configurator. Phase 2/3 = a deep build-configurator and a company ops
system (see `docs/PHASE-2-OPS.md`).

## Who I'm working with
Cieran — agency owner, drives the creative/product calls; not a deep engineer, so explain
clearly and do the technical work. He wants this to slot in with serious ("big-boy") clients,
so the engineering standard matters as much as the design.

## Stack
Next.js (App Router) + TypeScript · Tailwind (channel-based CSS-var tokens) · Supabase
(lead capture) · Vercel (auto-deploys from `main`). Fonts: Space Grotesk (display) + Inter (body).

## How we work (non-negotiable workflow)
- **Branch → PR → CodeRabbit + CI → merge.** `main` is protected; never commit to it directly.
  Use `gh` (full path on Windows: `C:\Program Files\GitHub CLI\gh.exe`).
- CI (`.github/workflows/ci.yml`) runs lint + build on every PR. Keep it green.
- Vercel auto-deploys `main`. A merged PR = live in ~2 min.
- **Never run `npm run build` while `npm run dev` is running** — it corrupts `.next`.

## Quality bar (every change)
- **WCAG 2.1 AA** — this is a disability product; accessibility is a hard gate. Verify with
  axe-core (inject from CDN, run wcag2a/2aa/21a/21aa) — target **0 violations**.
- Lint-clean (`npm run lint`), no hard-coded colours (use Tailwind tokens), responsive 320–1440,
  honour `prefers-reduced-motion`.

## Operating efficiently (token-conservative)

- Terse narration; short commit messages and PR bodies.
- Don't re-read files already seen in the session; prefer `grep` over reading whole files.
- Use a subagent for any big multi-file search.

## Guardrails (don't cross)
- No medical/clinical/health claims; no off-road capability claims (smooth-surface positioning only).
- No invented funding figures, partner names, or trial results — placeholders flagged `CLIENT —` /
  `TBC` / sign-off comments until the client supplies real ones.
- Founder/family story is built but flagged `PENDING FOUNDER SIGN-OFF`.

## Real product facts (safe to use)
Self-balancing on two wheels · seat 480–820mm (eye level) · 470mm wide (doorways) · ~75kg,
dismantles into 3 parts · 4mph, 10+ mile range · twin independent motors, fail-safe (stabiliser
legs on power loss) · joystick or app · leather/composite · in production, pre-order open.

## Key files
- `app/` routes · `components/` + `components/sections/` UI · `lib/supabase.ts` client
- `supabase/schema.sql` table + RLS (`config_payload` jsonb + `status` are the Phase-2 seam)
- `docs/` — BUILD-SYSTEM (backlog), GO-LIVE (launch runbook), PHASE-2-OPS (next phases)

## Outstanding (client-supplied)
Real logo `.svg`, 3D CAD/`.glb`, real testimonials, company no./address/phone, real privacy copy,
founder sign-off. A hero product video is the one design ceiling left (see Remotion route).
