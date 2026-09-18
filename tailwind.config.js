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
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        obsidian: {
          900: '#070a0d',
          850: '#0c1015',
          800: '#11171e',
          750: '#161f28',
          700: '#1e2936',
          600: '#334155',
          500: '#64748b',
        },
        jade: {
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        brass: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic: ['"Amiri"', '"Noto Naskh Arabic"', 'serif'],
        urdu: ['"Noto Nastaliq Urdu"', '"Amiri"', 'serif'],
      },
      boxShadow: {
        'micro': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'float': '0 12px 32px -4px rgba(12, 16, 21, 0.12), 0 4px 12px -2px rgba(12, 16, 21, 0.08)',
        'sheen': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
        'sheen-dark': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'glow-jade': '0 0 24px -4px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
