"use client";

import { createContext, useContext, useState } from "react";

// Save-status for the Build Studio. The layout's header shows a live indicator; later PRs
// (autosave wiring) flip the state as the customer's progress is persisted server-side.

export type SaveState = "idle" | "saving" | "saved" | "error";

type StudioStatusContextValue = {
  state: SaveState;
  setState: (next: SaveState) => void;
};

const StudioStatusContext = createContext<StudioStatusContextValue | null>(null);

export function StudioStatusProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SaveState>("idle");
  return (
    <StudioStatusContext.Provider value={{ state, setState }}>
      {children}
    </StudioStatusContext.Provider>
  );
}

export function useStudioStatus(): StudioStatusContextValue {
  const ctx = useContext(StudioStatusContext);
  if (!ctx) {
    throw new Error("useStudioStatus must be used within a StudioStatusProvider");
  }
  return ctx;
}

const LABELS: Record<SaveState, string> = {
  idle: "Saved automatically",
  saving: "Saving…",
  saved: "All changes saved",
  error: "Couldn’t save — we’ll keep trying",
};

const DOT: Record<SaveState, string> = {
  idle: "bg-ink/30",
  saving: "bg-bronze animate-pulse motion-reduce:animate-none",
  saved: "bg-bronze-deep",
  error: "bg-bronze-deep",
};

/** Compact, polite live region announcing save state. */
export function SaveIndicator() {
  const { state } = useStudioStatus();
  return (
    <p
      aria-live="polite"
      className="flex items-center gap-2 font-sans text-xs text-ink/70"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[state]}`} aria-hidden />
      {LABELS[state]}
    </p>
  );
}
