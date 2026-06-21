import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Centaur — Staff",
  robots: { index: false, follow: false },
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bone">
      <header className="border-b border-mist/70">
        <div className="container-edge flex h-16 items-center gap-3 text-ink">
          <Logo />
          <span className="font-sans text-xs uppercase tracking-[0.22em] text-ink/70">Staff</span>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  );
}
