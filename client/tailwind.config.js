/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'Fraunces', 'Georgia', 'serif'],
        display: ['"DM Serif Display"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyanbrand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#20C7C2', // Primary bright turquoise accent
          600: '#15aba6',
          700: '#0e8581',
          800: '#116360',
          900: '#13524f',
          950: '#042f2e',
        },
        charcoal: {
          950: '#020b09',
          900: '#031310', // Very dark green-black background
          850: '#061a16', // Surface cards
          800: '#0a2620', // Card border / elevated surfaces
          700: '#103932',
          600: '#1e5349',
          400: '#8FA6A3', // Subtitle / secondary text
          200: '#C8D8D5',
          100: '#F1F3F2', // Body text
          50: '#F9FBFB',  // Headlines
        },
      },
    },
  },
  plugins: [],
}
