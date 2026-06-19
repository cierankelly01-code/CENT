"use client";

import { useEffect, useState } from "react";

// Cycles the brand ethos — envy, not pity. Empowering, never deficit-framed.
const WORDS = ["wanted", "seen", "admired", "yours"];

export default function KineticWord({ className = "text-bronze-deep" }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((p) => (p + 1) % WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} aria-hidden>
      <span key={i} className="kinetic-word inline-block">
        {WORDS[i]}
      </span>
    </span>
  );
}
