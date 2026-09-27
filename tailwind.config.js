/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dusk: {
          DEFAULT: "#1C2230",
          deep: "#141821",
          light: "#262E40",
        },
        chalk: {
          DEFAULT: "#EDEEF2",
          dim: "#B7BCCB",
        },
        teal: {
          DEFAULT: "#5FA8A0",
          light: "#7FC2BA",
        },
        coral: {
          DEFAULT: "#E8735F",
          light: "#F0927F",
        },
      },
      fontFamily: {
        display: ["Source Serif 4", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
