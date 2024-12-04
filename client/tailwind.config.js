/**
 * @type {import('tailwindcss').Config}
 */
const primeui = require('tailwindcss-primeui');

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  plugins: [
    primeui,
    function ({ addUtilities }) {
      addUtilities({
        /**
         * our branded text color
         */
        ".text-magic": {
          "@apply bg-gradient-to-tr dark:from-purple-600 dark:to-orange-500 from-purple-500 to-orange-500 text-transparent bg-clip-text":
            {},
        },
        /**
         * our branded background color
         */
        ".bg-magic": {
          "@apply bg-gradient-to-tr dark:from-purple-600 dark:to-orange-500 from-purple-500 to-orange-500":
            {},
        },
      });
    },
  ],

};