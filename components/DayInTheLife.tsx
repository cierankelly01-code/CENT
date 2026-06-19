import Reveal from "@/components/Reveal";

// Emotional, dignity-first — real product facts woven into lived moments.
const MOMENTS: { time: string; line: string; detail: string }[] = [
  {
    time: "First thing",
    line: "Make your own tea before the house wakes.",
    detail: "Rise to 820mm and the mug, the kettle, the top shelf are all back within reach. No waiting. No asking.",
  },
  {
    time: "On the street",
    line: "Eye to eye at the gate, the counter, the bar.",
    detail: "Hold a conversation standing, the way it was always meant to be — in it, never beneath it.",
  },
  {
    time: "Through the day",
    line: "Turn on the spot. Slip through the doorway.",
    detail: "Self-balancing on two wheels at 470mm wide — no three-point shuffle, no “can you just move that.”",
  },
  {
    time: "Dinner",
    line: "Lower to the table and pull up a place.",
    detail: "Down to 480mm, you’re at the table with everyone else — not parked at the end of it.",
  },
  {
    time: "Out, out",
    line: "To the pub, the gallery, the high street.",
    detail: "10+ miles on a charge, at your pace, on smooth ground — looking like something you’d want to be seen in.",
  },
  {
    time: "And if it ever matters",
    line: "You’re safe, always.",
    detail: "Twin independent motors and fail-safe balancing. Lose power and it deploys stabiliser legs and lowers you gently.",
  },
];

export default function DayInTheLife() {
  return (
    <section className="border-t border-mist bg-bone">
      <div className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
            A day, reclaimed
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
            It&apos;s not the chair. It&apos;s the moments it gives back.
          </h2>
        </Reveal>

        <ol className="mt-14 space-y-0">
          {MOMENTS.map((m, i) => (
            <Reveal as="li" key={m.time} delay={(i % 2) * 70}>
              <div className="grid gap-x-8 gap-y-2 border-t border-mist py-8 md:grid-cols-[180px_1fr] md:py-10">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-bronze-deep" aria-hidden />
                  <span className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-bronze-deep">
                    {m.time}
                  </span>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[1.7rem]">
                    {m.line}
                  </p>
                  <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-ink/70">
                    {m.detail}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
