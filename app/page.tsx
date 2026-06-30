import Link from "next/link";
import HeroBuy from "@/components/sections/HeroBuy";
import Comparison from "@/components/Comparison";
import Specs from "@/components/Specs";
import Gallery from "@/components/Gallery";
import RiseExperience from "@/components/RiseExperience";
import HowItWorks from "@/components/HowItWorks";
import PressStrip from "@/components/PressStrip";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";

const STATS: { end: number; suffix: string; label: string }[] = [
  { end: 820, suffix: "mm", label: "Rises to eye level" },
  { end: 470, suffix: "mm", label: "Through any doorway" },
  { end: 480, suffix: "mm", label: "Down to the table" },
  { end: 10, suffix: "+ mi", label: "On a single charge" },
];

const TEASERS = [
  { href: "/the-centaur", eyebrow: "The Centaur", title: "A wheelchair engineered like a car.", body: "Self-balancing, eye-level, fail-safe. Explore every detail." },
  { href: "/story", eyebrow: "Our story", title: "Two fathers, one refusal.", body: "Why the Centaur exists — and who it was built for." },
  { href: "/who-its-for", eyebrow: "Who it's for", title: "Home, and everywhere you go.", body: "Independence at home; a better experience for venues." },
  { href: "/why-us", eyebrow: "Why us", title: "Built by an ex-Ford team.", body: "Automotive standards, in production now." },
];

export default function Home() {
  return (
    <main id="main">
      <HeroBuy />

      {/* Key facts */}
      <section className="border-t border-mist bg-bone">
        <div className="container-edge py-14 md:py-16">
          <Reveal>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink lg:text-4xl">
                    <CountUp end={s.end} suffix={s.suffix} />
                  </dt>
                  <dd className="mt-2 font-sans text-sm text-ink/70">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Eligibility signpost — answer "is this for me" early, before the deep dive */}
      <section className="border-t border-mist bg-mist/30">
        <div className="container-edge py-10 md:py-12">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="max-w-2xl font-sans text-base leading-relaxed text-ink/80">
                <span className="font-semibold text-ink">Is the Centaur for you? </span>
                Built for people who can&apos;t comfortably walk more than around 400m
                unaided — but who get on with their day otherwise.
              </p>
              <Link
                href="/who-its-for"
                className="inline-flex shrink-0 items-center gap-1.5 font-sans text-sm font-semibold text-bronze-deep transition-colors hover:text-ink"
              >
                Who it&apos;s for
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <RiseExperience />
      <Comparison />
      <Specs />
      <Gallery />

      {/* Teasers into each page */}
      <section className="border-t border-mist bg-bone">
        <div className="container-edge py-20 md:py-28">
          <div className="grid gap-px overflow-hidden rounded-md border border-mist bg-mist sm:grid-cols-2">
            {TEASERS.map((t, i) => (
              <Reveal key={t.href} delay={(i % 2) * 80} className="bg-bone">
                <Link
                  href={t.href}
                  className="group flex h-full flex-col p-8 transition-colors hover:bg-mist/20 lg:p-10"
                >
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
                    {t.eyebrow}
                  </span>
                  <h2 className="mt-4 font-display text-2xl font-semibold leading-snug tracking-[-0.01em] text-ink">
                    {t.title}
                  </h2>
                  <p className="mt-3 flex-1 font-sans text-base leading-relaxed text-ink/70">
                    {t.body}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink transition-transform group-hover:translate-x-0.5">
                    Read more
                    <span aria-hidden>→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <Testimonials />
      <PressStrip />

      {/* B2B / Fleet — NHS, venues, care homes */}
      <section className="border-t border-mist bg-bone">
        <div className="container-edge py-20 md:py-28">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
                  For organisations
                </span>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
                  Fleet pricing for NHS trusts, venues, and care homes.
                </h2>
                <p className="mt-5 font-sans text-base leading-relaxed text-ink/70">
                  Whether you&apos;re equipping a hospital ward, a Premier League stadium, or a care
                  facility — Centaur offers dedicated fleet pricing, a real-time management dashboard,
                  and a dedicated account manager for every organisation.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Live fleet dashboard — battery, charge status, service alerts per chair",
                    "Dedicated account manager and OT liaison",
                    "Fleet delivery, on-site setup and staff training",
                    "Volume pricing from 3 units",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 font-sans text-sm text-ink/80">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-bronze-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/configure"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-bronze-deep px-7 py-3 font-sans text-base font-semibold text-bone transition-colors hover:bg-[#6f4d29]"
                >
                  Enquire about fleet pricing
                  <span aria-hidden>→</span>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 content-start">
                {[
                  {
                    label: "NHS trusts",
                    desc: "Ward-ready. MHRA-compliant pathway.",
                    path: "M12 3v18M5 8h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm4 5h6",
                  },
                  {
                    label: "Stadiums & venues",
                    desc: "Dignity for every fan, every match day.",
                    path: "M3 16c3-2.2 15-2.2 18 0M5 16V9.5C5 6 8 4 12 4s7 2 7 5.5V16M9 16v3M15 16v3",
                  },
                  {
                    label: "Care homes",
                    desc: "Fleet management built for your team.",
                    path: "M4 11.5 12 4l8 7.5M6.5 10v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9M10 20v-5h4v5",
                  },
                  {
                    label: "Workplaces",
                    desc: "Independence at work, not dependence on others.",
                    path: "M4 8.5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8.5ZM9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M4 13h16",
                  },
                ].map((card) => (
                  <div key={card.label} className="rounded-xl border border-mist bg-bone p-5 shadow-[0_1px_2px_rgba(26,23,20,0.04)]">
                    <svg className="h-6 w-6 text-bronze-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={card.path} />
                    </svg>
                    <p className="mt-3 font-sans text-sm font-semibold text-ink">{card.label}</p>
                    <p className="mt-1 font-sans text-xs leading-relaxed text-ink/60">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pricing signal — CLIENT confirm figures before launch */}
      <section className="border-t border-mist bg-mist/30">
        <div className="container-edge py-16 md:py-20">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">Pricing</span>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
                Built to order. Priced to last.
              </h2>
              <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
                The Centaur starts from <strong className="text-ink">£14,995</strong> — a bespoke chair built around you,
                not a stock item pulled from a shelf. VAT relief applies for eligible buyers.{" "}
                {/* CLIENT — confirm price before launch */}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/configure"
                  className="inline-flex items-center rounded-full bg-bronze-deep px-7 py-3 font-sans text-base font-semibold text-bone transition-colors hover:bg-[#6f4d29]"
                >
                  Get a personalised quote
                </Link>
                <Link
                  href="/the-centaur"
                  className="inline-flex items-center rounded-full border border-ink/20 px-7 py-3 font-sans text-base font-semibold text-ink transition-colors hover:border-ink/40"
                >
                  See full spec
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Faq />
      <CtaBand />
    </main>
  );
}
