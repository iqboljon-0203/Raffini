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
        raffini: {
          bg: '#0C0F17',
          dark: '#121622',
          navy: '#1A1F33', // Exact background from original Raffini logo
          surface: '#222940',
          card: '#181E30',
          cardHover: '#232A42',
          border: 'rgba(250, 233, 215, 0.14)',
          cream: '#FAE9D7', // Exact letter color from original Raffini logo
          creamLight: '#FFF5EB',
          creamDark: '#E2C7A7',
          muted: '#8E9BAE',
        },
        luxury: {
          bg: '#0C0F17',
          dark: '#121622',
          card: '#181E30',
          surface: '#222940',
          border: 'rgba(250, 233, 215, 0.14)',
          gold: '#FAE9D7',
          goldLight: '#FFF5EB',
          goldDark: '#E2C7A7',
          cream: '#FAE9D7',
          textMuted: '#8E9BAE',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 25px rgba(250, 233, 215, 0.08)',
        'gold-glow': '0 0 25px rgba(250, 233, 215, 0.25)',
        'cream-glow': '0 0 35px rgba(250, 233, 215, 0.35)',
        'floating-pill': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 10px rgba(250, 233, 215, 0.15)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        chevrons: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(4px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'marquee': 'marquee 18s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'chevrons': 'chevrons 1.2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
