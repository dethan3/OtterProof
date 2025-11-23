import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0c0c16",
          dark: "#0a0b14",
          light: "#7ef5dc",
          pop: "#ffe76b",
          lilac: "#c4b5ff"
        }
      }
    }
  },
  plugins: []
};

export default config;
