// Brand colours as hex — the single source for non-CSS contexts (web manifest, OG image)
// that can't read the channel-based CSS variables. Keep in sync with the `--color-*` tokens
// in app/globals.css (values are the same colours, expressed as hex here).
export const BRAND_HEX = {
  bone: "#F4F1EA", // --color-bone:  244 241 234
  ink: "#1A1714", // --color-ink:   26 23 20
} as const;
