import { ImageResponse } from "next/og";
import { BRAND_HEX } from "@/lib/theme";

// Branded social share card (1200x630). Pure CSS (no external assets) so it builds and
// deploys identically everywhere. A photographic product render can replace this later.
export const runtime = "edge";
export const alt = "The Centaur — a wheelchair that lifts you to eye level";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: BRAND_HEX.ink,
          color: BRAND_HEX.bone,
          padding: 72,
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Warm aurora glow, echoing the hero */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 640,
            height: 640,
            borderRadius: "100%",
            background:
              "radial-gradient(circle, rgba(176,125,75,0.45), rgba(176,125,75,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: "100%",
            background:
              "radial-gradient(circle, rgba(218,212,200,0.16), rgba(218,212,200,0) 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#B07D4B",
          }}
        >
          Centaur Robotics
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 78, lineHeight: 1.03, fontWeight: 600, maxWidth: 940 }}>
            A wheelchair that lifts you to eye level.
          </div>
          <div style={{ fontSize: 30, color: "#DAD4C8", marginTop: 28 }}>
            Self-balancing. Built to automotive standards. In production.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
