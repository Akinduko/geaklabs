import { ImageResponse } from "next/og";
import type { ContentSection } from "@geaklabs/db";
import { generatedCoverSvg } from "./generated-cover";

/**
 * Social cards (Open Graph / Twitter) for posts and series.
 * An uploaded cover is letterboxed onto the 1200×630 card so its straps aren't cropped;
 * otherwise the post's generated art carries the title.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

let serif: ArrayBuffer | null = null;

/** Instrument Serif, bundled under assets/fonts (OFL). Read once per instance. */
async function loadSerif(): Promise<ArrayBuffer | null> {
  if (serif) return serif;
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const candidates = [
    join(process.cwd(), "assets/fonts/InstrumentSerif-Regular.ttf"),
    join(process.cwd(), "apps/web/assets/fonts/InstrumentSerif-Regular.ttf"),
  ];
  for (const file of candidates) {
    try {
      const buf = await readFile(file);
      serif = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
      return serif;
    } catch (err) {
      console.warn("[socialCard] font not at", file, (err as Error).message);
    }
  }
  return null;
}

export async function socialCard(args: Parameters<typeof socialCardInner>[0]) {
  try {
    const res = await socialCardInner(args);
    // Force the body to render now so a satori error surfaces here rather than mid-stream.
    const buf = await res.arrayBuffer();
    return new Response(buf, { headers: { "content-type": "image/png" } });
  } catch (err) {
    console.error("[socialCard]", err);
    throw err;
  }
}

async function socialCardInner({
  title,
  kicker,
  coverImageUrl,
  seed,
  section,
}: {
  title: string;
  kicker: string;
  coverImageUrl: string | null;
  seed: string;
  section?: ContentSection | null;
}) {
  const font = await loadSerif();
  const fonts = font ? [{ name: "Instrument Serif", data: font, style: "normal" as const, weight: 400 as const }] : undefined;
  const family = font ? "Instrument Serif" : undefined;

  if (coverImageUrl) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0b1220",
          }}
        >
          {/* 16:9 artwork fits the 1.9:1 card with thin bars rather than losing its top and bottom. */}
          <img src={coverImageUrl} width={1120} height={630} style={{ objectFit: "contain" }} />
        </div>
      ),
      { ...OG_SIZE, fonts },
    );
  }

  const art = `data:image/svg+xml;base64,${Buffer.from(generatedCoverSvg({ seed, section })).toString("base64")}`;
  const big = title.length > 48;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
        <img src={art} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background: "linear-gradient(180deg, rgba(12,14,18,0.10) 0%, rgba(12,14,18,0.82) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 64,
            display: "flex",
            flexDirection: "column",
            color: "#f6f6f4",
            ...(family ? { fontFamily: family } : {}),
          }}
        >
          <div style={{ display: "flex", fontSize: 22, letterSpacing: "5px", textTransform: "uppercase", opacity: 0.85 }}>
            GEAK LABS · {kicker}
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: big ? 60 : 76, lineHeight: 1.02, letterSpacing: "-1.5px" }}>
            {title}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
