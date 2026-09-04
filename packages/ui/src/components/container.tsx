import { cn } from "../lib/cn";

/** Editorial page gutter — max width with generous responsive padding. */
export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "wide" | "prose";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-14",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-[1440px]",
        size === "prose" && "max-w-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
