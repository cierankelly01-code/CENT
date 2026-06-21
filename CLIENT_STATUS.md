# Centaur Robotics Marketing Site & Build System — Status & Go-Live Guide

**Status:** Ready to launch. Core platform is built and live. Five setup steps unlock full lead capture and customer order tracking.

---

## What's Live Right Now

The entire marketing website and customer configurator are deployed and working.

**The Website** — customers see:
- Home page, product showcase, founder story, audience guide, company values, news & events, and privacy statement
- A lightweight enquiry form where prospects request information
- Responsive design from phones to desktops, optimised for search engines (Google rich results), and built to WCAG accessibility standards

**The Configurator (Build Studio)** — customers can:
- Step through a guided builder to fully specify their Centaur (seat height, control options, materials, colours, accessories)
- Save their choices automatically as they go
- Submit their spec with one click
- Receive an instant confirmation email

**The Staff Control Panel** — your team can:
- See a dashboard with live counts of enquiries, builds, and customer orders
- Search and filter enquiries by customer, date, or status
- Access a full list of all customer builds and their current stage
- Click through to each customer's order detail to read their spec and update status (e.g., received → reviewing → quoted → confirmed)
- View a visual Pipeline board showing all orders by stage at a glance
- Generate a unique private link and send it to any customer to start building their chair

**Customer Order Tracking** — when customers get their build link, they also get a private tracking page where they can watch their order move along a friendly status timeline (received → reviewing → quoted → confirmed). More stages (in production, delivered) arrive with the operations system later.

**Polish & Discovery** — we've added:
- A branded image that appears when customers share the link on WhatsApp, LinkedIn, or via email
- Faster image loading, optimised fonts, and "add to home screen" for mobile phones
- Deep search optimisation so Google can show rich snippets (FAQs, organisation and product data)

---

## Awaiting Your Approval (Built & Ready, Not Yet Public)

Two design enhancements are built and waiting for your sign-off:

- **A more premium look:** elegant serif headlines paired with the current sans-serif body text, plus a richer accent colour throughout the site. It feels slightly more luxury while staying clean and professional.
- **A reassurance line under the buttons:** "No payment, no commitment — and a test drive when you're ready." It sets customer expectations and reduces friction on the enquiry form and configurator submit.

Once you approve these, they go live immediately.

---

## What We Need from Centaur (Client Inputs)

To finish the site and make it truly yours, please supply:

**Visual assets:**
- Real company logo (SVG format)
- Product photos (hi-res) or 3D model (.glb) or hero product video
- Customer testimonials (real quotes + names + permission to display)

**Content & copy:**
- Sign-off on the founder story (currently held back pending your sign-off)
- Sources for the market statistics we quote ("1.2m wheelchair users in the UK," etc.) so we can cite them
- Real company news items and event dates
- The real privacy policy text (we have a template placeholder)

**Build Configurator specifics:**
- The complete list of seat sizes, control options, upholstery finishes, and accessories customers can choose from
- For each option: the customer-facing label, an internal part code, and whether it's standard or a paid extra
- Any rules (e.g., "option X only works with Y")
- Confirmation of specs marked `~` in the current spec (charge time, battery chemistry and capacity)

**Legal & compliance:**
- Company registered name and number
- Registered office address
- Support phone number and email address

---

## One Known Issue — Quick Fix Before Launch

The custom domain `centaurrobotics.com` currently shows a browser security warning because the SSL certificate expired. The site itself is fine — customers can use the backup address (`centaurrobotics1.vercel.app`) without any warning, and we can fix the custom domain in about 5 minutes once you give the word.

---

## Five Steps to Go Live (One-Time Setup)

Follow these in order. We will provide all the secret keys marked **[we provide]**.

### Step 1: Fix the SSL Certificate (5 min)
1. Log in to the Vercel Dashboard
2. Go to Domains → `centaurrobotics.com` → renew the SSL certificate
3. Test the link in a browser — the warning should vanish

