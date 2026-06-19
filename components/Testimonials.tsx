import Reveal from "@/components/Reveal";

// CLIENT-SUPPLIED — placeholder quotes, awaiting real testimonials + sign-off.
// Do NOT publish as real until confirmed. Layout drops in real quotes unchanged.
const QUOTES = [
  {
    quote: "For the first time in years, I'm talking to people standing up — not looking up at them.",
    name: "Placeholder — Centaur owner",
  },
  {
    quote: "It doesn't look like a wheelchair. It looks like something you'd want to be seen in.",
    name: "Placeholder — family member",
  },
  {
    quote: "Through the kitchen, to the table, out the front door — it just goes where I go.",
    name: "Placeholder — Centaur owner",
  },
];

export default function Testimonials() {
  return (
    <section className="grain relative overflow-hidden border-t border-graphite/30 bg-graphite text-bone">
      <div className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze">
            In their words
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            The difference, from the people living it.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal as="figure" key={i} delay={(i % 3) * 80}>
              <blockquote className="font-display text-xl font-medium leading-snug tracking-[-0.01em] text-bone/90">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 font-sans text-sm text-bone/70">
                {q.name}
              </figcaption>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 font-sans text-xs text-bone/60">
          Placeholder quotes shown — to be replaced with real, signed-off testimonials.
        </p>
      </div>
    </section>
  );
}
