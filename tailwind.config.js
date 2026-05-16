/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        surface: {
          DEFAULT: '#f8fafc',
          dark: '#030712',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(6, 182, 212, 0.45)',
        'glow-sm': '0 0 30px -8px rgba(6, 182, 212, 0.35)',
        card: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
        'card-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(at 40% 20%, rgba(6, 182, 212, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(99, 102, 241, 0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(14, 165, 233, 0.1) 0px, transparent 50%)',
        'mesh-dark':
          'radial-gradient(at 40% 20%, rgba(6, 182, 212, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 0% 80%, rgba(14, 165, 233, 0.08) 0px, transparent 50%)',
        'gradient-brand': 'linear-gradient(135deg, #0891b2 0%, #6366f1 50%, #0e7490 100%)',
        'gradient-card':
          'linear-gradient(135deg, #164e63 0%, #1e3a5f 40%, #0f172a 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
