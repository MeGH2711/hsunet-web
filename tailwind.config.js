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
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        muted: '#18181b',
        'muted-foreground': '#a1a1aa',
        card: '#09090b',
        'card-foreground': '#ffffff',
        border: '#27272a',
        primary: {
          DEFAULT: '#ffffff',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#18181b',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#27272a',
          foreground: '#ffffff',
        },
        emerald: {
          500: '#10b981',
          400: '#34d399',
        },
        cyan: {
          500: '#06b6d4',
          400: '#22d3ee',
        },
        rose: {
          500: '#f43f5e',
          400: '#fb7185',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 15px -3px rgba(16, 185, 129, 0.3)',
        'subtle': '0 1px 3px 0 rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
