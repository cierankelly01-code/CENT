# Centaur Robotics Website & Operations System — Project Status

**From:** Cieran (your agency)  
**To:** Julian (Centaur Robotics)  
**Date:** June 2026

---

## What's Live Right Now

Your website is live and working beautifully. Customers can:

- **Browse the full site:** home page, product details, your story, who it's for, and team info.
- **Fill out an enquiry form** to request more info or book a test drive — leads go straight to your inbox.
- **Use the Build Studio:** a private link lets customers fully configure their Centaur chair (seat height, colours, materials, accessories). Once they submit, you get the configuration details automatically.

**Recent polish we shipped:** better search results on Google, faster images, a branded preview image (what shows when the site is shared on WhatsApp or LinkedIn), and "add to home screen" for mobile users.

---

## The Next Layer: Your Control Panel (In Progress)

We're building a staff dashboard — a secure login area for you and your team to:

- **See new orders overnight:** every enquiry and submitted Build Studio configuration appears in your inbox.
- **Manage the sales flow:** mark leads as contacted, quoted, sent to test drive, confirmed, etc.
- **View full order details:** everything the customer configured, all in one place.

This is the foundation of your operations system. Once it's solid, we'll expand it.

---

## The Full Vision: Your Operations System (Coming Later)

Imagine logging in once and running your whole business from one place.

- **Sales:** see the pipeline (new leads → quoted → test-driven → ordered), auto-generated price quotes, delivery estimates.
- **Stock:** real-time visibility into parts inventory, automatic alerts when stock runs low, purchase order management.
- **Customers:** manage contact info, order history, service history in one place.
- **Owners' dashboard:** pipeline overview, revenue forecast, stock alerts, and key business metrics at a glance.

We're building this in stages. Your admin panel is stage one; the full system comes next.

---

## Security

Your staff login is hardened and encrypted. Only your team can access customer data. The system is built for a disability product, so security and privacy matter as much as they do to us.

---

## What We're Waiting For (From You)

To finish the website and get it launch-ready, we need:

**Visual & Content**
- Your logo (as an SVG file)
- Real product photos or 3D model (`.glb` file) for the hero section
- Customer testimonials (with names and permission to use them)
- Approval on the founder story section we've drafted
- Sources for any market stats we've quoted

**Business Details**
- Real privacy policy wording (we have a template)
- Company legal details: registered name, company number, office address, phone, support email

**Product Configuration**
- The exact questions & options you want customers to choose from in the Build Studio
- Confirmed specs: charge time, battery range, weight, dimensions (pricing stays off the public site — it lives in the staff system)
- Real news items & publication dates (for your News section)

**For the Full Operations System (Next Phase)**
- Your pricing structure
- Full parts lists and suppliers with lead times

---

## One Issue to Fix Before Launch

**⚠️ SSL Certificate (Security Certificate)**  
Your domain centaurrobotics.com is currently showing a security warning in browsers (the certificate expired). The site itself works fine on a backup address, but customers will see a warning. This needs fixing in your hosting settings before launch — it's a straightforward fix in the Vercel dashboard.

---

## How to Get Your Customer Configurator Links Live

Once we've set up your systems, staff will be able to log in and generate private Build Studio links to send to customers. Here's the one-time setup checklist:

### One-Time Setup (Do Once)

1. **Fix the SSL certificate**  
   Log in to Vercel → go to your domain settings (centaurrobotics.com) → renew the certificate. Browsers will stop showing warnings immediately.

2. **Add the secret keys in Vercel**  
   We'll give you two keys (a database key and an email-sending key). Add them to your Vercel environment settings. This takes 5 minutes.

3. **Run the database setup**  
   We'll provide a script. Run it once in Supabase (your database service). It creates the tables for orders and configurations. Takes 2 minutes.

4. **Create staff login accounts**  
   In Supabase, we'll set up login accounts for everyone who needs access (you, your team, etc.). Each person gets their own secure login.

5. **Verify your email domain**  
   Set up domain verification so confirmation emails send from hello@centaurrobotics.com (instead of a generic address). Instructions come from Supabase; takes 10 minutes.

### Ongoing (Every Time You Send a Customer a Link)

6. **Generate a customer link**  
   A staff member logs into the control panel → clicks "generate link" → copies the link → sends it to the customer. Done. Customer configures their chair, submits, and you get the data in your inbox.

---

## Premium Design Updates (Awaiting Approval)

We've designed two polishes:

- **New typography:** elegant serif fonts for headlines, giving the site a more premium feel.
- **Richer colour:** a deeper accent colour for buttons and highlights.

These are ready to ship — just waiting for your nod to go live.

---

## A Reassurance Line

We're also adding a small line under buttons: **"No payment, no commitment — and a test drive when you're ready."** This reassures customers they're not locked in. Ready to ship once you approve.

---

## Where We Are

The website is live and performing well. Your admin panel is coming together — within a week or two, you'll be able to log in and see every customer enquiry and configuration in one place. The SSL certificate needs a quick fix, and we're waiting on content and sign-offs from you (logo, photos, testimonials, company details, and the founder story). Once those land, we'll finalize the design and get everything formally launch-ready. The full operations system (stock, orders, forecasting) comes next, and we'll spec that once the admin panel is solid. You're on track.

