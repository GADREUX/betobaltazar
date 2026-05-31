import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#1A1A1A", soft: "#333333" },
        paper: "#FFFFFF",
        cream: { DEFAULT: "#F5F5F5", dark: "#EBEBEB" },
        moss: { DEFAULT: "#1A1A1A", dark: "#0D0D0D", light: "#444444" },
        terra: { DEFAULT: "#D62B2B", dark: "#B52020", light: "#E86060" },
        gold: "#D62B2B",
        border: { DEFAULT: "#E0E0E0", soft: "#EDEDED" },
        blue: "#2563EB",
        green: "#16A34A",
        yellow: "#CA8A04",
        red: "#D62B2B",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(26,26,26,.06)",
        card: "0 4px 16px rgba(26,26,26,.10)",
        lift: "0 16px 48px rgba(26,26,26,.16)",
      },
      animation: {
        "fade-in": "fadeIn .25s ease-out",
        "slide-up": "slideUp .3s cubic-bezier(.4,0,.2,1)",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
