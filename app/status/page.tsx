import { Metadata } from "next";

export const metadata: Metadata = { title: "System Status — Centaur Ops" };
export const dynamic = "force-dynamic";

type Check = { name: string; ok: boolean; plain: string; detail?: string; warn?: boolean };
type StatusData = { ok: boolean; summary: string; checks: Check[]; timestamp: string };

async function getStatus(): Promise<StatusData | null> {
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${base}/api/status`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const PAGES = [
  { path: "/", label: "Home" },
  { path: "/the-centaur", label: "Product" },
  { path: "/configure", label: "Configurator" },
  { path: "/fleet", label: "Fleet portal" },
  { path: "/staff", label: "Staff panel" },
  { path: "/track/[ref]", label: "Order tracking" },
  { path: "/api/build", label: "Build API" },
  { path: "/api/enquiry/notify", label: "Email API" },
];

export default async function StatusPage() {
  const data = await getStatus();

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-8">
        <div className="rounded-xl border border-red-900 bg-red-950/40 p-8 text-center max-w-sm">
          <p className="text-2xl mb-3">⚠️</p>
          <p className="text-red-300 font-semibold mb-1">Status check failed</p>
          <p className="text-red-400 text-sm">Could not reach the status API. Try refreshing in 30 seconds.</p>
        </div>
      </div>
    );
  }

  const { checks, timestamp } = data;
  const passing = checks.filter((c) => c.ok).length;
  const failing = checks.filter((c) => !c.ok && !c.warn);
  const warnings = checks.filter((c) => !c.ok && c.warn);
  const allOk = failing.length === 0;
  const dbCheck = checks.find((c) => c.name === "Database (public)");
  const emailCheck = checks.find((c) => c.name === "Email (Resend)");
  const staffCheck = checks.find((c) => c.name === "Staff login allowlist");

  const fixItems = [...failing, ...warnings];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#c9d1d9] font-sans">

      {/* Header */}
      <header className="bg-[#0d1117] border-b border-[#21262d] px-6 py-3.5 flex items-center justify-between">
        <div className="font-bold text-sm text-[#e6edf3] tracking-tight">
          Centaur <span className="text-[#58a6ff]">Ops</span> — System Status
        </div>
        <div className="flex items-center gap-4">
          {allOk ? (
            <span className="flex items-center gap-1.5 text-xs text-[#3fb950]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
              All systems live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-[#f85149]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f85149]" />
              Issues detected
            </span>
          )}
          <span className="text-xs text-[#484f58]">
            {new Date(timestamp).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
          </span>
          <a href="/status" className="text-xs text-[#58a6ff] hover:underline">Refresh</a>
        </div>
      </header>

      <div className="p-6 flex flex-col gap-5 max-w-4xl mx-auto">

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#484f58] mb-1.5">Overall</p>
            <p className={`text-2xl font-bold ${allOk ? "text-[#3fb950]" : "text-[#f85149]"}`}>
              {passing} / {checks.length}
            </p>
            <p className="text-[11px] text-[#484f58] mt-1">checks passing</p>
          </div>
          <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#484f58] mb-1.5">Database</p>
            <p className={`text-2xl font-bold ${dbCheck?.ok ? "text-[#3fb950]" : "text-[#f85149]"}`}>
              {dbCheck?.ok ? "✓" : "✗"}
            </p>
            <p className="text-[11px] text-[#484f58] mt-1">{dbCheck?.ok ? "Supabase connected" : "Not connected"}</p>
          </div>
          <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#484f58] mb-1.5">Email</p>
            <p className={`text-2xl font-bold ${emailCheck?.ok ? "text-[#3fb950]" : "text-[#f85149]"}`}>
              {emailCheck?.ok ? "✓" : "✗"}
            </p>
            <p className="text-[11px] text-[#484f58] mt-1">{emailCheck?.ok ? "Resend active" : "Key missing"}</p>
          </div>
          <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#484f58] mb-1.5">Staff panel</p>
            <p className={`text-2xl font-bold ${staffCheck?.ok ? "text-[#3fb950]" : "text-[#d29922]"}`}>
              {staffCheck?.ok ? "✓" : "!"}
            </p>
            <p className="text-[11px] text-[#484f58] mt-1">{staffCheck?.ok ? "Allowlist set" : "No allowlist"}</p>
          </div>
        </div>

        {/* Health checks */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#484f58] mb-2">Health checks</p>
          <div className="flex flex-col gap-1.5">
            {checks.map((c) => {
              const isWarn = !c.ok && c.warn;
              const color = c.ok ? "#3fb950" : isWarn ? "#d29922" : "#f85149";
              const bg = c.ok ? "#3fb95008" : isWarn ? "#d2992208" : "#f8514908";
              const border = c.ok ? "#3fb95030" : isWarn ? "#d2992230" : "#f8514930";
              const badge = c.ok ? "OK" : isWarn ? "WARN" : "FAIL";
              return (
                <div key={c.name} style={{ background: bg, borderColor: border }}
                  className="border rounded-lg px-4 py-3 flex items-center gap-3">
                  <span style={{ color, background: `${color}15` }}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {c.ok ? "✓" : isWarn ? "!" : "✗"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#e6edf3]">{c.name}</p>
                    <p className="text-[11px] text-[#8b949e] mt-0.5 leading-relaxed">{c.plain}</p>
                    {c.detail && <p className="text-[10px] text-[#484f58] mt-0.5 font-mono">{c.detail}</p>}
                  </div>
                  <span style={{ color, borderColor: `${color}40`, background: `${color}15` }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide flex-shrink-0">
                    {badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Pages */}
          <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#484f58] mb-3">Pages & routes</p>
            <div className="flex flex-col divide-y divide-[#21262d]">
              {PAGES.map((p) => (
                <div key={p.path} className="flex items-center justify-between py-2">
                  <span className="font-mono text-[11px] text-[#79c0ff]">{p.path}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#8b949e]">{p.label}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fix instructions */}
          <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#484f58] mb-3">What to fix</p>
            {fixItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-[#3fb950] text-xl mb-1">✓</p>
                <p className="text-[#3fb950] text-sm font-semibold">Everything is working</p>
                <p className="text-[#484f58] text-xs mt-1">Nothing to send to your developer</p>
              </div>
            ) : (
              <div className="bg-[#161b22] border border-[#f8514930] rounded-lg p-4">
                <p className="text-[11px] font-bold text-[#f85149] uppercase tracking-wide mb-3">
                  {fixItems.length} issue{fixItems.length > 1 ? "s" : ""} — copy this and send to your developer
                </p>
                <div className="flex flex-col gap-2.5">
                  {fixItems.map((c, i) => (
                    <div key={c.name} className="flex gap-2 text-xs text-[#c9d1d9] leading-relaxed">
                      <span className="text-[#f85149] font-bold flex-shrink-0">{i + 1}.</span>
                      <span>{c.plain}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
