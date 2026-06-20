import StudioWelcome from "@/components/studio/StudioWelcome";

// Capability-linked, per-build page — server-rendered on demand, never prerendered.
export const dynamic = "force-dynamic";

export default function BuildRefPage({ params }: { params: { ref: string } }) {
  return <StudioWelcome reference={params.ref} />;
}
