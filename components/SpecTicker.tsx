const ITEMS = [
  "820mm eye level",
  "470mm doorways",
  "Self-balancing",
  "Drops to the table",
  "10+ mile range",
  "Automotive-grade",
  "Dismantles in 3",
  "Joystick or app",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {ITEMS.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-6 font-sans text-sm font-medium uppercase tracking-[0.18em] text-bone/85">
            {t}
          </span>
          <span className="text-bronze">◆</span>
        </span>
      ))}
    </div>
  );
}

/** Auto-scrolling spec band — product-launch energy. */
export default function SpecTicker() {
  return (
    <div className="grain relative overflow-hidden border-y border-graphite/40 bg-ink py-4">
      <div className="marquee-track flex w-max">
        <Row />
        <Row />
      </div>
      <span className="sr-only">
        Key specifications: 820mm eye level, 470mm doorways, self-balancing,
        drops to the table, 10+ mile range, automotive-grade, dismantles in
        three parts, joystick or app control.
      </span>
    </div>
  );
}
