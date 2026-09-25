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
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        seagreen: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#3FD1C7',
          500: '#20B2AA', // Core brand primary
          600: '#17847E',
          700: '#0E6E68',
          800: '#0F4A46',
          900: '#083330',
          950: '#041f1d',
        },
        charcoal: {
          950: '#070C0B',
          900: '#0D1614', // Canvas background
          850: '#10201D', // Surface cards
          800: '#162B27', // Card border / elevated surfaces
          700: '#203B36', // Muted borders
          600: '#32544E',
          400: '#8EA3A0', // Subtitle / secondary text
          200: '#C8D5D3',
          100: '#F1F3F2', // Body text
          50: '#F9FBFB',  // Headlines
        },
      },
    },
  },
  plugins: [],
}
