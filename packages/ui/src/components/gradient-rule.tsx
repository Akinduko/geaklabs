import { cn } from "../lib/cn";

/** A thin mint→cyan hairline — the brand's signature editorial divider. */
export function GradientRule({ className }: { className?: string }) {
  return <span className={cn("block h-px w-full gradient-bg", className)} aria-hidden />;
}

/** Small gradient tick used before kickers / section labels. */
export function GradientTick({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-block h-2.5 w-2.5 rounded-full gradient-bg", className)}
      aria-hidden
    />
  );
}
