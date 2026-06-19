import Reveal from "@/components/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Configure",
    body: "Tell us who it's for and how you'll use it. Two minutes, no payment, no commitment.",
  },
  {
    n: "02",
    title: "We tailor it with you",
    body: "Our team reviews your spec, answers every question, and gets the details right for you.",
  },
  {
    n: "03",
    title: "Test drive & delivery",
    body: "Try the Centaur for yourself. When you're ready, we deliver and set it up at home.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t border-mist bg-bone">
      <div className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
            How it works
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
            From first look to your front door.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-md border border-mist bg-mist md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 90} className="bg-bone">
              <div className="flex h-full flex-col p-8 lg:p-10">
                <span className="font-display text-sm font-semibold tracking-[0.1em] text-bronze-deep">
                  {s.n}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.01em] text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 font-sans text-base leading-relaxed text-ink/65">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
