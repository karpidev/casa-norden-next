import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-jost)", "sans-serif"],
      },
      colors: {
        ink: "#0c0c0d",
        stone: "#f5f3ef",
      },
      letterSpacing: {
        mega: "0.35em",
      },
    },
  },
  plugins: [],
};

export default config;
