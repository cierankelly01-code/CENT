import Link from "next/link";
import { trackByRef } from "@/lib/configurator/repository";
import type { BuildStatus } from "@/lib/configurator/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Track your Centaur",
  robots: { index: false, follow: false },
};

// Customer-facing journey, mapped from the build's status. Keep it warm and reassuring.
const STAGES: { key: BuildStatus; label: string; blurb: string }[] = [
  { key: "submitted", label: "Specification received", blurb: "We've got your build — thank you." },
  { key: "under_review", label: "Reviewing your build", blurb: "Our team is going through the detail." },
  { key: "quoted", label: "Quote prepared", blurb: "We've put your quote together." },
  { key: "confirmed", label: "Confirmed", blurb: "Your Centaur is confirmed and in hand." },
];

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-edge py-16 md:py-24">
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  );
}

export default async function TrackPage({
  params,
  searchParams,
}: {
  params: { ref: string };
  searchParams: { t?: string };
}) {
  const token = searchParams.t;

  if (!token) {
    return (
      <Wrapper>
        <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
          Track your Centaur
        </h1>
        <p className="mt-4 font-sans text-base text-ink/70">
          Please open the secure tracking link we sent you — it includes the code that brings up
          your build.
        </p>
      </Wrapper>
    );
  }

  const data = await trackByRef(params.ref, token);

  if (!data) {
    return (
      <Wrapper>
        <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
          We couldn&apos;t find that build
        </h1>
        <p className="mt-4 font-sans text-base text-ink/70">
          The link may be incomplete or out of date. Please use the most recent link we sent, or
          get in touch and we&apos;ll help.
        </p>
      </Wrapper>
    );
  }

  // Still being configured.
  if (data.status === "draft") {
    return (
      <Wrapper>
        <p className="eyebrow">{data.ref}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
          Your build is in progress
        </h1>
        <p className="mt-4 font-sans text-base text-ink/70">
          You haven&apos;t finished your specification yet. Pick up where you left off whenever
          you&apos;re ready.
        </p>
        <Link
          href={`/build/${data.ref}?t=${token}`}
          className="mt-6 inline-flex items-center rounded-full bg-bronze-deep px-6 py-3 font-sans text-base font-semibold text-bone transition-colors motion-reduce:transition-none hover:bg-bronze-deeper"
        >
          Continue your build
        </Link>
      </Wrapper>
    );
  }

  // Closed states.
  if (data.status === "archived" || data.status === "abandoned") {
    return (
      <Wrapper>
        <p className="eyebrow">{data.ref}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
          This build is closed
        </h1>
        <p className="mt-4 font-sans text-base text-ink/70">
          If that&apos;s not right, or you&apos;d like to pick things back up, just get in touch and
          we&apos;ll sort it.
        </p>
      </Wrapper>
    );
  }

  const currentIndex = STAGES.findIndex((s) => s.key === data.status);

  return (
    <Wrapper>
      <p className="eyebrow">{data.ref}</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
        {data.customer_name ? `${data.customer_name}, here's your Centaur` : "Your Centaur"}
      </h1>
      {data.submitted_at && (
        <p className="mt-3 font-sans text-sm text-ink/60">
          Submitted {new Date(data.submitted_at).toLocaleDateString("en-GB")}
        </p>
      )}

      <ol className="mt-10 space-y-0">
        {STAGES.map((stage, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const state = done ? "Done" : current ? "In progress" : "To come";
          return (
            <li key={stage.key} className="flex gap-4 pb-8 last:pb-0" aria-current={current ? "step" : undefined}>
              <div className="flex flex-col items-center">
                <span
                  aria-hidden
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm ${
                    done
                      ? "border-bronze-deep bg-bronze-deep text-bone"
                      : current
                        ? "border-bronze-deep text-bronze-deep"
                        : "border-mist text-ink/40"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                {i < STAGES.length - 1 && (
                  <span aria-hidden className={`mt-1 w-px flex-1 ${done ? "bg-bronze-deep" : "bg-mist"}`} />
                )}
              </div>
              <div className="pb-2">
                <p className={`font-display text-lg font-semibold ${current || done ? "text-ink" : "text-ink/50"}`}>
                  {stage.label} <span className="font-sans text-xs font-medium text-ink/50">· {state}</span>
                </p>
                <p className="mt-1 font-sans text-sm text-ink/65">{stage.blurb}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-10 font-sans text-sm text-ink/60">
        We&apos;ll email you as your Centaur moves to each step. Any questions, just reply to our
        last email and we&apos;ll be straight back to you.
      </p>
    </Wrapper>
  );
}
