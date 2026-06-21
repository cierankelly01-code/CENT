import { ImageResponse } from "next/og";
import { BRAND_HEX } from "@/lib/theme";

// Branded social share card (1200x630). Pairs the approved headline with the product
// cutout on a warm-glow dark ground, matching the site's hero. A photographic hero render
// can still replace the cutout later, but this is a proper branded card, not a text stub.
export const runtime = "edge";
export const alt = "The Centaur — a wheelchair that lifts you to eye level";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Edge runtime can't read the filesystem, so the colocated asset is bundled and fetched via
// import.meta.url at generation time, then inlined as a data URI for Satori.
function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export default async function OpengraphImage() {
  const buf = await fetch(new URL("./og-centaur.png", import.meta.url)).then((r) =>
    r.arrayBuffer()
  );
  const productSrc = `data:image/png;base64,${toBase64(buf)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: BRAND_HEX.ink,
          color: BRAND_HEX.bone,
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Warm aurora glow, echoing the hero */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 620,
            height: 620,
            borderRadius: "100%",
            background:
              "radial-gradient(circle, rgba(176,125,75,0.40), rgba(176,125,75,0) 70%)",
          }}
        />

        {/* Copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 72,
            width: 720,
          }}
        >
          <div
            style={{
              fontSize: 28,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#B07D4B",
            }}
          >
            Centaur Robotics
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 72, lineHeight: 1.04, fontWeight: 600 }}>
              A wheelchair that lifts you to eye level.
            </div>
            <div style={{ fontSize: 28, color: "#DAD4C8", marginTop: 26 }}>
              Self-balancing. Built to automotive standards. In production.
            </div>
          </div>
        </div>

        {/* Product */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 480,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productSrc}
            alt=""
            width={460}
            height={460}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
