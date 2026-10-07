import type { ContentSection } from "@geaklabs/db";

/**
 * Deterministic cover art for posts without an uploaded image, as an SVG string.
 * Large arcs and bands in the brand gradient, composed from a hash of the seed so
 * every post gets its own arrangement. Professional posts sit on a pale ink ground;
 * faith and journal posts invert to deep ink. Used by the <GeneratedCover> component
 * and by the social-card renderer (which cannot render React to a string).
 */
function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1600;
const H = 900;

export function generatedCoverSvg({
  seed,
  section = "professional",
  className,
}: {
  seed: string;
  section?: ContentSection | null;
  className?: string;
}): string {
  const r = rng(hash(seed));
  const dark = section === "faith" || section === "journal";
  const id = `g${hash(seed).toString(36)}`;
  const angle = Math.round(r() * 360);

  // Three to four shapes: filled discs, a thick ring, and one wide band off-axis.
  const count = 3 + Math.floor(r() * 2);
  const shapes = Array.from({ length: count }, (_, i) => {
    const kind = i === 0 ? "disc" : r() < 0.4 ? "ring" : r() < 0.6 ? "band" : "disc";
    return {
      kind,
      cx: Math.round(r() * W),
      cy: Math.round(r() * H),
      rad: Math.round(240 + r() * 460),
      stroke: Math.round(28 + r() * 48),
      rot: Math.round(-35 + r() * 70),
      opacity: (dark ? 0.85 + r() * 0.15 : 0.7 + r() * 0.3).toFixed(3),
    };
  });

  const body = shapes
    .map((s) =>
      s.kind === "ring"
        ? `<circle cx="${s.cx}" cy="${s.cy}" r="${s.rad}" fill="none" stroke="url(#${id})" stroke-width="${s.stroke}" opacity="${s.opacity}"/>`
        : s.kind === "band"
          ? `<rect x="${s.cx - s.rad * 1.6}" y="${s.cy - s.stroke}" width="${s.rad * 3.2}" height="${s.stroke * 2}" fill="url(#${id})" opacity="${s.opacity}" transform="rotate(${s.rot} ${s.cx} ${s.cy})"/>`
          : `<circle cx="${s.cx}" cy="${s.cy}" r="${s.rad}" fill="url(#${id})" opacity="${s.opacity}"/>`,
    )
    .join("");

  const cls = className ? ` class="${className}"` : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"${cls}>` +
    `<defs><linearGradient id="${id}" gradientTransform="rotate(${angle} 0.5 0.5)"><stop offset="0" stop-color="#7fffc4"/><stop offset="1" stop-color="#0bb8fc"/></linearGradient></defs>` +
    `<rect width="${W}" height="${H}" fill="${dark ? "#1c1c1c" : "#e6e8e8"}"/>` +
    `<g style="mix-blend-mode:${dark ? "normal" : "multiply"}">${body}</g>` +
    `</svg>`
  );
}
