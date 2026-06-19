"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

type Spot = {
  id: string;
  /** Position over the image, as percentages. */
  x: number;
  y: number;
  title: string;
  line: string;
  spec: string;
};

// Coordinates are tuned over /assets/product/centaur-studio.png — nudge the
// x/y percentages here if the real hero render is swapped in.
const SPOTS: Spot[] = [
  {
    id: "seat",
    x: 52,
    y: 42,
    title: "Eye-level seat",
    line: "Rises above bar-stool height, so you meet the world standing — and reach the top shelf yourself.",
    spec: "Elevates to 820mm",
  },
  {
    id: "controls",
    x: 33,
    y: 30,
    title: "Effortless control",
    line: "Drive it with a single joystick, or from your phone. Considered down to the last button.",
    spec: "Joystick or mobile app",
  },
  {
    id: "balance",
    x: 63,
    y: 62,
    title: "Self-balancing",
    line: "Twin independent motors balance it on two wheels — nimble, no shuffling through doorways.",
    spec: "“Spins on a sixpence”",
  },
  {
    id: "width",
    x: 48,
    y: 68,
    title: "Doorway-narrow",
    line: "Built to the width of a standard home, so no room is off-limits.",
    spec: "470mm wide",
  },
  {
    id: "footplate",
    x: 47,
    y: 88,
    title: "Fail-safe by design",
    line: "On power loss it deploys stabiliser legs and lowers you gently to park. Built to automotive standards.",
    spec: "Redundant motors · stabiliser legs",
  },
];

export default function ProductExplorer() {
  const [activeId, setActiveId] = useState<string>(SPOTS[0].id);
  const active = SPOTS.find((s) => s.id === activeId)!;

  return (
    <section id="explore" className="border-t border-mist bg-bone">
      <div className="container-edge py-24 md:py-32">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Explore the Centaur</p>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Every part, engineered to be wanted.
          </h2>
          <p className="mt-5 font-sans text-lg leading-relaxed text-ink/70">
            Take it apart with your eyes. Hover or tap each point to see how it
            earns its place.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          {/* Stage */}
          <Reveal>
            <div className="relative overflow-hidden rounded-lg border border-mist bg-gradient-to-b from-bone to-[#e8e3d9] p-6 shadow-[0_30px_80px_-50px_rgba(26,23,20,0.45)] sm:p-8">
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(176,125,75,0.16), rgba(218,212,200,0.32) 45%, rgba(244,241,234,0) 72%)" }}
              />
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src="/assets/product/centaur-cutout.png"
                  alt="The Centaur self-balancing wheelchair"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain drop-shadow-[0_22px_32px_rgba(26,23,20,0.18)]"
                />

                {SPOTS.map((s) => {
                  const on = s.id === activeId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={on}
                      aria-label={`${s.title} — ${s.spec}`}
                      onMouseEnter={() => setActiveId(s.id)}
                      onFocus={() => setActiveId(s.id)}
                      onClick={() => setActiveId(s.id)}
                      style={{ left: `${s.x}%`, top: `${s.y}%` }}
                      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    >
                      <span
                        className={`block h-4 w-4 rounded-full ring-2 ring-bone shadow-[0_2px_8px_rgba(26,23,20,0.35)] transition-transform duration-300 ${
                          on
                            ? "scale-125 bg-bronze-deep"
                            : "bg-bronze-deep/80 hotspot-pulse group-hover:scale-110"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Callout + index */}
          <div>
            <Reveal>
              <div
                aria-live="polite"
                className="min-h-[8.5rem] border-l-2 border-bronze pl-6"
              >
                <p className="font-sans text-xs font-medium uppercase tracking-[0.16em] text-bronze-deep">
                  {active.spec}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
                  {active.title}
                </h3>
                <p className="mt-3 max-w-prose font-sans text-base leading-relaxed text-ink/70">
                  {active.line}
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {SPOTS.map((s) => {
                  const on = s.id === activeId;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setActiveId(s.id)}
                        onMouseEnter={() => setActiveId(s.id)}
                        className={`rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
                          on
                            ? "border-bronze-deep bg-bronze-deep text-bone"
                            : "border-mist text-ink/70 hover:border-bronze/60 hover:text-ink"
                        }`}
                      >
                        {s.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
