import Link from "next/link";
import Logo from "@/components/Logo";

const EXPLORE = [
  { href: "/the-centaur", label: "The Centaur" },
  { href: "/who-its-for", label: "Who it's for" },
  { href: "/story", label: "Our story" },
  { href: "/why-us", label: "Why us" },
  { href: "/news", label: "News & events" },
];

export default function Footer() {
  return (
    <footer className="border-t border-mist bg-bone">
      <div className="container-edge grid gap-10 py-16 md:grid-cols-[1.6fr_1fr_1.2fr]">
        <div>
          <div className="text-ink">
            <Logo size="md" />
          </div>
          <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-ink/70">
            A self-balancing wheelchair, engineered to automotive standards.
            Designed to be wanted, not tolerated.
          </p>
          <Link
            href="/configure"
            className="mt-6 inline-flex items-center rounded-full bg-bronze-deep px-5 py-2.5 font-sans text-sm font-semibold text-bone transition-colors hover:bg-[#6f4d29]"
          >
            Configure your Centaur
          </Link>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow mb-4">Explore</h2>
          <ul className="space-y-2.5">
            {EXPLORE.map((l) => (
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
        </nav>

        <div>
          <h2 className="eyebrow mb-4">Contact</h2>
          {/* CLIENT-SUPPLIED — replace placeholders with real details before launch */}
          <ul className="space-y-2.5 font-sans text-sm text-ink/70">
            <li>
              <a href="mailto:hello@centaurrobotics.com" className="hover:text-ink">
                hello@centaurrobotics.com
              </a>
            </li>
            <li>
              <a href="tel:+44" className="hover:text-ink">
                +44 (0)__ ____ ____ <span className="text-ink/70">[phone — TBC]</span>
              </a>
            </li>
            <li className="text-ink/70">
              Registered office address <span className="text-ink/70">[TBC]</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-mist/70">
        <div className="container-edge flex flex-col items-start justify-between gap-3 py-6 text-xs text-ink/70 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Centaur Robotics Ltd. Registered in
            England &amp; Wales, company no.{" "}
            <span className="text-ink/70">[TBC]</span>.
          </p>
          <Link href="/privacy" className="hover:text-ink">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
