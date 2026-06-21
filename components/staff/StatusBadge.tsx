import { humanizeStatus } from "@/lib/staff-format";

// Subtle status pill. The label text carries the meaning (never colour alone), with a light
// tone to group progressing vs closed states. Token-based colours only.
const TONE: Record<string, string> = {
  quoted: "border-bronze-deep/30 bg-bronze-deep/10 text-bronze-deep",
  confirmed: "border-bronze-deep/30 bg-bronze-deep/10 text-bronze-deep",
  ordered: "border-bronze-deep/30 bg-bronze-deep/10 text-bronze-deep",
  closed: "border-mist bg-mist/50 text-ink/70",
  archived: "border-mist bg-mist/50 text-ink/70",
  abandoned: "border-mist bg-mist/50 text-ink/70",
};
const DEFAULT_TONE = "border-mist bg-bone text-ink/75";

export default function StatusBadge({ status }: { status: string }) {
  const tone = TONE[status] ?? DEFAULT_TONE;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium ${tone}`}
    >
      {humanizeStatus(status)}
    </span>
  );
}
