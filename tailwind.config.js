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
        obsidian: {
          950: '#03070a',
          900: '#070a0d',
          850: '#0c1015',
          800: '#11171e',
          750: '#161f28',
          700: '#1e2936',
          600: '#334155',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        jade: {
          950: '#022c22',
          900: '#064e3b',
          800: '#065f46',
          700: '#047857',
          600: '#059669',
          500: '#10b981',
          400: '#34d399',
          300: '#6ee7b7',
          200: '#a7f3d0',
          100: '#d1fae5',
          50: '#ecfdf5',
        },
        brass: {
          950: '#451a03',
          900: '#78350f',
          800: '#92400e',
          700: '#b45309',
          600: '#d97706',
          500: '#f59e0b',
          400: '#fbbf24',
          300: '#fcd34d',
          200: '#fde68a',
          100: '#fef3c7',
          50: '#fffbeb',
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
