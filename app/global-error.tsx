"use client";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error); }, [error]);

  return (
    <html lang="en-GB">
      <body className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6">
        <div className="text-center max-w-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8b6914] mb-4">Something went wrong</p>
          <h1 className="text-2xl font-semibold text-white mb-3">Unexpected error</h1>
          <p className="text-[#888] text-sm mb-8">Our team has been notified automatically. Try again or go back home.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={reset}
              className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-[#e0e0e0] transition-colors">
              Try again
            </button>
            <Link href="/"
              className="px-5 py-2.5 rounded-full border border-[#333] text-white text-sm font-medium hover:border-[#555] transition-colors">
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
