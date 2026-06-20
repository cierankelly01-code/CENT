import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import { StudioStatusProvider, SaveIndicator } from "@/components/studio/StudioStatus";

export const metadata: Metadata = {
  title: "Centaur Build Studio",
  description: "Configure your Centaur in detail — every dimension, finish and control.",
  // Private, capability-link only — never index the Studio.
  robots: { index: false, follow: false },
};

/**
 * Build Studio chrome — deliberately separate from the marketing nav/footer so the deep
 * configurator reads as its own bespoke experience we send to a serious customer.
 */
export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudioStatusProvider>
      <div className="flex min-h-screen flex-col bg-bone">
        <header className="border-b border-mist/70">
          <div className="container-edge flex h-16 items-center justify-between gap-4">
            <span className="flex items-center gap-3 text-ink">
              <Logo />
              <span className="hidden font-sans text-xs uppercase tracking-[0.22em] text-ink/70 sm:inline">
                Build Studio
              </span>
            </span>
            <SaveIndicator />
          </div>
        </header>

        <main id="main" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-mist/70">
          <div className="container-edge flex h-14 items-center justify-between font-sans text-xs text-ink/70">
            <span>© {new Date().getFullYear()} Centaur Robotics</span>
            <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
              Privacy
            </Link>
          </div>
        </footer>
      </div>
    </StudioStatusProvider>
  );
}
