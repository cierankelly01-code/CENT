# Centaur Website — Go-Live Runbook

Everything needed to take this from local to live. Follow top to bottom.

## 1. Supabase (lead capture) — ~5 min
1. Create a free project at https://supabase.com.
2. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and **Run**.
   - This creates the `quote_requests` table, the `config_payload` (jsonb) column the
     configurator writes the full spec into, and the Row-Level Security policy that lets the
     site insert leads but lets nobody read them from the browser.
3. **Project Settings → API** — copy the **Project URL** and the **anon public** key.

## 2. Environment variables
Create `.env.local` in the project root (template in `.env.local.example`):
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-anon-key
```
Run locally to test: `npm install` then `npm run dev` → http://localhost:3000.
Submit the configurator, then check **Table Editor → quote_requests** in Supabase — you should
see a row, with the full spec under `config_payload`.

## 3. Deploy to Vercel
1. Push this repo to GitHub.
2. On https://vercel.com → **Add New → Project** → import the repo (it auto-detects Next.js).
3. Add the **same two env vars** under Project → Settings → Environment Variables.
4. Deploy. Add the custom domain `centaurrobotics.com` under Settings → Domains.
   - If the final domain differs, update `metadataBase` / `BASE` in `app/layout.tsx`,
     `app/sitemap.ts`, `app/robots.ts`.

## 4. Before it's public — content & assets (flagged in code)
- [ ] **Founder story sign-off** — `{/* PENDING FOUNDER SIGN-OFF */}` in `Story.tsx`.
- [ ] **Funding / partners / trials** — reserved, flagged in `Credibility.tsx`. Don't publish unverified.
- [ ] **Market stats** (1.2m / 9% / 400k) — press-sourced; confirm a citable source (`Credibility.tsx`).
- [ ] **Privacy policy** — replace placeholder copy (`app/privacy/page.tsx`).
- [ ] **Footer company details** — real phone, registered office address, and company number (`Footer.tsx`, marked `[TBC]`). Legally required for a UK Ltd.
- [ ] **JSON-LD** — confirm org name/socials in `app/layout.tsx` (add `sameAs` social URLs).
- [ ] **Real imagery** — drop high-res files into `public/assets/product/` (see that folder's README).
      Biggest single upgrade: one professional lifestyle/product photo, and/or a `centaur.glb`.
- [ ] **OG share image** — `app/opengraph-image.tsx` is a generated placeholder; swap for a real render.

## Status (built & verified)
- Multi-page site + 6-step engineering-grade configurator → writes `config_payload`.
- Accessibility: **0 axe-core violations (WCAG 2.1 AA)** across every page.
- Production build: clean (11 routes). No price shown (by request).
