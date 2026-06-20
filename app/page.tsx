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
    <>
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
      <Faq />
      <CtaBand />
    </>
  );
}
