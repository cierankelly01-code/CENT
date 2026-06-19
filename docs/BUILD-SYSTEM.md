# Centaur Website — Autonomous Build System

This file is the self-directing brief. Any session (me, today or future) reads this,
picks the top unchecked task, executes it, verifies it in the browser, checks it off,
and appends new tasks it discovers. The human is only pulled in for **assets** or
**genuine decisions** (flagged ⛔). Everything else, just build.

## The mission
A £100k, next-gen product-launch site for Centaur Robotics — a self-balancing,
two-wheeled electric wheelchair. It must make investors feel they are looking at the
future of mobility. Beat the live incumbent (centaurrobotics.com) decisively.

## The quality bar (every task must clear all five)
1. **Awe in 3 seconds** — cinematic, considered, expensive.
2. **Art-directed, not stacked** — dramatic light/dark rhythm, real editorial type, signature moments.
3. **Engineered interaction** — smooth scroll choreography, deliberate hover/focus states.
4. **Flawless on mobile + keyboard + reduced-motion** — non-negotiable (disability product, WCAG 2.1 AA).
5. **Zero template smell** — if it looks like a Tailwind starter, redesign it.

## Guardrails (never cross)
- No medical/clinical/health claims. No off-road claims. No invented funding/partners.
- Founder/family story stays flagged `PENDING FOUNDER SIGN-OFF`.
- Real product facts only (see CLAUDE.md). Phase 1 only (no configurator/ops/pricing).

## SELF-DIRECTION (Cieran is not a prompt engineer — I write my own prompts)
Each working session, run this on my own initiative — never wait to be asked:
1. AUDIT every page with axe-core (inject from CDN via preview_eval, run wcag2a/2aa/21a/21aa).
   This is a disability product — WCAG 2.1 AA is a hard gate, not a nice-to-have.
