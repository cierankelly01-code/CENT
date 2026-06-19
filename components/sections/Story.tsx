// PENDING FOUNDER SIGN-OFF BEFORE PUBLISH
import Image from "next/image";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";

export default function Story() {
  return (
    <section
      id="story"
      className="grain relative border-t border-mist bg-graphite text-bone"
    >
      {/* PENDING FOUNDER SIGN-OFF BEFORE PUBLISH */}
      <div className="container-edge py-24 md:py-32">
        <Reveal>
          <p className="eyebrow text-bronze">The story</p>
          <h2 className="mt-6 max-w-4xl font-display text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
            Two fathers. One refusal to accept
            <span className="text-bronze"> what a chair could be.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-20">
          <Reveal as="figure">
            <Placeholder
              src="/assets/product/david-alfie.png"
              label="DAVID & ALFIE — replace"
              alt="David Rajan with his son Alfie"
              aspect="aspect-[4/3]"
              className="ring-1 ring-bone/10"
            />
            <figcaption className="mb-8 mt-3 font-sans text-sm text-bone/70">
              David Rajan and his son, Alfie.
            </figcaption>
            <blockquote className="max-w-prose font-display text-2xl font-medium leading-snug text-bone/90 sm:text-[1.7rem]">
              “He wanted a chair that brings envy, not pity.”
            </blockquote>
            <p className="mt-7 max-w-prose font-sans text-lg leading-relaxed text-bone/70">
              David Rajan searched for a chair good enough for his son, Alfie,
              who has cerebral palsy. Everything on the market asked Alfie to be
              smaller, lower, easier to overlook. David refused to find a chair
              he could merely settle for — so he set out to build one worth
              wanting.
            </p>
          </Reveal>

          <Reveal as="figure" delay={120}>
            <blockquote className="max-w-prose font-display text-2xl font-medium leading-snug text-bone/90 sm:text-[1.7rem]">
              “I watched my father shrink into his chair.”
            </blockquote>
            <p className="mt-7 max-w-prose font-sans text-lg leading-relaxed text-bone/70">
              Paul Campbell spent a career designing cars — objects engineered to
              be desired. Then he watched his father, Bill, shrink into a clinical
              chair: blocking restaurant aisles, unable to reach his own
              cupboards, made to feel small. Paul knew the same craft that makes
              a car beautiful could give that dignity back.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-16 max-w-3xl font-display text-xl font-medium leading-relaxed text-bronze sm:text-2xl">
            The Centaur is what they built together: a chair that lifts you up,
            in every sense of the word.
          </p>
        </Reveal>

        <Reveal>
          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-md ring-1 ring-bone/10">
            <Image
              src="/assets/lifestyle/hug.jpg"
              alt="A grandchild hugging her grandmother, who sits at eye level in her Centaur at home"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
