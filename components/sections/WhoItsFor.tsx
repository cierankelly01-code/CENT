import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";

export default function WhoItsFor() {
  return (
    <section id="who" className="border-t border-mist bg-bone">
      <div className="container-edge py-24 md:py-32">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Who it&apos;s for</p>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Built for the home — and for the places people pass through.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <article className="group flex h-full flex-col rounded-sm border border-mist p-8 transition-shadow duration-300 hover:shadow-[0_24px_60px_-40px_rgba(26,23,20,0.45)] lg:p-10">
              <Placeholder
                src="/assets/lifestyle/kitchen.jpg"
                label="AT-HOME LIFESTYLE"
                alt="A Centaur user elevated to reach the top kitchen cabinets in her own home"
                aspect="aspect-[16/10]"
                hover
                className="mb-8"
              />
              <p className="eyebrow">At home</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
                Independence, on your terms.
              </h3>
              <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
                Reach your own shelves. Meet visitors standing. Sit at the table
                at everyone&apos;s height. A wheelchair that fits your home — and
                looks like it belongs there.
              </p>
            </article>
          </Reveal>

          <Reveal delay={120}>
            <article className="group flex h-full flex-col rounded-sm border border-mist p-8 transition-shadow duration-300 hover:shadow-[0_24px_60px_-40px_rgba(26,23,20,0.45)] lg:p-10">
              <Placeholder
                src="/assets/lifestyle/bar.jpg"
                label="BUSINESS / VENUE"
                alt="A Centaur user raised to bar height, talking eye to eye with friends at a bar"
                aspect="aspect-[16/10]"
                hover
                className="mb-8"
              />
              <p className="eyebrow">Business &amp; mobility-as-a-service</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
                A better experience to offer.
              </h3>
              <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
                For care homes, hospitals and airports: fewer assisted journeys,
                a more dignified experience. Deployable as a managed mobility
                service across your spaces.
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
