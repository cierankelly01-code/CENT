import type { MetadataRoute } from "next";

// Web app manifest — lets the site be added to a home screen and gives mobile browsers
// proper name/theme colours. Colours mirror the design tokens (bone background, ink theme).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Centaur Robotics",
    short_name: "Centaur",
    description:
      "A self-balancing wheelchair that rises to eye level, fits through standard doorways and lowers to the table. Built to automotive standards.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F1EA",
    theme_color: "#1A1714",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
