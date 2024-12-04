/**
 * @type {import('tailwindcss').Config}
 */
const primeui = require('tailwindcss-primeui');

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  plugins: [primeui],
  safelist: [
    {
      pattern: /bg-+/, // 👈  This includes bg of all colors and shades
    },
  ]
};