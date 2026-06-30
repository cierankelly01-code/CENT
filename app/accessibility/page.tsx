import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Accessibility — Centaur Robotics",
  description:
    "How we build the Centaur website and tools to be usable by everyone — our accessibility commitment and how to flag a barrier.",
};

export default function AccessibilityPage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Accessibility"
        title="Built to be used by everyone."
        intro="We make a mobility product for people with limited mobility. It would be a contradiction if the way you learn about it, or spec your own, wasn't accessible too. So accessibility is part of how we build — not an afterthought."
      />

      <section className="border-t border-mist bg-bone">
        <div className="container-edge grid gap-12 py-16 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink">
              Our commitment
            </h2>
            <p className="mt-4 max-w-sm font-sans text-base leading-relaxed text-ink/70">
              We aim to meet WCAG 2.1 AA across our website and customer tools, and we&apos;re
              working toward 2.2. We&apos;d rather be honest about where we are than claim perfection.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">How we build</h3>
              <ul className="mt-4 space-y-3 font-sans text-base leading-relaxed text-ink/75">
                <li>
                  <span className="font-medium text-ink">Tested automatically.</span> Every change
                  runs through automated accessibility checks before it can go live — we target zero
                  issues.
                </li>
                <li>
                  <span className="font-medium text-ink">Keyboard friendly.</span> You can use the
                  site and configure a Centaur without a mouse.
                </li>
                <li>
                  <span className="font-medium text-ink">Screen-reader ready.</span> Clear structure,
                  labels and live updates so assistive tech can follow along.
                </li>
                <li>
                  <span className="font-medium text-ink">Calm by default.</span> We honour
                  &ldquo;reduced motion&rdquo; settings, so nothing moves that you didn&apos;t ask to.
                </li>
                <li>
                  <span className="font-medium text-ink">Plain language.</span> We try to keep words
                  simple and questions optional where they can be.
                </li>
                <li>
                  <span className="font-medium text-ink">Works on your screen.</span> Designed to hold
                  up from a small phone to a large display, and at higher zoom.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Found a barrier?</h3>
              <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-ink/75">
                If anything is hard to use, please tell us — it helps us fix it for you and for the
                next person. Email{" "}
                {/* CLIENT — confirm the best inbox for accessibility reports */}
                <a
                  href="mailto:hello@centaurrobotics.com?subject=Accessibility"
                  className="font-medium text-bronze-deep underline underline-offset-2 hover:text-ink"
                >
                  hello@centaurrobotics.com
                </a>{" "}
                with what happened and the device or browser you were using, and we&apos;ll get on it
                as quickly as we can.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
