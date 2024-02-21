import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
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
      },
      colors: {
        "brand-1": "#2F2F2E",
        "brand-2": "#CDCDC3",
        "brand-3": "#F3F0EA",
        "atelier-primary": "var(--atelier-primary-color)",
        "atelier-secondary": "var(--atelier-secondary-color)",
        "atelier-background": "var(--atelier-background-color)",
        "atelier-text": "var(--atelier-text-color)",
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
      },
      borderRadius: {
        atelier: "var(--atelier-border-radius)",
      },
    },
  },
  plugins: [nextui(), require("tailwindcss-animate")],
} satisfies Config;

export default config;
