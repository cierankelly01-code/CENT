import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Centaur Robotics",
  description: "How Centaur Robotics handles your data.",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="container-edge py-24 md:py-32">
      {/* PRIVACY POLICY — needs real copy before public launch */}
      <a href="/" className="font-sans text-sm text-bronze-deep hover:text-ink">
        ← Back to Centaur
      </a>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink">
        Privacy Policy
      </h1>
      <p className="mt-4 font-sans text-sm uppercase tracking-wider text-ink/50">
        Draft — placeholder copy
      </p>

      <div className="mt-10 max-w-prose space-y-6 font-sans text-base leading-relaxed text-ink/75">
        <p>
          This is a placeholder privacy policy for the Centaur Robotics website.
          It must be replaced with reviewed copy before public launch.
        </p>
        <p>
          When you submit the quote request form, we collect your name, email,
          and any phone number or message you provide. We use these details only
          to contact you about the Centaur. We never share or sell your data.
        </p>
        <p>
          Under UK GDPR you have the right to access, correct, or request
          deletion of your data. To do so, contact{" "}
          <a href="mailto:hello@centaurrobotics.com" className="underline">
            hello@centaurrobotics.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
