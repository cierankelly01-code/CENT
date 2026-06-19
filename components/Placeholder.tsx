import Image from "next/image";

type PlaceholderProps = {
  /** Caption shown when no real asset is supplied, e.g. "PRODUCT HERO — replace". */
  label: string;
  /** Path under /public to the real asset, if it exists. */
  src?: string;
  alt: string;
  className?: string;
  /** Tailwind aspect-ratio utility, e.g. "aspect-[4/5]". */
  aspect?: string;
  priority?: boolean;
  rounded?: boolean;
  /** Use object-contain (e.g. product shots that must not be cropped). Defaults to cover. */
  contain?: boolean;
  /** Subtle zoom when an ancestor with `.group` is hovered. */
  hover?: boolean;
};

/**
 * Renders a real image when `src` is provided, otherwise a deliberate
 * graphite block at the final dimensions with a centred mist caption.
 * The real file drops in later with zero layout change.
 */
export default function Placeholder({
  label,
  src,
  alt,
  className = "",
  aspect = "aspect-[4/3]",
  priority = false,
  rounded = true,
  contain = false,
  hover = false,
}: PlaceholderProps) {
  const radius = rounded ? "rounded-sm" : "";
  const hoverCls = hover
    ? "transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    : "";

  if (src) {
    return (
      <div className={`relative overflow-hidden ${aspect} ${radius} ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`${contain ? "object-contain" : "object-cover"} ${hoverCls}`}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-center justify-center bg-graphite ${aspect} ${radius} ${className}`}
    >
      <span className="px-6 text-center font-sans text-xs font-medium uppercase tracking-[0.2em] text-mist">
        {label}
      </span>
    </div>
  );
}
