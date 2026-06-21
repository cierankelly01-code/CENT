import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import { DEMO_MODE } from "@/lib/admin/demo";
import DemoBanner from "@/components/staff/DemoBanner";

export const metadata: Metadata = {
  title: "Centaur — Staff",
  robots: { index: false, follow: false },
};

const BASE_NAV = [
  { href: "/staff", label: "Dashboard" },
  { href: "/staff/enquiries", label: "Enquiries" },
  { href: "/staff/builds", label: "Builds" },
  { href: "/staff/pipeline", label: "Pipeline" },
];

// Operations screens are demo-only for now (no live backend yet).
const OPS_NAV = [
  { href: "/staff/quotes", label: "Quotes" },
  { href: "/staff/production", label: "Production" },
  { href: "/staff/inventory", label: "Inventory" },
  { href: "/staff/procurement", label: "Procurement" },
  { href: "/staff/suppliers", label: "Suppliers" },
];

const NAV = DEMO_MODE ? [...BASE_NAV, ...OPS_NAV] : BASE_NAV;

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bone">
      <header className="border-b border-mist/70">
        <div className="container-edge flex min-h-16 flex-wrap items-center gap-x-6 gap-y-2 py-3 text-ink">
          <Link href="/staff" className="flex items-center gap-3">
            <Logo />
            <span className="font-sans text-xs uppercase tracking-[0.22em] text-ink/70">Staff</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-sm">
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
      {DEMO_MODE && <DemoBanner />}
      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  );
}
