"use client";

import { useState, useTransition } from "react";
import { humanizeStatus } from "@/lib/staff-format";

// A status dropdown wired to a (bound) staff server action. Optimistic-ish: reflects the
// chosen value immediately and reverts on error.
export default function StatusSelect({
  value,
  options,
  action,
}: {
  value: string;
  options: readonly string[];
  action: (status: string) => Promise<void>;
}) {
  const [current, setCurrent] = useState(value);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  // Always include the current value so it's visible even if outside the standard set.
  const opts = options.includes(current) ? options : [current, ...options];

  function onChange(next: string) {
    const prev = current;
    setCurrent(next);
    setError(false);
    startTransition(async () => {
      try {
        await action(next);
      } catch {
        setCurrent(prev);
        setError(true);
      }
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <select
        value={current}
        disabled={pending}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Status"
        className="rounded-md border border-mist bg-bone px-3 py-1.5 font-sans text-sm text-ink disabled:opacity-60"
      >
        {opts.map((o) => (
          <option key={o} value={o}>
            {humanizeStatus(o)}
          </option>
        ))}
      </select>
      {error && (
        <span role="alert" className="font-sans text-xs text-bronze-deep">
          Couldn&apos;t save
        </span>
      )}
    </span>
  );
}
