import { Metadata } from "next";

export const metadata: Metadata = { title: "System Status — Centaur Robotics" };
export const dynamic = "force-dynamic";

type Check = { name: string; ok: boolean; plain: string; detail?: string };
type StatusData = { ok: boolean; summary: string; checks: Check[]; timestamp: string };

async function getStatus(): Promise<StatusData | null> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000";
    const res = await fetch(`${base}/api/status`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function StatusPage() {
  const data = await getStatus();

  if (!data) {
    return (
      <main className="min-h-screen bg-ink flex items-center justify-center p-8">
        <div className="max-w-lg w-full">
          <div className="rounded-2xl bg-red-950 border border-red-800 p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-red-200 mb-2">Status check failed</h1>
            <p className="text-red-300 text-sm">Could not reach the status API. The server may be starting up — try refreshing in 30 seconds.</p>
          </div>
        </div>
      </main>
    );
  }

  const { ok, summary, checks, timestamp } = data;
  const failing = checks.filter((c) => !c.ok);

  return (
    <main className="min-h-screen bg-ink text-chalk p-8 font-body">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-ink/40 uppercase tracking-widest mb-1 font-display">Centaur Robotics</p>
          <h1 className="text-3xl font-display font-bold mb-3">System Status</h1>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${ok ? "bg-green-950 text-green-300 border border-green-800" : "bg-red-950 text-red-300 border border-red-800"}`}>
            <span className={`w-2 h-2 rounded-full ${ok ? "bg-green-400" : "bg-red-400"}`} />
            {summary}
          </div>
        </div>

        {/* Failing checks first */}
        {failing.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Needs fixing</h2>
            <div className="flex flex-col gap-3">
              {failing.map((c) => (
                <div key={c.name} className="rounded-xl border border-red-800 bg-red-950/50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <div>
                      <p className="font-semibold text-red-200 text-sm">{c.name}</p>
                      <p className="text-red-300 text-sm mt-0.5">{c.plain}</p>
                      {c.detail && <p className="text-red-400/60 text-xs mt-1 font-mono">{c.detail}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All checks */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-3">All checks</h2>
          <div className="flex flex-col gap-2">
            {checks.map((c) => (
              <div key={c.name} className={`rounded-xl border p-4 ${c.ok ? "border-green-900 bg-green-950/30" : "border-red-800 bg-red-950/30"}`}>
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 ${c.ok ? "text-green-400" : "text-red-400"}`}>{c.ok ? "✓" : "✗"}</span>
                  <div>
                    <p className={`font-semibold text-sm ${c.ok ? "text-green-200" : "text-red-200"}`}>{c.name}</p>
                    <p className={`text-sm mt-0.5 ${c.ok ? "text-green-300/80" : "text-red-300"}`}>{c.plain}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        {!ok && (
          <div className="rounded-xl border border-amber-800 bg-amber-950/30 p-5 mb-8">
            <h2 className="font-bold text-amber-200 text-sm mb-2">What to do</h2>
            <p className="text-amber-300/80 text-sm">Copy everything on this page and send it to your developer. They can fix each issue listed above and tell you when to refresh to confirm it&apos;s resolved.</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-ink/30">
          Last checked: {new Date(timestamp).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
          {" · "}
          <a href="/status" className="underline underline-offset-2">Refresh</a>
        </p>

      </div>
    </main>
  );
}
