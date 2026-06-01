import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#141414", soft: "#333333" },
        paper: "#FCFCFB",
        cream: { DEFAULT: "#F5F5F3", dark: "#EBEBE8" },
        moss: { DEFAULT: "#141414", dark: "#0D0D0D", light: "#444444" },
        // São Paulo FC inspired tricolor
        terra: { DEFAULT: "#CC0D1A", dark: "#990812", light: "#E63946" },
        gold: "#CC0D1A",
        border: { DEFAULT: "#E0E0DE", soft: "#EDEDEB" },
        blue: "#2563EB",
        green: "#16A34A",
        yellow: "#CA8A04",
        red: "#CC0D1A",
        spfc: {
          red: "#CC0D1A",
          black: "#141414",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20,20,20,.06)",
        card: "0 4px 16px rgba(20,20,20,.10)",
        lift: "0 16px 48px rgba(20,20,20,.16)",
        terra: "0 8px 24px rgba(204,13,26,.25)",
        glass: "0 4px 20px rgba(0,0,0,.06)",
      },
      backgroundImage: {
        "spfc-tricolor": "linear-gradient(90deg, #CC0D1A 0%, #CC0D1A 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #141414 66.66%, #141414 100%)",
        "spfc-stripes": "repeating-linear-gradient(-72deg, #CC0D1A 0px, #CC0D1A 90px, transparent 90px, transparent 130px, #141414 130px, #141414 190px, transparent 190px, transparent 230px)",
      },
      animation: {
        "fade-in": "fadeIn .25s ease-out",
        "slide-up": "slideUp .3s cubic-bezier(.4,0,.2,1)",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
