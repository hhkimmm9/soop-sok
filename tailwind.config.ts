import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        dhurjati: ["var(--font-dhurjati)"],
      },
      colors: {
        earth: {
          50: "#F5EDE6",
          100: "#EADBD1",
          200: "#DFC9BC",
          300: "#D4B7A7",
          400: "#C9A592",
          500: "#BE937D",
          600: "#B38168",
          700: "#A86F53",
          800: "#9D5D3E",
          900: "#924B29",
        },
      },
    },
  },
  plugins: [],
}
export default config
