/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        odyssey: {
          dark: '#0f172a',
          gold: '#eab308',
          blue: '#3b82f6',
          sea: '#0891b2',
          danger: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
