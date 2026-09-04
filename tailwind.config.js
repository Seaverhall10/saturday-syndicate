/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#131c2e',
          925: '#0b1120',
          950: '#030712',
        }
      }
    },
  },
  plugins: [],
}

