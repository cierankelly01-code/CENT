"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

const STOPS = [
  {
    h: "480mm",
    label: "At the table",
    img: "/assets/lifestyle/restaurant.jpg",
    alt: "A Centaur user dining at a restaurant table, at the same height as everyone else",
    desc: "Lower to dining height and pull up a place — at the table with everyone, not parked at the end of it.",
  },
  {
    h: "600mm",
    label: "At the counter",
    img: "/assets/lifestyle/kitchen.jpg",
    alt: "A Centaur user elevated to reach the top kitchen cabinets at home",
    desc: "Reach the worktop, the top shelf, the kettle — and make your own tea before anyone's up.",
  },
  {
    h: "720mm",
    label: "Eye to eye",
    img: "/assets/lifestyle/bar.jpg",
    alt: "A Centaur user raised to bar height, talking eye to eye with friends",
    desc: "Hold a real conversation on the level — at the bar, at the gate, at the counter. In it, never beneath it.",
  },
  {
    h: "820mm",
    label: "Standing height",
    img: "/assets/lifestyle/height.jpg",
    alt: "A Centaur user elevated to standing height",
    desc: "Rise to meet the whole room. Above bar-stool height, eye to eye with everyone standing.",
  },
];

export default function RiseExperience() {
  const [i, setI] = useState(2);
  const stop = STOPS[i];

  return (
    <section className="grain relative overflow-hidden border-t border-graphite/30 bg-ink text-bone">
      <div
        aria-hidden
        className="aurora-a pointer-events-none absolute left-[-6%] top-[8%] h-[55vh] w-[55vh] rounded-full opacity-40 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(176,125,75,0.30), rgba(176,125,75,0) 70%)" }}
      />
      <div className="container-edge relative py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze">
            Find your level
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Every height is a moment back.
          </h2>
          <p className="mt-5 font-sans text-lg leading-relaxed text-bone/70">
            The Centaur rises from the dining table to standing height. Choose a
            level — see exactly what it gives back.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Image for the active level */}
          <Reveal>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md ring-1 ring-bone/10">
              {STOPS.map((s, idx) => (
                <Image
                  key={s.img}
                  src={s.img}
                  alt={idx === i ? s.alt : ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className={`object-cover transition-opacity duration-500 ${idx === i ? "opacity-100" : "opacity-0"}`}
                />
              ))}
              <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-ink/70 px-4 py-1.5 font-display text-sm font-semibold backdrop-blur">
                {stop.h}
              </div>
            </div>
          </Reveal>

          {/* Stops */}
          <Reveal delay={120}>
            <div>
              <div aria-live="polite" className="min-h-[7rem] border-l-2 border-bronze pl-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-semibold tracking-[-0.02em] text-bronze">
                    {stop.h}
                  </span>
                  <span className="font-display text-xl font-semibold">{stop.label}</span>
                </div>
                <p className="mt-3 max-w-md font-sans text-base leading-relaxed text-bone/75">
                  {stop.desc}
                </p>
              </div>

              <ul className="mt-8 flex flex-col gap-2">
                {STOPS.map((s, idx) => {
                  const on = idx === i;
                  return (
                    <li key={s.label}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setI(idx)}
                        className={`flex w-full items-center justify-between rounded-lg border px-5 py-3.5 text-left font-sans transition-colors ${
                          on
                            ? "border-bronze bg-bronze/15 text-bone"
                            : "border-bone/15 text-bone/70 hover:border-bone/40 hover:text-bone"
                        }`}
                      >
                        <span className="text-base font-medium">{s.label}</span>
                        <span className={`text-sm ${on ? "text-bronze" : "text-bone/50"}`}>
                          {s.h}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
