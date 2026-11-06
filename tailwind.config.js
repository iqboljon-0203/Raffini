/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: '#091310',
          dark: '#0e1f19',
          card: '#142922',
          surface: '#1b342b',
          border: 'rgba(212, 175, 55, 0.15)',
          gold: '#d4af37',
          goldLight: '#f1d78a',
          goldDark: '#aa8214',
          cream: '#f9f6f0',
          textMuted: '#9aa8a1',
        },
        emerald: {
          950: '#06130e',
          900: '#0b241b',
          800: '#113a2c',
          700: '#18503d',
          600: '#226f54',
          500: '#2e9370',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(212, 175, 55, 0.08)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
