"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

/**
 * Wraps the marketing chrome (scroll progress, nav, footer) around the page — except in the
 * Build Studio (`/build/*`), which is a standalone, capability-linked experience with its own
 * chrome (see app/build/layout.tsx). Keeps a single root layout while letting the Studio feel
 * like its own thing we send a customer.
 */
export default function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname === "/build" || pathname?.startsWith("/build/") === true;

  if (isStudio) return <>{children}</>;

  return (
    <>
      <ScrollProgress />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
