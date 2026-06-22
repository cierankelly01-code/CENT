import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Centaur — Fleet Management",
  robots: { index: false, follow: false },
};

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bone">
      <header className="border-b border-mist/70">
        <div className="container-edge flex min-h-16 flex-wrap items-center gap-x-6 gap-y-2 py-3 text-ink">
          <Link href="/fleet" className="flex items-center gap-3">
            <Logo />
            <span className="font-sans text-xs uppercase tracking-[0.22em] text-ink/70">Fleet</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-sm">
            <Link href="/fleet" className="text-ink/70 transition-colors hover:text-ink motion-reduce:transition-none">
              Dashboard
            </Link>
          </nav>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-bronze-deep/30 bg-bronze-deep/[0.06] px-3 py-1 font-sans text-xs font-semibold text-bronze-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-bronze-deep" aria-hidden="true" />
              Fleet Preview
            </span>
          </div>
        </div>
      </header>
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center">
        <p className="font-sans text-xs text-amber-800">
          <strong>Preview mode</strong> — sample fleet data. Live chair telemetry connects once units are deployed.
        </p>
      </div>
      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  );
}
