import { cn } from "../lib/cn";

type LogoProps = {
  className?: string;
  /** Show the "GEAK LABS" wordmark next to the mark. */
  showWordmark?: boolean;
  /** Paint the g-mark with the mint→cyan gradient instead of a solid tone. */
  gradient?: boolean;
};

/**
 * GEAK LABS logo — geometric "g" mark + Poppins wordmark.
 * The mark uses `currentColor` (or the brand gradient) so it recolors per surface.
 */
export function GeakMark({
  className,
  gradient = false,
}: {
  className?: string;
  gradient?: boolean;
}) {
  const gid = "geak-mark-grad";
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="GEAK LABS"
      className={cn("h-8 w-8", className)}
      fill="none"
    >
      {gradient && (
        <defs>
          <linearGradient id={gid} x1="10" y1="40" x2="40" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#7FFFC4" />
            <stop offset="1" stopColor="#0BB8FC" />
          </linearGradient>
        </defs>
      )}
      {/* bowl of the g: an open ring */}
      <path
        d="M31 17.5a10 10 0 1 0 0 9.2"
        stroke={gradient ? `url(#${gid})` : "currentColor"}
        strokeWidth="6.4"
        strokeLinecap="round"
      />
      {/* ear + stem top */}
      <path
        d="M31 12.5V24"
        stroke={gradient ? `url(#${gid})` : "currentColor"}
        strokeWidth="6.4"
        strokeLinecap="round"
      />
      {/* sweeping descender tail */}
      <path
        d="M31 27c0 6.6-4.2 10.6-11.8 11.4"
        stroke={gradient ? `url(#${gid})` : "currentColor"}
        strokeWidth="6.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display font-semibold uppercase tracking-[0.22em] text-ink-900",
        className,
      )}
    >
      Geak&nbsp;Labs
    </span>
  );
}

export function Logo({ className, showWordmark = true, gradient = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <GeakMark gradient={gradient} className="h-7 w-7" />
      {showWordmark && <Wordmark className="text-[0.95rem]" />}
    </span>
  );
}
