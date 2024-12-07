/**
 * @type {import('tailwindcss').Config}
 */
const primeui = require('tailwindcss-primeui');

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    'bg-magic',
    'text-magic',
    'bg-girl-magic',
    'text-girl-magic',
  ],
  plugins: [
    primeui,
    function ({ addUtilities }) {
      addUtilities({
        /**
         * our branded text color
         */
        ".text-magic": {
          "@apply bg-gradient-to-tr from-purple-500 to-orange-500 text-transparent bg-clip-text":
            {},
        },
        /**
         * our branded background color
         */
        ".bg-magic": {
          "@apply bg-gradient-to-tr from-purple-500 to-orange-500":
            {},
        },
        /**
         * our branded background color (for girls)
         */
        ".bg-girl-magic": {
          "@apply bg-gradient-to-tr from-purple-300 to-pink-100":
            {},
        },
        /**
         * our branded text color (for girls)
         */
        ".text-girl-magic": {
          "@apply bg-gradient-to-tr from-purple-300 to-pink-100 text-transparent bg-clip-text":
            {},
        },
      });
    },
  ],

};