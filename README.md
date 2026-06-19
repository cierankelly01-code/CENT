# Centaur Robotics — Website

A premium, accessible marketing site for **Centaur Robotics** and their self-balancing
wheelchair, the Centaur. Built as Phase 1 of a larger engagement (the website + lead
capture now; a staff operations system later — see [`docs/PHASE-2-OPS.md`](docs/PHASE-2-OPS.md)).

## Stack
- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** — design tokens as channel-based CSS variables (see `app/globals.css`, `tailwind.config.ts`)
- **Supabase** — lead capture (`quote_requests`)
- **Vercel** — hosting target
- Fonts: **Space Grotesk** (display) + **Inter** (body), via `next/font`

## Getting started
```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase keys
npm run dev                         # http://localhost:3000
```

> ⚠️ Don't run `npm run build` while `npm run dev` is running — it corrupts the dev cache.
> Stop the dev server first.

## Environment variables
| Key | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key (insert-only via RLS) |

## Scripts
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint

## Structure
```
app/                 routes (/, /the-centaur, /story, /who-its-for, /why-us, /configure, /privacy)
components/          shared + section components
components/sections/ page sections
lib/supabase.ts      typed Supabase client
public/assets/       product + lifestyle imagery
supabase/schema.sql  table + Row-Level Security
docs/                BUILD-SYSTEM, GO-LIVE runbook, PHASE-2-OPS
```

## Database
Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor. It creates
`quote_requests` (with the `config_payload` jsonb + `status` columns the configurator and
the future ops system use) and an RLS policy: **anon can insert leads, nobody can read them
from the browser.**

## Quality bar
- **Accessibility:** WCAG 2.1 AA — verified with axe-core, 0 violations across all pages.
- **Responsive:** mobile-first, tested 320 / 768 / 1024 / 1440.
- **Motion:** honours `prefers-reduced-motion`.
- **SEO:** per-page metadata, Open Graph image, JSON-LD, sitemap + robots.

## Deployment
See [`GO-LIVE.md`](GO-LIVE.md) for the full launch runbook (Supabase → env → Vercel → domain),
plus the pre-public checklist of client-supplied items (flagged `[TBC]` / sign-off in code).
