/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
          neon: "#84CC16",
        },
        bodyBg: "#0B0F14",
        blackPure: "#000000",
        grayDarkest: "#0A0A0A",
        cardBg: "#111827",
        grayLight: "#1F2937",
        whitePure: "#FFFFFF",
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },

      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
  },
  plugins: [],
};
