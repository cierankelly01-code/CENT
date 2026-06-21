import type { MetadataRoute } from "next";
import { BRAND_HEX } from "@/lib/theme";

// Web app manifest — lets the site be added to a home screen and gives mobile browsers
// proper name/theme colours. Colours come from the shared brand tokens (see lib/theme.ts).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Centaur Robotics",
    short_name: "Centaur",
    description:
      "A self-balancing wheelchair that rises to eye level, fits through standard doorways and lowers to the table. Built to automotive standards.",
    start_url: "/",
    display: "standalone",
    background_color: BRAND_HEX.bone,
    theme_color: BRAND_HEX.ink,
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