2. Fix every violation, re-run until 0 across /, /the-centaur, /story, /who-its-for, /why-us, /configure.
3. Then do a craft pass: spacing, type, hierarchy, hover/empty/error states, mobile (320/768/1024/1440).
4. Log findings + fixes here. Keep guardrails (no medical/off-road/invented funding; founder story flagged).
Contrast cheatsheet: bronze (#B07D4B) FAILS as text on bone and as button-bg w/ bone text (3.1).
  → filled buttons + bronze text on LIGHT bg must use bronze-deep (#8A5E33, ~5.8). Muted text: /70 min.

## Verification loop (do this for every visual task)
1. Make the change. 2. Screenshot the affected section (desktop + mobile).
3. Compare against the bar. 4. If short, iterate before moving on. 5. Check off + log notes.

## Backlog (ordered; check off when done, append freely)
- [x] Cinematic dark hero with floating cut-out chair, glow, float motion, count-up stats
- [x] Nav floats over hero (light text at top → bone bar on scroll)
- [x] **Fix color tokens to channel-based** so Tailwind opacity modifiers work everywhere (systemic)
- [x] Scroll progress rail (bronze, top)
- [x] Film-grain depth overlay on dark sections (hero/story/credibility)
- [x] Hero chair enlarged + richer glow for monumental feel
- [ ] Story section: raise to hero's cinematic level (typography scale, image framing)
- [ ] Signature moment: "power-loss → stabiliser legs deploy / lowers gently" safety animation
- [ ] Explorer: refine hotspot positions on the real chair; add subtle entrance
- [x] Features: editorial sticky-heading + numbered list (grid-smell killed)
- [x] Credibility: real Paul Campbell quote + 1.2M / 9% / 400k market stats
- [x] Lifestyle cards: hover lift + image zoom (reduced-motion safe)
- [x] Copy voice rebuilt to best-in-class (WHILL/Figure/Anduril): radical word economy, capability-led. Hero halved, triadic line "Self-balancing · Eye-level · Yours", Who-it's-for tightened.
- [ ] Quote form: elevate to match (premium inputs, success state animation)
- [ ] Footer: refine
- [x] Hero direction: switched to WHILL-style full-bleed lifestyle (real person) — reads as a mobility co, not a robot co. (HeroLifestyle.tsx; old cinematic Hero.tsx kept as alt.)
- [x] Mobile nav: hamburger + drop panel, body-scroll lock, aria-expanded (was missing entirely)
- [ ] Full responsive pass (mobile/tablet) on every section
- [ ] Full keyboard + reduced-motion + contrast (AA) audit
- [ ] Performance pass (image sizing, priority, font loading)

## ⛔ Blocked on the client (asset/decision asks — surface, don't guess)
- 3D model (.glb/.step/CAD) of the chair → enables real interactive 3D viewer (the showstopper)
- Logo (SVG), founder headshots (David, Paul, Eric)
- Sign-off: publish £500k funding + investor names? Publish founders/family story?
- Higher-res / additional product + lifestyle photography (or budget a CGI render pass)

## Direction change (client, this session) — MAJOR
- Cieran: NO price shown (unknown; this build is to wow Julian + founders). Removed.
- Multi-page site (each section its own route), not a single landing.
- A configurator replaces "buy": user specs the chair → captured for the team.
- Sleek 2026 startup-grade. New typeface: Space Grotesk (display) + Inter (body).

### Architecture now
- Shared chrome (Nav/Footer/ScrollProgress/skip) in app/layout.tsx. Nav uses next/link routes.
- Routes: / (landing), /the-centaur, /story, /who-its-for, /why-us, /configure, /privacy.
- Each sub-page = PageHeader (light masthead, keeps nav contrast) + section component(s) + CtaBand.
- /configure = ConfigureClient.tsx: 4-step accessible configurator → writes config_payload jsonb
  (the reserved Phase-2 seam) + name/email/phone/enquiry_type into quote_requests. NO pricing/stock
  logic — pure requirement capture, team follows up (honours CLAUDE.md "no ops/pricing" spirit).
- HeroBuy.tsx is the live hero (light, type-led, product cutout, no price). Old Hero.tsx /
  HeroLifestyle.tsx kept as alternates.

## Session: hero + conversion substance
- Dropped the 3D/tilt hero idea (client). Hero product is now a bigger static cut-out.
- ProductViewer3D.tsx left in repo but unused — drop-in 3D path if a .glb ever arrives (set MODEL_URL).
- Added HowItWorks.tsx (Configure → We tailor → Test drive & delivery) + Faq.tsx (real buying Qs,
  native <details>, no invented price/warranty). Both on home before CtaBand.
- This is the conversion layer: reassurance content for a high-consideration purchase.

## Accessibility audit (axe-core, WCAG 2.1 AA) — PASSED
- Before: /the-centaur 12 serious contrast fails; / 9 (contrast + broken <dl>); others contrast.
- Root causes: bronze (#B07D4B) as button-bg/text on bone = 3.1 (need 4.5); muted /45–/60 text; <dl> with Reveal-div wrappers breaking dt/dd.
- Fixes: filled buttons + light-bg bronze text → bronze-deep; muted text → /70; home <dl> regrouped.
- After: / , /the-centaur, /story, /who-its-for, /why-us, /configure ALL return 0 violations.
- Explorer zoom reduced 1.12→1.05 (low-res photo was magnified into blur; real fix = better photo).

## Production-ready pass
- Configurator expanded to 6 steps with engineering depth: usage profile, weight (balance
  calibration), transfer method, home constraints, leading hand (control mounting), pace,
  a "Looking ahead" roadmap wishlist (honestly framed — no feature promised), personalisation
  (upholstery/tone/finish/engraving). All → config_payload. Re-audited: 0 a11y violations.
- Removed dead components: Hero.tsx, HeroLifestyle.tsx, QuoteForm.tsx, ProductViewer3D.tsx.
- Added app/sitemap.ts + app/robots.ts. Production build clean (13 routes incl sitemap/robots).
- Wrote GO-LIVE.md runbook (Supabase → env → Vercel → pre-public checklist).

## Energy + substance pass (meeting-ready)
- LESSON: never `npm run build` while the dev/preview server runs — it corrupts .next ('cant find ./xxx.js'). Fix: stop server, rm -rf .next, restart.
- Kinetic word motif (hero): eye level → the table → the bar → full height (dropped "the conversation" — too long, jumped). aria-hidden + sr-only stable phrase.
- Living aurora glow: hero + Specs + every PageHeader masthead (life on every page). Reduced-motion safe.
- New homepage sections (longer, real-grounded): SpecTicker, animated CountUp stats, Comparison ("The leap"), Specs (dark, full sheet, [~]=assumption), PressStrip (real coverage), Testimonials (PLACEHOLDER, flagged).
- Trust layer (the big missing piece): OwningCentaur.tsx — funding help (Access to Work/grants), test drive, support, peace of mind. On /who-its-for.
- Per-page substance: /the-centaur +Specs; /who-its-for +OwningCentaur; /why-us +PressStrip.
- Re-audited every page: 0 axe violations (WCAG 2.1 AA) maintained throughout.
- STILL NEEDS CLIENT: real photos/video, real testimonials, real contact/company-no/address, confirm funding schemes + warranty + charge/battery [~], founder-story sign-off.

## Senior audit pass (pre-launch)
- Footer: real company structure — Ltd, company-no [TBC], registered office [TBC], phone [TBC] (Companies Act compliance).
- Configurator: localStorage persistence (hydration-guarded to avoid clobber; StrictMode-safe) + "Your Centaur so far" review summary with per-row Edit jump + "What happens next" reassurance. Tested via reseed→reload restore.
- JSON-LD Organization+Product schema in layout <head>.
- Custom not-found.tsx (on-brand, aurora, CTAs).
- a11y regressions found & fixed: footer [TBC] text-ink/45 (2.85) → /70; <select> missing name → aria-label. All pages re-audited 0 violations.

## Real photography added (Facebook assets)
- Client uploaded ~30 real photos to project root. Curated 10 → optimized via PIL (resize 1600w, JPEG q82, 1-3.7MB → 94-255KB) into public/assets/lifestyle/.
- Placements: WhoItsFor (kitchen reach, bar conversation), new Gallery.tsx on home (6-shot editorial grid w/ tall hug focal), Story closing image (hug), Engineering (making/production).
- PERF NOTE: dev next/image optimizer chokes loading 10 imgs at once (screenshot timeouts) — page is healthy (axe 0, assets serve 200, optimizer 0.23s/img). Prod fine.
- Re-audited: 0 WCAG AA violations.
- BRAND DISCOVERY (decision for client): real Centaur brand = black bg + thin futuristic "CENTAUR ROBOTICS" wordmark + infinity logo mark + PINK/MAGENTA & BLUE gradient accents. Our site is bone/bronze/Space-Grotesk. Mismatch. Real tagline: "the home of the revolutionary Centaur." Option: align palette/logo to their actual brand — would be a big lift, needs sign-off. Unused assets available: real logo, founders slide, press cutting, controls/footplate/wheels detail shots, founder-speaking shots.

## Signature differentiator + logo
- Logo.tsx: infinity/centaur SVG mark + letter-spaced CENTAUR wordmark (currentColor, a11y). In Nav + Footer.
- RiseExperience.tsx ("Find your level"): interactive slider — user raises the chair 480→820mm, readout + "moment" caption update live (table → counter → eye to eye → standing), chair translates up. The product's USP (height) made operable. Nobody in the category does this. Keyboard-accessible (aria-valuetext), reduced-motion safe. On home after key-facts.
- Re-audited: 0 WCAG AA violations.

## Log
- Cut chair out of grey studio bg via rembg → /assets/product/centaur-cutout.png (enables floating hero).
- GOTCHA: editing tailwind.config colors under a live dev server serves STALE css (utilities keep old rule). Fix: stop server, `rm -rf .next/cache .next/static/css`, restart. Always full-restart after config/theme changes.
- Features rebuilt: editorial sticky-heading + numbered 01–06 list (killed grid-smell).
- Credibility rebuilt: market stats (1.2m/9%/400k, press-sourced — VERIFY) + real Paul Campbell quote.
