import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import NewsletterSignup from "@/components/NewsletterSignup";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "News & Events — Centaur Robotics",
  description:
    "The latest from Centaur Robotics — milestones, recognition, and where to see the Centaur in person.",
};

// CLIENT — replace/extend with real posts before launch. Press links are real;
// verify each before publishing. Add company news here as it happens.
const NEWS = [
  {
    tag: "Milestone",
    title: "The Centaur is in production — pre-orders open",
    body: "After years of development, the Centaur is being built and is open for pre-order. Reserve yours and book a test drive.",
    href: "/configure",
    cta: "Reserve yours",
  },
  {
    tag: "Recognition",
    title: "Covered across the design and mobility press",
    body: "Featured in Design Week, Startups Magazine, THIIS and AT Today — on the self-balancing wheelchair reimagining personal mobility.",
    href: "/why-us",
    cta: "See why us",
  },
  {
    tag: "Update",
    title: "[ Add your latest news here ]",
    body: "Partnerships, trial results, awards, new features — this page is built to take real posts. Drop them in and they'll slot straight in.",
    href: undefined,
    cta: undefined,
  },
];

// CLIENT — replace with real events. Placeholder shown to demonstrate the layout.
const EVENTS = [
  {
    when: "Date TBC",
    where: "[ Venue / expo ]",
    title: "[ Upcoming event or demo day ]",
    body: "Meet the team and try the Centaur in person.",
  },
  {
    when: "By appointment",
    where: "Your home or a space near you",
    title: "Private test drive",
    body: "Prefer to try it where you'll actually use it? Book a personal test drive any time.",
  },
];

export default function NewsPage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="News & events"
        title="What's new at Centaur."
        intro="Milestones, recognition, and where to see the Centaur in person."
      />

      {/* News */}
      <section className="border-t border-mist bg-bone">
        <div className="container-edge py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
              Latest
            </p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] text-ink sm:text-4xl">
              The latest from us.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-mist bg-mist md:grid-cols-3">
            {NEWS.map((n, i) => (
              <Reveal as="article" key={n.title} delay={(i % 3) * 80} className="bg-bone">
                <div className="flex h-full flex-col p-8 lg:p-10">
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-bronze-deep">
                    {n.tag}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-[-0.01em] text-ink">
                    {n.title}
                  </h3>
                  <p className="mt-3 flex-1 font-sans text-base leading-relaxed text-ink/70">
                    {n.body}
                  </p>
                  {n.href && (
                    <Link
                      href={n.href}
                      className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink transition-transform hover:translate-x-0.5"
                    >
                      {n.cta}
                      <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="border-t border-mist bg-bone">
        <div className="container-edge py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
              Upcoming
            </p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] text-ink sm:text-4xl">
              See the Centaur in person.
            </h2>
          </Reveal>

          <ul className="mt-12 divide-y divide-mist border-y border-mist">
            {EVENTS.map((e, i) => (
              <Reveal as="li" key={e.title} delay={(i % 2) * 80}>
                <div className="grid gap-2 py-7 md:grid-cols-[200px_1fr] md:gap-8 md:py-8">
                  <div>
                    <p className="font-display text-base font-semibold text-ink">{e.when}</p>
                    <p className="mt-0.5 font-sans text-sm text-ink/60">{e.where}</p>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-ink">
                      {e.title}
                    </h3>
                    <p className="mt-2 max-w-xl font-sans text-base leading-relaxed text-ink/70">
                      {e.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Newsletter */}
      <section className="grain relative overflow-hidden border-t border-graphite/30 bg-ink text-bone">
        <div className="container-edge py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze">
              Stay in the loop
            </p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
              Be first to hear.
            </h2>
            <p className="mt-5 font-sans text-lg leading-relaxed text-bone/70">
              Availability, events, and news — straight to your inbox. No spam, ever.
            </p>
            <div className="mt-8">
              <NewsletterSignup />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
