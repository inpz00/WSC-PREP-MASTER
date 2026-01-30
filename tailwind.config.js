/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        wsc: {
          gold: '#c9a227',
          'gold-light': '#e8d48b',
          purple: '#4a2c6d',
          'purple-light': '#7b5a9e',
          'purple-dark': '#2d1b45',
          white: '#ffffff',
          cream: '#faf8f5',
          navy: '#1a2744',
        },
      },
    },
  },
  plugins: [],
}
