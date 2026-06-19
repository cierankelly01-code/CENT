import Reveal from "@/components/Reveal";

// All real product facts. The two marked [~] are reasonable assumptions to
// showcase the layout — confirm with the client before publish.
const SPECS: { group: string; items: [string, string][] }[] = [
  {
    group: "Dimensions",
    items: [
      ["Seat height range", "480 – 820mm"],
      ["Width", "470mm"],
      ["Weight", "~75kg"],
      ["Dismantles into", "3 parts"],
    ],
  },
  {
    group: "Performance",
    items: [
      ["Top speed", "4mph"],
      ["Range", "10+ miles"],
      ["Charge time", "~4 hours [~]"],
      ["Drive", "Self-balancing, two wheels"],
    ],
  },
  {
    group: "Engineering",
    items: [
      ["Motors", "Twin independent, fail-safe"],
      ["On power loss", "Deploys stabiliser legs"],
      ["Standard", "Automotive-grade"],
      ["Battery", "Lithium-ion [~]"],
    ],
  },
  {
    group: "Living with it",
    items: [
      ["Controls", "Joystick or mobile app"],
      ["Upholstery", "Leather"],
      ["Body", "Composite"],
      ["Built", "In Britain"],
    ],
  },
];

export default function Specs() {
  return (
    <section className="grain relative overflow-hidden border-t border-graphite/30 bg-ink text-bone">
      <div
        aria-hidden
        className="aurora-b pointer-events-none absolute right-[-5%] top-[10%] h-[50vh] w-[50vh] rounded-full opacity-50 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(176,125,75,0.30), rgba(176,125,75,0) 70%)" }}
      />
      <div className="container-edge relative py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze">
            Specifications
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Engineered to the last millimetre.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {SPECS.map((col, i) => (
            <Reveal key={col.group} delay={(i % 4) * 80}>
              <div>
                <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze">
                  {col.group}
                </h3>
                <dl className="mt-5 space-y-4 border-t border-bone/15 pt-5">
                  {col.items.map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-sans text-sm text-bone/60">{k}</dt>
                      <dd className="mt-0.5 font-display text-lg font-semibold tracking-[-0.01em]">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 font-sans text-xs text-bone/60">
          For homes, pedestrian areas and smooth surfaces. [~] indicates a figure
          to confirm before publish.
        </p>
      </div>
    </section>
  );
}
