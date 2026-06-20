import { BUILD_STEP_COUNT } from "@/lib/configurator/options";

/**
 * Studio landing for a capability link. Shell milestone: presents the build reference and what
 * happens next. The step-by-step builder + email confirmation are wired in the next PRs.
 */
export default function StudioWelcome({ reference }: { reference: string }) {
  return (
    <div className="container-edge py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Your Centaur build</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
          Let’s build your Centaur, in detail.
        </h1>
        <p className="mt-4 font-sans text-lg leading-relaxed text-ink/70">
          This is your private build studio — take your time, change your mind, and pick up exactly
          where you left off whenever you return. Nothing here is a payment or a commitment.
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-mist py-5">
          <div>
            <dt className="font-sans text-xs uppercase tracking-[0.18em] text-bronze-deep">
              Reference
            </dt>
            <dd className="mt-1 font-display text-lg font-semibold tracking-[0.02em] text-ink">
              {reference}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-xs uppercase tracking-[0.18em] text-bronze-deep">
              Steps
            </dt>
            <dd className="mt-1 font-display text-lg font-semibold text-ink">
              {BUILD_STEP_COUNT}
            </dd>
          </div>
        </dl>

        <div className="mt-8 rounded-md border border-mist bg-mist/20 p-5 sm:p-6">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
            What happens next
          </p>
          <ol className="mt-3 space-y-2 font-sans text-sm text-ink/70">
            <li>1. You spec your Centaur — fit, controls, finish and more.</li>
            <li>2. We review it and prepare a tailored quote with a delivery estimate.</li>
            <li>3. We arrange a test drive in a space that suits you.</li>
          </ol>
        </div>

        <p className="mt-8 font-sans text-sm text-ink/70">
          The guided builder opens here shortly. Your reference{" "}
          <span className="font-medium text-ink">{reference}</span> is saved — keep this link to
          return any time.
        </p>
      </div>
    </div>
  );
}
