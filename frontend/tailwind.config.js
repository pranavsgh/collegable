/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan all source files so Tailwind can tree-shake unused utility classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CollegeBoard-inspired navy used for headers, buttons, and primary text
        navy: {
          DEFAULT: "#003057",
          light: "#1F5C96",
          dark: "#002040",
          50: "#EAF3FB",
        },
        // CollegeBoard blue used for accents, links, and category badges
        "cb-blue": {
          DEFAULT: "#0077C8",
          dark: "#005a96",
        },
      },
      fontFamily: {
        // Inter is loaded via index.html; both aliases point to it so all text is consistent
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}
