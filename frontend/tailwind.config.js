/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#003057",
          light: "#1F5C96",
          dark: "#002040",
          50: "#EAF3FB",
        },
        "cb-blue": {
          DEFAULT: "#0077C8",
          dark: "#005a96",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}
