import type { ContentSection } from "@geaklabs/db";
import { generatedCoverSvg } from "@/lib/generated-cover";

/** Deterministic cover art for posts without an uploaded image. See lib/generated-cover.ts. */
export function GeneratedCover({
  seed,
  section = "professional",
  className,
}: {
  seed: string;
  section?: ContentSection | null;
  className?: string;
}) {
  // The SVG is built as a string (shared with the social-card renderer); a contents-only
  // wrapper keeps the svg itself in the layout flow exactly as before.
  return (
    <span
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: generatedCoverSvg({ seed, section, className }) }}
    />
  );
}
