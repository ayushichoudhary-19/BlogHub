
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        grayBorder: 'inset 0 0 0 1px #5A5C60',
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
      },
    },
  },
  plugins: [
    // addVariablesForColors, // Temporarily comment this out
  ],
};

// Temporarily comment out the plugin function as well if it's in the same file
/*
function addVariablesForColors({ addBase, theme }) {
  // ... plugin code ...
}
*/