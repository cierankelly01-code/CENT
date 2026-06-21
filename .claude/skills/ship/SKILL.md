---
name: ship
description: Ship the current branch through the project's branch → CI + CodeRabbit → fix → self-merge loop. Use when a change is committed and ready to go to a PR and (if safe) merge to main.
---

# /ship — take a change from branch to merged

Drive a committed change through the team's non-negotiable workflow (see `CLAUDE.md`):
**branch → PR → CI + CodeRabbit → fix → merge.** Keep `main` always green and deployable.
Vercel auto-deploys `main`, so a merge = live in ~2 min.

`gh` path on Windows: `C:\Program Files\GitHub CLI\gh.exe`. Repo: `cierankelly01-code/CENT`.

## Steps

1. **Safety check.** Never commit or push to `main`. If on `main`, stop and ask the user to
   name a branch (or create a sensible `feat/…`, `fix/…`, `chore/…` branch first). Confirm
   the working tree changes are committed.

2. **Verify locally before pushing** (don't run `npm run build` while `npm run dev` is up):
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm run build` (with dummy Supabase env vars)
   - `npm run test:a11y` — axe-core must be **0 violations** (WCAG 2.1 AA; this is a hard gate
     for a disability product). If a flow/page was added, extend `e2e/a11y.spec.ts` first.
   - If a port-3000 server is already running, kill it first — a stale server makes Playwright
     test old code (`reuseExistingServer`).

3. **Push + open the PR** (`gh pr create`) with a short title and short body. If a PR already
   exists for the branch, just push.

4. **Wait for checks to settle**, then poll `gh pr checks <n>` until nothing is `pending`:
   `quality`, `accessibility`, `Vercel`, and `CodeRabbit`.

5. **Address findings.** Read CodeRabbit's review + inline comments
   (`gh api repos/cierankelly01-code/CENT/pulls/<n>/comments`). Fix every valid issue, push to
   the same branch, reply briefly, and re-poll. Skip invalid ones with a one-line reason.
   - If **Vercel** fails but CI passes, it's usually environment-specific (e.g. edge function
     bundling, env vars) — read the deploy logs and fix; don't merge on a red Vercel.

6. **Merge — only if safe.** When CI + Vercel are green and CodeRabbit has no blocking issues:
   `gh pr merge <n> --squash --delete-branch`, then `git checkout main && git pull`.

   **Do NOT self-merge — leave for the user — when the change is:**
   - **auth / security-sensitive** (login, middleware, RLS, service-role, tokens), or
   - a **brand / visual / copy** change, or anything needing client sign-off (testimonials,
     founder story, pricing, company/legal details, market-stat claims).
   For those, get the PR green, summarise, and hand back. Mark such PRs as **draft** with a
   `[PROPOSAL — do not merge]` title.

7. **Report** one line after each merge (or after handing back): what shipped + PR link.

## Guardrails (from CLAUDE.md)
No medical/clinical or off-road claims. No invented specs, pricing, partners, or figures —
flag client-supplied items `TBC`. No hard-coded colours (use the channel-based Tailwind
tokens). Responsive 320–1440. Honour `prefers-reduced-motion`. Terse commits/PR bodies.
