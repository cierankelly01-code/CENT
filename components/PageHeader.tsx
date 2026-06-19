import Reveal from "@/components/Reveal";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string;
};

/** Light masthead at the top of every sub-page. Clears the fixed nav and keeps
 *  nav contrast consistent (dark text always sits on bone). */
export default function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-bone">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="aurora-a absolute -right-[6%] -top-[10%] h-[46vh] w-[46vh] rounded-full opacity-60 blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(176,125,75,0.24), rgba(176,125,75,0) 70%)" }}
        />
        <div
          className="aurora-b absolute right-[24%] top-[20%] h-[34vh] w-[34vh] rounded-full opacity-50 blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(218,212,200,0.5), rgba(218,212,200,0) 70%)" }}
        />
      </div>
      <div className="container-edge relative pb-12 pt-32 md:pb-16 md:pt-40">
        <Reveal>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-ink/65">
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </header>
  );
}