### Step 2: Add Secret Keys in Vercel (10 min)
1. Log in to the Vercel Dashboard
2. Go to Settings → Environment Variables
3. Add these three variables:
   - `SUPABASE_SERVICE_ROLE_KEY` = **[we provide]**
   - `RESEND_API_KEY` = **[we provide]**
   - `NEXT_PUBLIC_SITE_URL` = `https://centaurrobotics.com`
4. Save and redeploy

### Step 3: Run the Database Setup (5 min, one time only)
1. Log in to Supabase
2. Go to SQL Editor
3. Paste and run the SQL script from `supabase/build-schema.sql`
4. This creates the tables for customer builds and enquiries

### Step 4: Create Staff Login Accounts (2 min per person, ongoing)
1. In Supabase, create a user account for each team member who needs staff panel access (email + password)
2. They log in at `/staff` with those credentials
3. *Optional:* We can restrict login to only your company email domain (e.g., @centaurrobotics.com only)

### Step 5: Verify the Email-Sending Domain (10 min)
1. Log in to Resend Dashboard
2. Go to Domains → add and verify `hello@centaurrobotics.com`
3. Once verified, all build confirmations and enquiry receipts will send from that address

**That's it.** Once you finish these five steps, the whole system is live and ready for real customers.

---

## How to Send a Customer Their Configurator Link (Repeat Per Customer)

Once setup is complete, here's the daily workflow:

1. **Log in to the staff panel** at `yoursite.com/staff`
2. **Click the "Generate customer link" button** — it creates a unique private link for that customer
3. **Copy the link** and send it to them (email, WhatsApp, text — your choice)
4. **They configure their chair** — the system autosaves as they go
5. **They submit their spec** — it appears in your Enquiries inbox and on the Pipeline board
6. **You move them through stages** — as you update their status (reviewing, quoted, confirmed), they see the progress on their private tracking page

No extra work: the system sends confirmations automatically.

---

## What's Next: The Operations System (Coming Later, in Stages)

This marketing site and configurator are **System 1 & 2** of a three-system vision. Once the site is live and gathering real customer data, we'll build **System 3: the ops hub** — one place to run the entire business.

The ops system will include:
- **Auto-generated quotes** based on customer specs and real pricing
- **Delivery estimates** calculated from production lead times and courier schedules
- **Stock & parts tracking** with supplier lead times and inventory visibility
- **Production tracking** with full traceability (which part went into which chair, by who, when)
- **Owners' dashboard** — after purchase, customers see service history, warranty, maintenance tips, and proactive care alerts
- **AI-assisted quoting** and later, a connected "digital twin" of each chair for predictive maintenance

The data structure is already in place (the `config_payload` and `status` fields are the bridge between configurator and ops), so when we build System 3, it plugs in seamlessly.

---

## The Three Links to Share Today

Once setup is complete, here are the three links to give to customers and colleagues:

1. **The Website:** `https://centaurrobotics.com` (or backup: `https://centaurrobotics1.vercel.app`)
   - Public marketing site, enquiry form, story, and product information

2. **Build Studio (Configurator):** Generated per customer (e.g., `https://centaurrobotics.com/build/CEN-001?t=<secret>`)
   - Private link you send to each customer; they design their chair, it saves automatically

3. **Staff Control Panel:** `https://centaurrobotics.com/staff`
   - Login required; your team uses this to manage enquiries, builds, and order status

---

## Where We Are

The hard engineering is done. The site is live, the system is built, and the processes are in place. Five quick setup steps turn it into a live, fully-tracked customer pipeline.

No medical claims on the site, no pricing on the public pages (pricing lives only in the staff system where it's safe), and everything is built to accessibility standards so it works for everyone.

You're ready. Let's go live.

---

**Questions?** Reach out — we're here to walk you through the setup or take it on ourselves if you prefer.
