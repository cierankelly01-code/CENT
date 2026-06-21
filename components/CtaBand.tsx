import Link from "next/link";
import Reveal from "@/components/Reveal";

type CtaBandProps = {
  heading?: string;
  sub?: string;
};

export default function CtaBand({
  heading = "Ready for a chair you'd want to be seen in?",
  sub = "Tell us about you and we'll spec your Centaur together. Takes two minutes.",
}: CtaBandProps) {
  return (
    <section className="grain relative border-t border-graphite/30 bg-ink text-bone">
      <div className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold leading-[1.06] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-bone/70">
            {sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/configure"
              className="inline-flex items-center rounded-full bg-bronze-deep px-7 py-3.5 font-sans text-base font-semibold text-bone shadow-[0_12px_30px_-12px_rgba(176,125,75,0.8)] transition-colors hover:bg-bronze-deeper"
            >
              Configure your Centaur
            </Link>
            <Link
              href="/the-centaur"
              className="inline-flex items-center rounded-full border border-bone/25 px-6 py-3.5 font-sans text-base font-medium text-bone transition-colors hover:border-bone/60"
            >
              Explore the Centaur
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
