import Reveal from "@/components/Reveal";

// Framed as the real positioning (eye-level, nimbleness, design, transport).
// Assumptions about "traditional" chairs are general — correct if needed.
const ROWS: { label: string; centaur: string; traditional: string }[] = [
  { label: "Eye level", centaur: "Rises to 820mm — stand to talk, reach the shelf", traditional: "Seated height only" },
  { label: "Through the home", centaur: "Self-balancing, turns on the spot", traditional: "Wider frame, multi-point turns" },
  { label: "At the table", centaur: "Lowers to 480mm — sits at the table", traditional: "Fixed seat height" },
  { label: "How it feels", centaur: "Designed to be wanted, not tolerated", traditional: "Clinical, medical-looking" },
  { label: "Transport", centaur: "Dismantles into three parts for the car", traditional: "Bulky, hard to move" },
];

export default function Comparison() {
  return (
    <section className="border-t border-mist bg-bone">
      <div className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
            The leap
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
            Not an upgrade. A different way to move.
          </h2>
        </Reveal>

        <div className="mt-14 overflow-hidden rounded-md border border-mist">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1.3fr_1.1fr] border-b border-mist bg-ink text-bone">
            <div className="p-4 sm:p-5" aria-hidden />
            <div className="border-l border-bone/15 p-4 font-display text-base font-semibold sm:p-5">
              The Centaur
            </div>
            <div className="border-l border-bone/15 p-4 font-sans text-sm text-bone/70 sm:p-5">
              A traditional powerchair
            </div>
          </div>
          {ROWS.map((r, i) => (
            <Reveal key={r.label} delay={(i % 3) * 70}>
              <div className={`grid grid-cols-[1fr_1.3fr_1.1fr] ${i % 2 ? "bg-bone" : "bg-mist/20"}`}>
                <div className="p-4 font-sans text-sm font-semibold uppercase tracking-wide text-ink/70 sm:p-5">
                  {r.label}
                </div>
                <div className="border-l border-mist p-4 font-sans text-base text-ink sm:p-5">
                  <span className="mr-2 text-bronze-deep" aria-hidden>✓</span>
                  {r.centaur}
                </div>
                <div className="border-l border-mist p-4 font-sans text-base text-ink/70 sm:p-5">
                  {r.traditional}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {/* CLIENT — verify comparison claims about traditional chairs before publish */}
      </div>
    </section>
  );
}
