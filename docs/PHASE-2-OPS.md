# Phase 2 — Centaur Staff Operations System (the "ERP")

Captured the night before the Phase-1 site launch. This is the next build after the
website is live and approved. It is an internal staff app that turns a configurator
submission into an automated, end-to-end order workflow.

## How it connects to what's already built
- The public configurator (`/configure`) already writes every submission into Supabase
  `quote_requests`, with the full spec in **`config_payload` (jsonb)** and a **`status`** column
  (default `'new'`). Both were planted as the Phase-2 seam — the staff app reads them.
- Same stack continues: **Next.js + Supabase**. Add **Supabase Auth + RLS** so only staff can
  read/write (the public site already has *no* anon read policy — leads are private by design).

## Cieran's brief (the automation he described)
A submission lands → goes into the staff software → the system runs the order: checks
inventory, sees what's in stock vs. needs ordering, pulls supplier lead times, and produces
an **automated quote** with a realistic delivery estimate. Tie it all back to this website.

## The system, mapped out (my recommendation for what they'll need)

### 1. Lead & order pipeline (the spine)
- Inbox of submissions from `quote_requests` (name, contact, full `config_payload`).
- Lifecycle via `status`: new → contacted → quoted → test-drive → ordered → in production → delivered.
- Assign to a staff owner; activity log + notes per lead; auto-acknowledgement email on submit.

### 2. Automated quoting
- Map each `config_payload` choice (upholstery, finish, controls, etc.) to a **BOM** (bill of materials) + price.
- Pricing engine: base price + option deltas → generates a branded **PDF quote**, emailed to the customer.
- Quote states: draft → sent → accepted/expired. Staff approves before send (or full-auto later).

### 3. Inventory, stock & supply chain (the "is it in stock?" engine)
- Components catalogue with live **stock levels**.
- On a new order: explode the BOM → flag **in stock vs. needs ordering**.
- **Supplier lead times** per component → compute a delivery ETA shown on the quote.
- Raise **purchase orders** for missing parts; **reserve stock** against confirmed orders; low-stock alerts.

### 4. Production & fulfilment
- Work-order / build queue with build status; capacity view.
- **Test-drive scheduling** + **delivery scheduling** (logistics, install at home).

### 5. CRM & compliance
- Customer records, full comms history (email/SMS log).
- **UK GDPR**: consent record (already captured at configure), data retention, right-to-erasure tooling.

### 6. Admin, roles & dashboard
- Roles/permissions: sales, ops, production, admin (Supabase Auth + RLS / row policies).
- Dashboard: pipeline value, revenue forecast, stock alerts, production capacity, delivery calendar.

### 7. Integrations to plan for
- Transactional email (acknowledgements, quotes), **deposit payments** (Stripe), **accounting**
  (Xero/QuickBooks) sync, **courier/logistics** for delivery, optional e-sign for order acceptance.

## The happy-path automation flow
configure submit → lead created + auto-ack email → BOM exploded → stock checked + ETA computed
→ draft quote auto-generated → staff approves/sends → customer accepts (+ deposit) → stock reserved
+ POs raised for shortfalls → production work order → test drive booked → delivery scheduled → delivered.

## Notes
- Phase-1 guardrails still hold for the public site (no pricing/stock logic there). All of the above
  lives in the **authenticated staff app**, not the marketing site.
- Build order suggestion: pipeline + auth first → quoting → inventory/BOM → production/fulfilment → integrations.
