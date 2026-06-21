import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Centaur — Staff",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/staff", label: "Dashboard" },
  { href: "/staff/enquiries", label: "Enquiries" },
  { href: "/staff/builds", label: "Builds" },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bone">
      <header className="border-b border-mist/70">
        <div className="container-edge flex h-16 items-center gap-6 text-ink">
          <Link href="/staff" className="flex items-center gap-3">
            <Logo />
            <span className="font-sans text-xs uppercase tracking-[0.22em] text-ink/70">Staff</span>
          </Link>
          <nav className="flex items-center gap-5 font-sans text-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-ink/70 transition-colors hover:text-ink motion-reduce:transition-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  );
}
