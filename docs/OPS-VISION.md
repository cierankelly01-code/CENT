# Centaur Operating System — Vision (System #3)

Synthesis of a multi-perspective design exercise (exec, finance, operations, sales, risk,
connected-product, growth, AI, accessibility). This is the **internal company OS** that runs
the whole business from one place. It builds in stages on the seam already in place
(website → both configurators → Supabase `config_payload` + `status`). Principle throughout:
**one source of truth, human-in-the-loop first, automate as trust builds.**

> Status: vision/roadmap. The **admin shell** (login, dashboard, enquiries + builds inbox) is
> stage one and is being built now. Everything below grows on top of it.

## 1. The cockpit — exec & finance
- **Owner dashboard**: pipeline value, order book/backlog, conversion, production throughput, on-time delivery, cash position + runway, NPS — traffic-light, drill-down per card.
- **Quoting & margin engine**: configured options (stable codes → BOM) → price with healthy margin; margin visible per order; margin guardrails flag low-margin quotes for approval.
- **Cashflow for made-to-order**: deposits + staged payments, supplier payment timing, 13-week cash view; "what-if" scenarios for scaling.
- **Board/investor reporting**: auto monthly pack (revenue, margin, cash, CAC/LTV, unit economics).
- *Standout*: a founder mobile cockpit (approve quotes/POs on the go); cash-runway scenario engine.

## 2. Sales & customer experience
- **Pipeline**: new → contacted → quoted → test-drive → ordered → in production → delivered; owner assignment, follow-up tasks, soft SLAs, full comms history.
- **Quote → accept → deposit**: branded quote, e-sign acceptance, Stripe deposit.
- **White-glove, dignified logistics**: test-drive + at-home install scheduling; accessibility needs captured respectfully.
- **Customer portal** ("where's my Centaur"): order tracking, resume build, view quote, book test drive.
- *Standout*: AI lead scoring + gentle nurture; referral/ambassador program; owner community.

## 3. Operations, production & supply chain
- **BOM explosion**: option codes → components → "in stock vs must order"; realistic delivery ETA on the quote.
- **Inventory**: live levels, reservations against confirmed orders, low-stock alerts, reorder points.
- **Suppliers & procurement**: supplier records, per-part lead times, purchase orders (raise/track/receive), supplier scorecards.
- **Production**: work-order/build queue, build stages, capacity view, QA checkpoints for a safety-critical product; serial-number build traveller.
- *Standout*: predictive stock & (human-approved → auto) procurement; reverse-logistics/refurb loop; aftercare parts shop (recurring revenue).

## 4. Risk, quality, safety & compliance
- **Full traceability**: serial number + batch tracking per chair — so a recall/service bulletin targets exactly the right units.
- **QA gates**: mandatory checkpoints with sign-off before "ready to ship"; defect tracking + root cause.
- **Safety & liability**: incident logging, warranty claims/RMA, monthly liability summary.
- **UK GDPR**: consent records (already captured), retention schedule, right-to-erasure tooling, access audit log.
- **Conformity**: design-freeze + Declaration of Conformity records (no medical-device overreach — no medical claims).
- *Standout*: one-click audit-ready "build dossier" ZIP per serial; firmware attestation (verify signed firmware at QA).

## 5. Connected product & data (the digital twin)
- **One immutable spec per built chair** (serial), flowing from enquiry → configurator → production → field — no re-keying, no data rot.
- **Optional, opt-in telemetry** (battery/motor health, fault codes) → proactive aftercare. Privacy-first, GDPR-safe, **no health data, no location, no medical claims**.
- **OTA app/firmware** update management; **fleet view** for B2B (care homes, airports).
- *Standout*: field data → R&D loop (which options chosen, component reliability) to steer the product roadmap.

## 6. Growth & community
- **Attribution tied to orders** (not just leads): which channels produce real revenue; CAC vs order value.
- **Owner advocacy**: consented owner stories feed the website; referral + ambassador tiers; private owner community.
- **B2B pipeline**: care homes / venues / airports as managed partnerships; advisor (OT) referral network.
- **Premium waitlist/pre-order** that builds desire and captures demand signal.

## 7. Throughlines
- **AI & automation** (human-in-the-loop → autonomous, safety-bounded): auto-quoting with confidence + approval; autonomous procurement for commodity parts; a staff copilot (status answers, draft replies, risk flags); predictive demand/stock/at-risk. Every AI decision audit-logged and explainable; safety-critical actions always gated.
- **Accessibility & dignity** (this is a disability company): every touchpoint — *including the staff tools* — exemplary-accessible (WCAG 2.2 AA+, keyboard, screen reader, plain language, reduced motion); needs captured without feeling medical; accessibility as a brand differentiator, ideally co-designed with real users.

## Phased roadmap (each stage usable on its own)
1. **Admin shell (now)** — login, dashboard, unified inbox (enquiries + builds), order detail, status pipeline, generate-customer-link.
2. **Quoting & pricing** — BOM mapping → quote + ETA + margin; deposits (Stripe).
3. **Inventory, suppliers & POs** — stock, reorder points, procurement.
4. **Production & fulfilment** — work orders, QA gates, traceability, delivery/install.
5. **CRM, customer portal & growth** — comms history, portal, attribution, referrals.
6. **Compliance & risk tooling** — dossiers, GDPR erasure, risk register.
7. **AI automation & connected-product** — copilot, predictive, telemetry/digital twin.

## Guardrails
No medical/clinical or off-road claims. No invented specs/pricing/figures — pricing & stock live
**only** in this internal system, never on the public site. Human approval for anything
safety- or money-critical; AI assists, it doesn't act alone. UK GDPR throughout.
