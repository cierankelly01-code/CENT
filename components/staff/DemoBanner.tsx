// Shown on every staff page while DEMO_MODE is on, so sample data is never mistaken for real.
export default function DemoBanner() {
  return (
    <div className="border-b border-bronze-deep/20 bg-bronze-deep/10">
      <div className="container-edge py-2 font-sans text-xs text-bronze-deep">
        <strong className="font-semibold">Sample data</strong> — this is a demonstration. Real data
        replaces it when DEMO_MODE is switched off.
      </div>
    </div>
  );
}
