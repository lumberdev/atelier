import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
      },
    },
    extend: {
      fontFamily: {
        "brand-heading": ["var(--font-dmmono)"],
        "brand-body": ["var(--font-taviraj)"],
        "assistant": "Assistant, sans-serif"
      },
      colors: {
        "brand-1": "#2F2F2E",
        "brand-2": "#CDCDC3",
        "brand-3": "#F3F0EA",
        "stroke-1": "#7D7D7D",
        "atelier-primary": "var(--atelier-primary-color)",
        "atelier-secondary": "var(--atelier-secondary-color)",
        "atelier-background": "var(--atelier-background-color)",
        "atelier-text": "var(--atelier-text-color)",
        "atelier-darkblue": "#15206B",
        "dropdown-empty": "#121212",
        "b4b4b4": "#b4b4b4",
      },
      height: {
        "80vw": "80vw",
      },
      spacing: {
        "4.5": "1.125rem",
        "minus-4": "-1rem",
        "minus-6": "-1.5rem",
        "minus-8": "-2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundColor: {
        atelier: "var(--atelier-bg-color, initial)",
        "atelier-announcement": "var(--atelier-bg-color, initial)",
      },
      backgroundImage: {
        atelier: "var(--atelier-bg-image)",
      },
      borderRadius: {
        atelier: "var(--atelier-border-radius)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("flowbite/plugin"),
  ],
} satisfies Config;

export default config;
