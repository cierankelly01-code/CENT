import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";

// Market stats are press-reported figures about UK wheelchair accessibility.
// VERIFY against a citable source before public launch.
const MARKET = [
  { value: <CountUp end={1.2} decimals={1} suffix="m" />, label: "wheelchair users in the UK" },
  { value: <CountUp end={9} suffix="%" />, label: "of UK homes are wheelchair-accessible" },
  { value: <CountUp end={400} suffix="k" />, label: "in England live in non-adapted homes" },
];

const CREDENTIALS: [string, string][] = [
  ["Automotive", "Engineering pedigree — ex-Ford design & engineering"],
  ["In production", "Built and shipping, not a render"],
  ["Pre-order", "Open now"],
  ["Fail-safe", "Redundant motors & self-balancing"],
];

export default function Credibility() {
  return (
    <section
      id="credibility"
      className="grain relative border-t border-mist bg-graphite text-bone"
    >
      <div className="container-edge py-24 md:py-32">
        {/* The problem — market context */}
        <Reveal>
          <p className="eyebrow text-bronze">Why it matters</p>
          <div className="mt-10 grid gap-10 border-y border-bone/15 py-12 sm:grid-cols-3">
            {MARKET.map((m, i) => (
              <Reveal key={m.label} delay={i * 90}>
                <div>
                  <div className="font-display text-5xl font-semibold text-bronze lg:text-6xl">
                    {m.value}
                  </div>
                  <p className="mt-3 max-w-[15rem] font-sans text-sm leading-relaxed text-bone/65">
                    {m.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* The answer — pull quote + credentials */}
        <div className="mt-20 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow text-bronze">Why us</p>
            <figure>
              <blockquote className="mt-6 font-display text-3xl font-medium leading-[1.18] tracking-tight sm:text-4xl">
                “It looks good, negotiates tight spaces, spins on a sixpence,
                and fits into the space of a dining room chair.”
              </blockquote>
              <figcaption className="mt-6 font-sans text-sm text-bone/70">
                Paul Campbell — Design Director, ex-Ford chief designer
              </figcaption>
            </figure>
            <p className="mt-8 max-w-prose font-sans text-lg leading-relaxed text-bone/70">
              The Centaur is engineered by a team from the likes of Ford,
              applying automotive standards of safety and craft to personal
              mobility. It is in production now and open for pre-order.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-bone/15 bg-bone/15">
              {CREDENTIALS.map(([stat, label]) => (
                <div key={label} className="bg-graphite p-7">
                  <dt className="font-display text-xl font-semibold text-bronze">
                    {stat}
                  </dt>
                  <dd className="mt-2 font-sans text-sm leading-relaxed text-bone/70">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>

            {/* CLIENT-SUPPLIED — awaiting sign-off: funding figures, partner logos, trial quotes */}
            <div className="mt-6 rounded-sm border border-dashed border-bone/25 p-6">
              <p className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-bone/70">
                Reserved for client-supplied proof
              </p>
              <ul className="mt-3 space-y-1.5 font-sans text-sm text-bone/70">
                <li>— Funding raised / backers (awaiting sign-off)</li>
                <li>— Partner &amp; pilot logos (awaiting assets)</li>
                <li>— Trial testimonials (awaiting sign-off)</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
