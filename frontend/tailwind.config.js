/** @type {import('tailwindcss').Config} */
module.exports = {
  // All the files Tailwind should scan for class names
  content: [
    "./index.html",            // Root HTML
    "./src/**/*.{js,jsx}",     // All JS/JSX files inside src
    "./src/components/**/*.{js,jsx}", // Components
    "./src/pages/**/*.{js,jsx}",      // Pages
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#f3e8ff",   // light brand color
          DEFAULT: "#8b5cf6", // primary brand color
          dark: "#5b21b6",    // dark brand color
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Merriweather", "serif"],
      },
      boxShadow: {
        card: "0 4px 6px rgba(0,0,0,0.1)",
        cardHover: "0 10px 15px rgba(0,0,0,0.15)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),      // better form styles for contact/admin
    require("@tailwindcss/typography"), // better typography for About page
    require("@tailwindcss/aspect-ratio") // maintain image ratios for products
  ],
  darkMode: "class", // enable dark mode toggle via a class on <html>
};
