type LogoProps = {
  className?: string;
  /** Wordmark size. */
  size?: "sm" | "md";
};

/**
 * Centaur wordmark lockup — a thin infinity/centaur mark + letter-spaced
 * wordmark, echoing the brand's real identity. Uses currentColor so it adapts
 * to light and dark surfaces.
 */
export default function Logo({ className = "", size = "sm" }: LogoProps) {
  const text = size === "md" ? "text-base" : "text-sm";
  const mark = size === "md" ? "h-6 w-9" : "h-5 w-8";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 24"
        className={mark}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M20 12c-1.4 2-3.1 3.4-5.2 3.4A4.4 4.4 0 0 1 14.8 6.6C16.9 6.6 18.6 8 20 12s3.1 5.4 5.2 5.4A4.4 4.4 0 0 0 25.2 8.6C23.1 8.6 21.4 10 20 12Z" />
      </svg>
      <span
        className={`font-display ${text} font-medium uppercase tracking-[0.28em] leading-none`}
      >
        Centaur
      </span>
    </span>
  );
}
