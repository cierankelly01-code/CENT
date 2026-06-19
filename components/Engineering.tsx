import Image from "next/image";
import Reveal from "@/components/Reveal";

const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Automotive standards, not medical minimums",
    body: "We didn't ask “what's the least a wheelchair can be?” We brought the discipline that makes a car safe and desirable, and pointed it at mobility.",
  },
  {
    title: "Redundancy by default",
    body: "Twin independent motors. If one ever fails, the other keeps you balanced. Lose power entirely and stabiliser legs deploy, lowering you gently to park.",
  },
  {
    title: "Dignity is an engineering requirement",
    body: "Eye-level reach, a 470mm footprint, a chair that drops to the table — these aren't features. They're the brief. The rider comes first, always.",
  },
  {
    title: "Built in Britain, to last",
    body: "Composite body, leather upholstery, engineered to be owned for years and serviced like the precision machine it is.",
  },
];

export default function Engineering() {
  return (
    <section className="border-t border-mist bg-bone">
      <div className="container-edge py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
              The hard way, on purpose
            </p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.04] tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
              Everyone else builds four wheels. We chose two.
            </h2>
            <p className="mt-6 max-w-prose font-sans text-lg leading-relaxed text-ink/70">
              Self-balancing on two wheels is genuinely harder to engineer — and
              it&apos;s the whole point. It&apos;s what lets the Centaur turn on the spot,
              stand you up to eye level, and keep a footprint slim enough for a
              standard doorway. The difficult choice is the one that gives you
              your freedom back.
            </p>
            <p className="mt-5 max-w-prose font-sans text-base leading-relaxed text-ink/70">
              The team behind it has spent careers making objects people desire —
              including a design and engineering line-up drawn from the likes of
              Ford. That instinct, turned toward the chair its own founders
              couldn&apos;t find.
            </p>
            <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-md">
              <Image
                src="/assets/lifestyle/making.jpg"
                alt="A technician machining Centaur components in the British factory"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-px overflow-hidden rounded-md border border-mist bg-mist">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="bg-bone p-7 lg:p-8">
                  <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-2 font-sans text-base leading-relaxed text-ink/70">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
