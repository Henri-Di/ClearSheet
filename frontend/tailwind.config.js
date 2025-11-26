/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Cal Sans", "sans-serif"],
      },

      colors: {

        light: {
          bg: "#FAF8FF",
          card: "#FFFFFF",
          card2: "#F9F7FF",
          input: "#FFFFFF",
          border: "#E6E1F7",
          hover: "#F3EEFF",
          text: "#2F2F36",
        },


        dark: {
          bg: "#15101F",
          card: "#1D152A",
          card2: "#20172F",
          input: "#2A2333",
          border: "#3B2F4A",
          hover: "#261C34",
          text: "#ECE7FF",
        },

        pastel: {
          lilac: "#EDE6FF",
          pink: "#FFE6F2",
          peach: "#FFEBDD",
          blue: "#E7EEFF",
          green: "#E6FFF6",
          yellow: "#FFFBD8",
        },
      },

      boxShadow: {
        soft: "0 4px 16px rgba(0,0,0,0.04)",
        medium: "0 6px 28px rgba(0,0,0,0.08)",
        strong: "0 8px 40px rgba(0,0,0,0.12)",
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },

  plugins: [],
};
