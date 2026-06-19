import Image from "next/image";
import Reveal from "@/components/Reveal";

const SHOTS: { src: string; alt: string; tall?: boolean }[] = [
  { src: "/assets/lifestyle/bar.jpg", alt: "Raised to bar height, talking eye to eye with friends at a bar" },
  { src: "/assets/lifestyle/kitchen.jpg", alt: "Reaching the top kitchen cabinets, elevated, at home" },
  { src: "/assets/lifestyle/hug.jpg", alt: "A grandmother hugging her grandchild, at eye level in her Centaur", tall: true },
  { src: "/assets/lifestyle/restaurant.jpg", alt: "At the table in a restaurant, at everyone's height" },
  { src: "/assets/lifestyle/desk.jpg", alt: "Working at a desk, independent and at ease" },
  { src: "/assets/lifestyle/makeup.jpg", alt: "Getting ready at the mirror, doing make-up, elevated" },
];

export default function Gallery() {
  return (
    <section className="border-t border-mist bg-bone">
      <div className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
            Real life, lived
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
            Not a render. People, living.
          </h2>
        </Reveal>

        <div className="mt-14 grid auto-rows-[220px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:auto-rows-[260px]">
          {SHOTS.map((s, i) => (
            <Reveal
              key={s.src}
              delay={(i % 3) * 70}
              className={`group relative overflow-hidden rounded-md ${s.tall ? "row-span-2" : ""}`}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
