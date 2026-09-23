import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep Ocean: near-black navy surfaces with a single vivid blue
        // accent (matches the reference login card). Status colors
        // (good/warn/bad) stay distinct from the accent so pass/fail/
        // in-progress states remain readable.
        bg: "#0a0b10",
        surface: "#10121a",
        surface2: "#161925",
        border: "#262b3a",
        "border-soft": "#1b1e29",
        ink: "#eef0f7",
        "ink-dim": "#a6acc4",
        "ink-faint": "#666c88",
        accent: "#3358f4",
        "accent-dim": "#24409e",
        "accent-soft": "rgba(51,88,244,0.14)",
        good: "#3fae7c",
        "good-soft": "rgba(63,174,124,0.14)",
        warn: "#c07a2b",
        "warn-soft": "rgba(192,122,43,0.14)",
        bad: "#d1495b",
        "bad-soft": "rgba(209,73,91,0.14)",
        // Secondary highlight (a lighter periwinkle-blue) for a fourth data
        // point in stat rows and shader accents.
        accentSecondary: "#7c93ff",
      },
      borderRadius: {
        xl2: "14px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
