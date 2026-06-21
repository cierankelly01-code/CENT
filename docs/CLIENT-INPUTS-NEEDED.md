# What we need from Centaur Robotics — to finish & launch

A single checklist of everything we need *off the company* to complete the website and the
build configurator, plus what we'll need later for the ops system. Hand this to the client and
tick it off. Everything flagged `TBC` / placeholder in the code maps back to an item here.

Status key: **[live placeholder]** = working stand-in shipped, swap when supplied · **[blocker]** = needed before public launch.

---

## A. Build configurator — the real spec
The questions and options live in a registry (`lib/configurator/options.ts`); they're sensible
placeholders now. We need the real set. For **each option** we need:
- The **customer-facing label** (what they read).
- An **internal code / part reference** (so the ops system can map option → parts later).
- Whether it's **standard or a paid add-on** (no prices shown to customers, but ops needs the flag).

Specifics to confirm:
- [ ] Seat sizes / fit options (widths, depths, height range confirmation).
- [ ] Control options (joystick / app / both; mount sides).
- [ ] Upholstery & finish ranges (materials, colours).
- [ ] Accessories / extras list.
- [ ] Any **conditional rules** ("option X only available with Y").
- [ ] Spec confirmations currently marked `[~]`: charge time (~4h?), battery chemistry/capacity.

## B. Website content & assets
- [ ] **Real logo** as `.svg`. **[live placeholder]**
- [ ] **Product imagery** — hi-res photos and/or 3D CAD (`.glb`) and/or the hero product video. **[live placeholder]**
- [ ] **Testimonials** — real quotes + names (+ photos) + sign-off. **[live placeholder] [blocker]**
- [ ] **Founder story sign-off** — the David/Paul/Alfie/Bill narrative. **[blocker]**
- [ ] **Market stats** — citable sources for "1.2m UK users / 9% accessible homes / 400k in non-adapted homes" (or we soften/remove). **[blocker]**
- [ ] **Comparison claims** sign-off (Centaur vs traditional chair rows).
- [ ] **News & events** — real items + real dates. **[live placeholder]**
- [ ] **Privacy policy** — real legal copy (currently a placeholder). **[blocker]**
- [ ] **Social share image** — a photographic hero render (a branded card is live now). **[live placeholder]**

## C. Company & legal details (footer / compliance)
- [ ] Registered **company name + number**. **[blocker]**
- [ ] **Registered office address**. **[blocker]**
- [ ] **Phone** + support **email**. **[blocker]**

## D. Domain & accounts (technical — mostly Vercel/registrar side)
- [ ] **Fix expired SSL** on `centaurrobotics.com` (the deployment is fine; it's a domain/cert issue). **[blocker]**
- [ ] **Verify the email-sending domain** for Resend (so confirmations send from `hello@centaurrobotics.com`).
- [ ] Decide the **staff allowlist** (`STAFF_ALLOWED_EMAILS`) and create staff logins in Supabase.

## E. For the ops / admin system (later — when we build System #3)
- [ ] **Pricing** — base price + per-option price deltas.
- [ ] **BOM** — each option → component(s) / part numbers.
- [ ] **Suppliers** — who supplies each part, lead times, and how stock is tracked.
- [ ] **Staff roles** — who sees what (sales / ops / production / admin).
- [ ] **Integrations** — decisions on payments (Stripe deposits), accounting (Xero/QuickBooks), couriers.

---

## How it all links together (the admin's view)
We (the admins) operate everything; the three systems are built to connect:
1. **Website** captures an enquiry (`/configure` → Supabase).
2. **Admin** sends that customer a **unique link** to the deep **build configurator** (`/build/<ref>?t=…`).
3. Their finished spec, the enquiry, and (later) stock all feed the **ops system**, which the
   admin logs into to see what's come in, manage each order, and drive it to delivery.

The data seam (`config_payload` + `status`) is already in place across all three, so nothing
here requires re-plumbing — it's content + the admin tooling on top.
