"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const LINKS = [
  { href: "/the-centaur", label: "The Centaur" },
  { href: "/story", label: "Story" },
  { href: "/who-its-for", label: "Who it's for" },
  { href: "/why-us", label: "Why us" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Solid surface when scrolled OR when the mobile menu is open.
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-mist/70 bg-bone/90 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="container-edge flex h-16 items-center justify-between gap-6"
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-ink"
          aria-label="Centaur Robotics — home"
        >
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-sans text-sm text-ink/70 transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/configure"
            onClick={() => setOpen(false)}
            className="hidden items-center rounded-full bg-bronze-deep px-5 py-2 font-sans text-sm font-medium text-bone transition-colors hover:bg-[#6f4d29] sm:inline-flex"
          >
            Configure
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-4 w-5" aria-hidden>
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`md:hidden ${open ? "block" : "hidden"}`}
      >
        <div className="container-edge flex flex-col gap-1 border-t border-mist/70 bg-bone/95 pb-8 pt-4 backdrop-blur">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 font-display text-2xl font-semibold text-ink transition-colors hover:text-bronze-deep"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/configure"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-bronze-deep px-6 py-3 font-sans text-base font-medium text-bone transition-colors hover:bg-[#6f4d29]"
          >
            Configure
          </Link>
        </div>
      </div>
    </header>
  );
}
