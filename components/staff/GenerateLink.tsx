"use client";

import { useState, useTransition } from "react";
import { generateBuildLink } from "@/app/staff/actions";

// Staff clicks → creates a build draft → shows the private link to copy and send the customer.
export default function GenerateLink() {
  const [pending, startTransition] = useTransition();
  const [link, setLink] = useState<{ ref: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onGenerate() {
    setError(null);
    setCopied(false);
    startTransition(async () => {
      try {
        setLink(await generateBuildLink());
      } catch {
        setError("Could not create a link. Please try again.");
      }
    });
  }

  async function onCopy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
    } catch {
      setError("Couldn't copy — select the link and copy it manually.");
    }
  }

  return (
    <div className="rounded-xl border border-mist/70 bg-bone p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">New customer build link</h2>
          <p className="mt-1 font-sans text-sm text-ink/70">
            Creates a private Build Studio link to send a customer.
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={pending}
          className="inline-flex items-center rounded-full bg-bronze-deep px-5 py-2.5 font-sans text-sm font-semibold text-bone transition-colors motion-reduce:transition-none hover:bg-bronze-deeper disabled:opacity-60"
        >
          {pending ? "Creating…" : "Generate link"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 font-sans text-sm text-bronze-deep">
          {error}
        </p>
      )}

      {link && (
        <div className="mt-4">
          <p className="font-sans text-sm text-ink/70">
            Reference <span className="font-medium text-ink">{link.ref}</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              readOnly
              value={link.url}
              aria-label="Customer build link"
              onFocus={(e) => e.currentTarget.select()}
              className="min-w-0 flex-1 rounded-md border border-mist bg-white px-3 py-2 font-sans text-sm text-ink"
            />
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex items-center rounded-full border border-ink/20 px-4 py-2 font-sans text-sm font-medium text-ink transition-colors motion-reduce:transition-none hover:border-ink/50"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
