import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: "rgb(var(--color-bone) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        graphite: "rgb(var(--color-graphite) / <alpha-value>)",
        bronze: "rgb(var(--color-bronze) / <alpha-value>)",
        "bronze-deep": "rgb(var(--color-bronze-deep) / <alpha-value>)",
        "bronze-deeper": "rgb(var(--color-bronze-deeper) / <alpha-value>)",
        mist: "rgb(var(--color-mist) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
