import Reveal from "@/components/Reveal";

const FAQS: [string, string][] = [
  [
    "Where can the Centaur be used?",
    "At home and across pedestrian areas on smooth surfaces — through the house, along the high street, around the airport. It's designed for everyday environments, not rough off-road terrain.",
  ],
  [
    "How do you control it?",
    "With a single joystick, or from a mobile app — whichever suits you. It self-balances on two wheels, so it turns on the spot and slips through doorways without shuffling.",
  ],
  [
    "Will it fit through my doorways?",
    "Yes. At 470mm wide it's built to pass through standard doorframes, so no room in the house is off-limits.",
  ],
  [
    "Can I transport it in a car?",
    "It dismantles into three manageable parts (around 75kg in total) that load into a car boot.",
  ],
  [
    "What happens if the power fails?",
    "It's engineered to automotive standards with twin independent motors. On power loss it deploys stabiliser legs and lowers you gently to park — fail-safe by design.",
  ],
  [
    "How do I get one?",
    "Configure your Centaur online — it takes about two minutes. Our team then gets in touch to tailor the details, arrange a test drive, and organise delivery.",
  ],
];

export default function Faq() {
  return (
    <section className="border-t border-mist bg-bone">
      <div className="container-edge grid gap-12 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
              Questions
            </p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
              The things people ask first.
            </h2>
            <p className="mt-5 max-w-sm font-sans text-base leading-relaxed text-ink/70">
              Still wondering about something? It&apos;s the fastest answered on a
              quick call — start by configuring yours.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="divide-y divide-mist border-y border-mist">
            {FAQS.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-semibold tracking-[-0.01em] text-ink marker:hidden">
                  {q}
                  <span
                    aria-hidden
                    className="shrink-0 text-2xl font-normal text-bronze-deep transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-10 font-sans text-base leading-relaxed text-ink/65">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
