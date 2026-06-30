import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import KineticWord from "@/components/KineticWord";

export default function HeroBuy() {
  return (
    <section id="top" className="relative overflow-hidden bg-bone">
      {/* Living aurora — drifting warm glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -right-[10%] top-[6%] h-[55vh] w-[55vh] rounded-full opacity-70 blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(176,125,75,0.30), rgba(176,125,75,0) 70%)" }}
        />
        <div
          className="aurora-b absolute right-[18%] top-[34%] h-[42vh] w-[42vh] rounded-full opacity-60 blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(218,212,200,0.55), rgba(218,212,200,0) 70%)" }}
        />
        <div
          className="aurora-a absolute -left-[8%] bottom-[2%] h-[38vh] w-[38vh] rounded-full opacity-40 blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(138,94,51,0.22), rgba(138,94,51,0) 70%)" }}
        />
      </div>

      <div className="container-edge relative grid items-center gap-10 pb-16 pt-20 md:pb-24 md:pt-24 lg:min-h-[92vh] lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* Copy */}
        <Reveal className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
            <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
            Self-balancing personal mobility · In production
          </span>

          <h1 className="mt-6 font-display text-[2.7rem] font-semibold leading-[1.0] tracking-[-0.02em] text-ink sm:text-6xl lg:text-7xl">
            Built to be
            <br />
            <span className="whitespace-nowrap">
              <span className="sr-only">wanted.</span>
              <KineticWord />
              <span className="text-bronze-deep" aria-hidden>.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-lg font-sans text-lg leading-relaxed text-ink/70">
            A self-balancing wheelchair that rises to eye level, glides through
            standard doorways, and lowers to the table — engineered to automotive
            standards, and made to be seen in.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/configure"
              className="inline-flex items-center rounded-full bg-bronze-deep px-7 py-3.5 font-sans text-base font-semibold text-bone shadow-[0_12px_30px_-12px_rgba(176,125,75,0.8)] transition-colors hover:bg-[#6f4d29]"
            >
              Configure your Centaur
            </Link>
            <Link
              href="/the-centaur"
              className="inline-flex items-center rounded-full border border-ink/20 px-6 py-3.5 font-sans text-base font-medium text-ink transition-colors hover:border-ink/50"
            >
              Explore the Centaur
            </Link>
          </div>

          <p className="mt-5 font-sans text-sm text-ink/60">
            No pressure — configure online, then we&apos;ll arrange a free test drive before you commit.
          </p>

          <p className="mt-3 font-sans text-sm text-ink/70">
            In production · Engineered by an ex-Ford team · Built in Britain
          </p>
        </Reveal>

        {/* Product */}
        <Reveal className="order-1 lg:order-2" delay={120}>
          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-75 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(176,125,75,0.18) 0%, rgba(218,212,200,0.38) 45%, rgba(244,241,234,0) 72%)",
              }}
            />
            <div className="relative aspect-square w-full lg:scale-110">
              <Image
                src="/assets/product/centaur-cutout.png"
                alt="The Centaur self-balancing wheelchair"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 52vw"
                className="object-contain drop-shadow-[0_34px_46px_rgba(26,23,20,0.2)]"
              />
            </div>
            <div
              aria-hidden
              className="mx-auto h-5 w-1/2 -translate-y-2 rounded-[100%] bg-ink/15 blur-xl"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
