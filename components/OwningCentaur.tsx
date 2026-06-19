import Reveal from "@/components/Reveal";

// Trust layer for a high-consideration purchase. Funding routes (Access to Work,
// charitable grants) are real UK options — framed as "we'll help you explore",
// no promise. CLIENT: confirm support/servicing/warranty specifics before publish.
const CARDS = [
  {
    title: "Help with funding",
    body: "Many Centaur owners fund their chair through workplace and charitable schemes — from Access to Work to disability grants. We'll help you explore the routes open to you.",
  },
  {
    title: "Try before you commit",
    body: "Book a test drive and feel the difference for yourself, in the kind of space you'll actually use it. No pressure, no obligation.",
  },
  {
    title: "Supported for the long run",
    body: "Built to automotive standards and looked after like it — with servicing and support behind every Centaur.",
  },
  {
    title: "Engineered for peace of mind",
    body: "Twin independent motors and fail-safe balancing. If power is ever lost, it deploys stabiliser legs and lowers you gently.",
  },
];

export default function OwningCentaur() {
  return (
    <section className="border-t border-mist bg-bone">
      <div className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
            Owning a Centaur
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
            We&apos;re with you, well beyond delivery.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-mist bg-mist sm:grid-cols-2">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 80} className="bg-bone">
              <div className="flex h-full flex-col p-8 lg:p-10">
                <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-ink">
                  {c.title}
                </h3>
                <p className="mt-3 font-sans text-base leading-relaxed text-ink/70">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
