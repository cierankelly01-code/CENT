import Reveal from "@/components/Reveal";

// Real publications that have covered Centaur Robotics. Verify each link / wording
// with the client before publish; swap for real logos when supplied.
const OUTLETS = [
  "Design Week",
  "Startups Magazine",
  "THIIS",
  "AT Today",
  "Insider Media",
];

export default function PressStrip() {
  return (
    <section className="border-t border-mist bg-bone">
      <div className="container-edge py-14 md:py-16">
        <Reveal>
          <p className="text-center font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
            Recognised by
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {OUTLETS.map((o) => (
              <span
                key={o}
                className="font-display text-lg font-semibold tracking-[-0.01em] text-ink/70"
              >
                {o}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
