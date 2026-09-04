import { ImageResponse } from "next/og";
import { getSiteCopy, copyLines } from "@geaklabs/db";

export const alt = "GEAK LABS — Olugbenga Akinduko";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social card: the hero headline on the brand ground, with the gradient block. */
export default async function OpengraphImage() {
  const copy = await getSiteCopy();
  const headline = copyLines(copy["hero.headline"]).join(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f6f4",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: "4px", color: "#1c1c1c" }}>
          GEAK LABS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, color: "#1c1c1c", lineHeight: 1 }}>
            {headline}.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#3a3a3a" }}>
            {copy["hero.kicker"]}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#6b6b6b" }}>Olugbenga Akinduko</div>
          <div style={{ display: "flex", width: 160, height: 12, background: "#0bb8fc" }} />
        </div>
      </div>
    ),
    size,
  );
}
