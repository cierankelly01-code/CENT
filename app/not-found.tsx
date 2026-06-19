import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-[80vh] items-center overflow-hidden bg-bone">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="aurora-a absolute right-[8%] top-[12%] h-[44vh] w-[44vh] rounded-full opacity-60 blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(176,125,75,0.24), rgba(176,125,75,0) 70%)" }}
        />
      </div>
      <div className="container-edge relative">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
          404
        </p>
        <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">
          This page took a turn we didn&apos;t plan for.
        </h1>
        <p className="mt-6 max-w-md font-sans text-lg leading-relaxed text-ink/70">
          The page you&apos;re after isn&apos;t here — but the Centaur is. Let&apos;s
          get you back on course.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-bronze-deep px-7 py-3.5 font-sans text-base font-semibold text-bone transition-colors hover:bg-[#6f4d29]"
          >
            Back to home
          </Link>
          <Link
            href="/configure"
            className="inline-flex items-center rounded-full border border-ink/20 px-6 py-3.5 font-sans text-base font-medium text-ink transition-colors hover:border-ink/50"
          >
            Configure your Centaur
          </Link>
        </div>
      </div>
    </main>
  );
}
