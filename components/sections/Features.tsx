import Reveal from "@/components/Reveal";

type Feature = {
  title: string;
  line: string;
  spec: string;
};

const FEATURES: Feature[] = [
  {
    title: "Balances on two wheels",
    line: "Nimble enough to turn on the spot and slip through a doorway without a three-point shuffle.",
    spec: "Twin independent motors",
  },
  {
    title: "Lifts you to eye level",
    line: "Rise above bar-stool height for a conversation held standing — and reach the top shelf yourself.",
    spec: "Elevates to 820mm",
  },
  {
    title: "Fits through any doorway",
    line: "Built to the width of a standard home, so no room in the house is off-limits.",
    spec: "470mm wide",
  },
  {
    title: "Drops to the table",
    line: "Lowers smoothly to dining height so you join the table, not sit apart from it.",
    spec: "Lowers to 480mm",
  },
  {
    title: "Engineered to automotive standards",
    line: "On power loss it deploys stabiliser legs and lowers you gently — fail-safe by design.",
    spec: "Redundant, fail-safe",
  },
  {
    title: "Dismantles for the journey",
    line: "Comes apart into three manageable parts that load into a car boot.",
    spec: "~75kg · 3 parts",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-mist bg-bone">
      <div className="container-edge py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Sticky editorial heading */}
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">The Centaur</p>
              <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Every detail engineered around how you actually live.
              </h2>
              <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-ink/65">
                Six decisions, each made the way an automotive team makes them —
                for the person, not the spec sheet.
              </p>
              <p className="mt-8 max-w-sm font-sans text-sm leading-relaxed text-ink/70">
                Designed for homes, pedestrian spaces and smooth surfaces — at
                home, on the high street, through the airport.
              </p>
            </div>
          </Reveal>

          {/* Numbered editorial list */}
          <ol className="border-t border-mist">
            {FEATURES.map((f, i) => (
              <Reveal as="li" key={f.title} delay={(i % 2) * 80}>
                <article className="group grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-b border-mist py-8 transition-colors sm:py-10">
                  <span className="font-display text-lg font-semibold text-bronze-deep transition-colors group-hover:text-[#6f4d29]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h3 className="font-display text-2xl font-semibold leading-snug text-ink sm:text-[1.7rem]">
                        {f.title}
                      </h3>
                      <span className="font-sans text-xs font-medium uppercase tracking-[0.16em] text-bronze-deep">
                        {f.spec}
                      </span>
                    </div>
                    <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-ink/70">
                      {f.line}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
