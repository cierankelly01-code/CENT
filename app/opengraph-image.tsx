import { ImageResponse } from "next/og";

// PLACEHOLDER OG IMAGE — swap for a 1200x630 product hero render before public launch.
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
          backgroundColor: "#1A1714",
          color: "#F4F1EA",
          padding: "72px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#B07D4B",
          }}
        >
          Centaur Robotics
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 900 }}>
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
