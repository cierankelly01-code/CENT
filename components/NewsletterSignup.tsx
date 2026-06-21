"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    setError(null);
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: dbError } = await getSupabaseClient()
        .from("quote_requests")
        .insert({
          name: "Newsletter subscriber",
          email: email.trim(),
          enquiry_type: "personal",
          message: "Newsletter signup",
          config_payload: { source: "newsletter" },
        });
      if (dbError) throw dbError;
      setDone(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      // eslint-disable-next-line no-console
      console.error("newsletter signup failed:", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <p role="status" className="font-sans text-base text-bone/85">
        You&apos;re on the list — we&apos;ll be in touch with news and availability.
      </p>
    );
  }

  return (
    <div className="max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="news-email" className="sr-only">
          Email address
        </label>
        <input
          id="news-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "news-email-error" : undefined}
          placeholder="you@email.com"
          className="w-full rounded-full border border-bone/25 bg-bone/[0.06] px-5 py-3 font-sans text-base text-bone placeholder:text-bone/45"
        />
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="shrink-0 rounded-full bg-bronze-deep px-6 py-3 font-sans text-base font-semibold text-bone transition-colors hover:bg-bronze-deeper disabled:opacity-60"
        >
          {submitting ? "…" : "Keep me posted"}
        </button>
      </div>
      {error && (
        <p id="news-email-error" role="alert" className="mt-2 font-sans text-sm text-bronze">
          {error}
        </p>
      )}
    </div>
  );
}
