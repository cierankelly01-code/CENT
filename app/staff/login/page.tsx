"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const DEMO_MODE = process.env.NEXT_PUBLIC_STAFF_DEMO === "1";

export default function StaffLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      router.push("/staff");
      router.refresh();
    } catch {
      setError("Sign-in failed. Check your email and password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-edge py-20 md:py-28">
      <div className="mx-auto max-w-sm">
        <h1 className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink">
          Staff sign-in
        </h1>

        {DEMO_MODE && (
          <div className="mt-6 rounded-xl border border-bronze-deep/30 bg-bronze-deep/[0.06] p-5">
            <p className="font-sans text-sm font-semibold text-bronze-deep">Preview mode</p>
            <p className="mt-1 font-sans text-sm text-ink/70">
              No login required — this is a demo system with sample data.
            </p>
            <a
              href="/staff"
              className="mt-4 inline-flex items-center rounded-full bg-bronze-deep px-6 py-2.5 font-sans text-sm font-semibold text-bone transition-colors hover:bg-[#6f4d29]"
            >
              Enter staff demo →
            </a>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="sf-email" className="mb-2 block font-sans text-base font-medium text-ink">
              Email
            </label>
            <input
              id="sf-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-mist bg-bone px-4 py-3 font-sans text-base text-ink"
            />
          </div>
          <div>
            <label htmlFor="sf-pw" className="mb-2 block font-sans text-base font-medium text-ink">
              Password
            </label>
            <input
              id="sf-pw"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-mist bg-bone px-4 py-3 font-sans text-base text-ink"
            />
          </div>
          {error && (
            <p role="alert" className="font-sans text-sm text-bronze-deep">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center rounded-full bg-bronze-deep px-7 py-3 font-sans text-base font-semibold text-bone transition-colors motion-reduce:transition-none hover:bg-bronze-deeper disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
